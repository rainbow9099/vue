<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe="">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbtm-1', i == 0 ? 'bdtop-1' : '', 'vcenter']"
              v-for="(item1, i) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[j == 0 ? '' : 'bdtop-2', 'vcenter']"
                  v-for="(item2, j) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          width="180"
        ></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="dialogClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editDialogVisible"
      width="30%"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole" :disabled="!isUpdated"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="rigthSetDialogVisible"
      width="30%"
      @close="clearLeafKeys"
    >
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="leafKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rigthSetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const checkRoleName = (rule, val, cb) => {
      if (/^(\w+)|([\u4e00-\u9fa5]+)$/.test(val)) {
        return cb()
      }
      cb(new Error('请输入合法的角色名称'))
    }
    return {
      roleList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      initEditForm: {},
      isUpdated: false,
      editDialogVisible: false,
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { validator: checkRoleName, trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      rigthSetDialogVisible: false,
      rightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      leafKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  watch: {
    editForm: {
      handler (newVal) {
        this.isUpdated =
          JSON.stringify(newVal) !== JSON.stringify(this.initEditForm)
      },
      deep: true
    }
  },
  methods: {
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const rids = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg || '设置角色失败')
      }
      this.$message.success(res.meta.msg || '角色权限设置成功')
      this.getRoleList()
      this.rigthSetDialogVisible = false
    },
    clearLeafKeys () {
      this.leafKeys = []
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    async showSetDialog (role) {
      this.roleId = role.id
      this.rigthSetDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg || '获取权限数据失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.leafKeys)
    },
    removeRightById (role, rightId) {
      this.$confirm('此操作将永久删除角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg || '删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    removeUserById (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg || '删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRoleList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = {
        roleName: row.roleName,
        roleDesc: row.roleDesc
      }
      this.roleId = row.id
      this.initEditForm = Object.assign({}, this.editForm)
    },
    editRole () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'roles/' + this.roleId,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg || '编辑角色失败')
          }
          this.$message.success(res.meta.msg)
          this.getRoleList()
          this.editDialogVisible = false
        }
      })
    },
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg || '角色列表获取失败')
      }
      this.roleList = res.data
    },
    addRole () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg || '添加角色失败')
          }
          this.$message.success(res.meta.msg)
          this.getRoleList()
          this.addDialogVisible = false
        }
      })
    },
    dialogClose () {
      this.$refs.addFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 8px;
}
/* .el-row{
    margin: 10px;
} */
.bdtop-1 {
  border-top: 1px dotted #409eff;
}
.bdtop-2 {
  border-top: 1px dotted #67c23a;
}
.bdbtm {
  border-bottom: 1px dotted #eee;
}
.bdbtm-1 {
  border-bottom: 1px dotted #409eff;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
