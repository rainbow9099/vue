<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          width="180"
          label="姓名"
          prop="username"
        ></el-table-column>
        <el-table-column
          width="180"
          label="邮箱"
          prop="email"
        ></el-table-column>
        <el-table-column
          width="180"
          label="电话"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          width="180"
          label="角色"
          prop="role_name"
        ></el-table-column>
        <el-table-column width="180" label="状态">
          <template>
            <el-switch
              v-model="mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作">
            <template>
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    return {
      userlist: [],
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: 4
      },
      total: 0,
      pagenum: 1
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表数据失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res.data)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
