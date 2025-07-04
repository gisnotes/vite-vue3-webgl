<template>
  <canvas class="webgl" ref="webglDivRef"></canvas>
</template>

<script setup>
const webglDivRef = ref(null);

onMounted(() => {
  console.log(webglDivRef.value);
});
</script>

<style lang="scss" scoped>
.webgl {
  width: 400px;
  height: 400px;
}
</style>
