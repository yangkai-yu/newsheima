<template>
  <div class="w">
    <div class="header">
      <span class="iconfont iconnew"></span>
      <router-link to="/search" class="search">
        <span class="iconfont iconsearch"></span>
        <i>搜索新闻</i>
      </router-link>
      <router-link to="/personal">
        <span class="iconfont iconwode"></span>
      </router-link>
    </div>

    <!-- tab栏切换 -->
    <!-- v-model：就是当前的索引值，是唯一的，比较类似于for循环的key -->
    <!-- sticky：是否使用粘性定位布局 -->
    <!-- swipeable: 是否开启手势滑动切换 -->
    <van-tabs v-model="active" sticky swipeable>
      <van-tab v-for="(item,index) in categories" :title="item.name" :key="index">
        <!-- 下拉刷新 -->

        <!-- van的列表组件 -->
        <!-- @load 滚动到底部时候触发的函数 -->
        <!-- immediate-check 这个属性可以阻止list组件默认就加载一次 -->
        <van-list
          :immediate-check="false"
          v-model="categories[active].loading"
          :finished="categories[active].finished"
          finished-text="我也是有底线的"
          @load="onLoad"
        >
          <!-- 假设list是后台返回的数组，里有10个元素 -->
          <div v-for="(item, index) in categories[active].posts" :key="index">
            <!-- 只有单张图片的 -->
            <PostItem1
              v-if="item.type === 1 && item.cover.length > 0 && item.cover.length < 3"
              :data="item"
            />

            <!-- 大于等于3张图片 -->
            <PostItem2 v-if="item.type === 1 && item.cover.length >= 3" :data="item" />

            <!-- 视频 -->
            <PostItem3 v-if="item.type === 2" :data="item" />
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 文章列表的组件,只有单张图片的
import PostItem1 from "@/components/PostItem1";
// 大于等于3张图片的组件
import PostItem2 from "@/components/PostItem2";
// 视频的列表组件
import PostItem3 from "@/components/PostItem3";
export default {
  components: {
    PostItem2,
    PostItem1,
    PostItem3
  },
  data() {
    return {
      categories: [],
      active: 0,
      //   list: [],
      //   loading: false,
      //   finished: false,
      token: "",
      categoryId: 999
    };
  },
  watch: {
    // 监听tab栏的切换
    active() {
      // 判断如果点击的是最后一个图标，跳转到栏目管理页
      if (this.active === this.categories.length - 1) {
        this.$router.push("/category");
      }
      this.getList();
      setTimeout(() => {
        window.scrollTo(0, this.categories[this.active].scrollY);
      }, 0);
    }
  },
  mounted() {
    const categories = JSON.parse(localStorage.getItem("categories"));
    // 本地的token
    const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.token = token;
    if (categories) {
      // 登录了(有token)但是第一条不是关注
      if (categories[0].name !== "关注" && token) {
        // 获取栏目数据
        this.getCategories(token);
        return;
      }
      // 登录了(有token)但是第一条不是关注
      if (categories[0].name === "关注" && !token) {
        // 获取栏目数据
        this.getCategories();
        return;
      }
      this.categories = categories;
      // 给每个栏目都加上pageIndex = 1
      this.handleCategories();
    } else {
      // 获取栏目数据
      this.getCategories();
    }
  },
  methods: {
    // 当栏目数据加载完成后
    // 循环给栏目加上pageIndex, 文章列表
    // 每个栏目都是自己的pageIndex，文章列表
    handleCategories() {
      this.categories = this.categories.map(v => {
        v.pageIndex = 1;
        v.posts = [];
        v.loading = false;
        v.finished = false;
        v.scrollY = 0; // 给每个栏目添加一个滚动条的高度
        return v;
      });
      this.getList();
    },
    // 获取栏目数据, 如果有token加上到头信息。没有就不加
    getCategories(token) {
      const config = {
        url: "/category"
      };
      if (this.token) {
        config.headers = {
          Authorization: this.token
        };
      }
      this.$axios(config).then(res => {
        console.log(res);
        const { data } = res.data;
        data.push({
          name: "∨"
        });
        this.categories = data;
        // 把请求返回的数据保存到本地存储
        localStorage.setItem("categories", JSON.stringify(data));
        this.handleCategories();
      });
    },

    // 封装一个请求文章列表的方法
    getList() {
      if (this.categories[this.active].finished) {
        return;
      }
      const { pageIndex, id, finished, name } = this.categories[this.active];
      if (finished) return;
      const config = {
        url: "/post",
        params: {
          pageIndex: pageIndex,
          pageSize: 5,
          category: id
        }
      };
      if (name === "关注") {
        config.headers = {
          Authorization: this.token
        };
      }
      this.$axios(config).then(res => {
        console.log(res);
        const { data, total } = res.data;
        // this.list = [...this.list, ...data];
        this.categories[this.active].posts = [
          ...this.categories[this.active].posts,
          ...data
        ];
        this.categories[this.active].loading = false;
        // if (this.list.length === total) {
        if (this.categories[this.active].posts.length === total) {
          this.categories[this.active].finished = true;
        }
        this.categories = [...this.categories];
      });
    },
    onLoad() {
      // 异步更新数据
      this.categories[this.active].pageIndex += 1;
      this.getList();
    }
  }
};
</script>

<style scoped lang="less">
.header {
  height: 50/360 * 100vw;
  background: #ff0000;
  display: flex;
  padding: 0 20/360 * 100vw;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .iconnew {
    font-size: 20px;
    transform: scale(3);
    position: relative;
    left: 20/360 * 100vw;
  }
  .search {
    flex: 1;
    height: 32/360 * 100vw;
    margin: 0 50/360 * 100vw;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    font-size: 13px;
    line-height: 1;
    vertical-align: middle;
    span {
      margin-right: 5px;
    }
  }
  .iconwode {
    font-size: 20px;
  }
}
// 重置vant组件的样式
// 如果在scoped声明中去修改第三方库的class样式，必须要在前面添加/deep/
/deep/ .van-tabs__nav {
  background: #eee;
}
/deep/ .van-tab {
  flex-basis: 15% !important;
}
/deep/ .van-tab:nth-last-child(2) {
  background: #eee;
  width: 20px !important;
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: unset;
}
/deep/ .van-tabs__wrap {
  padding-right: 20px;
}
/deep/ .van-tabs__nav {
  position: static;
}
/deep/ .van-tabs__line {
  display: none;
}
/deep/ .van-tab--active {
  border-bottom: 1px #ff0000 solid;
}
</style>