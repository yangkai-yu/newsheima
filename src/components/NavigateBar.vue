<template>
  <div class="navigate-bar">
    <!-- $router.back()是实例下的属性，可以直接在模板中渲染 -->
    <span class="iconfont iconjiantou2" @click="$router.back()"></span>
    <strong>{{title}}</strong>
    <!-- $router.push()是实例下的属性，可以直接在模板中渲染 -->
    <span class="iconfont iconshouye" @click="$router.push('./')" v-if="showHome"></span>
    <span v-else class="iconfont iconshouye" style="opacity:0"></span>
  </div>
</template>

<script>
export default {
  props: ["title", "showHome"]
};
</script>

<style lang="less" scoped>
.navigate-bar {
  line-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px #eee solid;
  .iconshouye {
    font-size: 20px;
  }
}
</style>