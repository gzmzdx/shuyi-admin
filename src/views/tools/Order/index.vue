<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">订单编号</label>
        <el-input v-model="query.orderId" clearable placeholder="订单编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">读者编号</label>
        <el-input v-model="query.readerId" clearable placeholder="读者编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">借书编号</label>
        <el-input v-model="query.borrowListId" clearable placeholder="借书编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="订单编号">
            <el-input v-model="form.orderId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="读者编号" prop="readerId">
            <el-input v-model="form.readerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商户系统内部订单号" prop="outTradeNo">
            <el-input v-model="form.outTradeNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="总价格" prop="totalPrice">
            <el-input v-model="form.totalPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="下单时间">
            <el-input v-model="form.orderTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="处理时间">
            <el-input v-model="form.handlingTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="借书编号" prop="borrowListId">
            <el-input v-model="form.borrowListId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.content" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="支付状态">
            <!--            <el-input v-model="form.status" style="width: 370px;" />-->
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in options002"
                :key="item.value002"
                :label="item.label"
                :value="item.value002"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            <!--            <el-input v-model="form.isEnable" style="width: 370px;" />-->
            <el-select v-model="form.isEnable" placeholder="请选择">
              <el-option
                v-for="item in options001"
                :key="item.value001"
                :label="item.label"
                :value="item.value001"
              />
            </el-select>
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
        <el-table-column prop="orderId" label="订单编号" />
        <el-table-column prop="readerId" label="读者编号" />
        <el-table-column prop="outTradeNo" label="商户系统内部订单号" />
        <el-table-column prop="totalPrice" label="总价格" />
        <el-table-column prop="orderTime" label="下单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handlingTime" label="处理时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.handlingTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="borrowListId" label="借书编号" />
        <el-table-column prop="content" label="备注" />
        <el-table-column prop="status" label="0:预支付1：支付成功2：支付取消/失败" />
        <el-table-column prop="isEnable" label="是否启用1启用0未启用" />
        <el-table-column v-permission="['admin','order:edit','order:del']" label="操作" width="150px" align="center">
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
import crudOrder from '@/api/order'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { orderId: null, readerId: null, outTradeNo: null, totalPrice: null, orderTime: null, handlingTime: null, borrowListId: null, content: null, status: null, isEnable: null }
export default {
  name: 'Order',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '订单', idField: 'orderId', url: 'api/order', sort: 'orderId,desc', crudMethod: { ...crudOrder }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'order:add'],
        edit: ['admin', 'order:edit'],
        del: ['admin', 'order:del']
      },
      rules: {
        readerId: [
          { required: true, message: '读者编号不能为空', trigger: 'blur' }
        ],
        outTradeNo: [
          { required: true, message: '商户系统内部订单号', trigger: 'blur' }
        ],
        totalPrice: [
          { required: true, message: '总价格不能为空', trigger: 'blur' }
        ],
        borrowListId: [
          { required: true, message: '借书编号不能为空', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: 'true启用 false:未启用', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'orderId', display_name: '订单编号' },
        { key: 'readerId', display_name: '读者编号' },
        { key: 'borrowListId', display_name: '借书编号' }
      ],
      options001: [{
        value001: 'false',
        label: '否'
      }, {
        value001: 'true',
        label: '是'
      }],
      value001: '',
      options002: [{
        value002: '0',
        label: '1:预支付'
      }, {
        value002: '1',
        label: '2:支付成功'
      }, {
        value002: '2',
        label: '3:支付取消或失败'
      }],
      value002: ''
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
