
import React, { Dispatch, createContext, useContext, useReducer } from 'react'
import { getMenuListReq } from '../requests/api';

interface actionType {
  type: string,
  payload: getmenuListParams
}
interface dataActionType {
  type: string,
  payload: menuItemType[]
}
const MenuItemsContext = createContext<menuItemType[]>([] as menuItemType[])
const MenuItemsDispatchContext = createContext<Dispatch<actionType>>({} as Dispatch<actionType>)
const MenuItemsProvider: React.FC<propsType> = ({ children }) => {
  const initialMenuItems = [
    {
      component: '',
      createTime: '',
      icon: '',
      menuDesc: '',
      menuId: '',
      menuName: '',
      path: '',
      children:[]
    }
  ]
  const [menuItems, dispatch] = useReducer(menuItemsReducer, initialMenuItems)
  function menuItemsReducer(menuItems: menuItemType[], action: dataActionType) {
    switch (action.type) {
      case 'getdata': {
        return [...action.payload]
      }
    }
    return [...menuItems]
  }
  return (
    <MenuItemsContext.Provider value={menuItems}>
      <MenuItemsDispatchContext.Provider value={dispatchMiddleware(dispatch)}>
        {children}
      </MenuItemsDispatchContext.Provider>
    </MenuItemsContext.Provider>
  )
}
export default MenuItemsProvider
export function useMenuItems() {
  return useContext(MenuItemsContext)
}
export function useMenuItemsDispatch() {
  return useContext(MenuItemsDispatchContext)
}
function dispatchMiddleware(next: Dispatch<dataActionType>) {
  return async (action: actionType) => {
    switch (action.type) {
      case 'getmenu': {
        let res = await getMenuListReq({
          orderByFields: { createTime: action.payload.orderByFields?.createTime },
          pageNum: action.payload.pageNum,
          pageSize: action.payload.pageSize,
          queryParam: {
            menuName: action.payload.queryParam.menuName,
            isDelete: action.payload.queryParam.isDelete
          }
        })
        next({
          type: 'getdata',
          payload: res.data.data
        })
      }

    }
  }
}
