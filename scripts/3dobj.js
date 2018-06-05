var cubeRotation = 0.0;

var model = {
  points: [
    // Front corners
    {
      x: -1.0, y: -1.0, z: 1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    },
    {
      x: 1.0, y: -1.0, z: 1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    },
    {
      x: 1.0, y: 1.0, z: 1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    },
    {
      x: -1.0, y: 1.0, z: 1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    },
    // Back corners
    {
      x: -1.0, y: -1.0, z: -1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    },
    {
      x: 1.0, y: -1.0, z: -1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    },
    {
      x: 1.0, y: 1.0, z: -1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    },
    {
      x: -1.0, y: 1.0, z: -1.0,
      r: 0.3, g: 0.34, b: 0.3, a: 1.0
    }
  ],
  pointIndices: [
    // Front triangles
    0, 1, 2,      
    0, 2, 3,    
    // Back triangles
    5, 4, 7,      
    5, 7, 6,
    // Left triangles
    4, 0, 3,    
    4, 3, 7,
    // Right triangles
    1, 5, 6,
    1, 6, 2,
    // Top triangles
    3, 2, 6,
    3, 6, 7,
    // Bottom triangles
    4, 5, 1,
    4, 1, 0
  ],
  compile: function()
  {
    this.vertices = [],
    this.normals = [],
    this.colors = [],
    this.indices = []
    for(var i=0; i < this.pointIndices.length; i += 3) {
      this.compileTriangle(this.points[this.pointIndices[i]], 
        this.points[this.pointIndices[i+1]], 
        this.points[this.pointIndices[i+2]]);
    }
  },
  compileTriangle: function (p1, p2, p3) {
    var normal = this.normalFromTriangle(p1, p2, p3);
    this.compilePoint(p1, normal);
    this.compilePoint(p2, normal);
    this.compilePoint(p3, normal);
  },
  compilePoint: function(p, normal) {
    var i = this.getIndex(p, normal);
    if (i >= 0) {
      this.indices.push(i);
    } else {
      this.vertices.push(p.x, p.y, p.z);
      this.normals.push(normal.x, normal.y, normal.z);
      this.colors.push(p.r, p.g, p.b, p.a);
      this.indices.push(this.vertices.length / 3 - 1);
    }
  },
  getIndex: function(p, normal) {
    for(var i=0; i < this.vertices.length / 3; i++) {
      if (this.vertices[i*3] == p.x && this.vertices[i*3+1] == p.y && this.vertices[i*3+2] == p.z
        && this.normals[i*3] == normal.x && this.normals[i*3+1] == normal.y && this.normals[i*3+2] == normal.z
        && this.colors[i*4] == p.r && this.colors[i*4+1] == p.g && this.colors[i*4+2] == p.b && this.colors[i*4+3] == p.a) 
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
  }
};

model.compile();

main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;

      // Apply lighting effect
      
      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
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
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl, model);

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl, model) {

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    normal: normalBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
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

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

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
  
  {
    const vertexCount = 36;
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
