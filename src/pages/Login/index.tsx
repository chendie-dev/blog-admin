import React, { useEffect } from 'react'
import './index.scss'
import { Button, Card, Form, Input, message } from 'antd'
import { loginReq } from '../../requests/api'
import { useNavigate } from 'react-router'
import { useUserDataDispatch } from '../../components/UserDataProvider'
import globalConstant from '../../utils/globalConstant'
export default function Login() {
  const navigateTo = useNavigate()
  const userDispatch = useUserDataDispatch()
  useEffect(()=>{
    window.addEventListener('message', ({ data, origin }) => {
      // console.log('admin',data,origin)
      if(origin===globalConstant().sourceUrl)localStorage.setItem('admin-token', data)
    },false)
  },[])
  const onFinish = async (value: { username: string; password: string; }) => {
    // console.log(value)
    let res = await loginReq(value)
    // console.log(res)
    if (res.code !== 200) {
      message.error('密码或用户名错误！')
      return
    }
    localStorage.setItem('admin-token', res.data)
    navigateTo('/home')
    userDispatch('getuser')
  }
  return (
    <div className='login'>
      <h1 className='login_title'>博客管理系统</h1>
      <Card className='login_card' bordered={false}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            className='loginItem'
            name="username"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            className='loginItem'
            name="password"
            rules={[{ required: true, message: '密码不能为空' }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '至少八个字符，至少一个字母和一个数字组成' }]}
          >
            <Input.Password placeholder="请输入登陆密码" />
          </Form.Item>
          <Form.Item className='loginItem'>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登陆
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
