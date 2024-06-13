// 获取临时缓存
export function getSession(key: string) {
  let val: any = window.sessionStorage.getItem(key)
  try {
    return JSON.parse(val)
  } catch (e) {
    return val
  }
}

const ClientIdKey = "m-clientId"

/**
 *
 * @returns uuid
 */
export function randomUuid() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
}

// 2. sessionStorage
// 设置临时缓存
export function setSession(key: string, val: any) {
    if (typeof val == 'object') {
        val = JSON.stringify(val);
    }
    window.sessionStorage.setItem(key, val);
}

// 获取客户端UUID
export function getClientId(): string {
  let uuid = getSession(ClientIdKey)
  if (uuid == null) {
    uuid = randomUuid()
    setSession(ClientIdKey, uuid)
  }
  return uuid
}

// 获取永久缓存
export function getLocal(key: string) {
  let val: any = window.localStorage.getItem(key)
  try {
    return JSON.parse(val)
  } catch (e) {
    return val
  }
}

const TokenKey = "m-token"

// 获取请求token
export function getToken(): string {
  return getLocal(TokenKey)
}

// 组装客户端参数，包括 token 和 clientId
export function joinClientParams(): string {
  return `token=${getToken()}&clientId=${getClientId()}`
}

export function getMachineTerminalSocketUrl(authCertName: any) {
  return `ws://localhost:19999/machines/terminal/${authCertName}?${joinClientParams()}`
}
