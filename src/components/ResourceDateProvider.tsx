import React, { Dispatch, createContext, useContext, useReducer } from 'react'
import { getResourceListReq } from '../requests/api'
import { utilFunc } from '../hooks/utilFunc'
interface actionType{
    type:string,
    payload:resourceListParams
}
interface dataType{
    type:string,
    payload:resourceListRes
}
const ResourceItemsContext = createContext<resourceListRes>({} as resourceListRes)
const ResourceItemsDispatch = createContext<Dispatch<actionType>>({} as Dispatch<actionType>)
const ResourceDateProvider: React.FC<propsType> = ({ children }) => {
    const initalResourceItem={
        code: 0,
        data: {
            data: [],
            totalPage: 0
        },
        traceId: ''
    }
    const [resourceItem,dispatch]=useReducer(resourceItemsReducer,initalResourceItem)
    function resourceItemsReducer(resourceItem:resourceListRes,action:dataType){
        switch(action.type){
            case 'getdata':{
                return action.payload
            }
            default:{
                return resourceItem
            }
        }
    }
    return (
        <ResourceItemsContext.Provider value={resourceItem}>
            <ResourceItemsDispatch.Provider value={dispatchMiddleware(dispatch)}>
                {children}
            </ResourceItemsDispatch.Provider>
        </ResourceItemsContext.Provider>
    )
}
export default ResourceDateProvider
export function useResource() {
    return useContext(ResourceItemsContext)
}
export function useResourceDispatch() {
    return useContext(ResourceItemsDispatch)
}
function dispatchMiddleware(next: Dispatch<dataType>) {
    return async (action:actionType) => {
        switch (action.type) {
            case 'getresourcedata': {
                let res = await getResourceListReq({
                    orderByFields: { createTime:action.payload.orderByFields?.createTime},
                    pageNum:action.payload.pageNum,
                    pageSize:action.payload.pageSize,
                    queryParam: {
                        isDelete:action.payload.queryParam.isDelete,
                        resourceName:action.payload.queryParam.resourceName
                    }
                })
                res.data.data.forEach(el=>{
                    el.createTime=utilFunc.FormatData(el.createTime)
                })
                next({
                    type: 'getdata',
                    payload: res
                })
            }
        }
    }
}