---
layout: post
title: Panviva Puppetry
tags: Puppet ApplicationOrchestration PuppetCamp InfrastructureManagement PuppetEnterprise
category: Puppet
excerpt_separator:  <!--more-->
---

Back in October I had the pleasure of speaking at Puppet Camp, Melbourne. The talk was centered around a puppet/DevOps implementation I was leading at [Panviva Pty Ltd](https://www.panviva.com/). I think our solution is quite good, so I thought I'd share a few details and link to the presentation.

<!--more-->

### Panviva

Panviva is a SaaS based software company that offers a knowledge management solution built for call centers. Behind the scenes they are using Puppet for both infrastructure management and application deployment.

### Implementation

For infrastructure management we followed the tried and true [roles and profiles](http://garylarizza.com/blog/2014/02/17/puppet-workflow-part-2/) workflow. For application deployment we wrote additional puppet code that leveraged the [application orchestrator](https://puppet.com/docs/pe/2017.3/managing_applications/managing_applications.html). The end result was a single control repo with two (where possible) distinct code bases supporting:
- Infrastructure Management
- Application Orchestration/Deployment

The ability to tell myself that the code was at least somewhat separate and independent provided the best opportunity for a full nights' sleep. Obviously there are dependencies on the configuration management code, but largely the door is open to treat the two as mutually exclusive. And if one day Panviva wants to bring in another tool for application deployment (*cough ansible*), it shouldn't be too hard.

Here is the slide deck...

<iframe src="//www.slideshare.net/slideshow/embed_code/key/djoC1wDyoQEZl" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/ScottPecnik/panviva-puppetry-84464358" title="Panviva Puppetry" target="_blank">Panviva Puppetry</a> </strong> from <strong><a href="https://www.slideshare.net/ScottPecnik" target="_blank">Scott Pecnik</a></strong> </div>
