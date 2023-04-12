import request from './index'

export const addCategoryReq=(params:{categoryName:string}):Promise<addRes>=>request.post('/article/admin/add/category',params)
export const addTagReq=(params:{tagName:string}):Promise<addRes>=>request.post('/article/admin/add/tag',params)
export const addArticalReq=(params:articalParams):Promise<addRes>=>request.post('/article/admin/add/articleBody',params)