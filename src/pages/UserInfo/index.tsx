import { useEffect, useLayoutEffect, useState } from 'react'
import './index.scss'
import { Button, Collapse, Divider, Form, Input, Radio, Space, Upload, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import {  UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { useUserData, useUserDataDispatch } from '../../components/UserDataProvider';
import { checkUsernameReq, getCaptchaReq, updateEmailReq, updatePasswordReq, updateUserInfoReq } from '../../requests/api';

export default function User() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);//已上传图片
  const [email, setEmail] = useState('')
  const [useInfo, setUserInfo] = useState<userInfoParams>({ userId: '' })
  const userData = useUserData()
  const userDispatch = useUserDataDispatch()
  const [captchaBtnVal, setCaptchaBtnVal] = useState('发送验证码')

  useEffect(() => {
    userDispatch('getuser')
  }, [])
  useLayoutEffect(() => {
    if (!userData.userId) return
    setUserInfo({
      userId: userData.userId,
      username: userData.username,
      avatarUrl: userData.avatarUrl,
      nickname: userData.nickname,
      phoneNumber: userData.phoneNumber,
      sex: userData.sexEnum
    })
    setFileList([{
      uid: userData.userId,
      name: 'avatar',
      status: "done",
      url: userData.avatarUrl,
      response: { data: userData.avatarUrl },
    }])
  }, [userData])

  // 提交图片
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    // console.log(file)
    if (file.status === 'removed') setFileList([])
    else {
      setFileList([file])
    }
    if (file.status === 'done') setUserInfo((a) => ({ ...a, avatarUrl: file.response.data }))
  }
  //修改信息
  const updateUserInfo = async () => {
    if (useInfo.nickname && (useInfo.nickname.length < 2 || useInfo.nickname.length > 20) && useInfo.nickname !== '') {
      message.error('姓名长度为2-20个字')
      return
    }
    if (useInfo.username && (useInfo.username.length < 6 || useInfo.username.length > 20) && useInfo.username !== '') {
      message.error('用户名长度为6-20个字')
      return
    }
    if (useInfo.phoneNumber && useInfo.phoneNumber.length !== 11 && useInfo.phoneNumber !== '') {
      message.error('手机号为11位')
      return
    }
    if (useInfo.username && useInfo.username !== userData.username) {
      let res = await checkUsernameReq(useInfo.username)
      if (!res.data) {
        message.error('用户名已存在')
        return
      }
    }
    let res = await updateUserInfoReq(useInfo)
    if (res.code !== 200) return
    message.success('保存成功')
    userDispatch('getuser')
  }
  const getCaptcha = async () => {
    if(userData.email===email){
      message.error('绑定邮箱已为该邮箱')
      return
    }
    await getCaptchaReq({ mail: email })
    let time = 3
    let a = setInterval(() => {
      if (time === 0) {
        setCaptchaBtnVal('重新发送')
        clearInterval(a)
        return
      }
      setCaptchaBtnVal(time - 1 + 's')
      time--
    }, 1000)
  }
  const updateEmailInfo = async (values: {
    captcha: string,
    currentPassword: string,
    email: string,
  }) => {
    console.log(values, 'email')
    let res = await updateEmailReq({ ...values, userId: userData.userId })
    if (res.code !== 200) {
      message.error('密码或者验证码错误')
      return
    }
    message.success('邮箱修改成功')
  };
  const updatePasswordInfo = async (value: {
    currentPassword: string,
    password: string,
    rePassword: string,
  }) => {
    console.log(value, 'pass')
    let res = await updatePasswordReq({ ...value, userId: userData.userId })
    if (res.code !== 200) {
      message.error('密码错误')
      return
    }
    message.success('密码修改成功')
  }

  return (
    <div className='user'>
      <p className="title">个人中心</p>
      <Collapse accordion bordered={false} defaultActiveKey={['1']} style={{ marginTop: '20px' }}>
        <Collapse.Panel header="资料设置" key="1">
          <div className="content">
            <div className="detail-info">
              <ImgCrop aspect={1 / 1}>
                <Upload
                  name='image'
                  accept='image/*'
                  action="/api/file/admin/image/upload"
                  listType='picture-circle'
                  onChange={handleChange}
                  fileList={fileList}
                >
                  {
                    fileList.length > 0 ? '' :
                      <div>
                        <PlusOutlined /><div style={{ marginTop: 8 }}>头像</div>
                      </div>
                  }
                </Upload>
              </ImgCrop>
              <Form
                labelCol={{ span: 4 }}
                labelAlign='left'
                layout='vertical'
              >
                <Form.Item label='真实姓名'
                >
                  <Input allowClear value={useInfo.nickname} onChange={(e) => setUserInfo((a) => ({ ...a, nickname: e.target.value.replaceAll(/\s*/g, "") }))} />
                </Form.Item>
                <Form.Item label='用户名'>
                  <Input allowClear value={useInfo.username} onChange={(e) => setUserInfo((a) => ({ ...a, username: e.target.value.replaceAll(/\s*/g, "") }))} />
                </Form.Item>
                <Form.Item label='手机号'>
                  <Input allowClear value={useInfo.phoneNumber} onChange={(e) => setUserInfo((a) => ({ ...a, phoneNumber: e.target.value.replaceAll(/\s*/g, "") }))} />
                </Form.Item>
                {/* <Form.Item label='角色名'>
                  <Input allowClear disabled value={userData.roleName} />
                </Form.Item> */}
              </Form>
              <Form
                colon={false}
              >
                <Form.Item label='性别'>
                  <Radio.Group value={useInfo.sex} onChange={(e) => setUserInfo((a) => ({ ...a, sex: e.target.value }))} >
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                    <Radio value={0}>保密</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item >
                  <Button type="primary" htmlType="submit" onClick={updateUserInfo}>
                    保存
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="账户设置" key="2" >
          <div className="content">
            <div className="pass">
              <h3>更改密码</h3>
              <Form
                name="updatePassword"
                initialValues={{ remember: true }}
                onFinish={updatePasswordInfo}
                autoComplete="off"
                style={{ marginTop: 10 }}
                labelCol={{ span: 8 }}
                labelAlign='left'
                layout='vertical'
              >
                <Form.Item
                  label="当前密码"
                  name="currentPassword"
                  rules={[{ required: true, message: '密码不能为空' }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '至少八个字符，至少一个字母和一个数字组成' }]}
                >
                  <Input.Password allowClear placeholder="请输入你的密码" />
                </Form.Item>
                <Form.Item
                  label="新密码"
                  name="password"
                  rules={[{ required: true, message: '密码不能为空' }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '至少八个字符，至少一个字母和一个数字组成' }]}
                >
                  <Input.Password allowClear placeholder="请输入你的密码" />
                </Form.Item>
                <Form.Item
                  className='loginItem'
                  label="确认新密码"
                  name="rePassword"
                  rules={[{ required: true, message: '密码不能为空' }, ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('你输入的两个密码不匹配!'));
                    },
                  })]}
                >
                  <Input.Password allowClear placeholder="请输入你的密码" />
                </Form.Item>
                <Form.Item className='loginItem registItem'>
                  <Button type="primary" htmlType="submit">
                    更新密码
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <Divider type="vertical" style={{ height: '29.9em' }} />
            <div className="email">
              <h3>更改邮箱</h3>
              <Form
                name="updataEmail"
                initialValues={{ remember: true }}
                onFinish={updateEmailInfo}
                autoComplete="off"
                style={{ marginTop: 10 }}
                labelCol={{ span: 8 }}
                labelAlign='left'
                layout='vertical'
              >
                <Form.Item
                  label="当前密码"
                  name="currentPassword"
                  rules={[{ required: true, message: '密码不能为空' }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '至少八个字符，至少一个字母和一个数字组成' }]}
                >
                  <Input.Password allowClear placeholder="请输入你的密码" />
                </Form.Item>
                <Form.Item
                  label="当前邮箱"
                >
                  <Input disabled value={userData.email} />
                </Form.Item>
                <Form.Item
                  className='loginItem'
                  label="新邮箱"
                  name="email"
                  rules={[{ required: true, message: '邮箱不能为空' }, { pattern: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, message: '邮箱格式不正确' }]}
                >
                  <Input allowClear placeholder="请输入你的邮箱" onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item
                  className='loginItem'
                  label="验证码"
                  name="captcha"
                  rules={[{ required: true, message: '验证码不能为空' }]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Input allowClear placeholder='请输入校验码' />
                    <Button type="primary" onClick={getCaptcha} disabled={captchaBtnVal.charAt(captchaBtnVal.length - 1) === 's'} >{captchaBtnVal}</Button>
                  </Space.Compact>
                </Form.Item>
                <Form.Item >
                  <Button type="primary" htmlType="submit">
                    更新邮箱
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}
