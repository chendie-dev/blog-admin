import Images from './images';
const Mock=require('mockjs');
Mock.setup({timeout:'100-200'})
const routeList=[
    ...Images
]
routeList.forEach(route=>{
    Mock.mock(route.url,route.method,route.tpl)
})
export default Mock