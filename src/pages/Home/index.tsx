import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import KeepAlive from 'react-activation';
import { Layout, Menu, theme, Divider, Breadcrumb, Popover, Avatar } from 'antd';
import { useAppSelector } from '../../hooks/storeHook';
import MyIcon from '../../components/MyIcon';
import './index.scss'
const { Header, Sider } = Layout;

export default function Home() {
    const [collapsed, setCollapsed] = useState(false)
    const { token: { colorBgContainer }, } = theme.useToken();
    const navigateTo = useNavigate()
    const location = useLocation()
    const [openKey, setOpenKey] = useState([''])
    const [firstBreadItem, setBreadItem] = useState<Array<BreadcrumbItem>>([])
    const [selectedKeys, setSelectedKeys] = useState([location.pathname])
    const { MenuItems } = useAppSelector((state) => ({
        MenuItems: state.menuItems.items
    }))
    //展开关闭控制
    useEffect(() => {
        for (let i = 0; i < MenuItems.length; i++) {
            if (MenuItems[i].children && MenuItems[i].children!.find((el: { key: React.Key }) => el.key === location.pathname)) {
                setOpenKey([MenuItems[i].key as string])
            }
        }
    }, [])
    //动态生成一级面包屑
    useEffect(() => {
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
        setSelectedKeys([location.pathname])
    }, [location.pathname])

    return (
        <Layout className='home' >
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: '100vh', overflowY: 'auto', paddingTop: '10px', boxShadow: '0 0 5px' }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKeys}
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
                        collapsed ? <MyIcon className='header__fold-switch' type='icon-s-unfold' onClick={() => setCollapsed(!collapsed)} /> : <MyIcon type='icon-s-fold' className='header__fold-switch' onClick={() => setCollapsed(!collapsed)} />
                    }
                    <span className="header__title">博客管理系统</span>
                    <Popover
                        placement="bottom"
                        content={(
                            <div>
                                <p className='header__exit'><MyIcon type='icon-yonghu' style={{ marginRight: '10px' }} />个人中心</p>
                                <Divider style={{ padding: 0, margin: '5px 0' }} />
                                <p className='header__exit'><MyIcon type='icon-tuichu' style={{ marginRight: '10px' }} />退出登陆</p>
                            </div>
                        )
                        }
                    >
                        <Avatar size={70} src={require('../../images/touxiang.png')} style={{ float: 'right', margin: '2px 40px 2px 0' }} />
                    </Popover>
                    <Divider style={{ padding: 0, margin: 0, width: '!important 100%' }} />
                    <Breadcrumb
                        items={firstBreadItem}
                        style={{ float: 'left', marginLeft: '10px', fontWeight: 'bolder' }} />

                </Header>
                <div
                    style={{
                        margin: ' 24px 16px',
                        padding: 24,
                        // minHeight:'100vh',
                        background: colorBgContainer,
                    }}
                >
                    <KeepAlive>
                        <Outlet />
                    </KeepAlive>
                </div>
            </Layout>
        </Layout>

    )
}
