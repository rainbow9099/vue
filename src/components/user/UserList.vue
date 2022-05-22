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
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
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
          width="200"
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
        <el-table-column width="80" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchHandler(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="dialogClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser" :disabled="!isUpdated"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    const checkEmail = (rule, val, cb) => {
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)/
      if (reg.test(val)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    const checkMobile = (rule, val, cb) => {
      const reg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (reg.test(val)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      userlist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        email: '',
        mobile: ''
      },
      initEditForm: {},
      isUpdated: false,
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3~10个之间',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  watch: {
    editForm: {
      handler (newVal) {
        console.log('xxx', newVal)
        this.isUpdated =
          JSON.stringify(newVal) !== JSON.stringify(this.initEditForm)
      },
      deep: true
    }
  },
  methods: {
    removeUserById (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg || '删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editUser () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg || '编辑用户失败')
          }
          this.$message.success(res.meta.msg)
          this.getUserList()
          this.editDialogVisible = false
        }
      })
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = Object.assign({}, row)
      this.initEditForm = Object.assign({}, row)
    },
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg || '添加用户失败')
          }
          this.$message.success(res.meta.msg)
          this.getUserList()
          this.addDialogVisible = false
        }
      })
    },
    dialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getUserList()
    },
    async switchHandler (row) {
      const { id, mg_state: type } = row
      const { data: res } = await this.$http.put(`users/${id}/state/${type}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表数据失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
</style>
