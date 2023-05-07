import React from 'react'
import request from './index'
//添加分类
export const addCategoryReq = (params: { categoryName: string }): Promise<idRes> => request.instance.post('/article/admin/category/add', params)
//添加标签
export const addTagReq = (params: { tagName: string }): Promise<idRes> => request.instance.post('/article/admin/tag/add', params)
//添加文章
export const addArticalReq = (params: articalParams): Promise<idRes> => request.instance.post('/article/admin/articleBody/add', params)
export const getArticleListReq = () => request.instance.post("/article/blog/list")
//获取标签分页
export const getTagListReq = (params: tagListParams): Promise<tagListRes> => request.instance.post('/article/admin/tag/queryByPage', params)
//批量删除标签
export const deleteTagListReq = (params: React.Key[]): Promise<idsRes> => request.instance.delete('/article/admin/tag/delete', {data:params})
//更新标签名
export const updataTagNameReq=(params:updataTagNameparams):Promise<idRes>=>request.instance.post('/article/admin/tag/update',params)
//恢复标签
export const recoverTagReq=(params:React.Key[]): Promise<idsRes>=>request.instance.post('/article/admin/tag/recover',params)
//获取分类分页
export const getCategoryListReq=(params:categoryListReqParams):Promise<categoryListRes>=>request.instance.post('/article/admin/category/queryByPage',params)
//删除分类
export const deleteCategoryReq=(params: React.Key[]):Promise<idsRes>=>request.instance.delete('/article/admin/category/delete',{data:params})
//更新分类名
export const updateCategoryReq=(params:updateCategoryParams):Promise<idRes>=>request.instance.post('/article/admin/category/update',params)
//恢复分类
export const recoverCategoryReq=(params:React.Key[]):Promise<idsRes>=>request.instance.post('/article/admin/category/recover',params)
//添加图片
export const addImageReq=(params:{imageName:string,imageUrl:string}):Promise<idRes>=>request.instance.post('/file/admin/image/add',params)
//删除图片
export const deleteImagesReq=(params:React.Key[]):Promise<idsRes>=>request.instance1.delete('/file/admin/image/delete',{data:params})
//查询图片
export const getImageListReq=(params:imageListParams):Promise<imageListRes>=>request.instance.post('/file/admin/image/queryByPage',params)
//恢复图片
export const recoverImageReq=(params:React.Key[]):Promise<idsRes>=>request.instance1.post('/file/admin/image/recover',params)
//更新图片
export const updateImageReq=(params:{imageId:number,imageName:string}):Promise<idRes>=>request.instance.post('/file/admin/image/update',params)
//上传图片
export const uploadImageReq=(form: any):Promise<imageUrlRes>=>request.instance.post('/file/admin/image/upload', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
