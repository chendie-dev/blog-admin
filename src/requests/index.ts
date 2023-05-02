/*
 * @Author: chendie chendie
 * @Date: 2023-04-09 09:25:14
 * @LastEditors: chendie chendie
 * @LastEditTime: 2023-04-25 14:48:34
 * @FilePath: /blog-admin/src/requests/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";

//创建axios实例
const instance1=axios.create({
    baseURL:"",
    timeout:20000,
    headers:{
        'USER-ID':'1'
    }
})
const instance=axios.create({
    baseURL:"/api",
    timeout:20000,
    headers:{
        'USER-ID':'1'
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