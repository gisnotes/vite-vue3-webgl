<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  init();
});

//以下代码注释行为两个矩阵实现视角矩阵和旋转矩阵分开实现的方法
function init() {
  // 定义一个顶点着色器程序
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    // uniform mat4 u_ViewMatrix;
    // uniform mat4 u_ModelMatrix;
    uniform mat4 u_ModelViewMatrix;
    varying vec4 v_Color;
    void main () {
      // gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
      // gl_Position = u_ModelViewMatrix * a_Position;
      gl_Position = u_ModelViewMatrix * a_Position;
      v_Color = a_Color;
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main () {
      gl_FragColor = v_Color;
    }
  `;

  const cvs = webglDivRef.value;
  cvs.width = cvs.height = 400;
  const gl = getWebGLContext(cvs);

  if (!gl) {
    console.log("无法获取 WebGL 的渲染上下文");
    return;
  }

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("初始化着色器失败");
    return;
  }

  //将顶点位置写入顶点着色器，设置顶点坐标和颜色
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("无法设置顶点位置");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // const u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  // const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  // if (!u_ViewMatrix || !u_ModelMatrix) {
  //   console.log("无法获取 u_ViewMatrix 或 u_ModelMatrix 存储位置");
  //   return;
  // }
  const u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
  if (!u_ModelViewMatrix) {
    console.log("无法获取 u_ModelViewMatrix 存储位置");
    return;
  }

  const viewMatrix = new Matrix4();
  //定义一个用于设置相机视角的矩阵，三个参数依次为视点、目标点和上方向
  viewMatrix.setLookAt(
    0.20, 0.25, 0.25,
    0, 0, 0,
    0, 1, 0);

  // 定义旋转矩阵
  const modelMatrix = new Matrix4();
  modelMatrix.setRotate(-10, 0, 0, 1);//绕z轴顺时针旋转10度

  const modelViewMatrix = viewMatrix.multiply(modelMatrix);


  // 设置视图矩阵
  // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * 设置纹理坐标
 */
function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色(RGBA)
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // 绿色三角形位于后面
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // 黄色三角形位于中间
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // 蓝色三角形位于前面
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4,
  ]);

  const n = 9;

  const vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将顶点位置缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  // 将顶点位置数据写入 buffer 对象
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // --------------顶点位置------------
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);

  // ---------------颜色----------
  // 将纹理坐标分配给a_Color
  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("无法获取a_Color的存储位置");
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  // 启用对 a_Color 变量的赋值
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
