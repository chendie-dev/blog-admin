const { createProxyMiddleware } = require('http-proxy-middleware')    //现在的
// const proxy = require("http-proxy-middleware");        //原来的
const a=  (app: { use: (arg0: any) => void })=> {
	app.use(
		createProxyMiddleware('/api', {      //这里也要改成createProxyMiddleware
			target: 'http://localhost:5001',
			changeOrigin: true,
			pathRewrite: { '^/api': '' },
		})
	)
	
}
export default a