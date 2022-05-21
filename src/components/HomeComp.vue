<template>
  <el-container class="home_container">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <h2>商城管理系统</h2>
      </div>
      <div class="ohters">
        <el-button size="small" type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle" @click="toggle">{{ arrowIcon }}</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#373d44"
          text-color="#fff"
          active-text-color="#409Eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + submenu.path"
              v-for="submenu in item.children"
              :key="submenu.id"
              @click="saveCurrentIndex('/' + submenu.path)"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ submenu.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'HomeComp',
  data () {
    return {
      menulist: [],
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
    // this.activePath && this.$router.push(this.activePath)
  },
  computed: {
    arrowIcon () {
      return this.isCollapse ? '>>' : '<<'
    }
  },
  methods: {
    saveCurrentIndex (path) {
      sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    logout () {
      this.$confirm('确认退出登录？')
        .then((_) => {
          sessionStorage.removeItem('token')
          this.$router.replace('/login')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    h2 {
      font-size: 20px;
      font-family: "楷体";
      color: #fff;
    }
  }
}
.el-aside {
  background: #373d44;
}
.el-main {
  background: #fff;
  letter-spacing: 0.2em;
}
.el-menu {
  border-right: none;
}
.toggle {
  background: #5b6570;
  color: #eee;
  text-align: center;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
}
</style>
