
import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//创建axios实例
const instance1=axios.create({
    baseURL:"",
    timeout:20000
})
const instance=axios.create({
    baseURL:"/api",
    timeout:20000,
   
})
//请求拦截器
instance.interceptors.request.use(config=>{
    config.headers.token=localStorage.getItem('token')
    NProgress.start()
    return config
},err=>{
    return Promise.reject(err)
})
//响应拦截器
instance.interceptors.response.use(res=>{
    if(res.data.code===1017){
        localStorage.removeItem('token')
    }
    console.log(res.headers.token,res.data.code)
    if(res.headers.token){
        localStorage.removeItem('token')
        localStorage.setItem('token',res.headers.token)
    }
    NProgress.done()
    return res.data
},err=>{
    return Promise.reject(err)
})
//请求拦截器
instance1.interceptors.request.use(config=>{
    return config
},err=>{
    return Promise.reject(err)
})
//响应拦截器
instance1.interceptors.response.use(res=>{
    return res.data
},err=>{
    return Promise.reject(err)
})
export default {instance,instance1}