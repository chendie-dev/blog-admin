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
    tagIds: number[],
}
interface tagListParams {
    orderByFields?: { createTime: boolean },
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
    data: { data: { createTime: string, tagId: string, tagName: string }[], totalNumber: number },
    msg: string
}
interface tagListType {
    tagId: string;
    tagName: string;
    createTime: string;
}
interface editTagRes {
    code: number,
    data: {
        ids: string[]
    },
    msg: string
}
interface updataTagNameparams {
    tagId: string,
    tagName: string,
}