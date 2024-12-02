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
      <el-aside width="200px" style="background-color:white">
        <el-menu @select="handleSelect">
            <el-menu-item index="frontpage">首页</el-menu-item>
            <el-menu-item index="cart">购物车</el-menu-item>
          </el-menu>
      </el-aside>
      <el-main style="background-color:white">
        <el-row v-for="(order, index) in orderList" :key="index" class="order-row" >
          <el-col :span="6"><div >
            <img :src="order.imageUrl" />
            </div></el-col>
          <el-col :span="6" ><div >
            <p>{{ order.proName }}</p>
            </div></el-col>
          <el-col :span="6">
            <div>
            <p style="height:20px">数量：{{order.ordNum}}</p>
            <p >总价：{{order.totalPrice}}</p>
            </div>
            </el-col>
          <el-col :span="6"><div >{{order.orderStatus}}</div></el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
export default {
    mounted() {
      this.getOrderList();
    },

  data() {
    return {
      orderList: [],
    };
  },
  methods: {
    handleSelect(key) {
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/FrontPage") {
          this.$router.push("/FrontPage");
        }
      } else if (key === "cart") {
        this.$router.push("/ShopCart");
      }
    },
    async getOrderList() {
      const loggedUserData = {
        userName: sessionStorage.getItem("displayName"),
      };
      try {
        const response = await axios.post("http://localhost:8081/getOrderList",loggedUserData);
        this.orderList = response.data.data;
        console.log(this.orderList);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.order-row {
  height: 150px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角 */
  margin-bottom: 10px; /* 行间距 */
  padding: 10px; /* 内边距 */
  background-color: #f9f9f9; /* 背景颜色 */
  transition: box-shadow 0.3s; /* 添加过渡效果 */
}
.order-details p {
  margin: 0; /* 去掉默认的段落间距 */
}
</style>