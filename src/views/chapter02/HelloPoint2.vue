<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  // 定义一个顶点着色器程序
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main () {
    gl_Position = a_Position;//设置坐标
    gl_PointSize = a_PointSize;//设置尺寸
  }`;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `void main () {
    gl_FragColor = vec4(0.0, 1.0 ,0.0 ,1.0);//设置颜色
  }`;

  const canvas = webglDivRef.value;
  canvas.width = canvas.height = 400;
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("无法获取 WebGL 的渲染上下文");
    return;
  }

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("初始化着色器失败");
    return;
  }

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");

  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return;
  }

  //将顶点位置传输给attribute变量
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.vertexAttrib1f(a_PointSize, 5.0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //绘制一个点
  gl.drawArrays(gl.POINTS, 0, 1);
});
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
