$(document).ready(function() {
  // Getting references to our form and inputs
  var loginForm = $('form.login');
  var usernameInput = $('input#username');
  var passwordInput = $('input#password-input');

  // loginUser does a post to our 'api/login' route and if successful, redirects us the the members page
  function loginUser(userData) {
    console.log(userData);
    $.post('/api/login', userData)
      .then(function() {
        console.log('hello');
        window.location.replace('/members');
        // If there's an error, log the error
      })
      .catch(function(err) {
        var message = JSON.stringify(err.responseJSON.errors[0]
          .message);
        $('#alert .msg').text(message.substring(1, message.length - 1));
        $('#alert').fadeIn(500);
      });
  }

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on('submit', function(event) {
    event.preventDefault();
    var userData = {
      username: usernameInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (userData.username === null || userData.username === undefined ||
        userData.password === null || userData.password === undefined) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData);
    usernameInput.val('');
    passwordInput.val('');
  });

});
