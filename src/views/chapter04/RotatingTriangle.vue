<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);
const ANGLE_STEP = 45.0;

onMounted(() => {
  init();
});

function init() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main () {
      gl_Position = u_ModelMatrix * a_Position;
    }
  `;

  const FSHADER_SOURCE = `
    void main () {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

  //将顶点位置写入顶点着色器
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("无法设置顶点位置");
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("无法获取 u_ModelMatrix 的存储位置");
    return;
  }

  let currentAngle = 0.0;
  const modelMatrix = new Matrix4();

  const tick = function () {
    currentAngle = animate(currentAngle);
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    /**
     * requestAnimationFrame请参考webgl-utils.js中的定义，兼容了不同的浏览器之间的差异
     *
     * 含义：函数tick(第一个参数)会在浏览器需要网页的某个元素(即第二个参数)
     * 重绘时被调用。
     *
     *  使用requestAnimationFrame函数的好处是：避免在未激活的标签页上运行动画。
     *  取消请求的方法为cancelAnimationFrame()
     */
    requestAnimationFrame(tick, cvs);
  };

  tick();
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const n = 3;
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }
  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 将顶点数据写入 buffer 对象
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return -1;
  }
  /**
   * 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据，
   * 将缓冲区对象分配给 a_Position 变量。
   *
   * 第二个参数2表示提供的数据为x和y坐标，是2维的意思
   */
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);

  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  // modelMatrix.translate(0.35, 0, 0);//取消注释该项则会平移加旋转
  // 将旋转矩阵传递给顶点着色器
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

// g_last:上次调用此函数的时间
let g_last = Date.now();
function animate(angle) {
  // 计算已用时间
  const now = Date.now();
  const elapsed = now - g_last;
  g_last = now;
  //更新当前旋转角度（根据经过的时间进行调整）
  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  // 求模，保证角度始终小于360
  return (newAngle %= 360);
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
