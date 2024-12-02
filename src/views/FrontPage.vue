<template>
  <div id="app">
    <el-container>
      <el-header>
        <div style="display: flex; align-items: center">
          <img
            src="../assets/ikun.png"
            alt="Logo"
            style="height: 40px; margin-right: 10px"
          />
          <div style="float: left">ikun购物商城</div>
          <span v-if="isUserLoggedIn" style="margin-left: 450px">{{
            displayName
          }}</span>
          <span v-else style="margin-left: 450px">未登录</span>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu @select="handleSelect">
            <el-menu-item index="frontpage">首页</el-menu-item>
            <el-menu-item index="cart" v-if="!isLoggedUserType">购物车</el-menu-item>
            <el-menu-item index="user">登陆（注册）</el-menu-item>
            <el-menu-item index="deleteuser" v-if="isUserLoggedIn">注销用户</el-menu-item>
            <el-menu-item index="orders" v-if="!isLoggedUserType">订单</el-menu-item>
            <el-menu-item index="recharge" v-if="!isLoggedUserType">充值</el-menu-item>
            <el-menu-item index="ordermanagement" v-if="isLoggedUserType">顾客订单管理</el-menu-item>
            <el-menu-item index="productmanagement" v-if="isLoggedUserType">商品目录管理</el-menu-item>
            <el-menu-item index="usermanagement" v-if="isLoggedUserType">用户管理</el-menu-item>
            <el-menu-item index="userrecords" v-if="isLoggedUserType">用户浏览/购买记录</el-menu-item>
          </el-menu>
        </el-aside>

        <el-main style="background-color: white">
          <div class="search-container">
            <el-input
              v-model="searchQuery"
              placeholder="请输入搜索内容"
              style="flex: 1"
              prefix-icon="el-icon-search"
            ></el-input>
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px; width: 80px"
              >搜索</el-button
            >
          </div>

          <el-row gutter="20">
            <el-col
              :span="6"
              v-for="(product, index) in paginatedProducts"
              :key="index"
              style="margin-bottom: 20px"
            >
              <el-card :body-style="{ padding: '0px' }">
                <img :src="product.proImg" style="width: 100%; height: 175px;"/>
                <div style="margin-top:10px margin-down:10px">{{product.proName}}</div>
                <div
                  style="
                    height:100px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                  "
                >
                  <el-button
                    type="text"
                    class="button"
                    @click="showDetails(product)"
                    >商品详情</el-button
                  >
                  <div style="display: flex; justify-content: space-between">
                    <el-button
                      type="text"
                      class="button"
                      @click="addToCart(product)"
                      >加入购物车</el-button
                    >
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="products.data.length"
            @current-change="handlePageChange"
            layout="total, prev, pager, next"
          />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      searchQuery: "",
      products: { data: [] },
      filteredProducts: { data: [] },
      currentPage: 1,
      pageSize: 8,
      totalProducts: 0,
      displayName: "未登录",
      isLoggedIn: false,
    };
  },
  computed: {
    isUserLoggedIn() {
      return sessionStorage.getItem("isLoggedIn");
    },
    isLoggedUserType() {
      if (sessionStorage.getItem("loggedUserType") === "1") {
        return true;
      } else {
        return false;
      }
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.data.slice(start, start + this.pageSize);
    },
  },
  //加载页面时执行的函数
  mounted() {
    this.fetchProducts();
    const username = sessionStorage.getItem("displayName");
    if (username != "未登录") {
      this.displayName = username; // 登录后显示用户名
    }
    console.log(this.products);
  },

  methods: {
    // 点击购买按钮的事件
    async makeOrders(product) {
      const makeOrdersData = {
        proId: product.proId,
        userName: sessionStorage.getItem("displayName"),
      };
      const response = await axios.post(
        "http://localhost:8081/makeOrders",
        makeOrdersData
      );
      console.log("购买商品：", response.data);
    },
    // 添加到购物车按钮点击事件
    async addToCart(product) {
      const cartData = {
        proId: product.proId,
        cartProNum: 1,
        userName: sessionStorage.getItem("displayName"),
        carProImg: product.proImage,
        proName: product.proName,
      };
      const response = await axios.post(
        "http://localhost:8081/addToCart",
        cartData
      );
      console.log("添加到购物车：", response.data);
      this.$message('添加购物车成功')
    },

    handleSelect(key, keypath) {
      console.log(key, keypath);
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/frontpage") {
          this.$router.push("/frontpage");
        }
      } else if (key === "cart") {
        this.$router.push("/shopcart");
      } else if (key === "user") {
        this.$router.push("/LogIn");
      } else if (key === "orders") {
        this.$router.push("/UserOrder");
      } else if (key === "productmanagement") {
        this.$router.push("/ProductManagement");
      } else if (key === "ordermanagement") {
        this.$router.push("/OrderManagement");
      } else if(key==="deleteuser"){
        this.deleteUserAndLogout();
      } else if(key==="usermanagement"){
        this.$router.push("/UserManagement");
      } else if(key==="userrecords"){
        this.$router.push("/UserRecords");
      } else if(key==="recharge"){
        this.rechargeBalance();
      }
    },
    // 充值事件
    async rechargeBalance(){
      //先获得当前余额
      const get_data={
        userName:sessionStorage.getItem("displayName")
      }
      const response = await axios.post("http://localhost:8081/getUserBalance",get_data);
      const current_balance=response.data.data;
      const recharge_balance = prompt(`当前余额：￥${current_balance}\n请输入充值金额：`, "");
      const recharge_data={
        userName:sessionStorage.getItem("displayName"),
        userBalance:current_balance+parseInt(recharge_balance)
      }
      //充值用户余额
      try {
        const response = await axios.post("http://localhost:8081/rechargeUserBalance",recharge_data);
        if(response.data.msg==="success"){
          alert("充值成功！");
        }
      }
      catch (error) {
        console.error(error);
      }
      },
    
    //删除用户并退出登录事件
    async deleteUserAndLogout(){
      const delete_data={
        userName:sessionStorage.getItem("displayName")
      }
      //删除users表中用户信息
      try {
        const response = await axios.post("http://localhost:8081/deleteUserInUsers",delete_data);
        if(response.data.msg==="success"){
          alert("删除用户成功！");
          sessionStorage.setItem("displayName","未登录");
          sessionStorage.setItem("isLoggedIn",false);
        }else{
          alert("删除用户失败！");
        }
        }
      catch (error) {
        console.error(error);
      }
      //删除cart表中用户信息
      try {
        const response = await axios.post("http://localhost:8081/deleteUserInCart",delete_data);
        if(response.data.msg==="success"){
          alert("删除用户成功！");
          sessionStorage.setItem("displayName","未登录");
          sessionStorage.setItem("isLoggedIn",false);
        }else{
          alert("删除用户失败！");
        }
      } catch (error) {
        console.error(error);
      }
      //删除orders表中用户信息
      try {
        const response = await axios.post("http://localhost:8081/deleteUserInOrders",delete_data);
        if(response.data.msg==="success"){
          alert("删除用户成功！");
          sessionStorage.setItem("displayName","未登录");
          sessionStorage.setItem("isLoggedIn",false);
        }else{
          alert("删除用户失败！");
        }
      } catch (error) {
        console.error(error);
      }
    },

    //点击搜索后的事件
    handleSearch() {
      console.log(this.searchQuery);
      if (this.searchQuery) {
        this.filteredProducts.data = this.products.data.filter((product) =>
          product.proName.includes(this.searchQuery)
        );
      } else {
        this.filteredProducts.data = this.products.data; // 如果搜索框为空，显示所有商品
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:8081/getProducts");
        this.products = response.data;
        this.filteredProducts.data = this.products.data;
        console.log(this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    handlePageChange(page) {
      this.currentPage = page; // 更新当前页码
    },
    showDetails(product) {
      //向Records表中插入一条数据
      const recordData = {
        userName: sessionStorage.getItem("displayName"),
        proName: product.proName,
        recordType: 0,  // 0表示浏览记录
      };
      axios.post("http://localhost:8081/addRecord", recordData);
      this.$router.push({
        name: "ProductDetail",
        params: { name: product.proName },
      });
    },
  },
};
</script>

<style>
/* 整体布局相关样式 */
.el-aside {
  background-color: white;
  color: #333;
  text-align: center;
  line-height: 200px;
}

/* 搜索框相关样式 */
.search-container {
  display: flex;
  align-items: center;
}

/* 卡片展示相关样式 */
</style>

