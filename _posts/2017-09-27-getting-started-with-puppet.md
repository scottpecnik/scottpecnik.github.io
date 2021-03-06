---
layout: post
title: Getting Started with Puppet (Enterprise)
tags: puppet devops cd automation
category: puppet
excerpt_separator:  <!--more-->
---

I recently started a new consulting engagement, the focus is on building
Continuous Delivery (CD) automation with Puppet. This is pretty typical for
"DevOps" gigs, but we'll leave it at that and delve into the DevOpsy stuff
in a later post.  

My intention is to document how to get started implementing Puppet.  Not because
it doesn't already exist (it does - aplenty), but because it seems there is
more to talk about, and I'd like to provide my take on the subject.
<!--more-->
### What is Puppet?

The obligatory - what is Puppet?  I'll keep it short and sweet, Puppet is a configuration
management system.  In other words, it's a software product that enables you to
describe the way a system (computer) should look, and then it applies that description
to the system.  When I say describe, I mean things like:
- A file called /etc/redis/redis.conf exists.
  - This file is owned by the user redis
  - This file has permissions 0755
- A package called redis is installed
  - That package is at version x.x.x
  - That package is configured to start at system boot

You get the point, it's a way to "script" things without "scripting" things.
Another topic we'll discuss in more detail later.

Puppet is typically implemented using a master/agent model, meaning each machine
that you intend to manage must have a Puppet agent installed on it, and
said agents phone home to the master to be given instruction.

### Learning Puppet

Now that you've got the picture, where do you start?  Read on...

#### Puppet Learning VM

If you're anything like me and you learn best by doing, I'd recommend starting
by going through the [Puppet Learning VM](https://puppet.com/download-learning-vm).
Just do it, it's worth the time.  And don't skim it, actually do the labs.

#### Puppet Control Repo

So you've gone through the Puppet Learning VM and at this point are thoroughly
confused as to what you can do with Puppet.  Don't worry, you're in good company.  

This is why it's important to start with "something", and luckily for us the good
people at Puppet Labs have created the defacto starting point.  Clone
[the control repo](https://github.com/puppetlabs/control-repo), do
it and appreciate it.  You'll thank me later.

#### Deploying Puppet Code (with PE)

*I'm making the assumption that you've already got a Puppet Master installed,
and that you're running Enterprise (Enterprise is free for up to 10 nodes).*

In order to run puppet code on a node with the typical master/agent configuration,
you'll need to deploy your control repo to the master.  If you're using open
source puppet, **r10k** is what you'll use to do this. Since I'm making the
assumption that you're using Puppet Enterprise (PE), the rest of this article
discusses [how to setup **code manager**](https://docs.puppet.com/pe/latest/code_mgr_config.html#enable-code-manager-after-installation).

I won't go too deep as it's well documented in the previous link, but in short you'll
need to do the following:
- Make sure the git remote that holds your puppet control repo can be accessed
by the machine the master lives on.
- Download an ssh key (used to authenticate with git) from your remote repo and
place it on the master machine somewhere.
- Tell Puppet about these things via the Puppet master console:
  - Click on **classification**->**PE Master**, provide the URL of the
  control repo and the location of the private key used to access it.
  - Create a **Deployment User** and add that user to the **Code Deployers** role.

Done, now puppet knows where to grab your code from and what to use to access it.
Next we just need to tell puppet to go get it.  Remember that deployment user
you just created?  Well it's time to put it to use.  SSH into your master and
run the following:

{% highlight bash %}
puppet-access login --service-url https://<HOSTNAME OF PUPPET ENTERPRISE CONSOLE>:4433/rbac-api --lifetime 180d
{% endhighlight %}

You'll be prompted to type in the userid/pass of your deployment user, which will
create a token and save it to /home/youruser/.puppetlabs/token.

Now that the code manager cli knows how to communicate with the puppet master,
you can deploy your code using the following command:

{% highlight bash %}
puppet-code deploy --all --wait
{% endhighlight %}

*"--all" refers to Puppet environment, which relates to git branch name*

### Final Words of Wisdom

At this point you're ready to get your hands dirty writing your own manifests
and applying them to puppet nodes.  You know enough to be dangerous, you've got
a project structured according to best practices, and the ability to deploy that
code to the master.

You did do all of the above on a system that you're never intending to call
production, right? :)
