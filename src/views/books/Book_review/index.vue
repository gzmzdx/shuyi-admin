<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <!--<el-form-item label="心得编号" prop="bookReviewId">
            <el-input v-model="form.bookReviewId" style="width: 370px;" />
          </el-form-item>-->
          <el-form-item label="读者编号" prop="readerId">
            <el-input v-model="form.readerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="心得内容" prop="content">
            <el-input v-model="form.content" style="width: 370px;" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="时间" prop="writeDate">
            <el-date-picker v-model="form.writeDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="点赞数量">
            <el-input v-model="form.likeNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书编号" prop="bookId">
            <el-input v-model="form.bookId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            <template>
              <el-radio v-model="form.isEnable" :label="true">是</el-radio>
              <el-radio v-model="form.isEnable" :label="false">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="审核状态" prop="type">
            <template>
              <el-select v-model="form.type" placeholder="请选择" style="width: 370px">
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
        <el-table-column prop="bookReviewId" label="图书心得编号" />
        <el-table-column prop="readerId" label="读者编号" />
        <el-table-column prop="content" label="心得内容" />
        <el-table-column prop="writeDate" label="时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.writeDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="likeNum" label="喜欢(点赞)数量" />
        <el-table-column prop="bookId" label="图书编号" />
        <el-table-column prop="isEnable" label="是否启用">
          <template slot-scope="scope">{{ scope.row.isEnable?"启用":"未启用" }}</template>
        </el-table-column>
        <el-table-column prop="type" label="审核状态" />
        <el-table-column v-permission="['admin','bookReview:edit','bookReview:del']" label="操作" width="150px" align="center">
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
import crudBookReview from '@/api/bookReview'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { bookReviewId: null, readerId: null, content: null, writeDate: null, likeNum: null, bookId: null, isEnable: null, type: null }
export default {
  name: 'BookReview',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '图书评论', url: 'api/bookReview', sort: 'bookReviewId,desc', crudMethod: { ...crudBookReview }})
  },
  data: function() {
    return {
      permission: {
        add: ['admin', 'bookReview:add'],
        edit: ['admin', 'bookReview:edit'],
        del: ['admin', 'bookReview:del']
      },
      rules: {
        bookReviewId: [
          { required: true, message: '图书心得编号不能为空', trigger: 'blur' }
        ],
        readerId: [
          { required: true, message: '读者编号不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '心得内容不能为空', trigger: 'blur' }
        ],
        writeDate: [
          { required: true, message: '时间不能为空', trigger: 'blur' }
        ],
        bookId: [
          { required: true, message: '图书编号不能为空', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '启用不能为空', trigger: 'blur' }
        ],
        type: [{ required: true, message: '复核通过不能为空', trigger: 'blur' }]
      },
      type: [{ value: '-1', label: '不发表' },
        { value: '1', label: '未审核' },
        { value: '2', label: '审核失败' },
        { value: '3', label: '机器审核未通过' },
        { value: '4', label: '需要进行人工审核' },
        { value: '5', label: '机器审核通过' },
        { value: '6', label: '人工复核通过' }]
    }
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
