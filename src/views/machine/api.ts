import Api from '@/common/Api';

export const machineApi = {
  // 获取权限列表
  list: Api.newGet('/machines'),
  tagList: Api.newGet('/machines/tags'),
  getMachinePwd: Api.newGet('/machines/{id}/pwd'),
  info: Api.newGet('/machines/{id}/sysinfo'),
  stats: Api.newGet('/machines/{id}/stats'),
  process: Api.newGet('/machines/{id}/process'),
  // 终止进程
  killProcess: Api.newDelete('/machines/{id}/process'),
  users: Api.newGet('/machines/{id}/users'),
  groups: Api.newGet('/machines/{id}/groups'),
  testConn: Api.newPost('/machines/test-conn'),
  // 保存按钮
  saveMachine: Api.newPost('/machines'),
  // 调整状态
  changeStatus: Api.newPut('/machines/{id}/{status}'),
  // 删除机器
  del: Api.newDelete('/machines/{id}'),
  scripts: Api.newGet('/machines/{machineId}/scripts'),
  runScript: Api.newGet('/machines/scripts/{scriptId}/{ac}/run'),
  saveScript: Api.newPost('/machines/{machineId}/scripts'),
  deleteScript: Api.newDelete('/machines/{machineId}/scripts/{scriptId}'),
  // 获取配置文件列表
  files: Api.newGet('/machines/{id}/files'),
  lsFile: Api.newGet('/machines/{machineId}/files/{fileId}/read-dir'),
  dirSize: Api.newGet('/machines/{machineId}/files/{fileId}/dir-size'),
  fileStat: Api.newGet('/machines/{machineId}/files/{fileId}/file-stat'),
  rmFile: Api.newPost('/machines/{machineId}/files/{fileId}/remove'),
  cpFile: Api.newPost('/machines/{machineId}/files/{fileId}/cp'),
  renameFile: Api.newPost('/machines/{machineId}/files/{fileId}/rename'),
  mvFile: Api.newPost('/machines/{machineId}/files/{fileId}/mv'),
  // uploadFile: Api.newPost('/machines/{machineId}/files/{fileId}/upload?' + joinClientParams()),
  fileContent: Api.newGet('/machines/{machineId}/files/{fileId}/read'),
  downloadFile: Api.newGet('/machines/{machineId}/files/{fileId}/download'),
  createFile: Api.newPost('/machines/{machineId}/files/{id}/create-file'),
  // 修改文件内容
  updateFileContent: Api.newPost('/machines/{machineId}/files/{id}/write'),
  // 添加文件or目录
  addConf: Api.newPost('/machines/{machineId}/files'),
  // 删除配置的文件or目录
  delConf: Api.newDelete('/machines/{machineId}/files/{id}'),
  // 机器终端操作记录列表
  termOpRecs: Api.newGet('/machines/{machineId}/term-recs'),
  // 机器终端操作记录详情
  termOpRec: Api.newGet('/machines/{id}/term-recs/{recId}'),
};

export function getMachineTerminalSocketUrl(authCertName: any) {
  const params=`username=${authCertName}&machineId=1}`
  return `ws://localhost:19999/api/devops/machines/terminal?${params}`
}

export function getMachineDetailSocketUrl(authCertName: any) {
  const params=`username=${authCertName}&machineId=1}`
  return `ws://localhost:19999/api/devops/machines/detail?${params}`
}
