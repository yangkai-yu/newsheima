<template>
  <div>
    <div class="box w">
      <!-- <div class="header"></div> -->
      <div class="close iconfont iconicon-test"></div>
      <div class="new iconfont iconnew"></div>
      <!-- <div>
        <input
          type="text"
          placeholder="用户名 / 手机号码"
          v-model="form.username"
        />
      </div>
      <div>
        <input v-model="form.password" type="password" placeholder="密码" />
      </div>
      <button class="btu-login" @click="headeleClick">登录</button>-->
      <!-- <footer class="foot"></footer> -->
      <van-form @submit="onSubmit" class="form">
        <van-field
          v-model="form.username"
          name="手机号码"
          placeholder="手机号码"
          :rules="[{ required: true, message: '请填写手机号码' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div>
          <van-button round block type="info" native-type="submit">登录</van-button>
          <router-link to="/register">
            <van-button round block class="register">注册</van-button>
          </router-link>
        </div>
      </van-form>
    </div>

    <!-- 要显示阿里图标库的图标，必须要加上iconfont这个类名，第二类名就是你想要显示的那个图标 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    // headeleClick() {
    //   // this.$toast("登录成功");
    //   //调用axios发起异步请求

    // },
    //提交表单时候触发的事件
    //values是表单返回的值
    onSubmit(values) {
      console.log("submit", this.form);
      this.$axios({
        //接口地址
        // url: "http://127.0.0.1:3000/login",
        url: "/login",
        //声明请求的方法post请求
        method: "POST",
        data: this.form
        // .then()接收返回的数据
      }).then(res => {
        console.log(res);
        // 获取到返回的信息, data是token和用户的信息，data是保存到本地的
        const { message, data } = res.data;
        // 使用vant的弹窗提示用，success表示成功的弹窗
        this.$toast.success(message);
        // 把token和id保存到本地
        // localStorage只能保存字符串，需要使用JSON.stringify来把对象转换成字符串
        localStorage.setItem("userInfo", JSON.stringify(data));
        // 先暂时登录成功跳转个人中心页
        this.$router.push("/personal");
      });
    }
  }
};
</script>

<style lang="less" scoped>
// scoped属性表示样式只针对当前的组件有效
.w {
  width: 360px;
}
.box {
  height: 610px;
  background-color: #f2f2f2;
  margin: 100px auto;
}

.close {
  font-size: 30px;
  color: #757575;
  /* margin: 20px; */
  padding: 20px;
}
.new {
  font-size: 130px;
  color: #cc3300;
  width: 360px;
  text-align: center;
}
::placeholder {
  color: #949494;
  font-size: 20px;
}
.form .van-cell {
  border: 0;
  padding: 0;
  outline: none;
  border-bottom: 1px solid #757575;
  margin: 0 auto;
  display: block;
  width: 320px;
  height: 44px;
  background-color: #f2f2f2;
  margin-top: 20px;
}

.form .van-button--info {
  width: 320px;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #cc3300;
  border: 1px solid #cc3300;
}
.register {
  width: 320px;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #06a9f6;
  border: 1px solid #06a9f6;
}
</style>
