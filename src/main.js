// vue构造函数
import Vue from "vue";
// App组件（以.vue结尾的文件都是组件）
import App from "./App.vue";
// 路由对象
import router from "./router";
// 引入vant ui组价库
import Vant, { Toast } from "vant";
// 导入Axios异步请求库
import axios from "axios";
// 注册vant插件 （vue.use都是用来注册插件
Vue.use(Vant);

// 绑定到原型，加上之后以后就可以在组件中通过this.$axios来调用请求方法
Vue.prototype.$axios = axios;
// 给axios添加基准路径，添加完了之后请求的url就会拼接这个地址
axios.defaults.baseURL = "http://localhost:3000";
// 上线环境是否提示信息(忽略)
Vue.config.productionTip = false;

// 添加路由的守卫
// to: 代表你即将要访问的页面
// from：代表你即将要离开的页面
// next：必须要调用，next就类似于你nodejs的中间件，调用才会加载后面的内容
//需要验证的页面
router.beforeEach((to, from, next) => {
  if (to.meta.authorization) {
    // 判断是否是登录状态，时候有token
    // 如果本地的数据是空会返回null，null是没有token属性，会导致js报错，
    // 所以可以加个判断，如果本地的数据空的，等于空的对象
    //获取登录成功后的token值(令牌)， 如果本地的数据是空会返回null，可以通过 || 等于空的对象
    const userJson = JSON.parse(localStorage.getItem("userInfo")) || {};
    // userJson.token获取到用户登录成功令牌的值
    if (userJson.token) {
      next();
    } else {
      // 跳转到登录页,next这个函数可以传递路径，并且会跳转该路径
      next("/login");
    }
  } else {
    next();
  }
});
//axios的响应拦截器
axios.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    console.log(error.response);
    //如果请求返回的结果是错误的，会进入到错误的处理函数中
    //error是js原生的错误对象，我们可以通过error.response可以获取到详细的信息
    const { statusCode, message } = error.response.data;
    if (statusCode === 400) {
      Toast.fail(message);
    }
    return Promise.reject(error);
  }
);
// 创建一个根实例
// .$mount('#app') 相当于el配置，指定id为app的元素作为模板
new Vue({
  // 路由对象
  router,
  // 加载第一个子组件，最底层的组件，（写法是固定的）
  render: h => h(App)
}).$mount("#app");
