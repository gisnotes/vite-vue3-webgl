import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        // #region 已完成
        // title: "HelloWorld",
        // title: "第一个webgl程序",
        // title: "绘制一个点(版本1)",
        // title: "绘制一个点(版本2)",
        // title: "通过鼠标点击绘制点",
        // title: "通过鼠标点击绘制不同颜色的点",

        // title: "(一次性)绘制多个点",
        // title: "绘制一个三角形",
        // title: "绘制多边形",
        // title: "平移三角形",
        // title: "旋转三角形",
        // title: "利用矩阵平移或旋转三角形",
        // title: "利用矩阵将三角形垂直方向(即y方向)上拉伸1.5倍",

        // title: "利用封装的matrix函数来旋转三角形",
        // title: "先平移后旋转(或先旋转后平移)三角形示例",
        // title: "三角形(平移/旋转)动画",
        // title: "加速/减速三角形动画",

        // title: "绘制多个不同尺寸的点(一)",
        // title: "绘制多个不同尺寸的点(二)",
        // title: "绘制多个不同颜色的点",
        // title: "绘制彩色三角形(一)",
        // title: "绘制彩色三角形(二)",
        // title: "在矩形表面贴上图像",
        // title: "在矩形表面重复贴图",
        // title: "在矩形上重复贴图，并设置水平和垂直方向上重复贴图的方式",
        // title: "使用多幅纹理",

        // title: "研究视点、观察目标点和上方向(一)",
        // title: "研究视点、观察目标点和上方向(二)",
        // #endregion
        title: "利用键盘动态改变视角",
      },
      // #region 已完成
      // component: () => import("@/views/HelloWorld.vue"),
      // component: () => import("@/views/chapter02/HelloCanvas.vue"),
      // component: () => import("@/views/chapter02/HelloPoint1.vue"),
      // component: () => import("@/views/chapter02/HelloPoint2.vue"),
      // component: () => import("@/views/chapter02/ClickedPoints.vue"),
      // component: () => import("@/views/chapter02/ColoredPoints.vue"),

      // component: () => import("@/views/chapter03/MultiPoint.vue"),
      // component: () => import("@/views/chapter03/HelloTriangle.vue"),
      // component: () => import("@/views/chapter03/HelloQuad.vue"),
      // component: () => import("@/views/chapter03/TranslateTriangle.vue"),
      // component: () => import("@/views/chapter03/RotatedTriangle.vue"),
      // component: () => import("@/views/chapter03/TranslateRotatedTriangleMatrix.vue"),
      // component: () => import("@/views/chapter03/ScaledTriangleMatrix.vue"),

      // component: () => import("@/views/chapter04/RotatedTriangle_Matrix4.vue"),
      // component: () => import("@/views/chapter04/RotatedTranslatedTriangle.vue"),
      // component: () => import("@/views/chapter04/RotatingTriangle.vue"),

      // component: () => import("@/views/chapter05/MultiAttributeSize.vue"),
      // component: () => import("@/views/chapter05/MultiAttributeSize_Interleaved.vue"),
      // component: () => import("@/views/chapter05/MultiAttributeColor.vue"),
      // component: () => import("@/views/chapter05/ColoredTriangle.vue"),
      // component: () => import("@/views/chapter05/HelloTriangle_FragCoord.vue"),
      // component: () => import("@/views/chapter05/TexturedQuad.vue"),
      // component: () => import("@/views/chapter05/TexturedQuad_Repeat.vue"),
      // component: () => import("@/views/chapter05/TexturedQuad_Clamp_Mirror.vue"),
      // component: () => import("@/views/chapter05/MultiTexture.vue"),

      // component: () => import("@/views/chapter07/LookAtTriangles.vue"),
      // component: () => import("@/views/chapter07/LookAtRotatedTriangles.vue"),
      // #endregion
      component: () => import("@/views/chapter07/LookAtTrianglesWithKeys.vue"),
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
