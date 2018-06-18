var modelUI = new Vue({
  el: '#model-ui',
  data: model,
  methods: {
    // Add objects
    addMaterial: function() {
      model.materials.push({
        name: "",
        r: 0.5, g: 0.5, b: 0.5, a: 1.0,
        isFire: false
      });
      this.scrollToBottom("materials-container");
    },
    addPoint: function() {
      model.points.push({
        name: "",
        x: 0, y: 0, z: 0
      });
      this.scrollToBottom("points-container");
    },
    addTriangle: function() {
      model.triangles.push({ 
        p1: -1, p2: -1, p3: -1, 
        material: -1, 
        renderBothSides: false 
      });
      this.scrollToBottom("triangles-container");
    },
    // Delete objects
    deleteMaterial: function(index) {
      var showInUseMessage = model.triangles.some(function(triangle){ return triangle.materiala == index || triangle.materialb == index; });
      var message = showInUseMessage 
        ? "This material is in use.  Triangles that use it will also be removed - are you sure?"
        : "Are you sure you want to delete this material?";
      if (confirm(message)){
        for(var i = 0; i < model.triangles.length; i++) {
          if (model.triangles[i].materiala == index || model.triangles[i].materialb == index) {
            // Remove triangle
            model.triangles.splice(i, 1);
            i--;
          } else {
            // Adjust index of materials greater than the one being deleted
            if (model.triangles[i].materiala > index) {
              model.triangles[i].materiala -= 1; 
            }
            if (model.triangles[i].materialb > index) {
              model.triangles[i].materialb -= 1; 
            }
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
    },
    // Point mirroring
    mirrorPoint: function(axis, point) {
      var mirroredPoint = this.mirrorPointInAxis(axis, point);
      if (!this.pointExists(axis, mirroredPoint)) {
        model.points.push(mirroredPoint);
        this.scrollToBottom("points-container");
      }
    },
    mirrorPointInAxis: function(axis, point) {
      return {
        name: this.mirrorPointName(axis, point.name),
        x: axis == "x" ? -point.x : point.x,
        y: axis == "y" ? -point.y : point.y,
        z: axis == "z" ? -point.z : point.z,
      };
    },
    mirrorPointName: function(axis, name) {
      if (axis == "x") {
        if (name.indexOf("left") >= 0) {
          name = name.replace("left", "right");
        } else {
          name = name.replace("right", "left");
        }
      }
      if (axis == "y") {
        if (name.indexOf("top") >= 0) {
          name = name.replace("top", "bottom");
        } else {
          name = name.replace("bottom", "top");
        }
      }
      if (axis == "z") {
        if (name.indexOf("back") >= 0) {
          name = name.replace("back", "front");
        } else {
          name = name.replace("front", "back");
        }
      }    
      return name;
    },
    pointExists: function(axis, point) {
      var existingPoint = model.points.find(function (p) { return p.x == point.x && p.y == point.y && p.z == point.z; })
      return existingPoint != undefined;
    },
    canMirrorPoints: function (axis) {
      var f = this;
      var map = model.points.map(function (point) {
        var mirroredPoint = f.mirrorPointInAxis(axis, point);
        return !f.pointExists(axis, mirroredPoint);
      });
      return map;
    },
    scrollToBottom(divId) {
      setTimeout(function () { scrollToBottom(divId); }, 0);
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
    },
    canMirrorPointsX: function () {
      return this.canMirrorPoints('x');
    },
    canMirrorPointsY: function () {
      return this.canMirrorPoints('y');
    },
    canMirrorPointsZ: function () {
      return this.canMirrorPoints('z');
    }
  }  
});

function scrollToBottom(id) {
  var div = document.getElementById(id);
  div.scrollTop = div.scrollHeight - div.clientHeight;
}

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
