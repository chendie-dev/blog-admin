import request from './index'
export const getAdminListReq=(params:{page:number})=>request.get(`/admin/list?page=${params.page}`)