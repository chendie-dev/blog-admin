interface idRes {
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
interface tagListType {
    tagId: string;
    tagName: string;
    createTime: string;
}
interface tagListRes {
    code: number,
    data: { data: tagListType[], totalNumber: number },
    msg: string
}
interface idsRes {
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
interface categoryItemType {
    categoryId: number,
    categoryName: string,
    createTime: string
}
interface categoryListReqParams {
    orderByFields?: { createTime: boolean },
    pageNum: number,
    pageSize: number,
    queryParam: {
        categoryId?: number,
        categoryName?: string,
        isDelete: boolean
    }
}
interface categoryListRes {
    code: number,
    data: {
        data: categoryItemType[],
        totalNumber: number
    },
    msg: string
}
interface updateCategoryParams {
    categoryId: number,
    categoryName: string
}
