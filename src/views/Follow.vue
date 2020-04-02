<template>
  <div class="w">
    <NavigateBar title="我的关注" />
    <div>
      <div class="interest" v-for="(item, index) in follows" :key="index">
        <img :src="$axios.defaults.baseURL+item.head_img" alt class="imgs" />
        <div class="news">
          {{item.nickname}}
          <p>{{moment(item.create_date).format('YYYY-MM-DD hh:mm:ss')}}</p>
        </div>
        <span class="unfriended" @click="handleCancel(item.id,index)">取消关注</span>
      </div>
    </div>
  </div>
</template>

<script>
import NavigateBar from "@/components/NavigateBar";
import moment from "moment";
export default {
  components: {
    NavigateBar
  },
  data() {
    return {
      follows: [],
      moment,
      userJson: {}
    };
  },
  mounted() {
    const userJson = JSON.parse(localStorage.getItem("userInfo"));
    this.userJson = userJson;
    this.$axios({
      url: "/user_follows",
      // 添加头信息
      headers: {
        //Authorization请求参数
        Authorization: userJson.token
      }
    }).then(res => {
      console.log(res);
      const { data } = res.data;
      this.follows = data;
    });
  },
  methods: {
    handleCancel(id, index) {
      // 弹窗提示
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定取消关注吗？"
        })
        .then(() => {
          // 根据id取消用户的关注,id是要取消的那个用户的id
          this.$axios({
            url: "/user_unfollow/" + id,
            headers: {
              Authorization: this.userJson.token
            }
          }).then(res => {
            this.$toast.success("取消关注成功");
            // 刷新页面的数据
            this.follows.splice(index, 1);
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.w {
  width: 360px;
  margin: 100px auto;
  height: 680px;
  background-color: #f2f2f2;
  .interest {
    //   padding: 20px;
    border-bottom: 1px solid #d7d7d7;
    height: 80px;
    margin: 20px auto;
    padding: 0 20px;
    .imgs {
      width: 40px;
      height: 40px;
      background-color: #b3b3b3;
      border-radius: 50%;
      margin-right: 10px;
      margin-right: 20px;
      float: left;
    }
    .news {
      width: 100px;
      height: 50px;
      float: left;
      p {
        font-size: 14px;
        color: #707070;
      }
    }
    .unfriended {
      float: right;
      height: 30px;
      width: 80px;
      line-height: 30px;
      text-align: center;
      border-radius: 20px;
      background-color: #e1e1e1;
      font-size: 14px;
      margin-top: 10px;
      color: #363636;
    }
  }
}
</style>