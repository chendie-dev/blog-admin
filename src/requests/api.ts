import { promises } from 'dns'
import request from './index'
import React from 'react'
//添加分类
export const addCategoryReq = (params: { categoryName: string }): Promise<idRes> => request.post('/article/admin/category/add', params)
//添加标签
export const addTagReq = (params: { tagName: string }): Promise<idRes> => request.post('/article/admin/tag/add', params)
//添加文章
export const addArticalReq = (params: articalParams): Promise<idRes> => request.post('/article/admin/articleBody/add', params)
export const getArticleListReq = () => request.post("/article/blog/list")
//获取标签分页
export const getTagListReq = (params: tagListParams): Promise<tagListRes> => request.post('/article/admin/tag/queryByPage', params)
//批量删除标签
export const deleteTagListReq = (params: React.Key[]): Promise<idsRes> => request.delete('/article/admin/tag/delete', {data:params})
//更新标签名
export const updataTagNameReq=(params:updataTagNameparams):Promise<idRes>=>request.post('/article/admin/tag/update',params)
//恢复标签
export const recoverTagReq=(params:React.Key[]): Promise<idsRes>=>request.post('/article/admin/tag/recover',params)
//获取分类分页
export const getCategoryListReq=(params:categoryListReqParams):Promise<categoryListRes>=>request.post('/article/admin/category/queryByPage',params)
//删除分类
export const deleteCategoryReq=(params: React.Key[]):Promise<idsRes>=>request.delete('/article/admin/category/delete',{data:params})
//更新分类名
export const updateCategoryReq=(params:updateCategoryParams):Promise<idRes>=>request.post('/article/admin/category/update',params)
//恢复分类
export const recoverCategoryReq=(params:React.Key[]):Promise<idsRes>=>request.post('/article/admin/category/recover',params)


