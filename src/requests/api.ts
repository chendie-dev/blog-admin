import request from './index'
//添加分类
export const addCategoryReq=(params:{categoryName:string}):Promise<addRes>=>request.post('/article/admin/category/add',params)
//添加标签
export const addTagReq=(params:{tagName:string}):Promise<addRes>=>request.post('/article/admin/tag/add',params)
//添加文章
export const addArticalReq=(params:articalParams):Promise<addRes>=>request.post('/article/admin/articleBody/add',params)
export const getArticleListReq=()=>request.post("/article/blog/list")
//获取标签分页
export const getTagList=(params:tagListParams):Promise<tagListRes>=>request.post('/article/admin/tag/queryByPage',params)
