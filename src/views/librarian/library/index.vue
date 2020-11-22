<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="图书馆名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书馆类型" prop="type">
            <el-radio v-model="form.type" :label="0">官方图书馆</el-radio>
            <el-radio v-model="form.type" :label="1">个人图书馆</el-radio>
          </el-form-item>
          <el-form-item label="图书馆所有者的编号 对应reader_id">
            <el-input v-model="form.ownerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书馆后台管理账号的编号对应user_id">
            <el-input v-model="form.userId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维度">
            <el-input v-model="form.latitude" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="form.longitude" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图书馆地址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            <el-radio v-model="form.isEnable" :label="true">启用</el-radio>
            <el-radio v-model="form.isEnable" :label="false">不启用</el-radio>
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
        <el-table-column prop="libraryId" label="图书馆编号" />
        <el-table-column prop="name" label="图书馆名称" />
        <el-table-column prop="type" label="图书馆类型">
          <template slot-scope="scope">{{ scope===0?"官方图书馆":"个人图书馆" }}</template>
        </el-table-column>
        <el-table-column prop="ownerId" label="图书馆所有者的编号 对应reader_id" />
        <el-table-column prop="userId" label="图书馆后台管理账号的编号对应user_id" />
        <el-table-column prop="address" label="图书馆地址" />
        <el-table-column prop="latitude" label="维度" />
        <el-table-column prop="longitude" label="经度" />
        <el-table-column prop="isEnable" label="是否启用">
          <template slot-scope="scope">{{ scope?"启用":"未启用" }}</template>
        </el-table-column>
        <el-table-column v-permission="['admin','library:edit','library:del']" label="操作" width="150px" align="center">
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
import crudLibrary from '@/api/library'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { libraryId: null, name: null, type: null, latitude: null, longitude: null, ownerId: null, userId: null, address: null, isEnable: null }
export default {
  name: 'Library',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '图书馆', idField: 'libraryId', url: 'api/library', sort: 'libraryId,desc', crudMethod: { ...crudLibrary }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'library:add'],
        edit: ['admin', 'library:edit'],
        del: ['admin', 'library:del']
      },
      rules: {
        name: [
          { required: true, message: '图书馆名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '0:官方图书馆  1:个人图书馆不能为空', trigger: 'blur' }
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
