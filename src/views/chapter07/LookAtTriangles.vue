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
    uniform mat4 u_ViewMatrix;
    varying vec4 v_Color;
    void main () {
      gl_Position = u_ViewMatrix * a_Position;
      v_Color = a_Color;
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main () {
      gl_FragColor = v_Color;
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

  //将顶点位置写入顶点着色器，设置顶点坐标和颜色
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("无法设置顶点位置");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("无法获取 u_ViewMatrix 存储位置");
    return;
  }

  const viewMatrix = new Matrix4();
  //定义一个用于设置相机视角的矩阵，三个参数依次为视点、目标点和上方向
  viewMatrix.setLookAt(
    0.20, 0.25, 0.25,
    0, 0, 0,
    0, 1, 0);

  // 设置视图矩阵
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * 设置纹理坐标
 */
function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色(RGBA)
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // 绿色三角形位于后面
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // 黄色三角形位于中间
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // 蓝色三角形位于前面
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4,
  ]);

  const n = 9;

  const vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将顶点位置缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  // 将顶点位置数据写入 buffer 对象
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // --------------顶点位置------------
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("无法获取a_Position的存储位置");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  // 启用对 a_Position 变量的赋值
  gl.enableVertexAttribArray(a_Position);

  // ---------------颜色----------
  // 将纹理坐标分配给a_Color
  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("无法获取a_Color的存储位置");
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  // 启用对 a_Color 变量的赋值
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

/**
 * 配置和加载纹理
 * @param gl
 * @param n
 */
function initTextures(gl, n) {
  //创建纹理对象
  const texture0 = gl.createTexture();
  const texture1 = gl.createTexture();
  if (!texture0 || !texture1) {
    console.log("无法创建纹理对象");
    return false;
  }

  const u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  const u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler0 || !u_Sampler1) {
    console.log("无法获取u_Sampler的存储位置");
    return false;
  }

  const image0 = new Image();
  const image1 = new Image();
  if (!image0 || !image1) {
    console.log("创建image对象失败");
    return false;
  }

  image0.onload = function () {
    loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
  };
  image1.onload = function () {
    loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
  };

  image0.src = "./examples/resources/sky.jpg";
  image1.src = "./examples/resources/circle.gif";

  return true;
}

// 指定纹理单元是否已准备就绪可供使用
let g_texUnit0 = false,
  g_texUnit1 = false;

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //翻转图像的y轴
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture); //将纹理对象绑定到目标

  //设置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // 设置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // 将0号或1号纹理单元传递给着色器中的取样器变量
  gl.uniform1i(u_Sampler, texUnit);

  gl.clear(gl.COLOR_BUFFER_BIT);

  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 绘制矩形
  }
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
