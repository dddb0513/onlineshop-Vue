<template>
  <el-container>
    <el-header style="height: 80px; background-color: #e0e0e0">
      <div style="display: flex; align-items: center">
        <img
          src="../assets/ikun.png"
          alt="Logo"
          style="height: 40px; margin-right: 10px"
        />
        <div style="float: left">ikun购物商城</div>
        
      </div>
    </el-header>
    <el-main style="height:calc(100vh - 80px);background-color: #e0e0e0;display: flex; justify-content: center;">
      <div class="colored-box">
        <el-button class="register-button" type="text" @click="navigateToRegister">立即注册</el-button>
        <div class="title">密码登陆</div>
        
        <el-form v-model="loginForm">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <div class="button-container">
      <el-button type="primary" @click="handleLogin">登录</el-button>
       </div>
        
      </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";


export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      
    };
  },
  methods: {
    navigateToRegister() {
      this.$router.push("/RegisterIn");
    },
    async handleLogin() {
      console.log("登录表单数据:", this.loginForm);
      // 在这里处理登录逻辑
      const login_data = {
        userName: this.loginForm.username,
        userPassword: this.loginForm.password,
      };
      try {
        const response = await axios.post(
          "http://localhost:8081/loginUser",
          login_data
        );
        console.log("服务器响应数据:", response.data);
        if (response.data.msg == "success") {
          // 登录成功，跳转到首页，
          sessionStorage.setItem("displayName", this.loginForm.username); // 存储用户名
          sessionStorage.setItem("isLoggedIn", true);
          sessionStorage.setItem("loggedUserType",response.data.data.userType);
          this.$router.replace("/frontpage");
        } else {
          alert("用户名或密码错误，请重新输入");
        }
      } catch (error) {
        console.error("登录失败：", error.response.data.message);
      }
    },
  },
};
</script>

<style>
.colored-box {
  position: relative; /* 设置为相对定位 */
  background-color: white; /* 背景颜色 */
  padding: 20px; /* 增加内边距 */
  margin: 10px; /* 外边距 */
  border-radius: 8px; /* 圆角 */
  width: 500px; /* 设置宽度 */
  height: auto; /* 自适应高度 */
}

.title {
  font-size: 24px; /* 标题字体大小 */
  margin-bottom: 10px; /* 减小标题下方间距 */
  text-align: center; /* 居中对齐 */
}

.register-button {
  position: absolute; /* 绝对定位 */
  top: 0px; /* 距离顶部20px */
  right: 230px; /* 距离右侧20px */
}

.el-form-item {
  margin-bottom: 15px; /* 表单项间距 */
}

.button-container {
  display: flex; /* 使用 flexbox */
  justify-content: center; /* 居中对齐按钮 */
  margin-top: 20px; /* 按钮上方间距 */
}

.el-button {
  width: 100%; /* 按钮宽度占满 */
}



</style>