import request from './index'
//添加分类
export const addCategoryReq = (params: { categoryName: string }): Promise<addRes> => request.post('/article/admin/category/add', params)
//添加标签
export const addTagReq = (params: { tagName: string }): Promise<addRes> => request.post('/article/admin/tag/add', params)
//添加文章
export const addArticalReq = (params: articalParams): Promise<addRes> => request.post('/article/admin/articleBody/add', params)
export const getArticleListReq = () => request.post("/article/blog/list")
//获取标签分页
export const getTagListReq = (params: tagListParams): Promise<tagListRes> => request.post('/article/admin/tag/queryByPage', params)
//批量删除标签
export const deleteTagListReq = (params: number[]): Promise<editTagRes> => request.delete('/article/admin/tag/delete', {data:params})
//更新标签名
export const updataTagNameReq=(params:updataTagNameparams):Promise<addRes>=>request.post('/article/admin/tag/update',params)
//恢复标签
export const recoverTagReq=(params:number[]): Promise<editTagRes>=>request.post('/article/admin/tag/recover',params)