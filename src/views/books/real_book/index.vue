<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="真实图书编号，自增长">
            <el-input v-model="form.realBookId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="书本编号" prop="bookId">
            <el-input v-model="form.bookId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书馆编号" prop="libraryId">
            <el-input v-model="form.libraryId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否被借出,1被借出,0未被借出">
            <el-input v-model="form.isBorrowed" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="form.latitude" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="经度" prop="longtitude">
            <el-input v-model="form.longtitude" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="条形码" prop="barcode">
            <el-input v-model="form.barcode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="书本类型">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用 1启用 0未启用" prop="isEnable">
            <el-input v-model="form.isEnable" style="width: 370px;" />
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
        <el-table-column prop="realBookId" label="真实图书编号，自增长" />
        <el-table-column prop="bookId" label="书本编号" />
        <el-table-column prop="libraryId" label="图书馆编号" />
        <el-table-column prop="isBorrowed" label="是否被借出,1被借出,0未被借出" />
        <el-table-column prop="latitude" label="纬度" />
        <el-table-column prop="longtitude" label="经度" />
        <el-table-column prop="barcode" label="条形码" />
        <el-table-column prop="type" label="书本类型" />
        <el-table-column prop="isEnable" label="是否启用 1启用 0未启用" />
        <el-table-column v-permission="['admin','real_book:edit','real_book:del']" label="操作" width="150px" align="center">
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
import crudRealBook from '@/api/realBook'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { realBookId: null, bookId: null, libraryId: null, isBorrowed: null, latitude: null, longtitude: null, barcode: null, type: null, isEnable: null }
export default {
  name: 'RealBook',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '真实图书', url: 'api/realBook', sort: 'realBookId,desc', crudMethod: { ...crudRealBook }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'real_book:add'],
        edit: ['admin', 'real_book:edit'],
        del: ['admin', 'real_book:del']
      },
      rules: {
        bookId: [
          { required: true, message: '书本编号不能为空', trigger: 'blur' }
        ],
        libraryId: [
          { required: true, message: '图书馆编号不能为空', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '纬度不能为空', trigger: 'blur' }
        ],
        longtitude: [
          { required: true, message: '经度不能为空', trigger: 'blur' }
        ],
        barcode: [
          { required: true, message: '条形码不能为空', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '是否启用 1启用 0未启用不能为空', trigger: 'blur' }
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
