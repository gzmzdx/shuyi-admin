<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="读者编号" prop="readerId">
            <el-input v-model="form.readerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户姓名" prop="readerName">
            <el-input v-model="form.readerName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="电话号码" prop="phoneNum">
            <el-input v-model="form.phoneNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="职业" prop="occupation">
            <template>
              <el-select v-model="form.occupation" placeholder="请选择" style="width: 370px;">
                <el-option
                  v-for="item in occupation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="职称" prop="professional">
            <template>
              <el-select v-model="form.professional" placeholder="请选择" style="width: 370px">
                <el-option
                  v-for="item in professional"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="学历" prop="education">
            <el-input v-model="form.education" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="签名" prop="signature">
            <el-input v-model="form.signature" style="width: 370px;" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="QQ号" prop="qqId">
            <el-input v-model="form.qqId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="微信号" prop="wxId">
            <el-input v-model="form.wxId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物流偏好" prop="shippercode">
            <template>
              <el-select v-model="form.shippercode" placeholder="请选择" style="width: 370px">
                <el-option
                  v-for="item in shippercode"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="form.birthday" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <template>
              <el-radio v-model="form.sex" label="true">男</el-radio>
              <el-radio v-model="form.sex" label="false">女</el-radio>
            </template>
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
        <el-table-column prop="readerId" label="读者编号" />
        <el-table-column prop="readerName" label="用户姓名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="phoneNum" label="电话号码" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="occupation" label="职业" />
        <el-table-column prop="professional" label="职称" />
        <el-table-column prop="education" label="学历" />
        <el-table-column prop="signature" label="签名" />
        <el-table-column prop="qqId" label="QQ号" />
        <el-table-column prop="wxId" label="微信号" />
        <el-table-column prop="shippercode" label="物流偏好" />
        <el-table-column prop="birthday" label="生日">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.birthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="isEnable" label="是否启用">
          <template slot-scope="scope">{{ scope.row.isEnable?"启用":"未启用" }}</template>
        </el-table-column>
        <el-table-column v-permission="['admin','reader:edit','reader:del']" label="操作" width="150px" align="center">
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
import crudReader from '@/api/reader'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { readerId: null, readerName: null, nickname: null, password: null, avatar: null, identityCard: null, phoneNum: null, email: null, occupation: null, professional: null, education: null, level: null, signature: null, qqId: null, wxId: null, openId: null, isBaned: null, shippercode: null, birthday: null, sex: null, phoneIsHid: null, isEnable: null, userId: null }
export default {
  name: 'Reader',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '读者', url: 'api/reader', sort: 'readerId,desc', crudMethod: { ...crudReader }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'reader:add'],
        edit: ['admin', 'reader:edit'],
        del: ['admin', 'reader:del']
      },
      rules: {
        readerId: [
          { required: true, message: '读者编号', trigger: 'blur' }
        ],
        readerName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '电话号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        occupation: [
          { required: true, message: '职业不能为空', trigger: 'blur' }
        ],
        professional: [
          { required: true, message: '职称不能为空', trigger: 'blur' }
        ],
        education: [
          { required: true, message: '学历不能为空', trigger: 'blur' }
        ],
        signature: [
          { required: true, message: '签名不能为空', trigger: 'blur' }
        ],
        qqId: [
          { required: true, message: 'QQ号不能为空', trigger: 'blur' }
        ],
        wxId: [
          { required: true, message: '微信号不能为空', trigger: 'blur' }
        ],
        shippercode: [
          { required: true, message: '物流偏好不能为空', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '生日不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '是否启用', trigger: 'blur' }
        ]
      },
      sex: { radio: '1' }, isEnable: { radio: '1' },
      occupation: [{ value: '选项1', label: '教师' },
        { value: '选项2', label: '学生' },
        { value: '选项3', label: '工人' },
        { value: '选项4', label: '农民' },
        { value: '选项5', label: '医生' }],
      shippercode: [{ value: '选项1', label: '圆通速递' },
        { value: '选项2', label: '中通快递' },
        { value: '选项3', label: '顺丰快递' },
        { value: '选项4', label: '申通快递' },
        { value: '选项5', label: '天天快递' },
        { value: '选项5', label: '韵达速运' }],
      professional: [{ value: '选项1', label: '高级' },
        { value: '选项2', label: '中级' },
        { value: '选项3', label: '助理级' },
        { value: '选项4', label: '员级' },
        { value: '选项5', label: '无职称' }]
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
