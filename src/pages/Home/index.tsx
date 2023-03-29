import React, { useEffect, useState } from 'react'
import { Layout, Menu, theme, Divider, Breadcrumb, Popover,Avatar } from 'antd';
import { useAppSelector } from '../../hooks/storeHook';
import MyIcon from '../../components/MyIcon';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './index.scss'
import touxiangImg from '../../images/touxiang.png'
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

    return (
        <>
            <Layout  className='home' >
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
                <Layout className="site-layout" style={{ height: '100vh', overflowY: 'auto' }}>
                    <Header style={{ paddingInline: 0, background: colorBgContainer, lineHeight: 0, height: '83px' }}>
                        <div className="l-head">
                            <div className="h-top">
                                {
                                    collapsed ? <MyIcon className='fold-switch' type='icon-s-unfold' onClick={() => setCollapsed(!collapsed)} /> : <MyIcon type='icon-s-fold' className='fold-switch' onClick={() => setCollapsed(!collapsed)} />
                                }
                                <span className="h-title">博客管理系统</span>

                            </div>
                            <Divider style={{ padding: 0, margin: 0 }} />
                            <div className="h-bottom">

                                <Breadcrumb
                                    items={firstBreadItem}
                                    style={{ float: 'left', marginLeft: '10px', fontWeight: 'bolder' }} />
                            </div>
                        </div>
                        <Popover placement="bottom" content={content}>
                            {/* <Button style={{ float: 'right',margin:'20px 37px 0 0' }}>Bottom</Button> */}
                            <Avatar size={70} src={touxiangImg} style={{ float: 'right',margin:'6px 29px 0 0' }}  />
                        </Popover>
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
