import React from 'react'
import request from './index'
//添加分类
export const addCategoryReq = (params: { categoryName: string }): Promise<idRes> => request.instance.post('/article/admin/category/add', params)
//添加标签
export const addTagReq = (params: { tagName: string }): Promise<idRes> => request.instance.post('/article/admin/tag/add', params)
//获取标签分页
export const getTagListReq = (params: getTagListParams): Promise<tagListRes> => request.instance.post('/article/admin/tag/queryByPage', params)
//批量删除标签
export const deleteTagListReq = (params: React.Key[]): Promise<idsRes> => request.instance.delete('/article/admin/tag/delete', { data: params })
//更新标签名
export const updataTagNameReq = (params: { tagId: string, tagName: string }): Promise<idRes> => request.instance.post('/article/admin/tag/update', params)
//恢复标签
export const recoverTagReq = (params: React.Key[]): Promise<idsRes> => request.instance.post('/article/admin/tag/recover', params)
//获取分类分页
export const getCategoryListReq = (params: getCategoryListParams): Promise<categoryListRes> => request.instance.post('/article/admin/category/queryByPage', params)
//删除分类
export const deleteCategoryReq = (params: React.Key[]): Promise<idsRes> => request.instance.delete('/article/admin/category/delete', { data: params })
//更新分类名
export const updateCategoryReq = (params: { categoryId: string, categoryName: string }): Promise<idRes> => request.instance.post('/article/admin/category/update', params)
//恢复分类
export const recoverCategoryReq = (params: React.Key[]): Promise<idsRes> => request.instance.post('/article/admin/category/recover', params)
//添加图片
export const addImageReq = (params: { imageName: string, imageUrl: string }): Promise<idRes> => request.instance.post('/file/admin/image/add', params)
//删除图片
export const deleteImagesReq = (params: React.Key[]): Promise<idsRes> => request.instance.delete('/file/admin/image/delete', { data: params })
//查询图片
export const getImageListReq = (params: getImageListParams): Promise<imageListRes> => request.instance.post('/file/admin/image/queryByPage', params)
//恢复图片
export const recoverImageReq = (params: React.Key[]): Promise<idsRes> => request.instance.post('/file/admin/image/recover', params)
//更新图片
export const updateImageReq = (params: { imageId: number, imageName: string }): Promise<idRes> => request.instance.post('/file/admin/image/update', params)
//上传图片
export const uploadImageReq = (form: any): Promise<imageUrlRes> => request.instance.post('/file/admin/image/upload', form, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
//添加敏感词
export const addSensitiveReq = (params: { sensitiveType: number, word: string }): Promise<idRes> => request.instance.post('/sms/admin/sensitive/add', params)
//删除敏感词
export const deleteSensitiveReq = (params: React.Key[]): Promise<idsRes> => request.instance.delete('/sms/admin/sensitive/delete', { data: params })
//恢复敏感词
export const recoverSensitiveReq = (params: React.Key[]): Promise<idsRes> => request.instance.post('/sms/admin/sensitive/recover', params)
//更新敏感词
export const updateSensitveReq = (params: { sensitiveId: number, sensitiveType?: number, word?: string }): Promise<idRes> => request.instance.post('/sms/admin/sensitive/update', params)
//查询敏感词
export const getSensitiveListReq = (params: getSensitiveListParams): Promise<sensitiveListRes> => request.instance.post('/sms/admin/sensitive/queryByPage', params)
//更新留言
export const updateMessageReq = (params: { auditType: number, messageId: number }): Promise<idsRes> => request.instance.post('/sms/admin/message/update', params)
//获取留言
export const getMessageReq = (params: getMessageListParams): Promise<messageListRes> => request.instance.post('/sms/admin/message/queryByPage', params)
//添加文章
export const addArticleReq = (params: addArticleParams): Promise<idRes> => request.instance.post('/article/admin/body/add', params)
//删除文章
export const deleteArticleReq = (params: React.Key[]): Promise<idsRes> => request.instance.delete('/article/admin/body/delete', { data: params })
//更新文章
export const updateArticleReq = (params: updateArticleParams): Promise<idRes> => request.instance.post('/article/admin/body/update', params)
//获取文章
export const getArticleListReq = (params: getArticleListParams): Promise<articleListRes> => request.instance.post('/article/admin/body/queryByPage', params)
//恢复文章
export const recoverArticleReq = (params: React.Key[]): Promise<idsRes> => request.instance.post('/article/admin/body/recover', params)
//登陆
export const loginReq = (params: { username: string, password: string }): Promise<loginRes> => request.instance.post('/auth/login', params)
//登出
export const logoutReq = () => request.instance('/auth/logout')
//获取用户信息
export const getUserReq = (): Promise<userRes> => request.instance.post('/auth/getUserInfo')
//获取验证码
export const getCaptchaReq = (params: { mail: string }) => request.instance.post('/sms/captcha/send', params)
//更新用户信息
export const updateUserInfoReq = (params: userInfoParams): Promise<idRes> => request.instance.post('/auth/updateUserInfo', params)
//更新邮箱
export const updateEmailReq=(params:emailInfoParams): Promise<idRes> => request.instance.post('/auth/updateEmail',params)
//更新密码
export const updatePasswordReq=(params:passwordInfoParams): Promise<idRes> => request.instance.post('/auth/updatePassword',params)
//判断邮箱是否合法
export const checkEmailReq=(email:string):Promise<booleanRes>=>request.instance.get(`/auth/checkEmail?email=${email}`)
//判断用户名是否合法
export const checkUsernameReq=(username:string):Promise<booleanRes>=>request.instance.get(`/auth/checkUsername?username=${username}`)
//获取用户列表信息
export const getUserListReq=(params:getUserListParams):Promise<userListRes>=>request.instance.post('/auth/admin/getUserInfoList',params)
//删除用户
export const deleteUserReq=(params: React.Key[]):Promise<idsRes>=>request.instance.delete('/auth/admin/deleteUser',{data:params})
//恢复用户
export const recoverUserReq=(params:React.Key[]):Promise<idsRes>=>request.instance.post('/auth/admin/recoverUser',params)
//更新用户角色
export const updateUserRoleReq=(params:{roleId:string,userId: string}):Promise<idRes>=>request.instance.post('/auth/admin/updateUserRole',params)
//添加角色
export const addRoleReq=(params:addRoleParams):Promise<idRes>=>request.instance.post('/auth/admin/role/add',params)
//删除角色
export const deleteRoleReq=(params:React.Key[]):Promise<idsRes>=>request.instance.delete('/auth/admin/role/delete',{data:params})
//修改角色
export const updateRoleReq=(params:updateRoleParams):Promise<idsRes>=>request.instance.post('/auth/admin/role/update',params)
//恢复角色
export const recoverRoleReq=(params:React.Key[]):Promise<idsRes>=>request.instance.post('/auth/admin/role/recover',params)
//查询角色
export const getRoleListReq=(params:getRoleListParams):Promise<roleListRes>=>request.instance.post('/auth/admin/role/queryByPage',params)
//添加菜单
export const addMenuReq=(params:addMenuParams):Promise<idRes>=>request.instance.post('/auth/admin/menu/add',params)
//删除菜单
export const deleteMenuReq=(params:React.Key[]):Promise<idsRes>=>request.instance.delete('/auth/admin/menu/delete',{data:params})
//查询菜单
export const getMenuListReq=(params:getmenuListParams):Promise<menuListRes>=>request.instance.post('/auth/admin/menu/queryByPage',params)
//恢复菜单
export const recoverMenuReq=(params:React.Key[]):Promise<idsRes>=>request.instance.post('/auth/admin/menu/recover',params)
//修改菜单
export const updateMenuReq=(params:updateMenuParams):Promise<idRes>=>request.instance.post('/auth/admin/menu/update',params)
//资源添加
export const addResourceReq=(params:addResourceParams):Promise<idRes>=>request.instance.post('/auth/admin/resource/add',params)
//资源删除
export const deleteResourceReq=(params:React.Key[]):Promise<idsRes>=>request.instance.delete('/auth/admin/resource/delete',{data:params})
//查询资源
export const getResourceListReq=(params:resourceListParams):Promise<resourceListRes>=>request.instance.post('/auth/admin/resource/queryByPage',params)
//恢复资源
export const recoverResourceReq=(params:React.Key[]):Promise<idsRes>=>request.instance.post('/auth/admin/resource/recover',params)
//资源更新
export const updateResourceReq=(params:updateResourceParams):Promise<idRes>=>request.instance.post('/auth/admin/resource/update',params)
//审核评论
export const auditCommentReq=(params:{auditType:number ,commentId:string }):Promise<idRes>=>request.instance.post('/sms/admin/comment/audit',params)
//查询评论
export const getCommentListReq=(params:getCommentListParams):Promise<getCommentListRes>=>request.instance.post('/sms/admin/comment/queryByPage',params)
//关于我
export const addAboutReq=(params:{aboutMe:string}):Promise<idRes>=>request.instance.post('/website/admin/aboutMe/add',params)
//获取关于我
export const getAboutMeReq=():Promise<loginRes>=>request.instance.post('/website/admin/aboutMe/query')
//获取页面
export const getPagesReq=():Promise<getPageRes>=>request.instance.post('/website/admin/page/query')
//更新页面
export const addPagesReq=(params:pageType):Promise<idsRes>=>request.instance.post('/website/admin/page/add',params)
//查询操作日志
export const getOplogListReq=(params:oplogListParams):Promise<oplogListRes>=>request.instance.post('/website/admin/oplog/queryByPage',params)
export const getUserInfoByIdReq=(userId:string):Promise<userInfoByIdRes>=>request.instance.get(`/auth/user/getUserInfo/${userId}`)

