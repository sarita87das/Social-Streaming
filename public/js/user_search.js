$(document).ready(function () {

    $("#usersearch").on("click", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        var userName = $('#user-input').val().trim();


        // Send the POST request.
        $.post('/api/user', { 'username': userName })
            .then(function (result) {
                console.log(result);
                for (var i = 0; i <= 10; i++) {
                    var uName = result[i].username;
                    var uID = result[i].id;

                    $('#userData').append(`
          <div
          <p>Username: ${uName}</p>
          <p>User Id: ${uID}</p>
          <button id = "followUser" type="button" class="btn btn-primary">Follow</button>
          </div>
          `);

               }
            });
    })
})


// $("#followuser").on("click", function (event) {
//     // Make sure to preventDefault on a submit event.
//     event.preventDefault();

//     var followID = 


//     // Send the POST request.
//     $.post('/api/follow/:otherUser', { 'username': userName })
//         .then(function (result) {
//             console.log(result);