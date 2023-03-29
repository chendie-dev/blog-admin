import admin from './admin'
const Mock =require('mockjs')
Mock.setup({timeout:'100-200'}) 
const routerList=[
    ...admin
]
routerList.forEach(route=>{
    Mock.mock(route.url,route.method,route.tpl)
})
export default Mock 