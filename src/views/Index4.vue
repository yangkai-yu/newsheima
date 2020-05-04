<template>
  <div>
    <!-- 红色的头部 -->
    <div class="header">
      <span class="iconfont iconnew"></span>
      <router-link to="#" class="search">
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

    <van-tabs v-model="active" sticky swipeable @scroll="handelScroll">
      <van-tab
        v-for="(item, index) in categories"
        :key="index"
        :title="item.name"
        v-if="item.is_top===1||item.name==='∨'"
      >
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <!-- van的列表组件 -->
          <!-- @load 滚动到底部时候触发的函数 -->
          <!-- immediate-check关闭list加载后触发一次 load 事件 -->
          <van-list
            immediate-check
            v-model="item.loading"
            :finished="item.finished"
            finished-text="我也是有底线的"
            @load="onLoad"
          >
            <!-- 假设list是后台返回的数组，里有10个元素 -->
            <div v-for="(item, index) in item.list" :key="index">
              <!-- 只有单张图片的 -->
              <PostItem1 :data="item" v-if="item.type===1&&item.cover.length <3" />
              <PostItem2 :data="item" v-if="item.type===1&&item.cover.length >=3" />
              <PostItem3 :data="item" v-if="item.type===2" />
            </div>
          </van-list>
        </van-pull-refresh>
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
  data() {
    return {
      // 菜单的数据
      //   categories: [
      //     "关注",
      //     "娱乐",
      //     "体育",
      //     "汽车",
      //     "房产",
      //     "关注",
      //     "关注",
      //     "娱乐",
      //     "体育",
      //     "汽车",
      //     "房产",
      //     "关注",
      //     "∨"
      //   ],
      categories: [],
      // 记录当前tab的切换的索引
      active: 0,
      // 假设这个数组是后台返回的数据
      //   list: [],
      //loading: false, // 是否正在加载中
      //finished: false, // 是否已经加载完毕
      refreshing: false, // 是否正在下拉加载
      token: ""
    };
  },
  // 监听属性
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
  components: {
    PostItem1,
    PostItem2,
    PostItem3
  },
  mounted() {
    const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
    const categories = JSON.parse(localStorage.getItem("categories"));
    this.token = token;
    if (categories) {
      if (
        (categories[0].name === "关注" && !token) ||
        (categories[0].name !== "关注" && token)
      ) {
        this.getCategories();
      } else {
        this.categories = categories;
        // 调用方法给每个栏目添加新属性
        this.handleCategories();
      }
    } else {
      this.getCategories();
    }
  },
  methods: {
    // 循环处理栏目的数据
    handleCategories() {
      this.categories = this.categories.map(v => {
        v.pageIndex = 1; // 给每个栏目都添加了一个pageIndex属性
        v.list = []; // 给每个栏目都拥有自己的文章列表
        v.loading = false; // 给每个栏目都添加是否正在请求的状态
        v.finished = false; // 给每个栏目都添加一个文章是否全部加载完毕的状态
        v.scrollY = 0; // 给每个栏目添加一个滚动条的高度
        v.isload = false;
        return v;
      });
      // 请求文章列表数据
      this.getList();
    },
    getList() {
      const { id, pageIndex, finished, name, isload } = this.categories[
        this.active
      ];
      if (finished) {
        return;
      }
      if (isload) return;
      this.categories[this.active].isload = true;
      // 给当前栏目的页数加1
      this.categories[this.active].pageIndex += 1;
      const config = {
        url: "post",
        params: {
          pageIndex: pageIndex,
          pageSize: 5,
          category: id
        }
      };
      if (this.token) {
        config.headers = {
          Authorization: this.token
        };
      }
      this.$axios(config).then(res => {
        console.log(res);
        const { data, total } = res.data;
        // 把data新数组和当前栏目的文章列表合并
        this.categories[this.active].list = [
          ...this.categories[this.active].list,
          ...data
        ];
        // 用赋值的方式触发页面刷新
        this.categories = [...this.categories];
        // 告诉组件当前的请求加载完毕
        this.categories[this.active].loading = false;
        // 如果当前文章的条数等于total总条数，说明数据已经加载完毕
        if (this.categories[this.active].list.length === total) {
          this.categories[this.active].finished = true;
        }
      });
    },
    // 请求获取菜单栏目数据
    getCategories() {
      // 用一个常量存储请求地址
      const config = {
        url: "/category"
      };
      //如果本地有token，就给请求的配置加上header
      if (this.token) {
        config.headers = {
          Authorization: this.token
        };
      }
      //发起请求
      this.$axios(config).then(res => {
        console.log(res);
        //把数据结构到data
        const { data } = res.data;
        // 手动给data最后添加一项数据
        data.push({
          name: "∨"
        });
        //然后把结构出data的数据给 this.categories存储起来
        this.categories = data;
        // 把请求返回的数据保存到本地存储
        localStorage.setItem("categories", JSON.stringify(data));
        // 调用方法给每个栏目添加新属性
        this.handleCategories();
      });
    },
    handelScroll(data) {
      // 因为栏目不管是从本地获取或者请求接口也好，都是需要时间，
      // 所以需要等this.categories有值时候才设置滚动条的高度
      if (this.categories.length === 0) {
        return;
      }
      // scrollTop是滚动条的距离
      const { scrollTop } = data;
      // 把滚动条的高度赋值给当前栏目下的scrollY
      this.categories[this.active].scrollY = scrollTop;
    },
    // 请求下一页的数据
    onLoad() {
      // 请求文章列表
      this.getList();
    },
    onRefresh() {
      // 表示加载完毕
      this.refreshing = false;
      console.log("正在下拉刷新");
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