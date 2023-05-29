import { useEffect, useLayoutEffect, useState } from 'react'
import './index.scss'
import { Button, Collapse, Divider, Form, Input, Radio, Space, Upload, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { useUserData, useUserDataDispatch } from '../../components/UserDataProvider';
import { checkUsernameReq, getCaptchaReq, updateEmailReq, updatePasswordReq, updateUserInfoReq } from '../../requests/api';

export default function User() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);//已上传图片
  const [email, setEmail] = useState('')
  const userData = useUserData()
  const userDispatch = useUserDataDispatch()
  const [captchaBtnVal, setCaptchaBtnVal] = useState('发送验证码')

  useEffect(() => {
    if (!userData.userId) return
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
    if (file.status === 'removed') setFileList([])
    else {
      setFileList([file])
    }
  }
  //修改信息
  const updateUserInfo = async (value: userInfoParams) => {
    value.avatarUrl = fileList[0].response.data
    value.userId = userData.userId
    console.log(value);
    let res = await updateUserInfoReq(value)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    message.success('保存成功')
    userDispatch('getuser')
  }
  const getCaptcha = async () => {
    if (userData.email === email) {
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
                    className='avatar'
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
                onFinish={updateUserInfo}
              >
                <Form.Item
                  name='nickname'
                  initialValue={userData.nickname}
                  label='真实姓名'
                  rules={[{ min: 2, max: 20, message: '姓名长度2-20个字' }]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  name='username'
                  initialValue={userData.username}
                  label='用户名'
                  rules={[{ min: 6, max: 20, message: '姓名长度6-20个字' }, () => ({
                    async validator(_, value) {
                      let res = await checkUsernameReq(value)
                      if (res.data) return Promise.resolve()
                      return Promise.reject(new Error('用户名已存在'))
                    }
                  })]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label='手机号'
                  name={'phoneNumber'}
                  initialValue={userData.phoneNumber}
                  rules={[{ len: 11, message: '手机号长度11位' }]}
                >
                  <Input allowClear />
                </Form.Item>
                {/* <Form.Item label='角色名'>
                  <Input allowClear disabled value={userData.roleName} />
                </Form.Item> */}
                <Form.Item
                  name='sex'
                  initialValue={userData.sexEnum}
                  label='性别'>
                  <Radio.Group  >
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                    <Radio value={0}>保密</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item >
                  <Button type="primary" htmlType="submit" >
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
