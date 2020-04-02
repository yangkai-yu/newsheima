<template>
  <div class="w">
    <!-- 头部导航组件 -->
    <NavigateBar title="编辑资料" showHome />

    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + userInfo.head_img" />

      <!-- 添加上传图片的组件 -->
      <van-uploader class="uploader" :after-read="afterRead" />
    </div>

    <!-- 按钮列表 -->
    <!-- show = true相当于this.show = true -->
    <Listbar label="昵称" :tips="userInfo.nickname" @click.native="show=true" />

    <!-- 编辑昵称的弹窗 -->
    <!-- v-model: value和input/change两种数据的集合，
        这里的v-model作用只要控制弹窗的显示和隐藏
        @confirm点击确定按钮时候的事件
    -->
    <van-dialog v-model="show" title="修改昵称" show-cancel-button @confirm="handChangNickname">
      <van-field v-model="nickname" placeholder="请输入用户名" />
    </van-dialog>

    <!-- 编辑密码的按钮 -->
    <Listbar label="密码" tips="******" @click.native="showpassword=true" />

    <!-- 编辑密码的弹窗 -->
    <van-dialog v-model="showpassword" title="修改密码" show-cancel-button @confirm="handChangpassword">
      <van-field v-model="password" placeholder="请输入密码" type="password" />
    </van-dialog>

    <!-- 编辑性别的按钮 -->
    <Listbar label="性别" :tips="userInfo.gender==1?'男':'女'" @click.native="showgender=true" />
    <!-- <Listbar label="性别" :tips="['女','男'][userInfo.gender]" @click.native="showgender=true" /> -->

    <!-- 编辑性别的弹窗 -->
    <!-- close-on-click-action 自动关闭弹窗
        actions 弹窗菜单的选项
    select 选中某一项时候的事件-->
    <van-action-sheet
      v-model="showgender"
      :actions="actions"
      @select="onSelect"
      close-on-click-action
    />
  </div>
</template>

<script>
// 头部导航组件
import NavigateBar from "@/components/NavigateBar";
// 导入列表按钮栏的组件
import Listbar from "@/components/Listbar";
export default {
  components: {
    NavigateBar,
    Listbar
  },
  data() {
    return {
      // 用户详情
      userInfo: {},
      // 本地的用户数据
      userJson: {},
      // 单独记录弹窗输入框昵称
      nickname: "",
      // 单独记录弹窗输入框密码
      password: "",
      // 是否显示编辑昵称的弹窗
      show: false,
      // 是否显示编辑密码的弹窗
      showpassword: false,
      // 是否显示编辑性别的弹窗
      showgender: false,
      // 性别弹窗的选项
      actions: [
        // 对象的数据可以随意增加修改的，比如添加value属性用来传递给接口1/0
        { name: "男", value: 1 },
        { name: "女", value: 0 }
      ]
    };
  },
  mounted() {
    // 从本地获取token和id 只要能进入这个页面就表示肯定已经登陆
    const userJson = JSON.parse(localStorage.getItem("userInfo"));
    // 把字符串转成对象,userJson就是用户的信息对象
    this.userJson = userJson;
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
      // 单独保存nickname给编辑的弹窗使用
      this.nickname = data.nickname;
    });
  },
  methods: {
    // 图片上传的方法，file是对文件对象（认为它是不可读的）
    afterRead(file) {
      // 创建一个表单对象，上传图片资源必须是表单类型,不能用json
      // 大家不用去纠结json还是表单的头信息，axios会自动设置的
      console.log(file);
      console.log(file.file);
      const fd = new FormData();
      // 通过原有的方法append给表单添加元素
      // 第一个字符串的file表示接口接收的属性，第二个 file.file是文件对象
      fd.append("file", file.file);
      this.$axios({
        url: "/upload",
        // post请求
        method: "POST",
        headers: {
          Authorization: this.userJson.token
        },
        data: fd
      }).then(res => {
        // url就是图片的路径
        const { url } = res.data.data;
        // 替换掉当前的头像路径
        this.userInfo.head_img = url;
        // 图片上传成功之后调用编辑用户信息的方法
        this.handleEdit({ head_img: url });
      });
    },
    // 编辑用户信息的函数,可以修改头像，昵称。。。
    // data就是请求的参数
    handleEdit(data) {
      return this.$axios({
        url: "/user_update/" + this.userInfo.id,
        method: "POST",
        // 添加头信息
        headers: {
          //Authorization请求参数
          Authorization: this.userJson.token
        },
        data
      }).then(res => {
        this.$toast.success("修改成功");
      });
    },
    // 修改昵称的事件
    handChangNickname() {
      // 调用编辑用户信息的函数
      const Nickname = this.handleEdit({ nickname: this.nickname });
      // 同步的修改当前显示的数据
      Nickname.then(() => {
        this.userInfo.nickname = this.nickname;
        console.log(this.nickname);
      });
    },
    // 修改密码的事件
    handChangpassword() {
      // 调用编辑用户信息的函数
      this.handleEdit({ password: this.password });
    },
    // 选中性别的时候触发的事件，item是选择的当前项
    onSelect(item) {
      // 调用编辑用户信息的函数
      const gender = this.handleEdit({ gender: item.value });
      gender.then(() => {
        // 同步的修改当前显示的数据
        this.userInfo.gender = item.value;
      });

      //隐藏弹出框
      // this.showgender = false;
    }
  }
};
</script>

<style lang="less" scoped>
.w {
  margin: 100px auto;
  width: 360px;
  padding-left: 20px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  height: 680px;
  font-size: 16px;
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

  img {
    text-align: center;
    margin: 40px auto;
    display: block;
    width: 100px;
    height: 100px;
  }
  .listbar {
    height: 50px;
    // border-bottom: 1px solid #e4e4e4;
    line-height: 50px;

    .nickname {
      float: left;
    }
    .tips {
      float: right;
      color: #a1a1a1;
      span {
        margin-left: 10px;
      }
    }
  }
}
</style>