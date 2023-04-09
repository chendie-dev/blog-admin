const Mock = require('mockjs')
const Random = Mock.Random
export default [{
    url: new RegExp('/admin/list'),
    method: 'get',
    tpl: {
        code: 0,
        msg: 'success',
        'data|1-10': [{
                'id|+1': 1,
                'name': '@cname',
                'email': '@email(163.com)',
                'county': Random.county(true),
                // 'county':'@county(true)'
            }

        ]

    }
}]