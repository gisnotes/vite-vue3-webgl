<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  init();
});

function init() {
  // 定义一个顶点着色器程序
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main () {
      gl_Position = a_Position;//设置坐标
      gl_PointSize = 10.0;//设置尺寸
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    void main () {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);//设置颜色
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
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
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
   */
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);
  return n;
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
