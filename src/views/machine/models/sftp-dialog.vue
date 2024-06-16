<script lang="ts" setup>
import { reactive, ref } from 'vue'
import emitter from '@/utils/emitter';

const formLabelWidth = '140px'

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

let sftpTerminalDialog = ref<boolean>(false)

// 绑定事件
emitter.on('openSftpTerminalDialog', (dialog: any) => {
  console.log('openSftpTerminalDialog',dialog)
  sftpTerminalDialog.value = dialog
});
</script>

<template>
  <el-dialog v-model="sftpTerminalDialog" title="Shipping address" width="500">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
