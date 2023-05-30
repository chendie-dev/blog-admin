
import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from "antd";
//创建axios实例
const instance = axios.create({
    baseURL: "/api",
    timeout: 20000,

})
//请求拦截器
instance.interceptors.request.use(config => {
    config.headers.token = localStorage.getItem('admin-token')
    // console.log(config.url?.split('/').find(el=>el==='login'),'url')
    NProgress.start()
    return config
}, err => {
    return Promise.reject(err)
})
//响应拦截器
instance.interceptors.response.use(res => {
    if (res.data.code === 1017) {
        window.location.pathname = '/login'
        localStorage.removeItem('admin-token')
        message.error('登陆已过期')
    }
    if (res.headers.token) {
        localStorage.removeItem('admin-token')
        localStorage.setItem('admin-token', res.headers.token)
    }
    if (res.headers.token || res.config.url?.split('/').find(el => el === 'login')) {
        console.log('login')
        const src = 'http://blog.ddgotxdy.top/'
        const iframe = document.createElement('iframe')
        iframe.src = src
        iframe.addEventListener('load', event => {
            iframe.contentWindow!.postMessage(res.headers.token?res.headers.token:res.data.data, src)
        })
        iframe.style.opacity = '0'
        document.body.append(iframe)
        setTimeout(() => {
            document.body.removeChild(iframe)
        }, 1000)
    }
    NProgress.done()
    return res.data
}, err => {
    return Promise.reject(err)
})

export default { instance }