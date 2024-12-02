<template>
  <el-container>
    <el-header>
        <div style="display: flex; align-items: center">
        <img
          src="../assets/ikun.png"
          alt="Logo"
          style="height: 40px; margin-right: 10px"
        />
        <div style="float: left">ikun购物商城</div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu @select="handleSelect">
          <el-menu-item index="frontpage">首页</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background-color:white">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
//import axios from "axios";
export default {
  methods: {
     handleSelect(key) {
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/FrontPage") {
          this.$router.push("/FrontPage");
        }
      } }
  },
};
</script>

<style>
</style>