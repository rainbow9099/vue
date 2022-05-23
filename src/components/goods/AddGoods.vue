<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        show-icon
        :closable="false"
        center
        type="info"
      >
      </el-alert>
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          tab-position="left"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParamsList"
              :key="item.attr_id"
            >
              <template>
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                    v-for="(param, i) in item.attr_vals"
                    :key="i"
                    :label="param"
                    border
                  ></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="attr.attr_name"
              v-for="attr in onlyParamsList"
              :key="attr.attr_id"
            >
              <el-input v-model="attr.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headers"
              :on-success="uploadSuccess"
              list-type="picture"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" class="addbtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewDialog" width="50%">
      <img :src="previewUrl" alt="" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'loadsh'
export default {
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
      },
      catelist: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        chidren: 'chidren'
      },
      manyParamsList: [],
      onlyParamsList: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headers: {},
      previewUrl: '',
      previewDialog: false
    }
  },
  created () {
    this.getCateList()
    this.headers = {
      Authorization: sessionStorage.getItem('token')
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请填写必要的表单项')
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyParamsList.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          })
        })
        this.onlyParamsList.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        form.attrs = this.addForm.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg || '添加失败')
        }
        this.$message.success(res.meta.msg || '添加商品成功')
        this.$router.push('/goods')
      })
    },
    handleRemove (file) {
      const tempPath = file.response.data.tmp_path
      this.addForm.pics = this.addForm.pics.filter(
        (item) => item.pic !== tempPath
      )
    },
    uploadSuccess (res) {
      const pic = {
        pic: res.data.tmp_path
      }
      this.addForm.pics.push(pic)
    },
    handlePreview (file) {
      this.previewUrl = file.response.data.url
      this.previewDialog = true
    },
    async getParams (sel) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg || '获取参数失败')
      }
      if (sel === 'many') {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
      }
      return res.data
    },
    async tabClicked () {
      switch (this.activeIndex) {
        case '1':
          // 获取商品参数
          this.manyParamsList = await this.getParams('many')
          break
        case '2':
          // 获取商品参数
          this.onlyParamsList = await this.getParams('only')
          break
      }
    },
    beforeTabLeave (activeName, oldName) {
      if (oldName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.warning('请先选择商品分类')
        return false
      } else {
        return true
      }
    },
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    }
  }
}
</script>
<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview-img {
  width: 100%;
}
.addbtn{
    margin-top: 15px;
}
</style>
