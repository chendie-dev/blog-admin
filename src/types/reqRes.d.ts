
interface defaultResType<T> {
    code: number,
    data: T,
    msg: string
    traceId: string
}
interface categoryItemType {
    categoryId: number,
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
type idRes = defaultResType<{ id: string }>
type idsRes = defaultResType<{ ids: string[] }>
type tagListRes = defaultResType<{ data: tagItemType[], totalPage: number }>
type categoryListRes = defaultResType<{ data: categoryItemType[], totalPage: number }>
type imageListRes = defaultResType<{ data: imageItemType[], totalPage: number }>
type imageUrlRes = defaultResType<string>
type sensitiveListRes = defaultResType<{ data: sensitiveItemType[], totalPage: number }>
type messageListRes = defaultResType<{ data: messageItemType[], totalPage: number }>
