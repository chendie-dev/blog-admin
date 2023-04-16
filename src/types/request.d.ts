interface addRes {
    code: number,
    data: { id: string },
    msg: string
}
interface articalParams {
    articleContent: string,
    articleCoverUrl: string,
    articleStatus: number,
    articleTitle: string,
    categoryId: number,
    rank: number,
    tagIds: Array<number>,
}
interface tagListParams {
    orderByFields?: { createTime:boolean },
    pageNum: number,
    pageSize: number,
    queryParam: {
        isDelete: boolean,
        tagId?: number,
        tagName?: string
    }
}
interface tagListRes {
    code: number,
    data: { data: [{ createTime: string, tagId: string, tagName: string }] },
    totalNumber:number
    msg: string
}