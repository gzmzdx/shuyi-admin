<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="图书编号" prop="bookId">
            <el-input v-model="form.bookId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="书名" prop="bookName">
            <el-input v-model="form.bookName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书作者" prop="author">
            <el-input v-model="form.author" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="简介" prop="summary">
            <el-input v-model="form.summary" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="详情" prop="introduction">
            <el-input v-model="form.introduction" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="发布年份" prop="publisherYear">
            <el-date-picker v-model="form.publisherYear" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="作者摘要">
            <el-input v-model="form.authorAbstract" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书图片路径">
            <el-input v-model="form.picturePath" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类号">
            <el-input v-model="form.classificationSymbol" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书数量">
            <el-input v-model="form.num" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            <template>
              <el-radio v-model="form.isEnable" label="true">是</el-radio>
              <el-radio v-model="form.isEnable" label="false">否</el-radio>
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="bookId" label="图书编号" />
        <el-table-column show-overflow-tooltip prop="bookName" label="书名" width="100" align="center" />
        <el-table-column show-overflow-tooltip prop="author" label="图书作者" />
        <el-table-column show-overflow-tooltip prop="summary" label="简介" width="300" align="center">
          <template slot-scope="scope">
            <p v-text="sensitiveWord">{{ scope.row.summary }}</p>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="introduction" label="详情" />
        <el-table-column show-overflow-tooltip prop="publisherYear" label="发布年份" width="85" />
        <el-table-column show-overflow-tooltip prop="authorAbstract" label="作者摘要" />
        <el-table-column prop="picturePath" label="封面" width="100" align="center">
          <template slot-scope="scope">
            <img height="60" :src="scope.row.picturePath" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="classificationSymbol" label="分类号" />
        <el-table-column prop="num" label="图书数量" />
        <el-table-column prop="isEnable" label="是否启用">
          <template slot-scope="scope">{{ scope.row.isEnable?"启用":"未启用" }}</template>
        </el-table-column>
        <el-table-column v-permission="['admin','book:edit','book:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudBook from '@/api/book'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { bookId: null, bookName: null, author: null, summary: null, introduction: null, publisherYear: null, authorAbstract: null, isbn: null, picturePath: null, classificationSymbol: null, num: null, isEnable: null }
export default {
  name: 'Book',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '图书', idField: 'bookId', url: 'api/book', sort: 'bookId,desc', crudMethod: { ...crudBook }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'book:add'],
        edit: ['admin', 'book:edit'],
        del: ['admin', 'book:del']
      },
      rules: {
        bookId: [
          { required: true, message: '图书编号不能为空', trigger: 'blur' }
        ],
        bookName: [
          { required: true, message: '书名不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '图书作者不能为空', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '简介不能为空', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '详情不能为空', trigger: 'blur' }
        ],
        publisherYear: [
          { required: true, message: '发布年份不能为空', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '是否启用', trigger: 'blur' }
        ]
      }}
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}

</script>

<style scoped>

</style>
