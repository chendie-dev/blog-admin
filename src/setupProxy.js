const { createProxyMiddleware } = require('http-proxy-middleware')    //现在的
 
module.exports = function (app) {
	app.use(
		createProxyMiddleware('/api', {      //这里也要改成createProxyMiddleware
			target: 'http://admin.ddgotxdy.top',
			changeOrigin: true,
		})
	)
	
}