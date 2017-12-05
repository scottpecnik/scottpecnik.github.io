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

<div id="formSubmitted" style="display:none">
  <p></p>
</div>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script>
  $(function() {
    $('#contactForm').on('submit', function(e) {
      e.preventDefault();
      $.ajax({
        url: "https://formspree.io/srpecnik+website@gmail.com",
        method: "POST",
        data: {
          name: $('#name').val(),
          email: $('#email').val(),
          message: $('#message').val(),
        },
        dataType: "json",
        beforeSend: function() {
          console.log('Sending!');
          $('#contactForm').hide();
          $('#formSubmitted').show();
          $('#formSubmitted p').text("Sending...");
        },
        success: function() {
          console.log('success');
          $('#contactForm').hide();
          $('#formSubmitted').show();
          $('#formSubmitted p').text("Thanks for your email!  I'll be in touch.");
        },
        error: function() {
          console.log('error');
          $('#contactForm').hide();
          $('#formSubmitted').show();
          $('#formSubmitted p').text("Oops!  Looks like something went wrong.");
        }   
      });
    })
  });
</script>
