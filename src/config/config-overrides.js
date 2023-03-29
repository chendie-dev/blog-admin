// antd样式按需引入
const {
    override,
    fixBabelImports
} = require('customize-cra');
module.exports = override(fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
}), );