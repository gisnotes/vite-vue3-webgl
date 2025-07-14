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
        // #endregion
        title: "利用封装的matrix函数来旋转三角形",
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
      // #endregion
      component: () => import("@/views/chapter04/RotatedTriangle_Matrix4.vue"),
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
