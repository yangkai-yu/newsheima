// vue构造函数
import Vue from "vue";
// App组件（以.vue结尾的文件都是组件）
import App from "./App.vue";
// 路由对象
import router from "./router";
// 引入vant ui组价库
import Vant from "vant";
// 导入Axios异步请求库
import axios from "axios";
//注册vant插件
Vue.use(Vant);

// 绑定到原型
Vue.prototype.$axios = axios;
//基准地址
axios.defaults.baseURL = "http://localhost:3000";
// 上线环境是否提示信息(忽略)
Vue.config.productionTip = false;

// 创建一个根实例
// .$mount('#app') 相当于el配置，指定id为app的元素作为模板
new Vue({
  // 路由对象
  router,
  // 加载第一个子组件，最底层的组件，（写法是固定的）
  render: h => h(App)
}).$mount("#app");
