$(document).ready(function () {
    
    $("#msadd-btn").on("click", function (event) {
        event.preventDefault();

        // create new movie object
        var addedMovie = $("#movie-show-add").val().trim();

        console.log(addedMovie);

        // Send an AJAX POST-request with jQuery
        $.post('/api/new-media', { 'title': addedMovie })
            .then(function (response) {

                $('#add-movie').append(`
            <div
            <p>Added Movie/Show: ${addedMovie}</p>
            <button id = "fav-ms" type="button" class="btn btn-info">Favorite</button>
            </div>
            `);
            console.log(response)


            });

        // Empty 
        $("#movie-show-add").val("");
    });



    $("#movie-showbtn").on("click", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        var userSearch = $("#movie-show-input").val().trim();
        var queryURL = '/api/moviedetails/title/:' + userSearch;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log("help me")
            for (var i = 0; i < 10; i++) {

                var imageURL = "https://image.tmdb.org/t/p/w185";
                var plot = response.results[i].overview;
                var mediaType = response.results[i].media_type;
                var title;

                if (mediaType === "tv") {
                    title = response.results[i].name;
                    date = response.results[i].first_air_date
                }
                else {
                    title = response.results[i].title;
                    date = response.results[i].release_date
                }

                var imageURL = "https://image.tmdb.org/t/p/w185";
                var backport = response.results[i].poster_path;

                $('#returnedData').append(`
                <img style="width:185px;height:278px;"src="${imageURL + backport}" alt="movie poster">
                <h5 class="card-title" >${title}</h5>
                <p class="card-text">Plot: </p>
                <p> ${plot} </p>
                <p> Media Type: ${mediaType}</p>
               
          
    
          `);

          // Empty 
        $("#movie-show-input").val("");

    
    

        $("#close-search").click(function(){
            $("#returnedData").hide();
            location.reload();

          });

            }
        
        });
    })
})

