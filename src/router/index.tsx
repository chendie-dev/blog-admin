import React,{lazy} from "react";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
const Charts=lazy(()=>import('../pages/Charts'))
const Articles=lazy(()=>import('../pages/Articals'))
const Categories=lazy(()=>import('../pages/Categories'))
const Tags=lazy(()=>import('../pages/Tags'))
const withLoading=(com:JSX.Element)=>(
    <React.Suspense>
        {com}
    </React.Suspense>
)
const routers=[
    {
        path:'/',
        element:<Navigate to="/charts"/>
    },
    {
        path:'/',
        element:<Home/>,
        children:[
            {
                path:'/charts',
                element:withLoading(<Charts/>)
            },
            {
                path:'/articles',
                element:withLoading(<Articles/>)
            },
            {
                path:'/categories',
                element:withLoading(<Categories/>)
            },
            {
                path:'/tags',
                element:withLoading(<Tags/>)
            }
        ]
    },
    
   
]
export default routers