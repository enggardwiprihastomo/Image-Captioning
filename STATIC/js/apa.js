$(".comment-list").append("<p class='loading'>Loading...</p>");
$.getJSON("data.json", function(result){
    $.each(result, function(i, content){
      $(".comment-list").append("<div class='comment-item'></div>");
      $(".comment-item").append("div class='comment-item__username'>" + content.username + "</div>");
      $(".comment-item").append("div class='comment-item__message'>" + content.message + "</div>");
      });
})
.error(function(){
    alert("error");
});
$(".loading").remove();