$(document).ready(function () {

    $("#usersearch").on("click", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        var addedUser = $('#user-input').val().trim();


        // Send the POST request.
        $.post('/api/user', { 'username': addedUser })
            .then(function (result) {
                console.log(result);
                for (var i = 0; i <= 10; i++) {
                    var uName = result[i].username
                    var uID = result[i].id;

                    $('#userData').append(`
          <div
          <p>Username: ${uName}</p>
          <p>User Id: ${uID}</p>
          <button id = "followUser" type="button" class="btn btn-primary" data-id="user-id">Follow</button>
          </div>
          `);
                    console.log(result[1].username);

                }
            });
    })
})


$("#followUser").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    var userId = $(this).data("user-id");


    // Send the POST request.
    $.post('/api/follow/:' + userId)
        .then(
            function () {
                console.log("userfollowed");
                alert("user followed!")
                // Reload the page
                location.reload();
            }
        );
});
