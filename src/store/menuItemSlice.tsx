/*
 * @Author: chendie chendie
 * @Date: 2023-04-09 09:25:14
 * @LastEditors: chendie chendie
 * @LastEditTime: 2023-04-25 15:15:28
 * @FilePath: /blog-admin/src/store/menuItemSlice.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createSlice } from "@reduxjs/toolkit";
import MyIcon from "../components/MyIcon";
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
const menuItemSlice = createSlice({
    name: 'menuItems',
    initialState: {
        items:[
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
            ]),
            getItem('用户管理', '4', <MyIcon type="icon-yonghu" />, [
                getItem('用户列表', '/users'),
                getItem('在线用户', '/online/users'),
            ]),
            getItem('权限管理', '5', <MyIcon type="icon-quanxian" />, [
                getItem('角色管理', '/roles'),
                getItem('接口管理', '/resources'),
                getItem('菜单管理', '/menus'),
        
            ]),
            getItem('系统管理', '6', <MyIcon type="icon-xitong" />, [
                getItem('网站管理', '/website'),
                getItem('页面管理', '/pages'),
                getItem('友链管理', '/links'),
                getItem('关于我', '/about'),
            ]),
            getItem('图片管理', '/images',<MyIcon type="icon-xiangce" />),
            getItem('日志管理', '9', <MyIcon type="icon-rizhi" />, [
                getItem('操作日志', '/operation/log')
            ]),
            getItem('个人中心', '/setting',<MyIcon type="icon-icon-person-renwu" />),
        ],
    },
    reducers: {

    }
})
export default menuItemSlice.reducer


