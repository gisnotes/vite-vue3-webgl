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
    attribute vec4 a_Normal; // 顶点法向量

    uniform mat4 u_MvpMatrix;

    uniform mat4 u_ModelMatrix;//模型矩阵
    uniform mat4 u_NormalMatrix;//法线变换矩阵
    uniform vec3 u_LightColor;// 灯光颜色
    uniform vec3 u_LightPosition;// 光源位置（在世界坐标中）
    uniform vec3 u_AmbientLight;// 环境光颜色

    varying vec4 v_Color;
    void main () {
      gl_Position = u_MvpMatrix * a_Position;

      //根据模型矩阵重新计算法向量，并将其长度设为 1
      vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
      // 计算顶点的世界坐标
      vec4 vertexPosition = u_ModelMatrix * a_Position;
      // 计算光线方向，并使其长度为 1.0
      vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));

      // 光线方向和表面方向（法线）的点积
      float nDotL = max(dot(lightDirection, normal), 0.0);
      // 计算漫反射产生的颜色
      // 漫反射光颜色 = 入射光颜色 × 表面基底色 × (光线方向 × 法线方向)
      vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
      // 计算由于环境反射而产生的颜色
      vec3 ambient = u_AmbientLight * a_Color.rgb;
      //添加由漫反射和环境反射产生的表面颜色
      // 表面反射光颜色 = 漫反射光颜色 + 环境反射光颜色
      v_Color = vec4(diffuse + ambient, a_Color.a);
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
    console.log("无法设置顶点信息");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 启用深度测试
  gl.enable(gl.DEPTH_TEST);

  const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

  const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_MvpMatrix || !u_ModelMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　 || !u_AmbientLight) {
    console.log("无法获取矩阵的存储位置");
    return;
  }

  // 设置灯光颜色（白色）
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  // 设置光源方向（基于世界坐标系）
  gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
  // 设置环境光颜色
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);


  const modelMatrix = new Matrix4();
  const mvpMatrix = new Matrix4();
  const normalMatrix = new Matrix4();

  modelMatrix.setRotate(90, 0, 1, 0);//绕y轴旋转90度
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // 将基于模型矩阵进行法线变换的矩阵传递给 u_NormalMatrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  // 清除颜色和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // 绘制立方体
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  // 顶点坐标
  const vertices = new Float32Array([
     2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0,  // v0-v1-v2-v3 前
     2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0,  // v0-v3-v4-v5 右
     2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0,  // v0-v5-v6-v1 上
    -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0,  // v1-v6-v7-v2 左
    -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0,  // v7-v4-v3-v2 下
     2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0   // v4-v7-v6-v5 后
  ]);

  // 每个面的颜色
  const colors = new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 前
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 右
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 上
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 左
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 下
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 后
  ]);

  // 法线
  const normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 前
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 右
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 上
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 左
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 下
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 后
  ]);

  // 顶点的索引
  const indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // 前
     4, 5, 6,   4, 6, 7,    // 右
     8, 9,10,   8,10,11,    // 上
    12,13,14,  12,14,15,    // 左
    16,17,18,  16,18,19,    // 下
    20,21,22,  20,22,23     // 后
  ]);

  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

  // 将索引写入缓冲区对象
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('无法创建缓冲区对象');
    return false;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('无法创建缓冲区对象');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log(`无法获取 ${attribute} 的存储位置`);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return true;
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
