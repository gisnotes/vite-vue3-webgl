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
    attribute float a_PointSize;
    void main () {
      gl_Position = a_Position;//设置坐标
      gl_PointSize = a_PointSize;//设置尺寸
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
  const verticesSizes = new Float32Array([
    // 点的坐标和大小
    0.0,
    0.5,
    10.0, // 第1个点
    -0.5,
    -0.5,
    20.0, // 第2个点
    0.5,
    -0.5,
    30.0, // 第3个点
  ]);

  const n = 3;

  const vertexSizeBuffer = gl.createBuffer();
  if (!vertexSizeBuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将顶点位置缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  // 将顶点位置数据写入 buffer 对象
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

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
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);

  //-----------------------顶点尺寸-----------------
  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("无法获取a_PointSize的存储位置");
    return -1;
  }

  //这里尺寸为一维数据，因此第二个参数为1
  //前两个是顶点坐标，后一个是尺寸，因此offset即第6个参数为FSIZW * 2
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_PointSize);

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
