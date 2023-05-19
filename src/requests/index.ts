
import axios from "axios";

//创建axios实例
const instance1=axios.create({
    baseURL:"",
    timeout:20000,
    headers:{
        // 'USER-ID':'1'
        token:localStorage.getItem('token')
    }
})
const instance=axios.create({
    baseURL:"/api",
    timeout:20000,
    headers:{
        // 'USER-ID':'1'
        'token':localStorage.getItem('token')
    }
})
//请求拦截器
instance.interceptors.request.use(config=>{
    return config
},err=>{
    return Promise.reject(err)
})
//响应拦截器
instance.interceptors.response.use(res=>{
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