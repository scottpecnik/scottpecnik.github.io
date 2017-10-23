---
layout: post
title: Writing a Custom Puppet Module in Ruby
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

In order to keep things simple, they were running Elasticsearch within a container,
which was being spun up manually.  OK, easy right?  Grab a [*puppet blessed*](https://forge.puppet.com/garethr/docker) docker module and get to work.
Well, that part is easy, except for when Elasticsearch decides to be difficult.

### The Problem

It's common practice to use [Index Templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-templates.html)
within Elasticsearch in order to provide some type of organization for your data.
The *puppet problem* arises in the creation of that index.  Elasticsearch must be
running, and the only way to create it is via REST call.  

Initially you might think, if he's using containers why not create the index in
a Dockerfile?  I thought the same, except for it [doesn't work](https://stackoverflow.com/questions/35526532/how-to-add-an-elasticsearch-index-during-docker-build).
And for good reason, Elasticsearch indices dictate the way data is stored, which
in our case lives safely inside docker volumes.  A volume would need to exist
and be mounted if the index is to persist.

To summarize, we needed to spin up a container, **and then make a REST call**.  
Making a REST call is quite *unpuppet like*, and probably a little dangerous.  So
before I continue, let me disclose that I don't condone making REST calls as part
of a puppet run, but since the real world sometimes interferes with our principles,
this is my solution in the most elegant way I could imagine.

### Non-elegant Solution

If I was lazy with no self-respect, I could simply make a REST call via a puppet
exec type.

{% highlight ruby %}

exec { 'createElasticSearchIndex':
  command     => 'curl -XPUT localhost:9200/_template/_someIndex/',
  path        => ['/usr/bin', '/usr/sbin'],
  unless      => 'curl -XGET localhost:9200/_template/_someIndex/',
}

{% endhighlight %}

...OK I admit it, this is what I initially tried.  And for reasons I don't care to
explain, it didn't work.

### Elegant Solution

To be honest, I was kind of glad the above didn't work.  I despise hacking things
up, and was looking for an excuse to do this the right way.
