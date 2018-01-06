

$(function() {
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      url: "https://formspree.io/contact@scottpecnik.com",
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
        $('#contactGPGMessage').hide();
        $('#formSubmitted').show();
        $('#formSubmitted p').text("Sending...");
      },
      success: function() {
        console.log('success');
        $('#contactForm').hide();
        $('#contactGPGMessage').hide();
        $('#formSubmitted').show();
        $('#formSubmitted p').text("Thanks for your email!  I'll be in touch.");
      },
      error: function() {
        console.log('error');
        $('#contactForm').hide();
        $('#contactGPGMessage').hide();
        $('#formSubmitted').show();
        $('#formSubmitted p').text("Oops!  Looks like something went wrong.");
      }
    });
  })
});
