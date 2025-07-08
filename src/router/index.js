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
        // #endregion
        title: "绘制一个点(版2)",
      },
      // #region 已完成
      // component: () => import("@/views/HelloWorld.vue"),
      // component: () => import("@/views/chapter02/HelloCanvas.vue"),
      // component: () => import("@/views/chapter02/HelloPoint1.vue"),
      // #endregion
      component: () => import("@/views/chapter02/HelloPoint2.vue"),
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
