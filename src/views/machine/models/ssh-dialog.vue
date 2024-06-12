<script setup lang="ts">
import emitter from '@/utils/emitter';
import { ref, reactive, toRefs } from 'vue';
import { ElMessageBox } from 'element-plus'

let sshTerminalDialog = ref<boolean>(false)

// 绑定事件
emitter.on('openSshTerminalDialog', (dialog: any) => {
  console.log('openSshTerminalDialog', dialog)
  sshTerminalDialog.value = dialog
});

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭当前终端会话吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

/**
terminal对象信息:

visible: false,
machineId: null as any,
terminalId: null as any,
machine: {} as any,
fullscreen: false,
 */
const state = reactive({
    terminals: {} as any, // key -> terminalId  value -> terminal
    minimizeTerminals: {} as any, // key -> terminalId  value -> 简易terminal
});

const { terminals, minimizeTerminals } = toRefs(state);

const openTerminalRefs: any = {};

enum TerminalStatus {
    Error = -1,
    NoConnected = 0,
    Connected = 1,
    Disconnected = 2,
}

// 打开终端
function open(terminalInfo: any, cmd: string = '') {
    console.log('in terminal dialog open...',);
    let terminalId = terminalInfo.terminalId;
    if (!terminalId) {
        terminalId = Date.now();
    }
    state.terminals[terminalId] = {
        ...terminalInfo,
        terminalId,
        visible: true,
        cmd,
        status: TerminalStatus.NoConnected,
    };
}

// 关闭终端
function close(terminalId: any) {
    console.log('in terminal dialog close');
    delete state.terminals[terminalId];

    // 关闭终端，并删除终端ref
    const terminalRef = openTerminalRefs[terminalId];
    terminalRef && terminalRef.close();
    delete openTerminalRefs[terminalId];

    // emit('close', terminalId);
}
</script>

<template>
  <div class="terminal-dialog-container" v-for="openTerminal of terminals" :key="openTerminal.terminalId">
    <el-dialog title="SSH终端" v-model="openTerminal.visible" top="32px" class="terminal-dialog" width="75%" :close-on-click-modal="false" :modal="true" :show-close="false">
    <template #header>
      <div class="terminal-title-wrapper">
        <!-- 左侧 -->
        <div class="title-left-fixed">
          <!-- title信息 -->
          <div>
            <slot name="headerTitle" :terminalInfo="openTerminal">
              {{ openTerminal.headerTitle }}
            </slot>
          </div>
        </div>

        <!-- 右侧 -->
        <div class="title-right-fixed">
          <!-- <el-popconfirm @confirm="reConnect(openTerminal.terminalId)" title="确认重新连接?">
            <template #reference>
              <div class="mr15 pointer">
                <el-tag v-if="openTerminal.status == TerminalStatus.Connected" type="success" effect="light" round> 已连接</el-tag>
                <el-tag v-else type="danger" effect="light" round> 未连接 </el-tag>
              </div>
            </template>
          </el-popconfirm> -->

          <!-- <el-popover placement="bottom" :width="200" trigger="hover">
            <template #reference>
              <SvgIcon name="QuestionFilled" :size="20" class="pointer-icon mr10" />
            </template>
            <div>ctrl | command + f (搜索)</div>
            <div class="mt5">点击连接状态可重连</div>
          </el-popover> -->

          <!-- <SvgIcon name="ArrowDown" v-if="props.visibleMinimize" @click="minimize(openTerminal.terminalId)" :size="20" class="pointer-icon mr10" title="最小化" /> -->

          <!-- <SvgIcon name="FullScreen" @click="handlerFullScreen(openTerminal)" :size="20" class="pointer-icon mr10" title="全屏|退出全屏" /> -->

          <SvgIcon name="Close" class="pointer-icon" @click="close(openTerminal.terminalId)" title="关闭" :size="20" />
        </div>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.terminal-dialog-container {
    .el-dialog__header {
        padding: 10px;
    }

    .el-dialog {
        padding: 1px 1px;
    }

    // 取消body最大高度，否则全屏有问题
    .el-dialog__body {
        max-height: 100% !important;
        overflow: hidden !important;
    }

    .el-overlay .el-overlay-dialog .el-dialog .el-dialog__body {
        padding: 0px !important;
    }

    .terminal-title-wrapper {
        display: flex;
        justify-content: space-between;
        font-size: 16px;

        .title-right-fixed {
            display: flex;
            align-items: center;
            font-size: 20px;
            text-align: end;
        }
    }
}

.terminal-minimize-container {
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 10;
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-end;

    .terminal-minimize-item {
        min-width: 120px;
        // box-shadow: 0 3px 4px #dee2e6;
        border-radius: 4px;
        margin: 1px 1px;
    }

    .terminal-status-error {
        box-shadow: 0 3px 4px var(--el-color-danger);
        border-color: var(--el-color-danger);
    }

    .terminal-status-no-connect {
        box-shadow: 0 3px 4px var(--el-color-warning);
        border-color: var(--el-color-warning);
    }

    .terminal-status-success {
        box-shadow: 0 3px 4px var(--el-color-success);
        border-color: var(--el-color-success);
    }

    .el-card__body {
        padding: 15px !important;
    }
}
</style>
