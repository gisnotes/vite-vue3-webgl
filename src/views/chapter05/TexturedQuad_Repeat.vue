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
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main () {
      gl_Position = a_Position;//设置坐标
      v_TexCoord = a_TexCoord;
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2  v_TexCoord;
    void main () {
      gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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

  // 设置纹理
  if (!initTextures(gl, n)) {
    console.log("Failed to intialize the texture.");
    return;
  }
}

/**
 * 设置纹理坐标
 */
function initVertexBuffers(gl) {
  const verticesTexCoords = new Float32Array([
    // 顶点坐标，纹理坐标
    -0.5, 0.5, -0.3, 1.7,
    -0.5, -0.5, -0.3, -0.2,
    0.5, 0.5, 1.7, 1.7,
    0.5, -0.5, 1.7, -0.2,
  ]);

  const n = 4;

  const vertexTexBuffer = gl.createBuffer();
  if (!vertexTexBuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将顶点位置缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexBuffer);
  // 将顶点位置数据写入 buffer 对象
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  // --------------顶点位置------------
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);

  // ---------------纹理坐标----------
  // 将纹理坐标分配给a_TexCoord
  const a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
  if (a_TexCoord < 0) {
    console.log("无法获取a_TexCoord的存储位置");
    return -1;
  }

  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  // 启用对 a_TexCoord 变量的赋值
  gl.enableVertexAttribArray(a_TexCoord);

  return n;
}

/**
 * 配置和加载纹理
 * @param gl
 * @param n
 */
function initTextures(gl, n) {
  //创建纹理对象
  const texture = gl.createTexture();
  if (!texture) {
    console.log("无法创建纹理对象");
    return false;
  }

  const u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
  if (!u_Sampler) {
    console.log("无法获取u_Sampler的存储位置");
    return false;
  }

  const image = new Image();
  if (!image) {
    console.log("创建image对象失败");
    return false;
  }

  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image);
  };

  image.src = "./examples/resources/sky.jpg";

  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //翻转图像的y轴
  gl.activeTexture(gl.TEXTURE0); //启用0号纹理单元
  gl.bindTexture(gl.TEXTURE_2D, texture); //将纹理对象绑定到目标

  /**
   * 设置纹理参数,
   * - 第1个参数：TEXTURE_2D表示二维纹理，TEXTURE_CUBE_MAP表示立方体纹理，
   * - 第2个参数：
   *   TEXTURE_MAG_FILTER：纹理放大时的采样算法
   *   TEXTURE_MIN_FILTER：纹理缩小时的采样算法
   *   TEXTURE_WRAP_S：水平填充方法
   *   TEXTURE_WRAP_T：垂直填充方法
   * - 第3个参数：
   *   NEAREST：最接近的像素采样算法
   *   LINEAR: 线性插值采样算法
   */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 设置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将0号纹理单元传递给着色器中的取样器变量
  gl.uniform1i(u_Sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 绘制矩形
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
