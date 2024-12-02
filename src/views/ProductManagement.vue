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
            <el-menu-item index="addproduct">添加商品</el-menu-item>
        </el-menu>
        <el-dialog :visible.sync="dialogVisible" title="添加商品信息" style="margin:0px">
      <el-form :model="productForm" ref="form">
        <el-form-item label="商品名" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :rules="[{ required: true, message: '请输入商品价格', trigger: 'blur' }]">
          <el-input v-model="productForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品简介" :rules="[{ required: true, message: '请输入商品简介', trigger: 'blur' }]">
          <el-input v-model="productForm.descrip"></el-input>
        </el-form-item>
        <el-form-item label="商品图片路径" :rules="[{ required: true, message: '请输入商品图片路径', trigger: 'blur' }]">
          <el-input v-model="productForm.imgs"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :rules="[{ required: true, message: '请输入商品数量', trigger: 'blur' }]">
          <el-input v-model="productForm.num"></el-input>
        </el-form-item>
      </el-form>
      <span style="display: flex; justify-content: flex-end">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitProductForm">提交</el-button>
      </span>
    </el-dialog>

    </el-aside>
    <el-main style="background-color:white">
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
      
      <el-row>
        <el-col v-for="item in paginatedItems" :key="item.proId" :span="8">
          <el-card>
            <div>{{ item.cartProImg }}</div>
            <div>{{ item.proName }}</div>
            <div style="display: flex; justify-content: space-between">
              <el-button type="danger" @click="reviseProduct(item)">修改商品</el-button>
              <el-button type="danger" @click="deleteProduct(item)">删除商品</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="products.length"
        layout="total, prev, pager, next"
      />

      <el-dialog :visible.sync="reviseDialogVisible" title="修改商品信息">
      <el-form :model="currentProduct" ref="form">
        <el-form-item label="商品名" :rules="[{ required: true, message: '请输入商品名称', trigger: 'blur' }]">
          <el-input v-model="currentProduct.name" :placeholder="currentProduct.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]">
          <el-input type="number" v-model="currentProduct.price" :placeholder="currentProduct.price" ></el-input>
        </el-form-item>
        <el-form-item label="商品简介" :rules="[{ required: true, message: '请输入商品简介', trigger: 'blur' }]">
          <el-input v-model="currentProduct.descrip" :placeholder="currentProduct.descrip"></el-input>
        </el-form-item>
        <el-form-item label="商品图片路径" :rules="[{ required: true, message: '请输入商品图片路径', trigger: 'blur' }]">
          <el-input v-model="currentProduct.imgs" :placeholder="currentProduct.imgs"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :rules="[{ required: true, message: '请输入商品数量', trigger: 'blur' }]">
          <el-input v-model="currentProduct.num" :placeholder="currentProduct.num"></el-input>
        </el-form-item>
      </el-form>
      <span style="display: flex; justify-content: flex-end">
        <el-button @click="reviseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </span>
    </el-dialog>
      
    </el-main>
  </el-container>
</el-container>
    
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
    searchQuery: "",
      products:[],
      filteredProducts:[],
      currentPage: 1,
      pageSize: 6, // 每页显示的卡片数量
      dialogVisible: false,
      reviseDialogVisible:false,
      currentProduct:{
        id: '',
        name: '',
        price: '',
        descrip: '',
        imgs: '',
        num: ''
      },
      productForm: {
        name: '',
        price: '',
        descrip: '',
        imgs: '',
        num: ''
      }
    };
  },
  computed:{
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(start, start + this.pageSize);
    }
  },
  methods:{
    async saveProduct(){
      const reviseProductData={
        proId: this.currentProduct.id,
        proName: this.currentProduct.name,
        proPrice: this.currentProduct.price,
        proDescrip: this.currentProduct.descrip,
        proImg: this.currentProduct.imgs,
        proNum: this.currentProduct.num
      }
      const response = await axios.post( "http://localhost:8081/reviseProduct",reviseProductData);
      console.log("修改商品：",response.data);
      this.reviseDialogVisible=false;
      this.fetchProducts();
      location.reload();
    },
    reviseProduct(item){
      this.currentProduct.id=item.proId;
      this.currentProduct.name=item.proName;
      this.currentProduct.price=item.proPrice;
      this.currentProduct.descrip=item.proDescrip;
      this.currentProduct.imgs=item.proImg;
      this.currentProduct.num=item.proNum;
      this.reviseDialogVisible=true;
    },
    //点击搜索后的事件
    handleSearch() {
      console.log(this.searchQuery);
      if (this.searchQuery) {
        this.filteredProducts = this.products.filter((product) =>
          product.proName.includes(this.searchQuery)
        );
      } else {
        this.filteredProducts = this.products; // 如果搜索框为空，显示所有商品
      }
    },
    async submitProductForm(){
      const addProductData={
        proName: this.productForm.name,
        proPrice: this.productForm.price,
        proDescrip: this.productForm.descrip,
        proImage: this.productForm.imgs,
        proNum: this.productForm.num
      }
      console.log(addProductData);
      const response = await axios.post("http://localhost:8081/addProduct",addProductData);
      console.log("添加商品：", response.data);
      this.dialogVisible = false;
      this.fetchProducts();
      location.reload();
    },
    async deleteProduct(item) {
      const deleteProductData={
        proName: item.proName,
      }
      //先看购物车中是否有该商品，如果有，则先从购物车中删除
      const response_1 = await axios.post("http://localhost:8081/inquireCart",deleteProductData);
      if(response_1.data.msg==="商品已存在"){
        const response_2 = await axios.post("http://localhost:8081/removeFromCart",deleteProductData);
        console.log("从购物车移除：", response_2.data);
      }
      console.log(deleteProductData);
      const response_3 = await axios.post("http://localhost:8081/deleteProduct",deleteProductData);
      console.log("删除商品：", response_3.data);
      this.fetchProducts();
      location.reload();
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:8081/getProducts");
        this.products = response.data.data;
        console.log(this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    handleSelect(key) {
      if (key === "frontpage") {
        if (this.$router.currentRoute.path !== "/FrontPage") {
          this.$router.push("/FrontPage");
        }
      }else if (key === "addproduct") {
        this.dialogVisible=true;
      } 
    }
    
  },
  mounted(){
    this.fetchProducts();
  }
}
</script>

<style>

</style>
