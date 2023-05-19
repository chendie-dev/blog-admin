import React, { useContext, createContext, useReducer, Dispatch } from 'react'
import { getArticleListReq } from '../requests/api';
import { FormatData } from '../hooks/formatData';
interface actionType {
    type: string,
    payload: getArticleListParams
}
interface dataActionType {
    type: string,
    payload: articleListRes
}
const ArticleListContext = createContext<articleListRes>({} as articleListRes);
const ArticleListDispatchContext = createContext<Dispatch<actionType>>({} as Dispatch<actionType>)
const ArticleListDataProvider: React.FC<propsType> = ({ children }) => {
    const [articleListData, dispatch] = useReducer(articleListDataReducer, {
        code: 0,
        data: {
            data: [],
            totalPage: 0
        },
        traceId: ''
    })
    function articleListDataReducer(articleListData: articleListRes, action: dataActionType) {
        switch (action.type) {
            case 'getdata': {
                return { ...action.payload }
            }
            default: return { ...articleListData }
        }
    }
    return (
        < ArticleListContext.Provider value={articleListData}>
            < ArticleListDispatchContext.Provider value={dispatchMiddleware(dispatch)}>
                {children}
            </ ArticleListDispatchContext.Provider>
        </ ArticleListContext.Provider>
    )
}
export default ArticleListDataProvider
export function useArticleListData() {
    return useContext(ArticleListContext)
}
export function useArticleListDataDispatch() {
    return useContext(ArticleListDispatchContext)
}
function dispatchMiddleware(next: Dispatch<dataActionType>) {
    return async (action: actionType) => {
        switch (action.type) {
            case 'getArticleListData': {
                let res = await getArticleListReq({
                    orderByFields: { createTime: action.payload.orderByFields ? action.payload.orderByFields.createTime : false },
                    pageNum: action.payload.pageNum,
                    pageSize: action.payload.pageSize,
                    queryParam: {
                        articleTitle: action.payload.queryParam.articleTitle,
                        categoryId: action.payload.queryParam.categoryId,
                        isDelete: action.payload.queryParam.isDelete,
                        tagIds:action.payload.queryParam.tagIds,
                        articleStatus:action.payload.queryParam.articleStatus
                    }
                })
                res.data.data = res.data.data.map(el => {
                    el.createTime = FormatData(el.createTime)
                    return el
                })
                next({
                    type: 'getdata',
                    payload: res
                })
            }
        }
    }
}