<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="搜索编号" prop="recordId">
            <el-input v-model="form.recordId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="读者编号" prop="readerId">
            <el-input v-model="form.readerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="搜索时间" prop="searchTime">
            <el-date-picker v-model="form.searchTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="搜索关键词" prop="content">
            <el-input v-model="form.content" style="width: 370px;" />
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
        <el-table-column prop="recordId" label="搜索编号" />
        <el-table-column prop="readerId" label="读者编号" />
        <el-table-column prop="searchTime" label="搜索时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.searchTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="搜索关键词" />
        <el-table-column prop="isEnable" label="是否启用" />
        <el-table-column v-permission="['admin','searchRecord:edit','searchRecord:del']" label="操作" width="150px" align="center">
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
import crudSearchRecord from '@/api/searchRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { recordId: null, readerId: null, searchTime: null, content: null, isEnable: null }
export default {
  name: 'SearchRecord',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '搜索记录(书名)', idField: 'recordId', url: 'api/searchRecord', sort: 'recordId,desc', crudMethod: { ...crudSearchRecord }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'searchRecord:add'],
        edit: ['admin', 'searchRecord:edit'],
        del: ['admin', 'searchRecord:del']
      },
      rules: {
        recordId: [
          { required: true, message: '搜索编号,不能为空', trigger: 'blur' }
        ],
        readerId: [
          { required: true, message: '读者编号不能为空', trigger: 'blur' }
        ],
        searchTime: [
          { required: true, message: '搜索时间不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '搜索关键词不能为空', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '是否启用 不能为空', trigger: 'blur' }
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
