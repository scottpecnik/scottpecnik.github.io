---
layout: post
title: Puppet Idempotency - What and Why
excerpt_separator:  <!--more-->
---

Idempotency is a common theme throughout computer science.  In essence, for
something to be idempotent, you must be able to apply it an unlimited number of
times and achieve the same result.  Sounds a bit like insanity...

<!--more-->

I must admit, when I first entered the puppet universe and started hearing people
mention idempotency, I had to pretend to understand it until I could safely access
"the google" later.  I'm certain I learned about it during any number of computer
science or math classes, but the term just didn't stick with me.  

After doing a [little research](https://puppet.com/blog/idempotence-not-just-a-big-and-scary-word),
it clicked, and here's how the lightbulb went off.

### Puppet and Idempotency

Every 30 minutes puppet runs and applies a catalog that enforces the state of a
machine. Think about that, when you declare a resource in a puppet manifest, that
piece of code will get run and **applied** every 30 minutes.  

I think the reason this didn't click right away for me is because most native
resource types are idempotent by nature.  But enough talk, time for an example.

This, is idempotent:

{% highlight ruby %}

file { '/home/specnik':
  ensure => 'directory',
}

{% endhighlight %}

This, is not:

{% highlight ruby %}

exec { 'createSpecnikHome':
  command     => 'mkdir /home/specnik',
  path        => '/usr/bin',
}

{% endhighlight %}

The exec resource will work the first time, but subsequent runs will throw an
error as you can't create a directory that already exists.  Of course, there are
ways to make exec idempotent, but that's a conversation for later, and as a general
rule exec should be avoided whenever possible.

Hope the lightbulb is now switched on, and that you no longer take the subtle
magic in native puppet types for granted!
