var app = new Vue({
    el: '#ui',
    data: model
  })

$(document).ready(function(){
  $("#points-list input").change(function(){
    model.compile();
  });
});