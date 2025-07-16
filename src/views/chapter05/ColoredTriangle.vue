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
    attribute vec4 a_Color;
    //用于在顶点着色器（Vertex Shader）与片元着色器（Fragment Shader）之间传递数据的变量声明
    varying vec4 v_Color;
    void main () {
      gl_Position = a_Position;//设置坐标
      v_Color = a_Color;//将数据传递给片元着色器
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;//从顶点着色器接收数据
    void main () {
      gl_FragColor = v_Color;//设置颜色
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
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色
    0.0,  0.5,  1.0,  0.0,  0.0,
    -0.5, -0.5,  0.0,  1.0,  0.0,
    0.5, -0.5,  0.0,  0.0,  1.0,
  ]);

  const n = 3;

  const vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将顶点位置缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // 将顶点位置数据写入 buffer 对象
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  //-----------------------顶点位置-----------------
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return -1;
  }
  /**
   * 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据，
   * 将缓冲区对象分配给 a_Position 变量。
   *
   * 第1个参数表示：指定待分配attribute变量的存储位置
   * 第2个参数2表示提供的数据为x和y坐标，是2维的意思
   * 第3个参数表示数据类型
   * 第4个参数表示是否归一化
   * 第5个参数stride表示：指单个顶点的所有数据，即相邻两个顶点间的距离(单位为字节)，即步进参数，默认值为0
   *  stride可以理解为步长
   * 第6个参数表示：指定缓冲区对象中的偏移量，单位也是字节。当前数据项距首个元素的距离。
   */
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);

  //-----------------------顶点颜色-----------------
  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("无法获取a_Color的存储位置");
    return -1;
  }

  //前两个是顶点坐标，后一个是尺寸，因此offset即第6个参数为FSIZW * 2
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Color);

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
