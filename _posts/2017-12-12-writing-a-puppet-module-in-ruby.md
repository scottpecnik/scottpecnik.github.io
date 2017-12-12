---
layout: post
title: Writing a Puppet Module in Ruby
tags: puppet automation module ruby REST Elasticsearch
category: puppet
excerpt_separator:  <!--more-->
---

I recently came across a problem that could not be solved with out of the box puppet resource types.  The issue was not with puppet, but my requirement, thus is the the real world...

<!--more-->

### Background

The particular client I was working with utilized [Elasticsearch](https://www.elastic.co/) as part of their technology stack.  Some quick background on Elasticsearch - it is a search and analytics engine based on the [Apache Lucene](https://lucene.apache.org/) project.

The client was running Elasticsearch within a container, with no automation in place for configuration or deployment.  OK, easy right?  Grab the official [*docker module*](https://forge.puppet.com/puppetlabs/docker) from the forge and get to work...

### The Problem

It's common practice in Elasticsearch to create [index templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-templates.html) in order to provide some type of organization for your data. The *puppet problem* arises with creating said index, as they can only be initiated via REST call.

Since we have the luxury of running Elasticsearch within a container, it would make logical sense to create the index via dockerfile. However, [indices are persisted within the data](https://stackoverflow.com/questions/35526532/how-to-add-an-elasticsearch-index-during-docker-build), which we store inside docker volumes on each respective host. I.e. As soon as we mount a volume for the data, anything we do in a dockerfile is null and void.

To summarize, we needed to spin up a container, **and then make a REST call**. Making a REST call with puppet is quite *unpuppet like*, and probably a little dangerous. So before I continue, let me disclose that I don't condone making REST calls as part of a puppet run, but since the real world sometimes interferes with our principles, this was/is my solution.

### Non-elegant Solution

If I was feeling lazy, I could simply make a REST call via a puppet exec type.

{% highlight ruby %}

exec { 'createElasticSearchIndex':
  command => 'curl -XPUT http://localhost:9200/_template/sometemplate/',
  path    => ['/usr/bin', '/usr/sbin'],
  unless  => 'curl -I --fail http://localhost:9200/_template/sometemplate',
}

{% endhighlight %}

...OK I admit it, this is what I initially tried.  And for reasons I don't care to explain, it didn't work.

### Elegant Solution

To be honest, I was glad the exec solution didn't work. I despise hacking things up and was looking for an excuse to do this the right way. The solution was to create a module, and since you can't make REST calls in the puppet declarative language, time to flex my non-existant ruby muscles.

#### Puppet Agent

Before you start, make sure you have the puppet agent installed on your local machine. Having an agent will give us the ability to:
- Use the Puppet Module Generator
- Test your module locally

For your convenience, you can find installation instructions and installers here: [linux](https://puppet.com/docs/puppet/5.3/install_linux.html),
[windows](https://puppet.com/docs/puppet/5.3/install_windows.html), [mac](https://puppet.com/docs/puppet/5.3/install_osx.html)

#### Puppet Module Generator

Once you've got the puppet agent installed, generate a boilerplate project using the puppet module generator. This is as simple as typing the following into a terminal

{% highlight bash %}

puppet module generate authorname/modulename

{% endhighlight %}

The module generate will start up a text based wizard that asks you a few questions
about your module:

![puppet module generate]({{ site.name }}/assets/images/creatingrubymod/puppet_module_generate.png)

After you've answered all the questions, a boilerplate project will be generated
for you.

![boiler plate project]({{ site.name }}/assets/images/creatingrubymod/boiler_plate_project.png)

#### Project Structure

By default, a boilerplate module contains the following folders:
- examples - For demonstrating how to use your module and providing the ability to test locally.
- manifests - For puppet manifests, a module written in the puppet declarative language will **define** types here that can be declared by a consuming puppet project.
- spec - For writing acceptance tests (not covered in this post).

I have added a few folders to my project:
- files - For general files, as part of my test manifest in the examples folder, I ship a sample Elasticsearch index template.
- lib - For ruby code, this is where we'll spend the majority of our time.

Here is my new project structure.

![boiler plate project]({{ site.name }}/assets/images/creatingrubymod/modified_boiler_plate_project.png)

#### Types and Providers

Before delving into the code, it's necessary to first discuss **types** and **providers**. In the puppet language there are about 50 out of the box defined types.  I'm talking about **file**, **package**, **service**, etc. When creating a puppet module, we'll be defining our own type that can be declared in the puppet language. And each type requires a provider, which contains the logic to enforce the described state.

I like to think that types and providers are akin to models and controllers in the Model View Controller (MVC) programming paradigm.

Back to the code, let's start by building a structure under the lib folder that will support our new module code.  First, create a top level folder called **puppet**, with child folders **type** and **provider**.

![lib folder]({{ site.name }}/assets/images/creatingrubymod/lib_folder.png)

##### Type

Next, create a ruby file under the type folder. The name of the file is arbitrary, but for those that will come after us, it is probably best to use the name of our type as the name of the file.

If you're anything like me, you'd prefer to just cut to the chase and see the code. So below is the entirety of our type definition. Take a gandor, and then read on for a description of its parts.

{% highlight ruby %}

Puppet::Type.newtype(:elasticsearch_template) do
  desc "Puppet type that models creating elastic search templates"

  ensurable

  newparam(:name, :namevar => true) do
    desc "Name of template - > name from URI after '_template'"
  end

  newparam(:servername) do
    desc "DNS resolvable name of server or container"
  end

  newparam(:port) do
    desc "Port that elasticsearch is running on"
  end

  newparam(:ssl) do
    desc "Is SSL enabled"
    defaultto :false
    newvalues(:true, :false)
  end

  newparam(:content) do
    desc "Contents of template in JSON format"
  end
end

{% endhighlight %}

OK so we start by calling **newType** to tell puppet about our type.  We then use the word **ensureable**, to tell the puppet framework that this is an ensureable resource. Think back to the basics here, puppet is a tool that allows us to describe and then enforce the state of a system.  The module we are writing will ensure that either an index template exists or does not exist in elasticsearch.  The ensureable piece contains a bit of magic, but we'll get to that when we discuss our provider.

Finally, we round out the type with a list of parameters and properties. Parameters help dictate how the controller enforces state on the system, while properties usually map directly to resources on the system. See the below example for an explanation written in puppet code.

{% highlight ruby %}

user{ 'specnik':
  ensure     => present,
  managehome => true,            #This is a parameter
  home       => '/home/specnik', #This is a property
}

{% endhighlight %}

In our case we are using all parameters, as the state we are enforcing is simply the presence of an index template within Elasticsearch. Note the existance of **:namevar => true** on the name parameter. This tells puppet that the name of the resource when it is defined in puppet language is to be interpreted as the name parameter. Alternatively, you could use an arbitrary name and explicitly provide a name parameter.

Below is what a declaration of our new type in puppet language would look like:

{% highlight ruby %}

elasticsearch_template { 'template_1':
  ensure     => present,
  servername => 'localhost',
  port       => '9201',
  ssl        => false,
}

{% endhighlight %}

##### Provider

Now that we've defined what our type will look like, we need to write the logic that will control how the resource gets created or removed.  Like before, below is the finished product, take a look and then scroll down for an explanation.

{% highlight ruby %}

require 'puppet/provider/rest'

Puppet::Type.type(:elasticsearch_template).provide(
  :ruby,
  :parent => Puppet::Provider::REST
) do

  def exists?
    doesTemplateExist() != nil
  end

  def create
    createTemplate()
  end

  def destroy
    deleteTemplate()
  end

  def doesTemplateExist
    response = rest(resource[:servername], resource[:port],
                "_template/#{resource[:name]}",
                'GET',
                resource[:ssl])
    return nil if response.code.to_i != 200
    response.code.to_i
  end

  def createTemplate
    response = rest(resource[:servername], resource[:port],
                "_template/#{resource[:name]}",
                'PUT',
                resource[:ssl],
                Puppet::FileSystem.read(resource[:content]))
  end

  def deleteTemplate
    response = rest(resource[:servername], resource[:port],
                "_template/#{resource[:name]}",
                'DELETE',
                resource[:ssl])
  end
end

{% endhighlight %}

The code starts very similar to the type, declaring that we are a provider for the type **elasticsearch_template**. Note that there are two class parameters. The first is the name of our ruby file that is the provider. I know, I picked a very intuitive file name in **ruby**. See the below screenshot for our final lib folder structure in order to get a better understanding. The second param is that of a parent class. This is an unnecessary step, but something I decided to do in order to keep the implementation more user friendly. I'll explain more later.

![lib folder]({{ site.name }}/assets/images/creatingrubymod/expanded_lib_folder.png)

Next up let's discuss these methods:
- exists?
- create
- destroy

Remember earlier when I mentioned ensureable and magic in the same sentence?  Since our type is ensureable, the puppet framework will automatically call the **exists** method during a puppet run in order to get the state of the resource. Puppet will then call either **create** or **destroy** based on what the implementer provides as the ensure in their resource declaration - hint: either **present (create)** or **absent (destroy)**.

Note the helper methods (doesTemplateExist, createTemplate, and deleteTemplate) that are called from within the **exists**, **create**, and **destroy**.  Having these is a matter of personal preference and not required. Also note how we reference parameters from the type using the following syntax: **resource[:servername]**

And finally, you'll notice that within the helper methods we call another method called **rest**. This method exists in our parent class called **rest.rb**. I'll skip the explanation of that implementation as it's more a function of ruby coding and not puppet module framework stuff. At the end of this post you can find a link to the project in github where you can look at the implementation of the **rest** class.

#### Testing your Module

Writing a module in ruby can be a little tedious at times. It's best to setup a local test bed within your module to easily measure quality. To do this, create a manifest (using any name you want) inside of the examples folder.  Below you can see that I've decided to continue on with my poor naming standards and use the generated init.pp. Also, here is where we leverage the sample index template from the files directory.

![test manifest]({{ site.name }}/assets/images/creatingrubymod/test_manifest.png)

My test code is pretty straightforward. First I write the sample JSON template to my local filesystem, then I declare my new type with an ensure **present**. Note that the **servername** is set to localhost, which means that Elasticsearch will have to be running on my local system. That part is not shown here...

{% highlight ruby %}

file { '/Users/scottpecnik/Desktop/template_1.json':
  ensure  => present,
  content => 'puppet:///modules/elasticsearch/template_1.json',
}

elasticsearch_template { 'template_1':
  ensure     => present,
  servername => 'localhost',
  port       => '9201',
  ssl        => false,
  content    => '/Users/scottpecnik/Desktop/template_1.json',
  require    => File['/Users/scottpecnik/Desktop/template_1.json']
}

{% endhighlight %}

Finally, to run our test we simply apply the example manifest using the below command. We need to tell the puppet agent where to find our module by setting the modulepath parameter. On my system the module's parent folder is **~/repositories**.

{% highlight bash %}

puppet apply --modulepath=~/repositories examples/init.pp

{% endhighlight %}

#### Finished product

The finished product can be found on [github](https://github.com/scottpecnik/elasticsearch). Feel free to fork and/or contribute!  If you'd like to use it in your project, the below snippet inside of your Puppetfile will get you there.

{% highlight ruby %}

mod 'scottpecnik/elasticsearch',
  :git => 'https://github.com/scottpecnik/elasticsearch'

{% endhighlight %}

I hope this post will help get you started when writing your first puppet module in ruby. Happy coding.
