import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        title: "HelloWorld",
      },
      // #region 已完成
      component: () => import("@/views/HelloWorld.vue"),
      // #endregion
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
