import React, { Dispatch, createContext, useContext, useReducer } from 'react'
import { getMenuListReq, getRoleListReq, getUserReq } from '../requests/api'
import { utilFunc } from '../hooks/utilFunc'
const UserContext = createContext<userType>({} as userType)
const UserDispatchContext = createContext<Dispatch<string>>({} as Dispatch<string>)
interface dataType {
    type: string,
    payload: userType
}
interface userType extends userItemType{
    menus:menuItemType[]
}
const UserDataProvider: React.FC<propsType> = ({ children }) => {
    const [userData, dispatch] = useReducer(userReducer, {
        avatarUrl: "",
        createTime: "",
        email: "",
        nickname: "",
        phoneNumber: "",
        roleId: "",
        sexEnum: "",
        userId: "",
        username: "",
        menus:[]
    })
    function userReducer(userData: userType, action: dataType) {
        switch (action.type) {
            case 'getdata': {
                return { ...action.payload }
            }
            default: return { ...userData }
        }
    }
    return (
        <UserContext.Provider value={userData}>
            <UserDispatchContext.Provider value={dispatchMiddleware(dispatch)}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    )
}
export default UserDataProvider;
export function useUserDataDispatch(){
    return useContext(UserDispatchContext)
}
export function useUserData(){
    return useContext(UserContext)
}
function dispatchMiddleware(next: Dispatch<dataType>) {
    return async (action: string) => {
        switch (action) {
            case 'getuser': {
                let res = await getUserReq()
                res.data.createTime = utilFunc.FormatData(res.data.createTime)
                let res1=await getRoleListReq({
                    orderByFields:{},
                    pageNum:1,
                    pageSize:1,
                    queryParam:{
                        isDelete:false,
                        roleId:res.data.roleId
                    }
                })
                let res2=await getMenuListReq({
                    orderByFields:{},
                    pageNum:1,
                    pageSize:10,
                    queryParam:{
                        isDelete:false,
                        menuIds:res1.data.data[0].menuIds
                    }
                })
                let userInfo={
                    ...res.data,
                    menus:res2.data.data
                }
                next({
                    type: 'getdata',
                    payload: userInfo
                })
            }
        }
    }
}
