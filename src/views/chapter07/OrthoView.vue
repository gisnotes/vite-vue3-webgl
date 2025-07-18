<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
  <p class="near-far-values">
    近平面：<span class="value">{{ nearValue }}</span>
    ，远平面：<span class="value">{{ farValue }}</span>
  </p>
</template>

<script setup>
import { toFixed } from "@/utils/math.js";

const webglDivRef = ref(null);
const nearValue = ref(0);
const farValue = ref(0);

onMounted(() => {
  init();
});

//以下代码注释行为两个矩阵实现视角矩阵和旋转矩阵分开实现的方法
function init() {
  // 定义一个顶点着色器程序
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main () {
      gl_Position = u_ProjMatrix * a_Position;
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

  const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
  if (!u_ProjMatrix) {
    console.log("无法获取 u_ProjMatrix 存储位置");
    return;
  }

  const projMatrix = new Matrix4();
  document.onkeydown = function (ev) {
    keydown(ev, gl, n, u_ProjMatrix, projMatrix);
  };

  draw(gl, n, u_ProjMatrix, projMatrix);
}

/**
 * 设置纹理坐标
 */
function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色(RGBA)
     0.0,  0.6,  -0.4,  0.4,  1.0,  0.4, // 绿色三角形位于后面
    -0.5, -0.4,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.4,  -0.4,  1.0,  0.4,  0.4,

     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // 黄色三角形位于中间
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0, // 蓝色三角形位于前面
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

let g_near = 0.0, g_far = 0.5;
function keydown(ev, gl, n, u_ProjMatrix, projMatrix) {
  switch(ev.keyCode){
    case 39:
      g_near += 0.01;
      break;  // 按下→键
    case 37:
      g_near -= 0.01;
      break;  // 按下←键
    case 38:
      g_far += 0.01;
      break;  // 按下↑键
    case 40:
      g_far -= 0.01;
      break;  // 按下↓键
    default:
      return;
  }
  draw(gl, n, u_ProjMatrix, projMatrix);
}

function draw(gl, n, u_ProjMatrix, projMatrix) {
  /**
   * 6个参数依次为：
   * left, right, bottom, top, near, far
   */
  projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  nearValue.value = toFixed(g_near, 2);
  farValue.value = toFixed(g_far, 2);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}

.near-far-values{
  margin-top: 10px;

  .value {
    color: #409eff;
  }
}
</style>
