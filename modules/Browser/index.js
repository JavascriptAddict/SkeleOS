
  var main = $("#main");

function searchBar(){
  
  main.append('<form id="search" class="center" action="javascript:submitSearch();">\
  <h2 id="brand">SkeleOS</h2>\
  <input type="text" name="search" value="" id="searchbar">\
  <input type="submit" value="Search">\
</form>');

}




function submitSearch(){

$("#overlay").show();

var q = $("#searchbar").val();

//Web browser
fetch("https://contextualwebsearch-websearch-v1.p.mashape.com/api/Search/WebSearchAPI?autocorrect=true&count=50&q=" + q,
{
 method: "GET", // *GET, POST, PUT, DELETE, etc.
 mode: "cors", // no-cors, cors, *same-origin
 cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
 // credentials: "same-origin", // include, *same-origin, omit
 headers: {
     "Content-Type": "application/json; charset=utf-8",
     "X-Mashape-Key": "70UJtJIBiVmshOpV6f21ARGc65y6p1Bxjvrjsn0kuS8vIOpvQV"
     // "Content-Type": "application/x-www-form-urlencoded",
 },
 redirect: "follow", // manual, *follow, error
 referrer: "no-referrer", // no-referrer, *client
})
 .then(function(response) {
   return response.json();
 })
 .then(function(results) {
   console.log(results.value);
   main.empty();
   searchBar();
  $("#search").removeClass("center");
   $("#overlay").hide();

   for(var count = 0; count < results.value.length; count++){

    main.append('<div class="results"><h4><a href="'+results.value[count].url+'">'+results.value[count].title+'</a></h4><p>"'+results.value[count].description+'"</p>');

   }

 });

}

