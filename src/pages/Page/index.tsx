import React, { useState } from 'react'
import './index.scss'
import ImgCrop from 'antd-img-crop'
import { Descriptions, Form, Upload, UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import Input from 'rc-input';
import TextArea from 'antd/es/input/TextArea';
export default function Page() {
    const [fileList, setFileList] = useState<UploadFile[]>([]);//已上传图片
    const handleChange = () => {
        
    }
    return (
        <div className='page'>
            <Descriptions layout="vertical">
                <Descriptions.Item >
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
                </Descriptions.Item>
                <Descriptions.Item label="网站名称"><Input allowClear /></Descriptions.Item>
                <Descriptions.Item label="网站简介"><TextArea /></Descriptions.Item>
                <Descriptions.Item label="Github地址"><Input allowClear /></Descriptions.Item>
                <Descriptions.Item label="QQ地址"><Input allowClear /></Descriptions.Item>
                <Descriptions.Item label="首页背景">
                    <ImgCrop aspect={1920 / 1080}>
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
                </Descriptions.Item>
                <Descriptions.Item label="留言界面背景">
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
                </Descriptions.Item>
                <Descriptions.Item label="分类界面背景">
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
                </Descriptions.Item>
                <Descriptions.Item label="标签界面背景">
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
                </Descriptions.Item>
                <Descriptions.Item label="关于我界面背景">
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
                </Descriptions.Item>

            </Descriptions>
        </div>
    )
}
