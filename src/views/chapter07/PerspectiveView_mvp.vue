<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  init();
});

//以下代码注释行为两个矩阵实现视角矩阵和旋转矩阵分开实现的方法
function init() {
  // 定义一个顶点着色器程序
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    // uniform mat4 u_ModelMatrix;
    // uniform mat4 u_ViewMatrix;
    // uniform mat4 u_ProjMatrix;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main () {
      gl_Position = u_MvpMatrix * a_Position;
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

  // const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  // const u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  // const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  // if (!u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix) {
  //   console.log("无法获取 u_ModelMatrix、u_ViewMatrix 或 u_ProjMatrix 存储位置");
  //   return;
  // }
  const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log("无法获取 u_MvpMatrix 存储位置");
    return;
  }

  const modelMatrix = new Matrix4();//模型矩阵
  const viewMatrix = new Matrix4();//视图矩阵
  const projMatrix = new Matrix4();//投影矩阵

  const mvpMatrix = new Matrix4();//模型视图投影矩阵

  // 设置视点、目标点和上方向
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  /**
   * 各个参数含义：
   *  -fov： 指定 y 方向上的视场角度（以度为单位）。
   *  -aspect： 指定 x/y 比例。
   *  -near： 指定近裁剪面。
   *  -far： 指定远裁剪面。
   */
  projMatrix.setPerspective(30, cvs.width/cvs.height, 1, 100);

  // 将模型、视图和投影矩阵传递给u_ModelMatrix、u_ViewMatrix， u_ProjMatrix
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  //第1次平移：沿着x轴正方向平移0.75个单位长度
  modelMatrix.setTranslate(0.75, 0, 0);
  // gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);

  //第2次平移：沿着x轴负方向平移0.75个单位长度
  modelMatrix.setTranslate(-0.75, 0, 0);
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * 设置纹理坐标
 */
function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色
    0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // 位于最后的绿色三角形
    -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
     0.5, -1.0,  -4.0,  1.0,  0.4,  0.4,

     0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // 位于中间的黄色三角形
    -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
     0.5, -1.0,  -2.0,  1.0,  0.4,  0.4,

     0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // 位于前面的蓝色三角形
    -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
     0.5, -1.0,   0.0,  1.0,  0.4,  0.4,
  ]);

  const n = 9;//3个三角形，9个顶点

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
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
