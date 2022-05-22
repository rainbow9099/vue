<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted == false"
            class="el-icon-circle-check"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-circle-close" style="color: red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opts" slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="removeCageById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialog"
      width="30%"
      @close="clearAddCate"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            expandTrigger="hover"
            clearable
            change-on-select
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialog" width="30%">
      <el-form
        :model="editCateForm"
        :rules="addCateRules"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opts'
        }
      ],
      addCateDialog: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请填写分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      editCateDialog: false,
      editCateForm: {
        id: '',
        cat_name: ''
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    removeCageById (id) {
      this.$confirm('此操作将永久删除商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg || '删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCateList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editCate () {
      this.$refs.editCateRef.validate(async (valid) => {
        if (!valid) return
        const { id } = this.editCateForm
        const { data: res } = await this.$http.put('categories/' + id, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg || '修改分类失败')
        }
        this.$message.success('修改分类成功')
        this.getCateList()
        this.editCateDialog = false
      })
    },
    showEditDialog (row) {
      this.editCateForm = {
        id: row.cat_id,
        cat_name: row.cat_name
      }
      this.editCateDialog = true
    },
    clearAddCate () {
      this.addCateForm = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
      this.selectedKeys = []
    },
    addCate () {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg || '添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialog = false
      })
    },
    parentCateChange () {
      const len = this.selectedKeys.length
      if (len > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[len - 1]
        this.addCateForm.cat_level = len
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: '2' }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg || '获取父级分类失败')
      }
      this.parentCateList = res.data
    },
    showAddCateDialog () {
      this.addCateDialog = true
      this.getParentCateList()
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getCateList()
    },
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getCateList()
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    }
  }
}
</script>
<style scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
