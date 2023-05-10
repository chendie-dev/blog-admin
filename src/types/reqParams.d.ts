interface addArticalParams {
    articleContent: string,
    articleCoverUrl: string,
    articleStatus: number,
    articleTitle: string,
    categoryId: number,
    rank: number,
    tagIds: number[],
}
interface defaultListType<T, T1> {
    orderByFields?: T,
    pageNum: number,
    pageSize: number,
    queryParam: T1
}
type getTagListParams = defaultListType<
    {
        createTime: boolean
    },
    {
        isDelete: boolean,
        tagId?: number,
        tagName?: string
    }
>
type getCategoryListParams = defaultListType<
    {
        createTime: boolean
    },
    {
        isDelete: boolean
        categoryId?: number,
        categoryName?: string,
    }
>

type getImageListParams = defaultListType<
    { createTime: boolean },
    {
        imageId?: number,
        imageName?: string
    }
>
type getSensitiveList = defaultListType<
    { createTime?: boolean },
    {
        isDelete: boolean,
        sensitiveId?: number|null,
        sensitiveType?: number|null,
        word?: string|null
    }
>
