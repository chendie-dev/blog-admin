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