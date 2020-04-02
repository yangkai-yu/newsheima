  
<template>
  <!-- 列表按钮栏 -->
  <div class="listbar">
    <router-link :to="path || '#' ">
      <div>{{label}}</div>
      <div class="tips">
        {{tips}}
        <span class="iconfont iconjiantou1"></span>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {
  //声明组件可以接收的属性，label表示左边的文字，tips表示右边的文字
  props: ["label", "tips", "path"]
};
</script>

<style lang='less' scoped>
.listbar {
  padding-left: 20px;
  height: 48px;
  line-height: 48px;

  a {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px #eee solid;
    align-items: center;
    padding-right: 20px;
  }
  .tips {
    color: #999;
    span {
      margin-left: 5px;
    }
  }
}
</style>