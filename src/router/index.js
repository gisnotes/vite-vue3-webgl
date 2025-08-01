import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        // #region 已完成
        // 第2章
        // title: "HelloWorld",
        // title: "第一个webgl程序",
        // title: "绘制一个点(版本1)",
        // title: "绘制一个点(版本2)",
        // title: "通过鼠标点击绘制点",
        // title: "通过鼠标点击绘制不同颜色的点",

        // 第3章
        // title: "(一次性)绘制多个点",
        // title: "绘制一个三角形",
        // title: "绘制多边形",
        // title: "平移三角形",
        // title: "旋转三角形",
        // title: "利用矩阵平移或旋转三角形",
        // title: "利用矩阵将三角形垂直方向(即y方向)上拉伸1.5倍",

        // 第4章
        // title: "利用封装的matrix函数来旋转三角形",
        // title: "先平移后旋转(或先旋转后平移)三角形示例",
        // title: "三角形(平移/旋转)动画",
        // title: "加速/减速三角形动画",

        // 第5章
        // title: "绘制多个不同尺寸的点(一)",
        // title: "绘制多个不同尺寸的点(二)",
        // title: "绘制多个不同颜色的点",
        // title: "绘制彩色三角形(一)",
        // title: "绘制彩色三角形(二)",
        // title: "在矩形表面贴上图像",
        // title: "在矩形表面重复贴图",
        // title: "在矩形上重复贴图，并设置水平和垂直方向上重复贴图的方式",
        // title: "使用多幅纹理",

        // 第7章
        // title: "研究视点、观察目标点和上方向(一)",
        // title: "研究视点、观察目标点和上方向(二)",
        // title: "利用键盘动态改变视角",
        // title: "正射视图",
        // title: "利用键盘动态改变视角(改为正射投影)",
        // title: "透视(投影)视图",
        // title: "透视(投影)视图-平移",
        // title: "正确处理对象的前后关系-开启深度测试",
        // title: "解决深度冲突",
        // title: "绘制立方体",
        // title: "绘制立方体——每个面用不同(单一)颜色渲染",

        // 第8章
        // title: "光照下的立方体",
        // title: "环境光下的漫反射",
        // title: "运动物体(平移+旋转)的光照效果",
        // title: "点光源光",
        // title: "点光源光(动画版)",
        // #endregion
        title: "点光源光-逐片元渲染",
      },
      // #region 已完成
      // 第2章
      // component: () => import("@/views/HelloWorld.vue"),
      // component: () => import("@/views/chapter02/HelloCanvas.vue"),
      // component: () => import("@/views/chapter02/HelloPoint1.vue"),
      // component: () => import("@/views/chapter02/HelloPoint2.vue"),
      // component: () => import("@/views/chapter02/ClickedPoints.vue"),
      // component: () => import("@/views/chapter02/ColoredPoints.vue"),

      // 第3章
      // component: () => import("@/views/chapter03/MultiPoint.vue"),
      // component: () => import("@/views/chapter03/HelloTriangle.vue"),
      // component: () => import("@/views/chapter03/HelloQuad.vue"),
      // component: () => import("@/views/chapter03/TranslateTriangle.vue"),
      // component: () => import("@/views/chapter03/RotatedTriangle.vue"),
      // component: () => import("@/views/chapter03/TranslateRotatedTriangleMatrix.vue"),
      // component: () => import("@/views/chapter03/ScaledTriangleMatrix.vue"),

      // 第4章
      // component: () => import("@/views/chapter04/RotatedTriangle_Matrix4.vue"),
      // component: () => import("@/views/chapter04/RotatedTranslatedTriangle.vue"),
      // component: () => import("@/views/chapter04/RotatingTriangle.vue"),

      // 第5章
      // component: () => import("@/views/chapter05/MultiAttributeSize.vue"),
      // component: () => import("@/views/chapter05/MultiAttributeSize_Interleaved.vue"),
      // component: () => import("@/views/chapter05/MultiAttributeColor.vue"),
      // component: () => import("@/views/chapter05/ColoredTriangle.vue"),
      // component: () => import("@/views/chapter05/HelloTriangle_FragCoord.vue"),
      // component: () => import("@/views/chapter05/TexturedQuad.vue"),
      // component: () => import("@/views/chapter05/TexturedQuad_Repeat.vue"),
      // component: () => import("@/views/chapter05/TexturedQuad_Clamp_Mirror.vue"),
      // component: () => import("@/views/chapter05/MultiTexture.vue"),

      // 第7章
      // component: () => import("@/views/chapter07/LookAtTriangles.vue"),
      // component: () => import("@/views/chapter07/LookAtRotatedTriangles.vue"),
      // component: () => import("@/views/chapter07/LookAtTrianglesWithKeys.vue"),
      // component: () => import("@/views/chapter07/OrthoView.vue"),
      // component: () => import("@/views/chapter07/LookAtTrianglesWithKeys_ViewVolume.vue"),
      // component: () => import("@/views/chapter07/PerspectiveView.vue"),
      // component: () => import("@/views/chapter07/PerspectiveView_mvp.vue"),
      // component: () => import("@/views/chapter07/DepthBuffer.vue"),
      // component: () => import("@/views/chapter07/ZFighting.vue"),
      // component: () => import("@/views/chapter07/HelloCube.vue"),
      // component: () => import("@/views/chapter07/ColoredCube.vue"),

      // 第8章
      // component: () => import("@/views/chapter08/LightedCube.vue"),
      // component: () => import("@/views/chapter08/LightedCube_ambient.vue"),
      // component: () => import("@/views/chapter08/LightedTranslatedRotatedCube.vue"),
      // component: () => import("@/views/chapter08/PointLightedCube.vue"),
      // component: () => import("@/views/chapter08/PointLightedCube_animation.vue"),
      // #endregion
      component: () => import("@/views/chapter08/PointLightedSphere_perFragment.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "WebGL学习笔记";
  }

  next();
});

export default router;
