import React,{lazy} from "react";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
const Charts=lazy(()=>import('../pages/Charts'))
const Articles=lazy(()=>import('../pages/Articals'))
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
        ]
    },
    
   
]
export default routers