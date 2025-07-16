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
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    precision mediump float;
    uniform float u_Width;
    uniform float u_Height;
    void main () {
      gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
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

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
  0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);

  const n = 3;

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将顶点位置缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 将顶点位置数据写入 buffer 对象
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  const u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  if (!u_Width) {
    console.log('无法获取u_Width的存储位置');
    return;
  }
  const u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  if (!u_Height) {
    console.log('无法获取u_Height的存储位置');
    return;
  }

  // 传递<canvas>的宽度和高度
  gl.uniform1f(u_Width, gl.drawingBufferWidth);
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);
  // 取消绑定缓冲区对象
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
