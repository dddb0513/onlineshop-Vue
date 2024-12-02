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
          <el-menu-item index="browserecord">浏览记录</el-menu-item>
          <el-menu-item index="buyrecord">购买记录</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main style="background-color: white">
        <el-table :data="recordList" height="470" border style="width: 100%">
          <el-table-column prop="userName" label="用户名" width="350">
          </el-table-column>
          <el-table-column prop="proName" label="商品名" width="350">
          </el-table-column>
          <el-table-column prop="recordType" label="记录类型"> </el-table-column>
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
    browseRecordList: [],
    buyRecordList: [],
    recordList: [],
    };
  },
  methods: {
    async getBrowseRecordList() {
      try {
        const response = await axios.post("http://localhost:8081/getBrowseRecordList");
        this.browseRecordList = response.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getBuyRecordList() {
      try {
        const response = await axios.post("http://localhost:8081/getBuyRecordList");
        this.buyRecordList = response.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    handleSelect(key) {
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/FrontPage") {
          this.$router.push("/FrontPage");
        }
      } else if(key==="browserecord"){
        this.recordList = this.browseRecordList;
      } else if(key==="buyrecord"){
        this.recordList = this.buyRecordList;
      }
    }
  },
  mounted() {
    this.getBrowseRecordList();
    this.getBuyRecordList();
    this.recordList = this.browseRecordList;
  }
};
</script>

<style>
/* 修改表头行的高度 */
.el-table .el-table__header th {
  height: 50px; /* 设置你想要的高度 */
  line-height: 50px; /* 确保文本垂直居中 */
}


</style>
