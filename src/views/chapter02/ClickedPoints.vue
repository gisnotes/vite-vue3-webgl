<template>
  <canvas id="webgl" class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  // 定义一个顶点着色器程序
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main () {
    gl_Position = a_Position;//设置坐标
    gl_PointSize = 10.0;//设置尺寸
  }`;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `void main () {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);//设置颜色
  }`;

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

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const g_points = [];
  cvs.onmousedown = (ev) => {
    let x = ev.clientX;
    let y = ev.clientY;
    const rect = ev.target.getBoundingClientRect();

    x = (x - rect.left - cvs.width / 2) / (cvs.width / 2);
    y = (cvs.height / 2 - (y - rect.top)) / (cvs.height / 2);
    g_points.push([x, y]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const len = g_points.length;
    for (let i = 0; i < len; i++) {
      const xy = g_points[i];
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      //绘制点
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  };
});
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
