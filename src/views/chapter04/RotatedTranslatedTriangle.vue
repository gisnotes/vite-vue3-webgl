<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  init();
});

function init() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main () {
      gl_Position = u_ModelMatrix * a_Position;
    }
  `;

  // 定义一个片元着色器程序
  const FSHADER_SOURCE = `
    void main () {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

  const modelMatrix = new Matrix4();
  const ANGLE = 60.0;
  const Tx = 0.5;

  /**
   *  思路：先平移后旋转
   * 旋转矩阵 * (平移矩阵 * 原始坐标) <=> (旋转矩阵 * 平移矩阵) * 原始坐标，
   * 虽然我们想先平移后旋转，但通过上述公式可以看出
   */
  //利用带有set前缀的方法计算旋转矩阵
  modelMatrix.setRotate(ANGLE, 0, 0, 1); //设置模型矩阵为旋转矩阵
  /**
   * 然后利用不带set前缀的方法计算先计算出平移矩阵，
   * 然后用存储在modelMatrix中的矩阵乘以这个平移矩阵，将结果再写回modelMatrix中
   *
   * 这里也说明了带有set前缀和不带的方法的区别。
   */
  modelMatrix.translate(Tx, 0, 0); //将模型矩阵乘以平移矩阵

  // 先旋转后平移， 则实现如下，同上类似,但最终结果却完全不同
  // modelMatrix.setTranslate(Tx, 0, 0);
  // modelMatrix.rotate(ANGLE, 0, 0, 1);

  const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("无法获取 u_ModelMatrix 的存储位置");
    return;
  }
  // 将模型矩阵传输给顶点着色器
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //  绘制一个三角形
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0, 0.3, -0.3, -0.3, 0.3, -0.3]);
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
