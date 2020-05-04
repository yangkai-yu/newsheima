<template>
  <div>
    <div class="header">
      <!-- @click="$router.back()" -->
      <span class="iconfont iconjiantou2" @click="$router.back()"></span>
      <div class="search">
        <span class="iconfont iconsearch"></span>
        <!-- keyup.enter是键盘事件，keyup就是原生的onkeyup，enter就是确认键 -->
        <input type="text" placeholder="搜索新闻" autofocus v-model="value" @keyup.enter="handleSearch" />
      </div>
      <span @click="handleSearch">搜索</span>
    </div>
    <!-- 历史记录 -->
    <div class="record">
      <div class="title">
        <strong>历史记录</strong>
        <span class="iconfont iconicon-test" @click="handleClear"></span>
      </div>
      <div class="record-list">
        <span
          class="record-item"
          v-for="(item,index) in history"
          :key="index"
          @click="handleRecord(item)"
        >{{item}}</span>
      </div>
    </div>
    <!-- 搜索结果的浮层 -->
    <div class="result-layer" v-if="showLayer">
      <div v-for="(item, index) in list" :key="index">
        <!-- 只有单张图片的 -->
        <PostItem1 :data="item" v-if="item.type === 1 && item.cover.length < 3" />
        <!-- 大于等于3张图片 -->
        <PostItem2 :data="item" v-if="item.type === 1 && item.cover.length >= 3" />
        <!-- 视频 -->
        <PostItem3 :data="item" v-if="item.type === 2" />
      </div>
      <div class="empty" v-if="list.length === 0">没有找到你想要的内容</div>
    </div>
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
  name: "search",
  data() {
    return {
      // 输入框的值
      value: "",
      // 历史记录,先获取本地的搜索记录，如果没有就是等于一个空数组
      history: JSON.parse(localStorage.getItem(history)) || [],
      // 文章列表
      list: [],
      // 是否展示浮层
      showLayer: false
    };
  },
  components: {
    PostItem1,
    PostItem2,
    PostItem3
  },
  // 监听输入框的输入
  watch: {
    value() {
      // 如果值的空的
      if (this.value == "") {
        // 清空文章列表
        this.list = [];
        // 且隐藏浮层
        this.showLayer = false;
      }
    }
  },
  // 组件进入时候触发这个路由守卫
  // to: 代表你即将要访问的页面
  // from：代表你从哪里来
  // next：必须要调用，next就类似于你nodejs的中间件，调用才会加载后面的内容
  beforeRouteEnter(to, from, next) {
    // 通过 `vm` 访问组件实例, vm就是this
    next(vm => {
      // 如果是从首页进来的，就把数据初始化
      if (from.path === "/") {
        // 隐藏浮层
        vm.showLayer = false;
        // 清空关键字
        vm.value = "";
      }
    });
  },
  methods: {
    // 点击搜索或者按钮回车按钮触发的事件
    handleSearch() {
      // 如果关键字是空的，直接返回
      if (this.value == "") return;
      //unshift在数组前面添加
      this.history.unshift(this.value);
      // 数组去重
      this.history = [...new Set(this.history)];
      // 把搜索关键字添加到本地
      localStorage.setItem("history", JSON.stringify(this.history));
      // 调用接口开始搜索
      this.getList();
    },
    // 清除本地的搜索记录
    handleClear() {
      this.history = [];
      localStorage.removeItem("history");
    },
    // 点击历史记录列表的选项, item是关键字字符串
    handleRecord(item) {
      this.value = item;
      // 调用接口开始搜索
      this.getList();
    },
    getList() {
      this.$axios({
        url: "/post_search",
        params: {
          keyword: this.value
        }
      }).then(res => {
        this.showLayer = true;
        console.log(res);
        const { data } = res.data;
        this.list = data;
      });
    }
  }
};
</script>

<style scoped lang="less">
.header {
  padding: 10/360 * 100vw 20/360 * 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .search {
    flex: 1;
    margin: 0 20/360 * 100vw;
    border: 1px #ccc solid;
    height: 38/360 * 100vw;
    padding: 0 10/360 * 100vw;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 0;
    border-radius: 50px;
    box-sizing: border-box;
    input {
      border: none;
      background: none;
      margin-left: 5px;
    }
  }
}
.record {
  margin-top: 10/360 * 100vw;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20/360 * 100vw;
    margin-bottom: 10/360 * 100vw;
  }
  .record-list {
    padding: 0 10/360 * 100vw;
    display: flex;
    flex-wrap: wrap;

    .record-item {
      padding: 5px 10/360 * 100vw;
      border: 1px #ccc solid;
      font-size: 14px;
      margin: 5/360 * 100vw 10/360 * 100vw;
    }
  }
}
.result-layer {
  position: absolute;
  // 在定位中如果同时设置top和bottom，那么这个元素高度取这两个定位的距离!
  top: 58/360 * 100vw;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  overflow-y: auto;
  padding: 20/360 * 100vw 0;
  box-sizing: border-box;
  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10/360 * 100vw 0;
    border-bottom: 1px #eee solid;
    p {
      flex: 1;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      color: #999;
    }
  }
  .empty {
    text-align: center;
    color: #999;
    line-height: 2;
  }
}
</style>