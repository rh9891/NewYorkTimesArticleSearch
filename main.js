function buildQueryURL() {
    // queryURL is the url we'll use to query the API
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  
    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParameters = { "api-key": "EeRWIecf8YA3Y5SjdaGLqMmO8UYmd2ya" };
  
    // Grab text the user typed into the search input, add to the queryParameters object
    queryParameters.q = $("#searchTerm").val().trim();
  
    // If the user provides a startYear, include it in the queryParameters object
    var startYear = $("#startYear").val().trim();
  
    if (parseInt(startYear)) {
      queryParameters.begin_date = startYear + "0101";
    }
  
    // If the user provides an endYear, include it in the queryParameters object
    var endYear = $("#endYear").val().trim();
  
    if (parseInt(endYear)) {
      queryParameters.end_date = endYear + "0101";
    }
  
    return queryURL + $.param(queryParameters);
  };

function updatePage(NYTData) {
// Get from the form the number of results to display
// API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = $("#numRecords").val();

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
        // Get specific article info for current index
        var article = NYTData.response.docs[i];

        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#articlesSection").append($articleList);

        // If the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
        $articleListItem.append("<strong> " + headline.main + "</strong>");
        }

        // Appends the bylines of the articles (if it exists) onto the page.
        var byline = article.byline;

        if (byline && byline.original) {

        $articleListItem.append("<h5>" + byline.original + "</h5>");
        }

        // Appends the respective news section of the articles (if it exists) onto the page.
        var section = article.section_name;

        if (section) {
        $articleListItem.append("<h5>Section: " + section + "</h5>");
        }

        // Appends the date of publication for the articles (if it exists) onto the page.
        var pubDate = article.pub_date;

        if (pubDate) {
        $articleListItem.append("<h5>" + article.pub_date + "</h5>");
        }

        // Appends the URLs of the articles onto the page.
        $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");

        // Append the articles onto the page.
        $articleList.append($articleListItem);

        $articleList.css({"margin": "10px"});
        $articleList.css({"padding-bottom": "20px"});
}
}

// Empties the well of articles from the previous runs.
function clear() {
    $("#articlesSection").empty();
}

$("#searchBtn").on("click", function(event) {
    // The preventDefault function allows the user to hit enter on the keyboard to register the search (in addition to clicks) and prevents the page from reloading.
    event.preventDefault();
  
    // Clears the inputted queries and data on the page.
    clear();
  
    // The URL base for the ajax call to the New York Times API.
    var queryURL = buildQueryURL();
  
    // AJAX function. Makes the AJAX request to the API to retrieve the JSON data. The data then gets passed as an argument to the updatePage function.
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });
  
  //  The on "click" function that is associated with the clear button.
  $("#clearBtn").on("click", clear);