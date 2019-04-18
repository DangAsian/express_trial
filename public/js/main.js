$(document).ready(function() {
  $(".delete-article").click(function() {
    $target = $(e.target);
    console.log($target.arrt('data-id'));
  });
});
