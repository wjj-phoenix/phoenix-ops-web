export interface MachineInfo {
  name: string
  ip: string
  port: number
  operatingSystem: string
  isVirtual: boolean
  enabled: boolean
  remark: string
  createdUser: string
  createdTime: string
  latestTime: string
  updatedUser: string
  updatedTime: string
  // resourceAuth: ResourceAuth[]
}

export interface MachineRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  limit: number
  /** 查询参数 */
  condition: string | undefined
}

export interface Machine {
  id: number
  code: string,
  name: string
  ip: string
  port: number
  operatingSystem: string
  isVirtual: boolean
  enabled: boolean
  remark: string
  createdUser: string
  createdTime: string
  latestTime: string
  updatedUser: string
  updatedTime: string
  username: string
  resourceAuths: ResourceAuth[]
}

export interface ResourceAuth {
  id: number
  name: string
  username: string
  password: string
  isPrivileged: boolean
  isEnabled: boolean
  remark: string
  createdUser: string
  createdTime: string
  latestConnTime: string
  effectiveEndTime: string
}

export type MachineResponseData = ApiResponseData<{
  rows: Machine[]
  total: number
  limit: number
  page: number
  pages: number
}>
