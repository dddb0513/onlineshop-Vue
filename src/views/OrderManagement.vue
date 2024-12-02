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
          <el-menu-item index="salestatistic">销售统计报表</el-menu-item>
          <el-menu-item index="ordermanagement">订单管理</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main style="background-color: white">
        <el-table v-if="selectedMenu==='ordermanagement'" :data="orderList" height="470" border style="width: 100%">
          <el-table-column prop="userName" label="用户" width="180">
          </el-table-column>
          <el-table-column prop="proName" label="商品" width="180">
          </el-table-column>
          <el-table-column prop="ordNum" label="购买数量"> </el-table-column>
          <el-table-column prop="totalPrice" label="总价"> </el-table-column>
          <!-- 订单状态列，添加按钮 -->
          <el-table-column label="订单状态" width="180">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>{{ scope.row.orderStatus }}</span>  <!-- 显示订单状态 -->
                <!-- 在这里添加按钮 -->
                <el-button 
                  @click="updateOrderStatus(scope.row)" 
                  type="primary" 
                  class="custom-button"
                  style="margin-left: 10px;">
                  修改状态
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-table v-if="selectedMenu==='salestatistic'" :data="salesData" height="470" border style="width: 100%">
          <el-table-column prop="pro_name" label="商品名" width="300">
          </el-table-column>
          <el-table-column prop="totalOrderNum" label="销量" width="300">
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价" width="300">
          </el-table-column>
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
      orderList: [],
      salesData: [],
      selectedMenu:'ordermanagement'
    };
  },
  methods: {
    async getSalesData() {
      try {
        const response = await axios.post("http://localhost:8081/getSalesData");
        this.salesData = response.data.data;
        console.log(this.salesData);
      } catch (error) {
        console.error(error);
      }
    },
    async updateOrderStatus(order) {
      const newStatus = prompt("请输入新的订单状态:", order.orderStatus);
      if (newStatus !== null) {
        const updateData = {
          orderId: order.orderId,
          orderStatus: newStatus,
        };
        try {
          const response = await axios.post(
            "http://localhost:8081/updateOrderStatus",
            updateData
          )
          console.log("更新订单状态：", response.data);
        }
        catch (error) {
          console.error(error);
        }
      }
      //刷新页面
      location.reload();
    },
    handleSelect(key) {
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/FrontPage") {
          this.$router.push("/FrontPage");
        }
      } else if (key === "salestatistic") {
        this.selectedMenu = 'salestatistic';
        
      } else if (key === "ordermanagement") {
        this.selectedMenu = 'ordermanagement';
        
      }
    },
    async getOrderList() {
      try {
        const response = await axios.post("http://localhost:8081/getAllOrders");
        this.orderList = response.data.data;
        console.log(this.orderList);
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.getOrderList();
    this.getSalesData();
  },
};
</script>

<style>
.custom-button {
  width:100px;
  height:35px;
  font-size: 14px;    /* 控制字体大小 */
}
</style>