<template>
  <canvas id="webgl" class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  const canvas = webglDivRef.value;
  // console.log("🚀 ~ :13 ~ canvas:", canvas);
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("无法获取 WebGL 的渲染上下文");
    return;
  }
  /**
   * WebGLRenderingContext.clearColor(r,g,b,a) 方法用于设置清空颜色缓冲时的颜色值。
   * 这里的各个颜色通道的范围都为0~1，这个和OpenGL的颜色分量是一致的。
   */
  gl.clearColor(0.5, 0.5, 0.5, 1.0);//灰色
/**
 * COLOR_BUFFER_BIT: 存储像素颜色信息
 * 通过调用 clear，你可以将这些缓冲区的内容重置为(clearColor)指定的默认值。
 */
  gl.clear(gl.COLOR_BUFFER_BIT);
});
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
