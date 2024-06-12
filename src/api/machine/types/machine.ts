export interface CreateOrUpdateTableRequestData {
  name: string
  ip: string
  port: number
  operatingSystem: string
  isVirtual: boolean
  remark: string
  createdUser: string
  createdTime: string
  hostUsers: string[]
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
  name: string
  ip: string
  port: number
  operatingSystem: string
  isVirtual: boolean
  remark: string
  createdUser: string
  createdTime: string
  hostUsers: string[]
}

export type MachineResponseData = ApiResponseData<{
  rows: Machine[]
  total: number
  limit: number
  page: number
  pages: number
}>
