<template>
  <div class="w">
    <NavigateBar title="编辑资料" />
    <div class="avatar">
      <van-uploader :after-read="afterRead" class="uploader" />
      <img :src="$axios.defaults.baseURL + user.head_img" alt />
    </div>
    <Listbar label="昵称" :tips="user.nickname" @click.native="show=true" />
    <!-- confirm点击确认按钮时触发-->
    <van-dialog v-model="show" title="修改昵称" show-cancel-button @confirm="handChangNickname">
      <van-field v-model="nickname" placeholder="请输入用户名" />
    </van-dialog>

    <Listbar label="密码" tips="******" @click.native="showpasswrod=true" />
    <van-dialog v-model="showpasswrod" title="密码" show-cancel-button @confirm="handChangPasswrod">
      <van-field v-model="passwrod" placeholder="请输入密码" type="password" />
    </van-dialog>

    <Listbar label="性别" :tips="user.gender==1?'男':'女'" @click.native="showgender=true" />
    <!-- 默认情况下点击选项时不会自动收起
    可以通过 close-on-click-action 属性开启自动收起-->
    <van-action-sheet
      v-model="showgender"
      :actions="actions"
      @select="onSelect"
      close-on-click-action
    />
  </div>
</template>

<script>
import Listbar from "@/components/Listbar";
import NavigateBar from "@/components/NavigateBar";
export default {
  data() {
    return {
      //定义一个空数据接收用户详情
      user: "",
      //接收存储昵称的值
      nickname: "",
      show: false,
      nickname: "",
      showpasswrod: false,
      passwrod: "",
      showgender: false,
      actions: [
        { name: "男", value: 1 },
        { name: "女", value: 0 }
      ]
    };
  },
  components: {
    Listbar,
    NavigateBar
  },
  //组件加载完自动运行
  mounted() {
    //获取存储在本地的token，当前token是字符串
    const userJson = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(userJson);

    this.userJson = userJson;
    // console.log(this.userJson);
    // 发起请求
    this.$axios({
      //请求地址
      url: "/user/" + this.userJson.user.id,
      //请求类型 默认是get
      // method:'GET',
      //headers头信息参数
      headers: {
        Authorization: userJson.token
      }
      //请求返回的数据
    }).then(res => {
      console.log(res);
      //获取到res.data的数据，结构出来
      const { data } = res.data;
      // console.log(data);
      //把结构出来的数据给this.user存储起来
      this.user = data;
      //把昵称的值给 this.nickname存储起来
      this.nickname = data.nickname;
      // console.log(this.nickname);
    });
  },
  //方法
  methods: {
    //调用上传方法
    afterRead(file) {
      //上传图片需要new FormData()
      const fd = new FormData();

      // 第一个字符串的file表示接口接收的属性，第二个 file.file是文件对象
      //给表单添加
      fd.append("file", file.file);
      //发起请求
      this.$axios({
        //请求的地址
        url: "/upload",
        //请求数据类型
        method: "POST",
        //Authorization请求参数
        headers: {
          Authorization: this.userJson.token
        },

        data: fd
      }).then(res => {
        console.log(res);
        const { data } = res.data;
        this.user.head_img = data.url;
        //调用封装
        this.handleEdit({ head_img: data.url });
      });
    },
    handChangNickname() {
      const Nickname = this.handleEdit({ nickname: this.nickname });
      Nickname.then(() => {
        this.user.nickname = this.nickname;
      });
    },
    handChangPasswrod() {
      this.handleEdit({ password: this.passwrod });
    },
    onSelect(item) {
      const gender = this.handleEdit({ gender: item.value });
      gender.then(() => {
        this.user.gender = item.value;
      });
      //隐藏弹出框
      // this.showgender = false;
    },
    handleEdit(data) {
      return this.$axios({
        url: "/user_update/" + this.userJson.user.id,
        method: "POST",
        headers: {
          Authorization: this.userJson.token
        },
        data: data
      }).then(res => {
        console.log(res);
        this.$toast.success("修改成功");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.w {
  width: 360px;
  margin: 0 auto;
  .avatar {
    display: flex;
    padding: 20px;
    justify-content: center;
    align-items: center;
    position: relative;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .uploader {
      position: absolute;
      width: 100px;
      height: 100px;
      left: 50%;
      top: 50%;
      transform: translateX(-50px) translateY(-50px);
      opacity: 0;
    }
  }
}
</style>