<template>
  <canvas id="webgl" class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  // 定义一个顶点着色器程序
  const VSHADER_SOURCE = `void main () {
    gl_Position = vec4(0.0, 0.5 ,0.0 ,1.0);//设置坐标
    gl_PointSize = 10.0;//设置尺寸
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
