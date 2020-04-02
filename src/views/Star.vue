<template>
  <div class="w">
    <NavigateBar title="我的收藏" />
    <div class="conten" v-for="(item,index) in content" :key="index">
      <div class="imgText" v-if="item.cover.length < 3 && item.cover.length > 0">
        <h4>{{item.title}}</h4>
        <p>{{item.user.nickname}} {{item.comments.length}}跟帖</p>
      </div>
      <img :src="$axios.defaults.baseURL + item.cover[0].url" alt class="images" />
    </div>
  </div>
</template>

<script>
import NavigateBar from "@/components/NavigateBar";
export default {
  data() {
    return {
      userJson: {},
      content: []
    };
  },
  components: {
    NavigateBar
  },
  mounted() {
    const userJson = JSON.parse(localStorage.getItem("userInfo"));
    this.userJson = userJson;
    this.$axios({
      url: "/user_star",
      headers: {
        //Authorization请求参数
        Authorization: userJson.token
      }
    }).then(res => {
      console.log(res);
      const { data } = res.data;
      this.content = data;
      console.log(this.content);
    });
  }
};
</script>

<style lang="less" scoped>
.w {
  width: 360px;
  height: 680px;
  .conten {
    border-bottom: 1px solid #868686;
    .imgText {
      padding: 20px;
      float: left;

      h4 {
        width: 200px;
        height: 60px;
        font-weight: normal;
        // 文字超出两行出现省略号
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-weight: normal;
      }
      p {
        color: #868686;
      }
    }

    .images {
      width: 100px;
      display: inline-block;
      padding: 20px 0;
    }
  }
}
</style>