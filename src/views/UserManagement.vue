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

      <el-main style="background-color: white">
        <el-table :data="userList" height="470" border style="width: 100%">
          <el-table-column prop="userName" label="用户名" width="180">
          </el-table-column>
          <el-table-column prop="userPassword" label="用户密码" width="180">
          </el-table-column>
          <el-table-column prop="userEmail" label="用户邮箱"> </el-table-column>
          <el-table-column prop="userPhone" label="用户电话"> </el-table-column>
          <el-table-column prop="userType" label="用户类型"> </el-table-column>
          <el-table-column prop="userBalance" label="用户余额"> </el-table-column>
        </el-table>
        
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
    };
  },
  methods: {
    async getUserList() {
      try {
        const response = await axios.post("http://localhost:8081/getAllUsers");
        this.userList = response.data.data;
        console.log(this.userList);
      } catch (error) {
        console.error(error);
      }
    },
    handleSelect(key) {
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/FrontPage") {
          this.$router.push("/FrontPage");
        }
      }
    }
  },
  mounted() {
    this.getUserList();
  }
}
</script>

<style>

</style>