
interface defaultResType<T> {
    code: number,
    data: T,
    msg?: string,
    traceId: string
}

interface categoryItemType {
    categoryId: string,
    categoryName: string,
    createTime: string
}
interface imageItemType {
    imageId: number,
    imageName: string,
    imageUrl: string
    createTime: string,
}
interface sensitiveItemType {
    sensitiveId: number,
    sensitiveType: number,
    word: string
    createTime: string,
}
interface tagItemType {
    tagId: string;
    tagName: string;
    createTime: string;
}
interface messageItemType {
    auditType: number,
    createTime: string,
    messageContent: string,
    messageId: number
}
interface articleItemType {
    articleContent: string,
    articleCoverUrl: string,
    articleId: string,
    articleStatus: number,
    articleTitle: string,
    categoryId: string,
    createTime: string,
    rank: number,
    tagIds: string[]
}
interface userItemType {
    avatarUrl: string,
    createTime: string,
    email: string,
    nickname: string,
    phoneNumber: string,
    roleId: string,
    sexEnum: string,
    userId: string,
    username: string
}
interface roleItemType {
    createTime: string,
    menuIds: string[],
    resourceIds: string[],
    roleDesc: string,
    roleId: string,
    roleName: string
}
interface menuItemType {
    component: string,
    createTime: string,
    icon: string,
    menuDesc: string,
    menuId: string,
    menuName: string,
    path: string,
    children: menuItemType[],
}
interface resourceItemType {
    createTime: string,
    resourceDesc: string,
    resourceId: string,
    resourceName: string,
    uri: string
}
interface commentItemType {
    auditType: number,
    commentContent: string,
    commentId: string,
    createTime: string,
    userId: string
}
interface pageType {
    authorUrl: string,
    authorName: string,
    briefIntroduction: string,
    githubUrl: string,
    qqUrl: string,
    homePageUrl: string,
    messagePageUrl: string,
    categoryPageUrl: string,
    tagPageUrl: string,
    aboutMePageUrl: string
}
interface oplogItemType {
    createTime: string,
    operatorContent:string ,
    operatorId:string ,
    operatorStage:string ,
    operatorType: string,
    userId: string,
    username:string
}
interface userInfoByIdType {
    avatarUrl: string,
    userId: string,
    username: string
}
type idRes = defaultResType<{ id: string }>
type idsRes = defaultResType<{ ids: string[] }>
type tagListRes = defaultResType<{ data: tagItemType[], totalPage: number }>
type categoryListRes = defaultResType<{ data: categoryItemType[], totalPage: number }>
type imageListRes = defaultResType<{ data: imageItemType[], totalPage: number }>
type imageUrlRes = defaultResType<string>
type sensitiveListRes = defaultResType<{ data: sensitiveItemType[], totalPage: number }>
type messageListRes = defaultResType<{ data: messageItemType[], totalPage: number }>
type articleListRes = defaultResType<{ data: articleItemType[], totalPage: number }>
type loginRes = defaultResType<string>
type userRes = defaultResType<userItemType>
type booleanRes = defaultResType<boolean>
type userListRes = defaultResType<{ data: userItemType[], totalPage: number }>
type roleListRes = defaultResType<{ data: roleItemType[], totalPage: number }>
type menuListRes = defaultResType<{ data: menuItemType[], totalPage: number }>
type resourceListRes = defaultResType<{ data: resourceItemType[], totalPage: number }>
type getCommentListRes = defaultResType<{ data: commentItemType[], totalPage: number }>
type getPageRes = defaultResType<pageType>
type oplogListRes = defaultResType<{ data: oplogItemType[], totalPage: number }>
type userInfoByIdRes = defaultResType<userInfoByIdType>

