<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, featchedMachineApi } from "@/api/machine"
import { type CreateOrUpdateTableRequestData, type Machine } from "@/api/machine/types/machine"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, CirclePlus, Delete, Download, RefreshRight, Edit } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"
import emitter from '@/utils/emitter';
import SshDialog from './models/ssh-dialog.vue';
import SftpDialog from './models/sftp-dialog.vue';

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const terminalDialogRef: any = ref(null);

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  name: '',
  ip: '',
  port: 22,
  operatingSystem: '',
  isVirtual: false,
  enabled: false,
  remark: '',
  createdUser: '',
  createdTime: '',
  latestTime: '',
  updatedUser: '',
  updatedTime: '',
  // resourceAuth: null,
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateTableRequestData> = {
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
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const handleDelete = (row: Machine) => {
  ElMessageBox.confirm(`正在删除用户：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: Machine) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const machines = ref<Machine[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  phone: ""
})



const sshTerminal = (row: Machine) => {
  console.log('row', row)
  // emitter.emit('openSshTerminalDialog', true)
  const ac = row.username;
  const terminalId = Date.now();
  /*
   调用了一个名为 terminalDialogRef 的组件的 open 方法，传入了一个包含多个属性的对象作为参数。其中，属性包括 terminalId、socketUrl、minTitle、minDesc 和 meta。
   * terminalId 表示终端的ID。
   * socketUrl 是通过调用函数 getMachineTerminalSocketUrl(ac) 得到的终端的socket URL。
   * minTitle 是一个字符串，由 ${row.name} [${(terminalId + '').slice(-2)}] 组成，用来描述终端的标题。
   * minDesc 是一个字符串，由 ${row.selectAuthCert.username}@${row.ip}:${row.port} (${row.name}) 组成，用来描述终端的概要信息。
   * meta 是包含了一系列有关终端的其他元信息的对象，其中可能包含了关于终端的更多详细信息。
   * 总结：以上代码调用了终端对话框组件的 open 方法，并通过传递参数的方式展示了有关终端的信息，包括终端ID、socket URL、标题、概要信息以及其他详细信息。
   */
  terminalDialogRef.value.open({
    terminalId,
    socketUrl: getMachineTerminalSocketUrl(ac),
    minTitle: `${row.name} [${(terminalId + '').slice(-2)}]`, // 截取terminalId最后两位区分多个terminal
    // minDesc: `${row.selectAuthCert.username}@${row.ip}:${row.port} (${row.name})`,
    meta: row,
  });
}

const sftpTerminal = (row: Machine) => {
  console.log(row)
  emitter.emit('openSftpTerminalDialog', true)
  // formData.value = cloneDeep(row)
}

const getTableData = () => {
  loading.value = true
  featchedMachineApi({
    page: paginationData.currentPage,
    limit: paginationData.pageSize,
    condition: undefined,
  }).then(({ data }) => {
      paginationData.total = data.total
      console.log('data', data)
      machines.value = data.rows
      machines.value.forEach(item => {
        item.username = item.resourceAuths[0].username
      })
    })
    .catch(() => {
      machines.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="主机名称">
          <el-input v-model="searchData.username" placeholder="请输入主机名称..." />
        </el-form-item>
        <el-form-item prop="phone" label="主机IP">
          <el-input v-model="searchData.phone" placeholder="请输入主机IP..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询主机</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增主机</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="machines" style="width: 100%">
          <el-table-column flex="left" type="selection" width="50" align="center" />
          <el-table-column flex="left" prop="name" label="主机名称" align="center" width="150">
            <template #default="scope">
              <el-button type="success" link>{{ scope.row.name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP:Port" align="center" width="150" />
          <el-table-column prop="phone" label="运行状态" align="center" width="250"></el-table-column>
          <el-table-column label="授权凭证" align="center" width="180">
            <template #default="scope">
              <el-select v-model="scope.row.username" style="width: 150px">
                <el-option v-for="item in scope.row.resourceAuths" :key="item.id" :label="item.username"
                  :disabled="item.isEnabled === false" :value="item.username">
                  <span style="float: left">{{ item.username }}</span>
                  <el-divider direction="vertical" />
                  <span v-if="item.isPrivileged" style="float: right;color: red;font-size: 13px;"><el-tag type="danger"
                      size="small">特权账号</el-tag></span>
                  <span v-else style="float: right; color: blue; font-size: 13px;"><el-tag type="success"
                      size="small">普通账号</el-tag></span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="主机状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.enabled" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="latestTime" width="180" label="上次登录" align="center" />
          <el-table-column prop="updatedUser" width="180" label="修改用户" align="center" />
          <el-table-column prop="updatedTime" width="180" label="修改时间" align="center" />
          <el-table-column prop="createdUser" width="180" label="创建用户" align="center" />
          <el-table-column prop="createdTime" width="180" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="250" align="center" flex="right">
            <template #default="scope">
              <el-button type="success" text bg size="small" @click="sshTerminal(scope.row)">SSH</el-button>
              <el-button type="primary" text bg size="small" @click="sftpTerminal(scope.row)">SFtp</el-button>
              <el-button type="warning" text bg size="small" :icon="Edit" @click="handleUpdate(scope.row)" />
              <el-button type="danger" text bg size="small" :icon="Delete" @click="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination background :layout="paginationData.layout" :page-sizes="paginationData.pageSizes"
          :total="paginationData.total" :page-size="paginationData.pageSize" :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 新增/修改 -->
    <!-- <el-dialog v-model="dialogVisible" :title="formData.id === undefined ? '新增用户' : '修改用户'" @closed="resetForm"
      width="30%">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="formData.id === undefined">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
 -->
    <sftp-dialog ref="terminalDialogRef" :visibleMinimize="true">
      <template #headerTitle="{ terminalInfo }">
        {{ `${(terminalInfo.terminalId + '').slice(-2)}` }}
        <el-divider direction="vertical" />
        {{ `${terminalInfo.meta.selectAuthCert.username}@${terminalInfo.meta.ip}:${terminalInfo.meta.port}` }}
        <el-divider direction="vertical" />
        {{ terminalInfo.meta.name }}
      </template>
    </sftp-dialog>
    <ssh-dialog />
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
