---
layout: post
title: What is DevOps
tags: devops automation people process tools
category: devops
excerpt_separator:  <!--more-->
---

It seems borderline ridiculous writing a "What is DevOps" post in 2017.  It's been
eight years since the first "DevOpsDays" conference (2009 in Belgium), and even longer
since Patrick Debois coined the term.  But because of the momentum behind the movement,
I feel many of us have succumb to that old Ferris Bueller adage, and are possibly
missing the point...

<!--more-->

> Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.

Every organization with even an ounce of a technical development arm is "looking
into DevOps".  The truth is, the term has been commoditized. And just like our old
friend "Agile", everybody is doing it!

### Why?

Most IT organizations are structured the same.  At the top of the food chain is a
CIO, with a VP of Operations and a VP of Dev reporting in.  This is where the problem
begins, and the result is that Development and Operations are often times at odds.  

#### <ins>Operations</ins>
Operations' main responsibility is to keep the production systems up and running.
Plain and simple, if prod is down, revenue is lost and reputations are tarnished.

Standard business practices dictate that we compensate our employees in order to
motivate them to achieve business objectives.  You guessed it, that Christmas bonus
is tied to your performance, which is likely tied in some way to production uptime.

So what's the problem? Make sense so far... Well, enter in those creative minded,
wild west, shoot from the hip devs.  Yep, they're the ones that write buggy code
that puts our system at risk. They have no idea what it's like to be "on call",
and if they're up at 3am it's likely because they haven't gone to bed yet. Deploying
every week is just not an option.

#### <ins>Development</ins>
On the other side of the coin, the business weighs market demand and customer want
in order to build a prioritized list of product requirements. Devs are measured
and compensated on how many of those requirements they can implement while maintaining
an acceptable defect count.

One of the key points of product development that is not lost on many people is
that **the business does not see value from a new feature or enhancement until
it is deployed to production and in the hands of the customer.**

Aaaah, there it is.  We've circled back to Operations.  As a former dev,
I'd be remiss not to include a little something about the perception of Ops,
but instead I'll take the high road :)


### What?
Now that we understand why the problem exists, let's talk about what it is, starting
with a semi-formal definition:
> DevOps is a set of practices, encompassing tool automation, cultural transformation,
and process change in order to build and deliver better software faster.

Let's dig in, **it is not a specification, it is not an architecture, it is a
set of practices**.  And this set of practices is hinged on the following three pillars:

- **People** - People are people, they have good days and they have bad days.
A culture of finger pointing and blame can no longer be accepted.  An environment
must exist where innovation and experimentation is encouraged.
- **Process** - Trust is critical to delivering at speed.  The more confident we
are in our ability to catch issues early before they reach production, the faster
we can go.
- **Tools** - Automation is about doing things frequently and in a repeatable manner.
The same automation scripts should be run continuously and in environments of
differing topologies.  Build once, deploy many, test early and often.

### How?
There's no single method, but there are proven techniques for transforming your
organization to follow DevOps practices.
- Behaviors trickle down from the top.  Without C-Level support, you won't succeed.
- Start with a pilot.  Don't rush it, learn from your mistakes, refine new processes,
select fit for purpose tools.
- You only get one chance to make a first impression.  Change is never accepted
with open arms, make sure you have your ducks in a row before moving beyond
the pilot phase.
- Your "DevOps" team must have credibility.  Pull developers and operations
engineers from your pilot group!  You need people that have done this before in
**your** organization.  Include a reputable vendor or DevOps consultant (cough).
- Consider shared organizational objectives.  Things that everyone needs to work
together on in order to achieve.

If you follow some of these basic principles, I think you'll be well on your way
to breaking down the firm wall that exists between Dev and Ops.  Let that wall be
short, and leave pogo sticks on either end.
