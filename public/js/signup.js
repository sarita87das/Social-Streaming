$(document).ready(function() {

  function handleLoginErr(err) {
    $('#alert .msg').text(JSON.stringify(err.responseJSON));
    $('#alert').fadeIn(500);
  }

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(userData) {
    $.post('/api/signup', userData)
      .then(function() {
        window.location.replace('/members');
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  // Getting references to our form and input
  var signUpForm = $('form.signup');
  var username = $('#username-input');
  var emailInput = $('input#email-input');
  var passwordInput = $('input#password-input');
  var city = $('#city');
  var state = $('#state');
  var country = $('#country');

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on('submit', function(event) {
    event.preventDefault();
    var userData = {
      username: username.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      city: city.val().trim(),
      state: state.val().trim(),
      country: country.val().trim()
    };

    if (userData.username === null || userData.username === undefined ||
        userData.email === null ||userData.email === undefined ||
        userData.password === null || userData.password === undefined) {
      console.log('Need to have username, password, and email!');
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData);
    emailInput.val('');
    passwordInput.val('');
  });

});
