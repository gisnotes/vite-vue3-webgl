<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  init();
});

function init() {
  /**
   * 定义一个顶点着色器程序
   * x = r * cosα
   * y = r * sinα
   *
   * x' = r * cos(α + β)
   * y' = r * sin(α + β)
   *
   * 利用三角函数两角和公式
   * x' = r * (cosα * cosβ - sinα * sinβ)
   * y' = r * (sinα * cosβ + cosα * sinβ)
   *
   * 将最上面的x和y的值代入上面的公式，以消除r和α变量：
   * x' = x cosβ - y sinβ
   * y' = x sinβ + y cosβ
   * z' = z
   */
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main () {
      gl_Position = u_xformMatrix * a_Position;
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    void main () {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;

  const ANGLE = 90.0; //要旋转的角度

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

  const xformMatrix = new Matrix4();
  /**
   * 旋转轴：角度后的三个参数0,0,1表示旋转轴z轴，这里表示绕z轴旋转，
   * 并且旋转的角度为角度，而非弧度
   * 上述的0,0,1表示绕着从原点(0,0,0)指向的(0,0,1)的轴进行旋转
   */
  xformMatrix.setRotate(ANGLE, 0, 0, 1);

  const u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
  if (!u_xformMatrix) {
    console.log("无法获取 u_xformMatrix 的存储位置");
    return;
  }
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //  绘制一个三角形
  gl.drawArrays(gl.TRIANGLES, 0, n);
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
   *
   * 第二个参数2表示提供的数据为x和y坐标，是2维的意思
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
