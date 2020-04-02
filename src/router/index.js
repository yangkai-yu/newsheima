import Vue from "vue";
// 导入路由
import VueRouter from "vue-router";

// 注册路由的插件，把路由关联到vue。固定要加的
Vue.use(VueRouter);

// 路由配置
const routes = [
  {
    path: "/",
    component: () => import("@/views/Index")
  },
  {
    // 登录页
    path: "/login",
    // 除了首页之外的页面都可以用懒加载,@符号代表的src这个目录
    // .vue这个扩展名可以忽略
    component: () => import("@/views/Login")
  },
  {
    // 注册页
    path: "/register",
    component: () => import("@/views/Register")
  },
  {
    // 个人中心页
    path: "/personal",
    component: () => import("@/views/Personal"),
    meta: {
      authorization: true
    }
  },
  {
    // 编辑资料
    path: "/editprofile",
    component: () => import("@/views/Editprofile"),
    meta: {
      authorization: true
    }
  },
  {
    // 跟帖
    path: "/comment",
    component: () => import("@/views/Comment"),
    meta: {
      authorization: true
    }
  },
  {
    // 关注
    path: "/follow",
    component: () => import("@/views/Follow"),
    meta: {
      authorization: true
    }
  },
  {
    // 关注
    path: "/star",
    component: () => import("@/views/Star"),
    meta: {
      authorization: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  //路由配置
  routes
});

export default router;
