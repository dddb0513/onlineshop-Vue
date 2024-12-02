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
    <el-main
      style="
        height: calc(100vh - 80px);
        background-color: #e0e0e0;
        display: flex;
        justify-content: center;
      "
    >
      <div class="register">
        <div>注册账户</div>
        <el-form
          v-model="registerForm"
          label-width="100px"
          @submit.prevent="handleSubmit"
        >
          <div v-if="step === 1" class="form-group">
            <el-form-item label="用户名">
              <el-input
                v-model="registerForm.username"
                style="width: 350px"
              ></el-input>
            </el-form-item>

            <el-form-item label="密码">
              <el-input v-model="registerForm.password"></el-input>
            </el-form-item>
            <el-button type="primary" style="width: 200px" @click="nextStep"
              >下一步</el-button
            >
          </div>

          <div v-if="step === 2">
            <el-form-item label="邮箱">
              <el-input
                v-model="registerForm.email"
                style="width: 350px"
              ></el-input>
            </el-form-item>

            <el-form-item label="验证码">
              <div style="display: flex; align-items: center">
                <el-input
                  v-model="registerForm.verificationCode"
                  style="flex: 1; margin-right: 10px"
                ></el-input>
                <el-button
                  type="primary"
                  style="width: 120px"
                  @click="sendCode()"
                  >发送验证码</el-button
                >
              </div>
            </el-form-item>
            <el-button type="primary" style="width: 200px" @click="prevStep"
              >上一步</el-button
            >
            <el-button type="primary" style="width: 200px" @click="nextStep"
              >下一步</el-button
            >
          </div>

          <div v-if="step === 3">
            <el-form-item label="电话">
              <el-input
                v-model="registerForm.phone"
                style="width: 350px"
              ></el-input>
            </el-form-item>

            <el-form-item label="地址">
              <el-input v-model="registerForm.address"></el-input>
            </el-form-item>

            <el-form-item label="注册用户类型">
              <el-select v-model="registerForm.userType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-button type="primary" style="width: 200px" @click="prevStep">上一步</el-button>
            <el-button
              type="primary"
              style="width: 200px"
              @click="handleRegister"
              >注册</el-button
            >
          </div>
        </el-form>

        <div v-if="submitted">
          <h3>注册成功!</h3>
          <p>用户名: {{ registerForm.username }}</p>
          <p>邮箱: {{ registerForm.email }}</p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      step: 1,
      submitted: false,
      options: [
        { value: "customer", label: "顾客" },
        { value: "seller", label: "销售主管" },
      ],
      registerForm: {
        username: "",
        password: "",
        verificationCode: "",
        phone: "",
        email: "",
        address: "",
        userType: "",
      },
    };
  },

  methods: {
    async sendCode() {
      // 发送验证码逻辑
      const emailData = {
        email: this.registerForm.email,
      };
      const response = await axios.post("http://localhost:8081/send-verification-code", emailData);
      console.log("服务器响应数据:", response.data);
      alert("验证码已发送")
    },

    nextStep() {
      this.step++;
    },
    prevStep() {
      this.step--;
    },
    async handleRegister() {
      // 检查用户名是否已存在
      try {
        const checkResponse = await axios.post(
          "http://localhost:8081/checkUsername",
          {
            userName: this.registerForm.username,
            userPassword: this.registerForm.password,
          }
        );
        if (checkResponse.data.msg === "success") {
          this.$message.error("用户已存在,请直接登陆");
          this.$router.replace("/LogIn");
          return;
        }
      } catch (error) {
        console.error("检查用户名失败：", error.response.data.message);
        this.$message.error("检查用户名时出错，请稍后再试");
        return;
      }
      //检查验证码是否正确
      const checkCodeData = {
        email: this.registerForm.email,
        code: this.registerForm.verificationCode,
      };
      const checkCodeResponse = await axios.post(
        "http://localhost:8081/verify-code",
        checkCodeData
      );
      if (checkCodeResponse.data!== "验证码正确") {
        this.$message.error("验证码错误，请重新输入");
        return;
      }
      const regis_data = {
        userName: this.registerForm.username,
        userPassword: this.registerForm.password,
        userEmail: this.registerForm.email,
        userPhone: this.registerForm.phone,
        userAddress: this.registerForm.address,
        userType: this.registerForm.userType === "customer" ? 1 : 0
        }
      
      try {
        const response = await axios.post(
          "http://localhost:8081/addUser",
          regis_data
        );
        console.log("服务器响应数据:", response.data);
        // 注册成功，跳转到首页
        sessionStorage.setItem("displayName", this.registerForm.username); // 存储用户名
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("loggedUserType", this.registerForm.userType);
        this.$router.replace("/frontpage");
      } catch (error) {
        console.error("注册失败：", error.response.data.message);
      }
    },
  },
};
</script>

<style>
</style>