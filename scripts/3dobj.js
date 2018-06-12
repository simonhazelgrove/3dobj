var cubeRotation = 0.0;

var model = {
  gl: null,
  materials: [
    {
      name: "Painted metal",
      r: 0.5, g: 0.54, b: 0.5, a: 1.0,
      isFire: false
    },
    {
      name: "Glass",
      r: 0, g: 0, b: 1, a: 0.5,
      isFire: false
    },
    {
      name: "Fire",
      r: 1, g: 0, b: 0, a: 1,
      isFire: true
    },
    {
      name: "Black paint",
      r: 0.1, g: 0.1, b: 0.1, a: 1,
      isFire: false
    }
  ],
  points: [
    {
      name: "fuselage.front.bottomleft",
      x: -0.1, y: -0.1, z: 1.0
    },
    {
      name: "fuselage.front.bottomright",
      x: 0.1, y: -0.1, z: 1.0
    },
    {
      name: "fuselage.front.topleft",
      x: 0.1, y: 0.1, z: 1.0
    },
    {
      name: "fuselage.front.topright",
      x: -0.1, y: 0.1, z: 1.0
    },
    {
      name: "fuselage.back.bottomleft",
      x: -0.1, y: -0.1, z: -1.0
    },
    {
      name: "fuselage.back.bottomright",
      x: 0.1, y: -0.1, z: -1.0
    },
    {
      name: "fuselage.back.topleft",
      x: 0.1, y: 0.1, z: -1.0
    },
    {
      name: "fuselage.back.topright",
      x: -0.1, y: 0.1, z: -1.0
    },
    {
      name: "nosecone.tip",
      x: 0, y: 0, z: 1.5
    },
    {
      name: "wing.left.front",
      x: -0.1, y: 0, z: 0.5
    },
    {
      name: "wing.left.tip",
      x: -0.8, y: 0, z: -0.9
    },
    {
      name: "wing.left.backroot",
      x: -0.1, y: 0, z: -0.9
    },
    {
      name: "wing.right.front",
      x: 0.1, y: 0, z: 0.5
    },
    {
      name: "wing.right.tip",
      x: 0.8, y: 0, z: -0.9
    },
    {
      name: "wing.right.backroot",
      x: 0.1, y: 0, z: -0.9
    },
    {
      name: "fin.front",
      x: 0, y: 0.1, z: -0.4
    },
    {
      name: "fin.tip",
      x: 0, y: 0.6, z: -1.0
    },
    {
      name: "fin.backroot",
      x: 0, y: 0.1, z: -1.0
    },
    {
      name: "cockpit.front",
      x: 0, y: 0.1, z: 1
    },
    {
      name: "cockpit.left",
      x: -0.1, y: 0.1, z: 0.8 
    },
    {
      name: "cockpit.back",
      x: 0, y: 0.1, z: 0.2
    },
    {
      name: "cockpit.right",
      x: 0.1, y: 0.1, z: 0.8
    },
    {
      name: "cockpit.top",
      x: 0, y: 0.2, z: 0.8
    },
  ],
  triangles: [
    // Cockpit
    { p1: 18, p2: 21, p3: 22, material: 1, renderBothSides: false },
    { p1: 21, p2: 20, p3: 22, material: 1, renderBothSides: false},
    { p1: 20, p2: 19, p3: 22, material: 1, renderBothSides: false},
    { p1: 19, p2: 18, p3: 22, material: 1, renderBothSides: false},
    // Front cone
    { p1: 8, p2: 0, p3: 1, material: 3, renderBothSides: false },      
    { p1: 8, p2: 1, p3: 2, material: 3, renderBothSides: false },
    { p1: 8, p2: 2, p3: 3, material: 3, renderBothSides: false },
    { p1: 8, p2: 3, p3: 0, material: 3, renderBothSides: false },
    // Jet pipe
    { p1: 5, p2: 4, p3: 7, material: 2, renderBothSides: false },
    { p1: 5, p2: 7, p3: 6, material: 2, renderBothSides: false },
    // Left fuselage panel
    { p1: 4, p2: 0, p3: 3, material: 0, renderBothSides: false },
    { p1: 4, p2: 3, p3: 7, material: 0, renderBothSides: false },
    // Right fuselage panel
    { p1: 1, p2: 5, p3: 6, material: 0, renderBothSides: false },
    { p1: 1, p2: 6, p3: 2, material: 0, renderBothSides: false },
    // Top fuselage panel
    { p1: 3, p2: 2, p3: 6, material: 0, renderBothSides: false },
    { p1: 3, p2: 6, p3: 7, material: 0, renderBothSides: false },
    // Bottom fuselage panel
    { p1: 4, p2: 5, p3: 1, material: 0, renderBothSides: false },
    { p1: 4, p2: 1, p3: 0, material: 0, renderBothSides: false },
    // Left wing
    { p1: 9, p2: 10, p3: 11, material: 0, renderBothSides: true },
    // Right wing
    { p1: 12, p2: 13, p3: 14, material: 0, renderBothSides: true },
    // Back fin
    { p1: 15, p2: 16, p3: 17, material: 0, renderBothSides: true },
  ],
  compile: function(gl)
  {
    this.gl = gl == null ? this.gl : gl;
    this.vertices = [];
    this.normals = [];
    this.colors = [];
    this.indices = [];
    this.vertexMaterials = [];
    for(var i=0; i < this.triangles.length; i++) {
      this.compileTriangle(this.triangles[i]);
    }
    this.initBuffers();
  },
  compileTriangle: function (triangle) {
    var p1 = this.points[triangle.p1];
    var p2 = this.points[triangle.p2];
    var p3 = this.points[triangle.p3];
    var material = this.materials[triangle.material];
    var normal = this.normalFromTriangle(p1, p2, p3);
    this.compilePoint(p1, normal, material);
    this.compilePoint(p2, normal, material);
    this.compilePoint(p3, normal, material);
    if (triangle.renderBothSides) {
      // Render opposite side of triangle
      normal = this.normalFromTriangle(p3, p2, p1);
      this.compilePoint(p3, normal, material);
      this.compilePoint(p2, normal, material);
      this.compilePoint(p1, normal, material);
      }
  },
  compilePoint: function(p, normal, material) {
    var i = this.getIndex(p, normal, material);
    if (i >= 0) {
      this.indices.push(i);
    } else {
      this.vertices.push(p.x, p.y, p.z);
      this.normals.push(normal.x, normal.y, normal.z);
      this.colors.push(material.r, material.g, material.b, material.a);
      this.vertexMaterials.push(material.isFire ? 1 : 0);
      this.indices.push(this.vertices.length / 3 - 1);
    }
  },
  getIndex: function(p, normal, material) {
    for(var i=0; i < this.vertices.length / 3; i++) {
      if (this.vertices[i*3] == p.x && this.vertices[i*3+1] == p.y && this.vertices[i*3+2] == p.z
        && this.normals[i*3] == normal.x && this.normals[i*3+1] == normal.y && this.normals[i*3+2] == normal.z
        && this.colors[i*4] == material.r && this.colors[i*4+1] == material.g && this.colors[i*4+2] == material.b && this.colors[i*4+3] == material.a
        && ((this.vertexMaterials[i] == 0 && !material.isFire) || (this.vertexMaterials[i] == 1 && material.isFire)))
        return i;
    }
    return -1;
  },
  normalFromTriangle: function(p1, p2, p3) {
    var u = {
      x: p2.x - p1.x,
      y: p2.y - p1.y,
      z: p2.z - p1.z
    } 
    var v = {
      x: p3.x - p1.x,
      y: p3.y - p1.y,
      z: p3.z - p1.z
    } 
    var n = {
      x: (u.y * v.z) - (u.z * v.y),
      y: (u.z * v.x) - (u.x * v.z),
      z: (u.x * v.y) - (u.y * v.x)
    };
    return this.normalize(n);
  },
  normalize: function(v) {
    var z = Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2);
    z = Math.pow(z, 0.5);
    return {
      x: v.x / z,
      y: v.y / z,
      z: v.z / z
    }
  },
  initBuffers: function() {
    if (this.buffers.position === null) {
      this.buffers.position = this.gl.createBuffer();
      this.buffers.normal = this.gl.createBuffer();
      this.buffers.color = this.gl.createBuffer();
      this.buffers.indices = this.gl.createBuffer();
      this.buffers.material = this.gl.createBuffer();
    }
    this.updateBuffers();
  },  
  updateBuffers: function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
  
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normal);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
  
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
  
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
  
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.material);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexMaterials), this.gl.STATIC_DRAW);
  },
  vertices: null,
  normals: null,
  colors: null,
  indices: null,
  vertexMaterials: null,
  buffers: {
    position: null,
    normal: null,
    color: null,
    indices: null,
    material: null
  },
  update: function(deltaTime, totalTime) {
  }
};

