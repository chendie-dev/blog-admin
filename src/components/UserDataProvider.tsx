import React, { Dispatch, createContext, useContext, useReducer } from 'react'
import { getUserReq } from '../requests/api'
import { utilFunc } from '../hooks/utilFunc'
const UserContext = createContext<userItemType>({} as userItemType)
const UserDispatchContext = createContext<Dispatch<string>>({} as Dispatch<string>)
interface dataType {
    type: string,
    payload: userItemType
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
        username: ""
    })
    function userReducer(userData: userItemType, action: dataType) {
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
                next({
                    type: 'getdata',
                    payload: res.data
                })
            }
        }
    }
}
