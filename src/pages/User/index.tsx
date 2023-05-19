import React, { useEffect, useLayoutEffect, useState } from 'react'
import './index.scss'
import { Button, Form, Input, Modal, Space, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { getUserReq } from '../../requests/api';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export default function User() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);//已上传图片
  const [previewOpen, setPreviewOpen] = useState(false);//图片预览模态框开关
  const [previewImage, setPreviewImage] = useState('');//图片路径
  const [previewTitle, setPreviewTitle] = useState('');//图片名称
  const [userInfo, setUserInfo] = useState<userInfo>({} as userInfo)
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [phoneNumber,setPhoneNumber]=useState('')
  useLayoutEffect(() => {
    getUser()
  }, [])
  //图片预览设置
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  // 提交图片
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    console.log(file)
    if (file.status === 'removed') {
      setFileList([]);
    } else {
      setFileList([file]);
    }

  }
  //获取用户
  const getUser = async () => {
    let res = await getUserReq()
    if (res.code !== 200) return
    console.log(res)
    setUsername(res.data.username)
    setEmail(res.data.email)
    setPhoneNumber(res.data.phoneNumber)
    setUserInfo(res.data)
  }
  //修改信息
  const updateInfo=()=>{
    console.log(fileList[0].response.data)
  }
  return (
    <div className='user'>
      <p className="title">个人中心</p>
      <div className="user-content">
        <ImgCrop
          aspect={1 / 1}
        >
          <Upload
            name='image'
            accept='image/*'
            action="/api/file/admin/image/upload"
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
            className='user-content_img'
          >
            {
              fileList.length >= 1 ? null :
                <div>
                  <PlusOutlined /><div style={{ marginTop: 8 }}>添加头像</div>
                </div>
            }
          </Upload>
        </ImgCrop>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <div className="user-content_form" >
          <div className="itm">
            <label>昵称:</label><Input onChange={(e)=>setUsername(e.target.value)} value={username} allowClear />
          </div>
          <div className="itm">
            <label>角色:</label><span>{userInfo.roleName}</span>
          </div>
          <div className="itm">
            <label>邮箱:</label><Input onChange={(e)=>setEmail(e.target.value)} value={email} allowClear />
          </div>
          <div className="itm">
            <label>手机号:</label><Input onChange={(e)=>setPhoneNumber(e.target.value)} value={phoneNumber} style={{ width: '80%' }} allowClear />
          </div>
          <Button type="primary" htmlType="submit" onClick={()=>updateInfo()}>修改</Button>
        </div>
      </div>
    </div>
  )
}
