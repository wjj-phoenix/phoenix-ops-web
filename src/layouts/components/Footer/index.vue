<script lang="ts" setup>
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <footer class="layout-footer">
    <p>
      MIT © 2024-PRESENT
      <a href="https://github.com/wjj-phoenix" target="_blank">{{ VITE_APP_TITLE }}</a>
    </p>
    </footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder);
}
</style>
