<template>
  <div>
    <div class="box w">
      <div class="iconfont iconicon-test close"></div>
      <div class="new iconfont iconnew"></div>
      <van-form @submit="onSubmit" class="form">
        <van-field
          v-model="form.username"
          name="手机号码"
          placeholder="手机号码"
          :rules="[{ required: true, message: '请填写手机号码' }]"
        />
        <van-field
          v-model="form.nickname"
          name="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请填写昵称' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <!-- 如果这个按钮是在van-form组件内部，
        并且按钮的native-type="submit"，说明点击这个按钮就会触发submit事件-->
        <div>
          <van-button round block type="info" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        nickname: "",
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
        // url: "http://127.0.0.1:3000/register",
        url: "/register",
        //声明请求的方法post请求
        method: "POST",
        // 参数
        data: this.form
        // .then()接收返回的数据
        // .then方法里面的函数就是成功的回调函数,axios没有succces
      }).then(res => {
        console.log(res);
        const { message } = res.data;
        // 使用vant的弹窗提示用，success表示成功的弹窗
        this.$toast.success(message);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.w {
  width: 360px;
}
.box {
  height: 610px;
  background-color: #f2f2f2;
  margin: 0 auto;
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
