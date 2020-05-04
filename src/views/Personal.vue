<template>
  <div class="container w">
    <!-- 顶部的导航条 -->
    <NavigateBar title="个人中心" showHome="true" />
    <!-- 头部 -->
    <router-link to="/editprofile">
      <div class="header">
        <div class="avatar">
          <!-- $axios.defaults.baseURL 就是后台的基准路径 -->
          <img :src="$axios.defaults.baseURL + userInfo.head_img" />
        </div>
        <div class="profile">
          <div>
            <span class="iconfont iconxingbienan" v-if="userInfo.gender ===1"></span>
            火星网友
          </div>
          <span class="iconfont iconxingbienv" v-if="userInfo.gender ===0"></span>
          {{userInfo.nickname}}
          <p>{{moment(userInfo.create_date).format('YYYY-MM-DD')}}</p>
        </div>
        <span class="arrow iconfont iconjiantou1"></span>
      </div>
    </router-link>

    <!-- 组件的调用，单双标签都可以 -->
    <!-- :key不是报错，可以不加，
    但是vue希望给循环的元素指定“唯一的key”，所以推荐我们在循环时候都加上-->
    <Listbar
      v-for="(item, index) in rows"
      :key="index"
      :label="item.label"
      :tips="item.tips"
      :path="item.path"
    />
    <!-- handleClick点击退出按钮时候触发 -->
    <!-- click.native这个事件类型，会给Listbar这个组件最外部的div强制绑定点击事件
    不要去跟事件传递作比较-->
    <Listbar @click.native="handleClick" label="退出" />
  </div>
</template>

<script>
//导入列表按钮的组件  @代表src目录
import Listbar from "@/components/Listbar";
import NavigateBar from "@/components/NavigateBar";

//第三方日期插件
import moment from "moment";

export default {
  data() {
    return {
      // 组织一个列表按钮栏的数据
      rows: [
        {
          label: "我的关注",
          tips: "关注的用户",
          path: "/follow"
        },
        {
          label: "我的跟帖",
          tips: "跟帖/回复",
          path: "/comment"
        },
        {
          label: "我的收藏",
          tips: "文章/视频",
          path: "/star"
        }
      ],
      // 个人的详细信息,初始值给一个对象
      userInfo: {},
      // moment是日期处理的工具库，为了在模板中可以使用，所以需要绑定在data中
      moment
    };
  },
  //注册组件,导入的子组件都必须要注册才可以再模板渲染
  components: {
    Listbar,
    NavigateBar
  },
  // 组件加载完毕后触发，类似window.onload
  mounted() {
    // 从本地获取token和id
    const jsonStr = localStorage.getItem("userInfo");
    // 把字符串转成对象,userJson就是用户的信息对象
    const userJson = JSON.parse(jsonStr);
    // 发起异步的请求
    //不设置请求类型默认是get请求
    this.$axios({
      url: "/user/" + userJson.user.id,
      // 添加头信息
      headers: {
        //Authorization请求参数
        Authorization: userJson.token
      }
    }).then(res => {
      console.log(res);
      // 解构出用户的数据
      const { data } = res.data;
      // 赋值给data的userInfo
      this.userInfo = data;
    });
  },
  //方法
  methods: {
    // 退出的事件
    handleClick() {
      //使用第三方插件
      // 询问用户是否确定退出
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定退出吗？"
        })
        // 点击确定时候触发的函数
        .then(() => {
          // 清除本地的存储的用户数据
          localStorage.removeItem("userInfo");
          // 跳转到登录页,必须要使用replace。因为退出不可能再返回个人中心
          this.$router.replace("/login");
        })
        .catch(() => {
          // 点击取消按钮触发的函数
        });
    }
  }
};
</script>

<style lang="less" scoped>
.w {
  width: 360px;
  margin: 0 auto;
  height: 680px;
  // padding-left: 20px;
}
// .navigate-bar {
//   line-height: 48px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 0 20px;
//   border-bottom: 1px #eee solid;
//   .iconshouye {
//     font-size: 20px;
//   }
// }
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 5px solid #eee;
  // padding-left: 0;
  .avatar {
    img {
      display: block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: contain;
    }
  }
  .profile {
    flex: 1;
    padding-left: 20px;
    line-height: 20px;
    font-size: 18px;
    p {
      color: #999;
    }
  }
}
</style>