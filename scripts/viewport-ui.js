var viewportUI = new Vue({
  el: '#viewport-ui',
  data: viewportControls,
  methods: {
    setView: function(view) {
      viewportControls.view = view;
      viewportControls.speed.x = 0;
      viewportControls.speed.y = 0;
      viewportControls.speed.z = 0;
      viewportControls.offset.x = 0;
      viewportControls.offset.y = 0;
      viewportControls.offset.z = 0;
      viewportControls.time = 0;
    },
    changeRotation: function(axis, amount) {
      if (viewportControls.mode == "static") {
        this.changeRotationType(viewportControls.offset, axis, amount * 0.1);
      } else {
        this.changeRotationType(viewportControls.speed, axis, amount * 1);
      }
    },
    changeRotationType: function(rotationType, axis, amount) {
      if (axis == "x") {
        rotationType.x += amount;
      } else if (axis == "y") {
        rotationType.y += amount;
      } else if (axis == "z") {
        rotationType.z += amount;
      } 
    },
    changeZoom: function(direction) {
      viewportControls.zoom += direction * 0.5;
    }
  },
  computed: {
  }  
});
