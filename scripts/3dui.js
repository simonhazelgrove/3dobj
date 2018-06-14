var app = new Vue({
  el: '#ui',
  data: model,
  methods: {
    // Add objects
    addMaterial: function() {
      model.materials.push({
        name: "",
        r: 0.5, g: 0.5, b: 0.5, a: 1.0,
        isFire: false
      });
    },
    addPoint: function() {
      model.points.push({
        name: "",
        x: 0, y: 0, z: 0
      });
    },
    addTriangle: function() {
      model.triangles.push({ 
        p1: -1, p2: -1, p3: -1, 
        material: -1, 
        renderBothSides: false });
    },
    // Delete objects
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
            // Adjust index of materials greater than the one being deleted
            model.triangles[i].material -= 1; 
          }
        }
        // Delete the material
        model.materials.splice(index, 1);
        model.compile();
      }
    },
    deletePoint: function(index) {
      var showInUseMessage = model.triangles.some(function(triangle){ return triangle.p1 == index || triangle.p2 == index || triangle.p3 == index; });
      var message = showInUseMessage 
        ? "This point is in use.  Triangles that use it will also be removed - are you sure?"
        : "Are you sure you want to delete this point?";
      if (confirm(message)){
        for(var i = 0; i < model.triangles.length; i++) {
          if (model.triangles[i].p1 == index || model.triangles[i].p2 == index || model.triangles[i].p3 == index) {
            // Remove triangle
            model.triangles.splice(i, 1);
            i--;
          } else { 
            // Adjust index of points greater than the one being deleted
            if (model.triangles[i].p1 > index) {
              model.triangles[i].p1 -= 1; 
            }
            if (model.triangles[i].p2 > index) {
              model.triangles[i].p2 -= 1; 
            }
            if (model.triangles[i].p3 > index) {
              model.triangles[i].p3 -= 1; 
            }
          }
        }
        // Delete the point
        model.points.splice(index, 1);
        model.compile();
      }
    },
    deleteTriangle: function(index) {
      var message = "Are you sure you want to delete this triangle?";
      if (confirm(message)){
        // Delete the triangle
        model.triangles.splice(index, 1);
        model.compile();
      }
    },
    // Clear lists
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
    },
    clearPoints: function() {
      var showInUseMessage = model.triangles.length > 0;
      var message = showInUseMessage 
        ? "Some of these points are in use.  The Triangles list will also be cleared - are you sure?"
        : "Are you sure you want to remove all points?";
      if (confirm(message)){
        model.triangles.splice(0);
        model.points.splice(0);
        model.compile();
      }
    },
    clearTriangles: function() {
      var message = "Are you sure you want to remove all triangles?";
      if (confirm(message)){
        model.triangles.splice(0);
        model.compile();
      }
    },
    // Property changed listeners
    materialChanged: function() {
      model.compile();
    },
    pointChanged: function() {
      model.compile();
    },
    triangleChanged: function() {
      model.compile();
    },
    exportJson: function() {
      var json = this.modelJson;
      copyTextToClipboard(json);
    }
  },
  computed: {
    modelJson: function () {
      var cleanModel = {
        materials: model.materials,
        points: model.points,
        triangles: model.triangles
      };
      var json = JSON.stringify(cleanModel, null, 2);
      return json.trim();
    }
  }  
});

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);

    alert("Text copied to clipboard.");
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
