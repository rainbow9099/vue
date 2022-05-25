<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avator">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="login_panel">
        <el-form
          @keydown.enter.native="submitLogin('ruleForm')"
          :model="user"
          :rules="rules"
          ref="ruleForm"
          class="demo-form-inline"
        >
          <el-form-item label="账号" label-width="60px" prop="username">
            <el-input
              size="middle"
              v-model="user.username"
              ref="nameRef"
              prefix-icon="el-icon-user"
              placeholder="账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="60px" prop="password">
            <el-input
              size="middle"
              v-model="user.password"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button size="middle" type="primary" @click="submitLogin('ruleForm')"
              >登录</el-button
            >
            <el-button size="middle" type="info" @click="reset('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginComp',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名账号', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.$refs.nameRef.focus()
  },
  methods: {
    submitLogin (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.user)
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')
            return
          }
          this.$message.success('登录成功')
          sessionStorage.setItem('token', res.data.token)
          this.$router.replace('/home')
        } else {
          return false
        }
      })
    },
    reset (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang='less' scoped>
.login_container {
  background: #3b4b6b;
  height: 100%;
  position: relative;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 4px;
  background-color: #fff;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avator {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    background-color: #fff;
    padding: 5px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #52658b;
    }
  }
}
.login_panel {
  margin-top: 70px;
  padding: 0 10px;
}
.btns {
  text-align: center;
}
</style>
