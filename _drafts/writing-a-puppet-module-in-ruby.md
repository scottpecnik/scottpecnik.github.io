---
layout: post
title: Writing a Puppet Module in Ruby
excerpt_separator:  <!--more-->
---

I recently came across a problem that could not be solved with out of
the box puppet resource types.  The issue was not with puppet, but my
requirement, thus is the the real world...

<!--more-->

### Background

The particular client I was working with utilized [Elasticsearch](https://www.elastic.co/)
as part of their technology stack.  Some quick background on Elasticsearch - it
is a search and analytics engine based on the [Apache Lucene](https://lucene.apache.org/)
project.

They're were running Elasticsearch within a container, which was being spun up manually.
OK, easy right?  Grab the official [*docker module*](https://forge.puppet.com/puppetlabs/docker)
from the forge and get to work.  Yep, with puppet it's easy to install docker,
easy to run a container, but the next part is not so easy...

### The Problem

It's common practice to use [index templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-templates.html)
with Elasticsearch in order to provide some type of organization for your data.
The *puppet problem* arises in the creation of that index.  Elasticsearch must be
running, and the only way to create it is via REST call.  

Initially you might think, if he's using containers why not make sure the index
exists in the image by creating it via Dockerfile? I thought the same, except for it [doesn't work](https://stackoverflow.com/questions/35526532/how-to-add-an-elasticsearch-index-during-docker-build).
And for good reason, Elasticsearch indices dictate the way data is stored, which
in our case lives safely inside docker volumes.  A volume would need to exist
and be mounted if the index is to persist.

To summarize, we needed to spin up a container, **and then make a REST call**.  
Making a REST call with puppet is quite *unpuppet like*, and probably a little
dangerous. So before I continue, let me disclose that I don't condone making REST
calls as part of a puppet run, but since the real world sometimes interferes with
our principles, this was/is my solution.

### Non-elegant Solution

If I was lazy with no self-respect, I could simply make a REST call via a puppet
exec type.

{% highlight ruby %}

exec { 'createElasticSearchIndex':
  command => 'curl -XPUT http://localhost:9200/_template/sometemplate/',
  path    => ['/usr/bin', '/usr/sbin'],
  unless  => 'curl -I --fail http://localhost:9200/_template/sometemplate',
}

{% endhighlight %}

...OK I admit it, this is what I initially tried.  And for reasons I don't care to
explain, it didn't work.

### Elegant Solution

To be honest, I was glad the exec solution didn't work.  I despise hacking things
up and was looking for an excuse to do this the right way.  The solution was to build
a custom module, and since you can't make REST calls in the puppet declarative
language, time to flex my non-existant ruby muscles.

#### Puppet Agent

Before you start, make sure you have the puppet agent installed on your local
machine. Having an agent will give us the ability to:
- Use the Puppet Module Generator
- Test your module locally

For your convenience, you can find installation instructions and installers here: [linux](https://puppet.com/docs/puppet/5.3/install_linux.html),
[windows](https://puppet.com/docs/puppet/5.3/install_windows.html), [mac](https://puppet.com/docs/puppet/5.3/install_osx.html)

#### Puppet Module Generator

Once you've got the puppet agent installed, we'll generate a boilerplate project
using the puppet module generator.  This is as simple as typing the following into
a terminal

{% highlight bash %}

puppet module generate authorname/modulename

{% endhighlight %}

![puppet module generate]({{ site.name }}/assets/images/creatingrubymod/puppet_module_generate.png)

#### Types and Providers

#### Testing your Module
