<template>
  <el-container>
    <el-header>
      <span v-if="isUserLoggedIn"
        >{{ displayName }}的购物车</span
      >
      <span v-else>未登录</span>
    </el-header>

    <el-main>
      <el-row>
        <el-col v-for="item in paginatedItems" :key="item.cartId" :span="8">
          <el-card :style="{height: '500px', width: '100%', padding: '20px'}"> 
            <div style="height: 200px; overflow: hidden; margin-bottom: 10px;">
                <img :src="item.cartProImg" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div>{{ item.proName }}</div>
            <el-button @click="removeFromCart(item)">取消加入购物车</el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="cartItems.length"
        layout="total, prev, pager, next"
      />
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      cartItems: [],
      currentPage: 1,
      pageSize: 6, // 每页显示的卡片数量
      displayName: "",
    };
  },
  computed:{
    
    isUserLoggedIn(){
      return sessionStorage.getItem("isLoggedIn");
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.cartItems.slice(start, start + this.pageSize);
    },
  },
   methods: {
    getDisplayName(){
      this.displayName= sessionStorage.getItem("displayName");
      return this.displayName;
    },
    async removeFromCart(item) {
      const removeFromCartData={
        proName: item.proName,
      }
      console.log(removeFromCartData);
      const response = await axios.post("http://localhost:8081/removeFromCart",removeFromCartData);
      console.log("从购物车移除：", response.data);
      this.fetchCartItems();
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    async fetchCartItems() {
      try {
        const fetchCartItemsData={
            userName: sessionStorage.getItem("displayName"),
        }
        console.log(fetchCartItemsData);
        const response = await axios.post("http://localhost:8081/fetchCartItems",fetchCartItemsData);
        this.cartItems = response.data.data;
        console.log(this.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    },
  },
  
  mounted() {
    this.fetchCartItems();
    this.getDisplayName();
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
body > .el-container {
  margin-bottom: 40px;
}
</style>