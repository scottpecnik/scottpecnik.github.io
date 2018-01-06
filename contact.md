---
layout: page
title: Contact
sidebar_link: true
order: 4
---

<div id="contactContainer">
  <form method="POST" id="contactForm">
    <div class="contactField">
      <input type="name" name="name" id="name" placeholder="Your name">
    </div>
    <div class="contactField">
      <input type="email" name="email" id="email" placeholder="Your email">
    </div>
    <div class="contactField">
      <textarea name="message" id="message" placeholder="Your message"></textarea>
    </div>
    <div class="contactButton">
      <button type="submit">Send</button>
    </div>
  </form>
</div>

{:#contactGPGMessage}
To send me an encrypted message, my public PGP key can be found [here]({{site.baseurl}}/public-pgp/).

<div id="formSubmitted" style="display:none">
  <p></p>
</div>
