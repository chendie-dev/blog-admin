import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import KeepAlive from "react-activation";
import Home from "../pages/Home";
const Charts = lazy(() => import('../pages/Charts'))
const Articles = lazy(() => import('../pages/Articals'))
const Categories = lazy(() => import('../pages/Categories'))
const Tags = lazy(() => import('../pages/Tags'))
const Images = lazy(() => import('../pages/Images'))
const Messages = lazy(() => import('../pages/Messages'))
const Sensitive = lazy(() => import('../pages/Sensitive'))
const ArticleList=lazy(()=>import('../pages/ArticleList'))
const withLoading = (com: JSX.Element, name: string) => (
        // <KeepAlive id={name}>
            <React.Suspense>
                {com}
            </React.Suspense>
        // </KeepAlive

)
const routers = [
    {
        path: '/',
        element: <Navigate to="/charts" />
    },
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
                path:'/messages',
                element:withLoading(<Messages/>,'messages')
            },
            {
                path:'/sensitive',
                element:withLoading(<Sensitive/>,'sensitive')
            },
            {
                path:'/article-list',
                element:withLoading(<ArticleList/>,'article-list')
            }
        ]
    },


]
export default routers