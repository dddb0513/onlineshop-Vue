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
          <el-menu-item index="cart">购物车</el-menu-item>
          <el-menu-item index="order">订单</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main style="background-color: white">
        <el-row :gutter="10" style="height: 500px">
          <el-col :span="8">
            <div>
                <img :src="product.proImg" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          </el-col>
          <el-col :span="8">
            <div >
                <div style="font-size: 20px; font-weight: bold;height:30px">{{product.proName}}</div>
                <div style="font-size: 16px;height:30px">{{product.proDescrip}}</div>
                <div style="font-size: 16px;height:30px">价格：{{product.proPrice}}</div>
                <div style="font-size: 16px;height:30px">库存：{{product.proNum}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
                <el-input-number v-model="num" @change="handleChange" :min="1" :max="product.proNum" ></el-input-number>
            </div>
            <div style="display: flex; align-items: center;">
                <el-button type="danger" @click="addToCart(product)" >加入购物车</el-button>
                <el-button type="danger" @click="makeOrders(product)">立即购买</el-button>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      product: null,
      num: 1
    };
  },
  created() {
    const productname = this.$route.params.name;
    this.fetchProduct(productname);
  },
  methods: {
   
    // 点击购买按钮的事件
    async makeOrders(product) {
      //判断用户余额是否充足
      const get_data={
        userName:sessionStorage.getItem("displayName")
      }
      const response2 = await axios.post("http://localhost:8081/getUserBalance",get_data);
      const current_balance=response2.data.data;
      if(current_balance<product.proPrice*this.num){
        alert("余额不足，请充值！");
        return;
      }else{
        const update_data={
          userName:sessionStorage.getItem("displayName"),
          userBalance:current_balance-product.proPrice*this.num
        }
        //更新用户余额
        const response = await axios.post("http://localhost:8081/rechargeUserBalance",update_data);
        if(response.data.msg==="success"){
          alert("付款成功！");
        }
      }
      //向Records表中插入一条数据
      const recordData = {
        userName: sessionStorage.getItem("displayName"),
        proName: product.proName,
        recordType: 1,  // 1表示购买记录
      };
      axios.post("http://localhost:8081/addRecord", recordData);
      //向用户发送确认邮件,首先要获取用户邮箱
      const userData = {
        userName: sessionStorage.getItem("displayName"),
      };
      const response0 = await axios.post("http://localhost:8081/getUserEmail",userData);
      const email = response0.data.data;
      const emailData = {
        email: email,
      };
      const response1 = await axios.post("http://localhost:8081/send-confirmation-email",emailData);
      console.log("发送确认邮件：", response1.data);

      //向订单表中插入一条数据
      const makeOrdersData = {
        userName: sessionStorage.getItem("displayName"),
        proName: product.proName,
        ordNum: this.num,
        // orderDate: new Date().toISOString(),
        totalPrice: product.proPrice * this.num,
        orderStatus: "待发货"
      };
      const response = await axios.post(
        "http://localhost:8081/makeOrders",
        makeOrdersData
      );
      console.log("购买商品：", response.data);
      //修改商品表中的商品数量
      const updateData = {
        proName: product.proName,
        proNum: product.proNum - this.num
      };
      const response_2 = await axios.post(
        "http://localhost:8081/updateProductNum",
        updateData
      );
      console.log("修改商品数量：", response_2.data);
      this.$message('购买成功');
      setTimeout(() => {
      location.reload();
    }, 3000); // 3000毫秒 = 3秒

    },

    // 添加到购物车按钮点击事件
    async addToCart(product) {
      const cartData = {
        proId: product.proId,
        cartProNum: this.num,
        userName: sessionStorage.getItem("displayName"),
        carProImg: product.proImage,
        proName: product.proName
      };
      const response = await axios.post(
        "http://localhost:8081/addToCart",
        cartData
      );
      console.log("添加到购物车：", response.data);
      this.$message('添加购物车成功')
    },
    handleSelect(key) {
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/FrontPage") {
          this.$router.push("/FrontPage");
        }
      } else if (key === "cart") {
        this.$router.push("/ShopCart");
      } else if (key === "order") {
        this.$router.push("/UserOrder");
      }
    },
    async fetchProduct(name) {
      try {
        const fetchData = {
          proName: name,
        };
        const response = await axios.post(
          "http://localhost:8081/fetchProductsByName",
          fetchData
        );
        this.product = response.data.data;
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    },
  },
};
</script>

<style>
</style>