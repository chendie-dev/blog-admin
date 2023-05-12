
interface defaultResType<T> {
    code: number,
    data: T,
    msg: string
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
    articleId:string ,
    articleStatus:number ,
    articleTitle: string,
    categoryId: string,
    createTime: string,
    rank: number,
    tagIds: string[]
}
type idRes = defaultResType<{ id: string }>
type idsRes = defaultResType<{ ids: string[] }>
type tagListRes = defaultResType<{ data: tagItemType[], totalPage: number }>
type categoryListRes = defaultResType<{ data: categoryItemType[], totalPage: number }>
type imageListRes = defaultResType<{ data: imageItemType[], totalPage: number }>
type imageUrlRes = defaultResType<string>
type sensitiveListRes = defaultResType<{ data: sensitiveItemType[], totalPage: number }>
type messageListRes = defaultResType<{ data: messageItemType[], totalPage: number }>
type articleListRes = defaultResType<{data:articleItemType[], totalPage: number }>

