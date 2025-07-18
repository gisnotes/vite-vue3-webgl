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
    uniform mat4 u_ViewProjMatrix;
    varying vec4 v_Color;
    void main () {
      gl_Position = u_ViewProjMatrix * a_Position;
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
  // 启用深度测试
  gl.enable(gl.DEPTH_TEST);

  const u_ViewProjMatrix = gl.getUniformLocation(gl.program, 'u_ViewProjMatrix');
  if (!u_ViewProjMatrix) {
    console.log("无法获取 u_ViewProjMatrix 存储位置");
    return;
  }

  const viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30, cvs.width / cvs.height, 1, 100);
  // 设置视点、目标点及上方向
  viewProjMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);

  gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);

  // 清除颜色和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // 启用多边形偏移功能
  gl.enable(gl.POLYGON_OFFSET_FILL);

  gl.drawArrays(gl.TRIANGLES, 0, n/2);//绿色三角形
  gl.polygonOffset(1.0, 1.0);//设置偏移量
  gl.drawArrays(gl.TRIANGLES, n/2, n/2);//黄色三角形
}

/**
 * 设置纹理坐标
 */
function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色
    0.0,  2.5,  -5.0,  0.4,  1.0,  0.4, // 绿色三角形
    -2.5, -2.5,  -5.0,  0.4,  1.0,  0.4,
     2.5, -2.5,  -5.0,  1.0,  0.4,  0.4,

     0.0,  3.0,  -5.0,  1.0,  0.4,  0.4, // 黄色三角形
    -3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
     3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
  ]);

  const n = 6;//2个三角形，6个顶点

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
