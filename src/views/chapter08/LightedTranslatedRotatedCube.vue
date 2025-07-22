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
    attribute vec4 a_Normal;// 顶点法向量
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;//法线变换矩阵
    uniform vec3 u_LightColor;// 灯光颜色
    uniform vec3 u_LightDirection;// 光方向（在世界坐标中，已归一化）
    uniform vec3 u_AmbientLight;// 环境光颜色
    varying vec4 v_Color;
    void main () {
      gl_Position = u_MvpMatrix * a_Position;

      //使法线的长度为1.0，实现具体查看 cuon-matrix.js文件中定义的Vector3类中的normalize方法
      vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
      // 光线方向和表面方向（法线）的点积
      float nDotL = max(dot(u_LightDirection, normal), 0.0);
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

  const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightDirection || !u_AmbientLight) {
    console.log("无法获取矩阵的存储位置");
    return;
  }

  // 设置灯光颜色（白色）
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  //设置光源方向（基于世界坐标系）
  let lightDirection = new Vector3([0.0, 3.0, 4.0]);
  lightDirection.normalize();// 归一化
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  // 设置环境光
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  const modelMatrix = new Matrix4();  // 模型矩阵
  const mvpMatrix = new Matrix4();    // 模型视图投影矩阵
  const normalMatrix = new Matrix4(); // 法线变换矩阵矩阵

  // 计算模型矩阵
  modelMatrix.setTranslate(0, 0.9, 0);//沿 y 轴方向平移
  modelMatrix.rotate(90, 0, 0, 1);//绕z轴旋转90度
  // 计算视图投影矩阵
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // 基于模型矩阵计算法线变换矩阵
  normalMatrix.setInverseOf(modelMatrix);//求逆矩阵
  normalMatrix.transpose();//转置
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
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 前
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 右
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 上
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 左
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 下
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 后
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

  const normals = new Float32Array([    // 法线
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

  if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

function initArrayBuffer(gl, attribute, data, num) {
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
  gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