main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl', { alpha: false });

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  model.compile(gl);

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    attribute float aVertexMaterial;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform float uGameTime;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
      
      if (aVertexMaterial == 1.0) {
        vColor = vec4(1.0, (sin(uGameTime * 20.0) + 1.0) / 2.0, 0.0, 1.0);
        vLighting = vec3(1.0, 1.0, 1.0);
      } else {
        vColor = aVertexColor;

        // Apply lighting effect
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
      }
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      vertexMaterial: gl.getAttribLocation(shaderProgram, 'aVertexMaterial'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      gameTime: gl.getUniformLocation(shaderProgram, 'uGameTime')
    },
  };

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, now, deltaTime, model);

    model.update(deltaTime, now);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


//
// Draw the scene.
//
function drawScene(gl, programInfo, gameTime, deltaTime, model) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LESS);              // Near things obscure far things

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  //gl.disable(gl.DEPTH_TEST);
  
  gl.enable(gl.CULL_FACE);

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation * .7,// amount to rotate in radians
              [1, 1, 0]);       // axis to rotate around (X)

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }
  
  // Tell WebGL how to pull out the normals from
  // the normal buffer into the vertexNormal attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexNormal);
  }
  
  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL how to pull out the material info from the vertexMaterial buffer
  // into the vertexColor attribute.
  {
    const numComponents = 1;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.buffers.material);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexMaterial,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexMaterial);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix);
  gl.uniform1f(programInfo.uniformLocations.gameTime, gameTime);
      
  {
    const vertexCount = model.indices.length;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
