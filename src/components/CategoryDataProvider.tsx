import React, { useContext, createContext, useReducer, Dispatch } from 'react'
import { getCategoryListReq } from '../requests/api';
import { FormatData } from '../hooks/formatData';
interface actionType {
    type: string,
    payload: getCategoryListParams
}
interface dataActionType {
    type: string,
    payload: categoryListRes
}
const CategoryListContext = createContext<categoryListRes>({} as categoryListRes);
const CategoryListDispatchContext = createContext<Dispatch<actionType>>({} as Dispatch<actionType>)
const CategoryDataProvider: React.FC<propsType> = ({ children }) => {
    const [categoryData, dispatch] = useReducer(categoryDataReducer, {
        code: 0,
        data: {
            data: [],
            totalPage: 0
        },
        traceId:''
    })
    function categoryDataReducer(categoryData: categoryListRes, action: dataActionType) {
        switch (action.type) {
            case 'getdata': {
                return { ...action.payload }
            }
            default: return { ...categoryData }
        }
    }
    return (
        <CategoryListContext.Provider value={categoryData}>
            <CategoryListDispatchContext.Provider value={dispatchMiddleware(dispatch)}>
                {children}
            </CategoryListDispatchContext.Provider>
        </CategoryListContext.Provider>
    )
}
export default CategoryDataProvider
export function useCategoryData() {
    return useContext(CategoryListContext)
}
export function useCategoryDataDispatch() {
    return useContext(CategoryListDispatchContext)
}
function dispatchMiddleware(next: Dispatch<dataActionType>) {
    return async (action: actionType) => {
        switch (action.type) {
            case 'getCategorydata': {
                let res = await getCategoryListReq({
                    orderByFields: { createTime: action.payload.orderByFields ? action.payload.orderByFields.createTime : false },
                    pageNum: action.payload.pageNum,
                    pageSize: action.payload.pageSize,
                    queryParam: {
                        categoryName: action.payload.queryParam.categoryName,
                        isDelete: action.payload.queryParam.isDelete
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