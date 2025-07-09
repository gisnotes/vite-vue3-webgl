<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
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

  /**
   * 定义一个片元着色器程序
   *
   * precision mediump float; 是一条精度指令，用于指定浮点数运算的精度级别
   *  - mediump:中等精度,全称为：medium precision
   *    mediump 通常提供 10 位精度（约 3-4 位小数有效位），
   *    适合颜色、纹理坐标和大多数中间计算。mediump 在精度和性能间取得折中。
   *  - lowp:低精度，通常 8 位，适合颜色值但不适合复杂计算
   *  - highp:高精度，通常 16-32 位，适合顶点变换等高精度需求
   */
  const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main () {
    gl_FragColor = u_FragColor;//设置颜色
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
  const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const g_points = [];
  const g_colors = [];
  cvs.onmousedown = (ev) => {
    let x = ev.clientX;
    let y = ev.clientY;
    const rect = ev.target.getBoundingClientRect();

    x = (x - rect.left - cvs.width / 2) / (cvs.width / 2);
    y = (cvs.height / 2 - (y - rect.top)) / (cvs.height / 2);
    g_points.push([x, y]);

    if (x >= 0.0 && y >= 0.0) {
      g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) {
      g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
      g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    const len = g_points.length;
    for (let i = 0; i < len; i++) {
      const xy = g_points[i];
      const rgba = g_colors[i];
      gl.vertexAttrib3f(a_Position, ...xy, 0.0);
      gl.uniform4f(u_FragColor, ...rgba);
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
