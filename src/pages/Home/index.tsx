import React, { useEffect, useState } from 'react'
import { Layout, Menu, theme, Divider, Breadcrumb, Popover, Avatar } from 'antd';
import { useAppSelector } from '../../hooks/storeHook';
import MyIcon from '../../components/MyIcon';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './index.scss'
import touxiangImg from '../../images/touxiang.png'
import { getArticalList } from '../../requests/api';
const { Header, Sider } = Layout;
const content = (
    <div>
        <p className='h-exit'><MyIcon type='icon-yonghu' style={{ marginRight: '10px' }} />个人中心</p>
        <Divider style={{ padding: 0, margin: '5px 0' }} />
        <p className='h-exit'><MyIcon type='icon-tuichu' style={{ marginRight: '10px' }} />退出登陆</p>
    </div>
);

export default function Home() {
    const [collapsed, setCollapsed] = useState(false)
    const { token: { colorBgContainer }, } = theme.useToken();
    const navigateTo = useNavigate()
    const location = useLocation()
    const [openKey, setOpenKey] = useState([''])
    const [firstBreadItem, setBreadItem] = useState<Array<BreadcrumbItem>>([])
    const { MenuItems } = useAppSelector((state) => ({
        MenuItems: state.menuItems.items
    }))
    useEffect(() => {
        for (let i = 0; i < MenuItems.length; i++) {
            if (MenuItems[i].children && MenuItems[i].children!.find((el: { key: React.Key }) => el.key === location.pathname)) {
                setOpenKey([MenuItems[i].key as string])
            }
        }
    }, [])
    //动态生成一级面包屑
    useEffect(() => {
        test()
        MenuItems.forEach((el) => {
            if (el.key === location.pathname) {
                if (location.pathname === '/charts') {
                    setBreadItem([
                        {
                            title: <a onClick={() => navigateTo("" + el.key)}>{el.label}</a>,
                        }])
                } else {
                    setBreadItem([{
                        title: <a onClick={() => navigateTo("/charts")}>首页</a>,
                    },
                    {
                        title: <a onClick={() => navigateTo("" + el.key)}>{el.label}</a>,
                    }])
                }
            } else if (el.children && el.children.find(element => element.key === location.pathname)) {
                let menuItems: MenuItems[] = []
                el.children.forEach(el2 => {
                    menuItems.push({
                        key: el.key as string,
                        label: (
                            <a onClick={() => navigateTo("" + el2.key)} >
                                {el2.label}
                            </a>
                        ),
                    })
                })
                setBreadItem([
                    {
                        title: <a onClick={() => navigateTo("/charts")}>首页</a>,
                    },
                    {
                        title: el.label + '',
                        menu: { items: menuItems }
                    },
                    {
                        title: el.children.find(element => element.key === location.pathname)?.label + '',
                    }
                ])
            }
        })
    }, [location.pathname])
    async function test() {
        let res = await getArticalList();
        console.log(res)
    }
    return (
        <>
            <Layout className='home' >
                <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: '100vh', overflowY: 'auto' }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[location.pathname]}
                        items={MenuItems}
                        onClick={(e: { key: string }) => {
                            navigateTo(e.key)
                        }}
                        onOpenChange={(openKeys: string[]) => {
                            setOpenKey([openKeys[openKeys.length - 1]])
                        }}
                        openKeys={openKey}
                    />
                </Sider>
                <Layout style={{ height: '100vh', overflowY: 'auto' }}>
                    <Header className='header' style={{ paddingInline: 0, background: colorBgContainer, height: '100px' }}>
                        {
                            collapsed ? <MyIcon className='fold-switch' type='icon-s-unfold' onClick={() => setCollapsed(!collapsed)} /> : <MyIcon type='icon-s-fold' className='fold-switch' onClick={() => setCollapsed(!collapsed)} />
                        }
                        <span className="h-title">博客管理系统</span>
                        <Popover placement="bottom" content={content}>
                            <Avatar size={70} src={touxiangImg} style={{ float: 'right', margin: '6px 29px 0 0' }} />
                        </Popover>
                        <Divider style={{ padding: 0, margin: 0, width: '!important 100%' }} />
                        <Breadcrumb
                            items={firstBreadItem}
                            style={{ float: 'left', marginLeft: '10px', fontWeight: 'bolder' }} />
                        
                    </Header>
                    <div
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            // minHeight:'100vh',
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Layout>
            </Layout>
        </>
    )
}
