
interface addArticleParams {
    articleContent?: string,
    articleCoverUrl?: string,
    articleStatus?: number,
    articleTitle?: string,
    categoryId?: string,
    rank?: number,
    tagIds?: string[],
}
interface updateArticleParams {
    articleContent?: string,
    articleCoverUrl?: string,
    articleId: string,
    articleStatus?: number,
    articleTitle?: string,
    categoryId?: string,
    rank?: number,
    tagIds?: string[]
}
interface userInfoParams {
    avatarUrl?: string,
    nickname?: string,
    phoneNumber?: string,
    sex?: string,
    userId: string,
    username?: string
}
interface emailInfoParams {
    captcha: string,
    currentPassword: string,
    email: string,
    userId: string
}
interface defaultListType<T, T1> {
    orderByFields?: T,
    pageNum: number,
    pageSize: number,
    queryParam: T1
}
interface passwordInfoParams {
    currentPassword: string,
    password: string,
    rePassword: string,
    userId: string
}
type getTagListParams = defaultListType<
    {
        createTime?: boolean
    },
    {
        isDelete: boolean,
        tagId?: string | null,
        tagName?: string
    }
>
type getCategoryListParams = defaultListType<
    {
        createTime?: boolean
    },
    {
        isDelete: boolean
        categoryId?: string | null,
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
type getSensitiveListParams = defaultListType<
    { createTime?: boolean },
    {
        isDelete: boolean,
        sensitiveId?: number | null,
        sensitiveType?: number | null,
        word?: string | null
    }
>
type getMessageListParams = defaultListType<
    { createTime?: boolean },
    {
        auditType: number | null,
        messageContent: string | null,
        messageId?: number
    }
>
type getArticleListParams = defaultListType<
    { createTime?: boolean },
    {
        articleContent?: string | null,
        articleId?: string | null,
        articleTitle?: string | null,
        categoryId?: string | null,
        isDelete: boolean,
        tagIds?: string[] | null
        articleStatus?: number | null
    }
>

type getUserListParams = defaultListType<
    { createTime?: boolean },
    {
        email?:string ,
        isDelete: boolean,
        sex?: string,
        userId?:string ,
        username?: string|null
    }
>