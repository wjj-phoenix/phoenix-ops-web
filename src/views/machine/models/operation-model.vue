<script setup lang="ts">
import { ref, reactive, toRefs } from "vue"
import { type MachineInfo, type Machine } from "@/api/machine/types/machine"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { cloneDeep } from "lodash-es"
import emitter from '@/utils/emitter';
import TableEdit from "./table-edit.vue";
import { TagResourceTypeEnum } from '@/common/commonEnum';
import { machineApi } from '../api';

const loading = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)

// defineProps({ dialogVisible: Boolean })

emitter.on('openOperationModel', (dialog: any) => {
  dialogVisible.value = dialog
});

const defaultForm: Machine = {
  name: '',
  ip: '',
  port: 22,
  operatingSystem: '',
  isVirtual: false,
  enabled: true,
  remark: '',
  createdUser: '',
  createdTime: '',
  latestTime: '',
  updatedUser: '',
  updatedTime: '',
  // resourceAuth: null,
}

const machineForm: any = ref(null);

const formRules: FormRules<MachineInfo> = {
  name: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  ip: [{ required: true, trigger: "blur", message: "请输入密码" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    // const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi

    /* api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTableData()
      })
      .finally(() => {
        loading.value = false
      }) */
  })
}

const machine = ref<Machine>(cloneDeep(defaultForm))

const resetForm = () => {
  formRef.value?.clearValidate()
  machine.value = cloneDeep(defaultForm)
}

const state = reactive({
    sshTunnelMachineList: [] as any,
    form: defaultForm,
    submitForm: {} as any,
    pwd: '',
});

const { form, submitForm } = toRefs(state);

const { isFetching: testConnBtnLoading, execute: testConnExec } = machineApi.testConn.useApi(submitForm);

const testConn = async (authCert: any) => {
    try {
        await machineForm.value.validate();
    } catch (e: any) {
        ElMessage.error('请正确填写信息');
        return false;
    }

    state.submitForm = getReqForm();
    state.submitForm.authCerts = [authCert];
    await testConnExec();
    ElMessage.success('连接成功');
};

const getReqForm = () => {
    const reqForm: any = { ...state.form };
    // if (!state.form.sshTunnelMachineId || state.form.sshTunnelMachineId <= 0) {
    //     reqForm.sshTunnelMachineId = -1;
    // }
    return reqForm;
};
</script>

<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="machine.id === undefined ? '新增用户' : '修改用户'" @closed="resetForm"width="50%">
    <el-form ref="formRef" :model="machine" :rules="formRules" label-width="100px" label-position="right">
      <el-row>
        <el-col :span="18">
          <el-form-item prop="name" label="主机名称">
            <el-input v-model="machine.name" placeholder="请输入主机名称..." />
          </el-form-item>
        </el-col>    
        <el-col :span="6">
          <el-form-item prop="enabled" label="主机状态">
            <el-switch v-model="machine.enabled" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="ip" label="ip" required>
        <el-col :span="18">
          <el-input v-model.trim="machine.ip" placeholder="请输入主机IP..." auto-complete="off"> </el-input>
        </el-col>
        <el-col style="text-align: center" :span="1">:</el-col>
        <el-col :span="5">
          <el-input type="number" v-model.number="machine.port" placeholder="请输入SSH协议连接端口..."></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="machine.remark" type="textarea" placeholder="请输入备注信息..." />
      </el-form-item>

      <el-divider content-position="left">授权凭证</el-divider>
      <div>
        <table-edit v-model="machine.resourceAuths" :resource-code="machine.code" :resource-type="TagResourceTypeEnum.Machine.value" :test-conn-btn-loading="testConnBtnLoading" @test-conn="testConn" />
      </div>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
    </template>
  </el-dialog>
</template>
