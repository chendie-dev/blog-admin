import request from './index'
export const CategoryReq=(parentId:string)=>request.get(`/manage/category/list?parentId=${parentId}`)

export const addCategory=(params:{categoryName:string})=>request.post('/article/admin/add/category',params)