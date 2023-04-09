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
            getItem('相册管理', '7',<MyIcon type="icon-xiangce" />, [
                getItem('相册列表', '/albums')
            ]),
            getItem('说说管理', '8', <MyIcon type="icon-xiaoxi-xiaoxi" />, [
                getItem('发布说说', '/talks'),
                getItem('说说列表', '/talk-list')
            ]),
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


