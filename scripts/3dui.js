var app = new Vue({
    el: '#ui',
    data: model,
    methods: {
      addMaterial: function() {
        model.materials.push({
          name: "",
          r: 0.5, g: 0.5, b: 0.5, a: 1.0,
          isFire: false
        });
      },
      deleteMaterial: function(index) {
        var showInUseMessage = model.triangles.some(function(triangle){ return triangle.material == index; });
        var message = showInUseMessage 
          ? "This material is in use.  Triangles that use it will also be removed - are you sure?"
          : "Are you sure you want to delete this material?";
        if (confirm(message)){
          for(var i = 0; i < model.triangles.length; i++) {
            if (model.triangles[i].material == index) {
              // Remove triangle
              model.triangles.splice(i, 1);
              i--;
            } else if (model.triangles[i].material > index) {
              // Adjust index of materials after the one being deleted
              model.triangles[i].material -= 1; 
            }
          }
          // Delete the material
          model.materials.splice(index, 1);
          model.compile();
        }
      },
      clearMaterials: function() {
        var showInUseMessage = model.triangles.length > 0;
        var message = showInUseMessage 
          ? "Some of these materials are in use.  The Triangles list will also be cleared - are you sure?"
          : "Are you sure you want to remove all materials?";
        if (confirm(message)){
          model.triangles.splice(0);
          model.materials.splice(0);
          model.compile();
        }
      }
    }
  });

$(document).ready(function(){
  $("#material-list input, #points-list input, #triangles-list input, #triangles-list select").change(function(){
    model.compile();
  });
});
