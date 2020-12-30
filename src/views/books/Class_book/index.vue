<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="分类编号">
            <el-input v-model="form.classificationId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类名" prop="classificationName">
            <el-input v-model="form.classificationName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类号" prop="classificationSymbol">
            <el-input v-model="form.classificationSymbol" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="父类">
            <el-input v-model="form.parentClassificationId" style="width: 370px;" />
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
        <el-table-column prop="classificationId" label="分类编号" />
        <el-table-column prop="classificationName" label="分类名" />
        <el-table-column prop="classificationSymbol" label="分类号" />
        <el-table-column prop="parentClassificationId" label="父类" />
        <el-table-column prop="isEnable" label="是否启用">
          <template slot-scope="scope">{{ scope.row.isEnable?"启用":"未启用" }}</template>
        </el-table-column>
        <el-table-column v-permission="['admin','bookClassification:edit','bookClassification:del']" label="操作" width="150px" align="center">
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
import crudBookClassification from '@/api/bookClassification'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { classificationId: null, classificationName: null, classificationSymbol: null, parentClassificationId: null, isEnable: null }
export default {
  name: 'BookClassification',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '分类号', idField: 'classificationId', url: 'api/bookClassification', sort: 'classificationId,desc', crudMethod: { ...crudBookClassification }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'bookClassification:add'],
        edit: ['admin', 'bookClassification:edit'],
        del: ['admin', 'bookClassification:del']
      },
      rules: {
        classificationName: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ],
        classificationSymbol: [
          { required: true, message: '分类号不能为空', trigger: 'blur' }
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
