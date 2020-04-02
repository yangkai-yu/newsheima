<template>
  <div class="w">
    <NavigateBar title="我的跟帖" />
    <div class="comment-item" v-for="(item, index) in comments" :key="index">
      <div class="date">{{moment(item.create_date).format("YYYY-MM-DD hh:mm")}}</div>
      <div class="parent" v-if="item.parent">
        <div class="parent-user">回复：{{item.parent.user.nickname}}</div>
        <div class="parent-content">{{item.parent.content}}</div>
      </div>
      <!-- 自己发布的内容 -->
      <div class="comment-content">{{item.content}}</div>
      <!-- 回复的文章标题 -->
      <router-link to="#" class="link-post">
        <div>原文：{{item.post.title}}</div>
        <span class="iconfont iconjiantou1"></span>
      </router-link>
    </div>
  </div>
</template>

<script>
import NavigateBar from "@/components/NavigateBar";
import moment from "moment";
export default {
  data() {
    return {
      comments: [],
      moment
    };
  },
  components: {
    NavigateBar
  },
  mounted() {
    const userJson = JSON.parse(localStorage.getItem("userInfo"));
    this.$axios({
      url: "/user_comments",
      headers: {
        //Authorization请求参数
        Authorization: userJson.token
      }
    }).then(res => {
      console.log(res);
      const { data } = res.data;
      this.comments = data;
    });
  }
};
</script>

<style lang='less' scoped>
.w {
  width: 360px;
  height: 680px;

  .comment-item {
    padding: 20px;
    border-bottom: 1px solid #eee;
    .date {
      color: #999;
      margin-bottom: 15px;
    }
    .parent {
      padding: 10px;
      background-color: #eee;
    }
    .comment-content {
      margin: 20px;
    }
    .link-post {
      color: #999;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>