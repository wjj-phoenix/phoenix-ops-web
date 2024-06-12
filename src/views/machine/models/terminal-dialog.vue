<script setup lang="ts">
import emitter from '@/utils/emitter';
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus'

let sshTerminalDialog = ref<boolean>(false)

// 绑定事件
emitter.on('openSshTerminalDialog', (dialog: any) => {
  sshTerminalDialog.value = dialog
  // console.log('sshTerminalDialog',dialog)
});

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭终端会话吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <el-dialog v-model="sshTerminalDialog" :show-close="false" width="80%">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <p :id="titleId" :class="titleClass">This is a custom header!</p>
        <!-- <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button> -->
      </div>
    </template>
    This is dialog content.
  </el-dialog>
</template>

<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
