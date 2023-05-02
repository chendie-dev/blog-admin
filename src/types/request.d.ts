/*
 * @Author: chendie chendie
 * @Date: 2023-04-11 17:27:22
 * @LastEditors: chendie chendie
 * @LastEditTime: 2023-05-02 19:29:34
 * @FilePath: /blog-admin/src/types/request.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
interface imageItemType {
    createTime: string,
    imageId: number,
    imageName: string,
    imageUrl: string
}
interface imageListRes {
    code: number,
    data: {
        data: imageItemType[],
        totalNumber: number
    },
    msg: string
}
interface imageListParams {
    orderByFields?: { createTime: boolean },
    pageNum: number,
    pageSize: number,
    queryParam: {
        isDelete: boolean,
        imageId?: number,
        imageName?: string
    }
}
interface imageUrlRes{
    code:number,
    data:string,
    msg:string
}