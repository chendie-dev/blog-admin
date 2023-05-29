
import React, { Dispatch, createContext, useContext, useReducer } from 'react'
import MyIcon from "./MyIcon";

interface actionType {
  type: string
}
const MenuItemsContext = createContext<MenuItem[]>([])
const MenuItemsDispatchContext = createContext<Dispatch<actionType>>({} as Dispatch<actionType>)
const MenuItemsProvider: React.FC<propsType> = ({ children }) => {
  const initialMenuItems = [
    getItem('首页', '/charts', <MyIcon type={'icon-shouye-tianchong'} />),
    getItem('文章管理', '2', <MyIcon type="icon-16" />, [
      getItem('发布文章', '/articles'),
      getItem('文章列表', '/article-list'),
      getItem('分类管理', '/categories'),
      getItem('标签管理', '/tags'),
    ]),
    getItem('消息管理', '3', <MyIcon type="icon-xinfengtianchong" />, [
      getItem('评论管理', '/comments'),
      getItem('留言管理', '/messages'),
      getItem('敏感词管理', '/sensitive'),
    ]),
    getItem('用户管理', '4', <MyIcon type="icon-yonghu" />, [
      getItem('用户列表', '/users'),
      getItem('在线用户', '/online/users'),
    ]),
    getItem('权限管理', '5', <MyIcon type="icon-quanxian" />, [
      getItem('角色管理', '/roles'),
      getItem('菜单管理', '/menus'),

    ]),
    getItem('系统管理', '6', <MyIcon type="icon-xitong" />, [
      getItem('网站管理', '/website'),
      getItem('页面管理', '/pages'),
      getItem('关于我', '/about'),
    ]),
    getItem('图片管理', '/images', <MyIcon type="icon-xiangce" />),
    getItem('日志管理', '9', <MyIcon type="icon-rizhi" />, [
      getItem('操作日志', '/operation/log')
    ]),
    getItem('看板界面', '/a', <MyIcon type="icon-icon-person-renwu" />),
  ]
  const [menuItems, dispatch] = useReducer(menuItemsReducer, initialMenuItems)
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  function menuItemsReducer(menuItems: MenuItem[], action: actionType) {
    switch (action.type) {
      case 'addFalse': {
        console.log(12345);

        let newMenuItems = [...menuItems]
        return newMenuItems
      }
    }
    return [...menuItems]
  }
  return (
    <MenuItemsContext.Provider value={menuItems}>
      <MenuItemsDispatchContext.Provider value={dispatch}>
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
