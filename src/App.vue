<template>
  <div id="app">
    <!--这句代码在页面中放入一个路由视图容器，当我们访问http://localhost:8080/#/about/的时候会将about的内容放进去，-->
    <!--访问http://localhost:8080/#/recruit的时候会将recruit的内容放进去-->
    <router-view></router-view>
  </div>
</template>
<script>
  export default{
      name:'app'
  }
</script>
<style>
  @import "../src/custom/css/main.css";
  @import "../src/custom/iconfont/iconfont.css";/*引入自己的图标库*/
</style>
