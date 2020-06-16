$(document).ready(function () {
    var queryURL = '/api/moviedetails/topten';
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
               
    
    
            // console.log(response.results.slice(0, 9));
            console.log(response);
            for (var i = 0; i < 10; i++) {
                            
                var imageURL = "https://image.tmdb.org/t/p/w185";
                var plot = response.results[i].overview;
                var mediaType = response.results[i].media_type;
                var date, title;

                if(mediaType === "tv" ) {
                    title = response.results[i].name;
                    date = response.results[i].first_air_date
                }
                else{
                    title= response.results[i].title;
                    date =response.results[i].release_date
                }
                               
                var imageURL = "https://image.tmdb.org/t/p/w185";
                var backport = response.results[i].poster_path;
    
                $('#moviesData').append(`
          <img style="width:185px;height:278px;"src="${imageURL + backport}" alt="movie poster">
          <h5 class="card-title" >${title}</h5>
          <p class="card-text">Plot: </p>
          <p> ${plot} </p>
          <p> Movie Release/ Show First Air Date: ${date} </p>
          <p> Media Type: ${mediaType}</p>
          
    
          `);
            }
    
        });
    })
    
    $("#fav-ms").on("click", function(event) {
        var favId = $(this).data("mediaId");
    
        // Send the request.
        $.ajax("/api/favorite/" + favId, {
        //   type: "POST" or" "PUT"
        }).then(
          function() {
            console.log("Favorited", FavId);
            // Reload the page to get the updated list
            location.reload();
          }
        );
      });
    