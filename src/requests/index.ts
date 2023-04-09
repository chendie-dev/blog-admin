import axios from "axios";

//创建axios实例
const instance=axios.create({
    baseURL:"http://59.110.143.1:28080",
    timeout:20000
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

export default instance