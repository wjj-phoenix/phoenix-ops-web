import { request } from "@/utils/service"
import type * as Table from "./types/machine"

/** 增 */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return request({
    url: "table",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request({
    url: `table/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return request({
    url: "table",
    method: "put",
    data
  })
}

/** 查 */
export function featchedMachineApi(params: Table.MachineRequestData) {
  return request<Table.MachineResponseData>({
    baseURL: "http://localhost:19999/api/devops",
    url: "/machine/pages",
    method: "get",
    params
  })
}
