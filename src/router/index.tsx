import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import KeepAlive from "react-activation";
import Home from "../pages/Home";
import Login from "../pages/Login"
const Charts = lazy(() => import('../pages/Charts'))
const Articles = lazy(() => import('../pages/Articles'))
const Categories = lazy(() => import('../pages/Categories'))
const Tags = lazy(() => import('../pages/Tags'))
const Images = lazy(() => import('../pages/Images'))
const Messages = lazy(() => import('../pages/Messages'))
const Sensitive = lazy(() => import('../pages/Sensitive'))
const ArticleList = lazy(() => import('../pages/ArticleList'))
const About = lazy(() => import('../pages/About'))
const Setting=lazy(()=>import('../pages/UserInfo'))
const Users=lazy(()=>import('../pages/Users'))
const Role=lazy(()=>import('../pages/Role'))
const Menu=lazy(()=>import('../pages/Menu'))
const Resource=lazy(()=>import('../pages/Resource'))
const Comment=lazy(()=>import('../pages/Comment'))
const withLoading = (com: JSX.Element, name: string) => (
    // <KeepAlive id={name}>
    <React.Suspense>
        {com}
    </React.Suspense>
    // </KeepAlive

)
const routers = [
    // {
    //     path: '/',
    //     element: <Navigate to="/login" />
    // },
    {
        path: '/',
        element: <Home />,
        children: [
            {
                path: '/charts',
                element: withLoading(<Charts />, 'charts')
            },
            {
                path: '/articles/:id',
                element: withLoading(<Articles />, 'articles')
            },
            {
                path: '/articles',
                element: withLoading(<Articles />, 'articles')
            },
            {
                path: '/categories',
                element: withLoading(<Categories />, 'categories')
            },
            {
                path: '/tags',
                element: withLoading(<Tags />, 'tags')
            },
            {
                path: '/images',
                element: withLoading(<Images />, 'images')
            },
            {
                path: '/messages',
                element: withLoading(<Messages />, 'messages')
            },
            {
                path: '/sensitive',
                element: withLoading(<Sensitive />, 'sensitive')
            },
            {
                path: '/article-list',
                element: withLoading(<ArticleList />, 'article-list')
            },
            {
                path: '/about',
                element: withLoading(<About />, 'about')
            },
            {
                path: '/setting',
                element: withLoading(<Setting />, 'setting')
            },
            {
                path: '/users',
                element: withLoading(<Users />, 'users')
            },
            {
                path: '/roles',
                element: withLoading(<Role />, 'roles')
            },
            {
                path: '/menus',
                element: withLoading(<Menu />, 'menus')
            },
            {
                path: '/resources',
                element: withLoading(<Resource />, 'resource')
            },
            {
                path: '/comments',
                element: withLoading(<Comment />, 'comment')
            },
        ]
    },
    {
        path: '/login',
        element: <Login />
    }

]
export default routers