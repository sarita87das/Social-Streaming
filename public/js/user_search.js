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
                    var uName = result[i].username;
                    var uID = result[i].id;

                    $('#userData').append(`
          <div
          <p>Username: ${uName}</p>
          <p>User Id: ${uID}</p>
          <button type="button" class="btn btn-primary followUser" data-id="${uID}">Follow</button>

          </div>
          `);
                    console.log(result[1].username);

                }
            });
    })
})


$(document).on("click", ".followUser", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    console.log("anything")
    var userId = $(this).data("id");
    console.log(userId);


    // Send the POST request.
    $.post('/api/follow/' + userId)
        .then(function (response) {

                console.log(response);
                // Reload the page
                location.reload();
            }
        );
});

// $(document).on("click", ".unFollowUser", function (event) {
//     // Make sure to preventDefault on a submit event.
//     event.preventDefault();
//     console.log("anything")
//     var userId = $(this).data("id");
//     console.log(userId);


//     // Send the POST request.
//     $.post('/api/unfollow/' + userId)
//         .then(function (response) {

//                 console.log(response);
//                 // Reload the page
//                 location.reload();
//             }
//         );
// });
{/* <button type="button" class="btn btn-primary unFollowUser" data-id="${uID}">UnFollow</button> */}
