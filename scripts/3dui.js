var app = new Vue({
    el: '#ui',
    data: model
  })

$(document).ready(function(){
  $("#material-list input, #points-list input, #triangles-list input, #triangles-list select").change(function(){
    model.compile();
  });
});