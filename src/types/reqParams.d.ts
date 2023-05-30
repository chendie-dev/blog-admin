
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
interface addRoleParams {
    menuIds?: React.Key[]|null,
    resourceIds?: string[]|null,
    roleDesc?: string|null,
    roleName: string,
}
interface addMenuParams {
    component: string,
    icon: string,
    menuDesc: string,
    menuName: string,
    parentId?: string,
    path: string
}
interface updateRoleParams extends addRoleParams {
    roleId: string
}
interface updateMenuParams {
    menuId: string,
    component: string,
    icon: string,
    menuDesc: string,
    menuName: string,
    path: string
}
interface addResourceParams {
    resourceDesc: string,
    resourceName: string,
    uri: string
}
interface updateResourceParams extends addResourceParams {
    resourceId: string,
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
        imageName?: string,
        isDelete: boolean
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
        email?: string,
        isDelete: boolean,
        sex?: string,
        userId?: string,
        username?: string | null
    }
>

type getRoleListParams = defaultListType<
    { createTime?: boolean },
    {
        isDelete: boolean,
        menuIds?: React.Key[] | null,
        resourceIds?: string[],
        roleId?: string | null,
        roleName?: string | null
    }
>
type getmenuListParams = defaultListType<
    { createTime?: boolean },
    {
        component?: string | null,
        isDelete: boolean,
        menuId?: string | null,
        menuIds?:string[]|null,
        menuName?: string | null,
        path?: string | null,
        icon?: string | null
    }
>
type resourceListParams = defaultListType<
    { createTime?: boolean },
    {
        isDelete: boolean,
        resourceId?: string|null,
        resourceName?: string|null,
        uri?: string|null
    }
>