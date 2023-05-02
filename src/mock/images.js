const images = [
    //添加图片
    {
        url: '/file/admin/image/add',
        method: 'post',
        tpl: {
            code: 200,
            data: {
                id: 0
            },
            msg: ""
        }
    },
    //获取图片列表
    {
        url: '/file/admin/image/queryByPage',
        method: 'post',
        tpl: {
            code: 200,
            data: {
                'data|3-4': [
                    {
                        createTime: (new Date()).valueOf(),
                        'imageId|+1': 0,
                        'imageName':'@cname',
                        imageUrl: "https://img.ddgotxdy.top/b8ac405f558b44329078492af1a5868a.jpg"
                    }
                ],
                totalNumber: 0
            },
            msg: ""
        }
    }
]
export default images