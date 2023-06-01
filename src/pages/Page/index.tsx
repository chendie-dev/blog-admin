import { useEffect, useState } from 'react'
import './index.scss'
import ImgCrop from 'antd-img-crop'
import { Button, Descriptions, Input, Upload, UploadFile, UploadProps, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { addPagesReq, getPagesReq } from '../../requests/api';
export default function Page() {
    const [authorUrl, setAuthorUrl] = useState<UploadFile[]>([]);//已上传图片
    const [authorName, setAuthorName] = useState('')
    const [briefIntroduction, setBriefIntroduction] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [qqUrl, setQqUrl] = useState('')
    const [homePageUrl, setHomePageUrl] = useState<UploadFile[]>([]);//已上传图片
    const [messagePageUrl, setMessagePageUrl] = useState<UploadFile[]>([]);//已上传图片
    const [categoryPageUrl, setCategoryPageUrl] = useState<UploadFile[]>([]);//已上传图片
    const [tagPageUrl, setTagPageUrl] = useState<UploadFile[]>([]);//已上传图片
    const [aboutMePageUrl, setAboutMePageUrl] = useState<UploadFile[]>([]);//已上传图片
    const getPage=async ()=>{
        let res=await getPagesReq()
        console.log(res.data)
        if(res.code!==200){
            message.error(res.msg)
            return
        }
        setAuthorUrl([{
            uid:'-1',
            name:'头像',
            response:{data:res.data.authorUrl},
            url:res.data.authorUrl
        }])
        setAuthorName(res.data.authorName)
        setGithubUrl(res.data.githubUrl)
        setQqUrl(res.data.qqUrl)
        setHomePageUrl([{
            uid:'-1',
            name:'头像',
            response:{data:res.data.homePageUrl},
            url:res.data.homePageUrl
        }])
        setMessagePageUrl([{
            uid:'-2',
            name:'头像',
            response:{data:res.data.messagePageUrl},
            url:res.data.messagePageUrl
        }])
        setCategoryPageUrl([{
            uid:'-3',
            name:'头像',
            response:{data:res.data.categoryPageUrl},
            url:res.data.categoryPageUrl
        }])
        setTagPageUrl([{
            uid:'-4',
            name:'头像',
            response:{data:res.data.tagPageUrl},
            url:res.data.tagPageUrl
        }])
        setAboutMePageUrl([{
            uid:'-5',
            name:'头像',
            response:{data:res.data.aboutMePageUrl},
            url:res.data.aboutMePageUrl
        }])
        setBriefIntroduction(res.data.briefIntroduction)
    }
    useEffect(()=>{
        getPage()
    },[])
    const submit = async () => {
        let res = await addPagesReq({
            authorUrl: authorUrl[0].response.data,
            authorName: authorName,
            briefIntroduction: briefIntroduction,
            githubUrl: githubUrl,
            qqUrl: qqUrl,
            homePageUrl: homePageUrl[0].response.data,
            messagePageUrl: messagePageUrl[0].response.data,
            categoryPageUrl: categoryPageUrl[0].response.data,
            tagPageUrl: tagPageUrl[0].response.data,
            aboutMePageUrl: aboutMePageUrl[0].response.data
        })
        if (res.code !== 200) {
            message.error(res.msg)
            return
        }
        message.success('提交成功')
    }
    const authorUrlChange: UploadProps['onChange'] = ({ file }) => {
        if (file.status === 'removed') setAuthorUrl([])
        else {
            setAuthorUrl([file])
        }
    }
    const homePageUrlChange: UploadProps['onChange'] = ({ file }) => {
        if (file.status === 'removed') setHomePageUrl([])
        else {
            setHomePageUrl([file])
        }
    }
    const messagePageUrlChange: UploadProps['onChange'] = ({ file }) => {
        if (file.status === 'removed') setMessagePageUrl([])
        else {
            setMessagePageUrl([file])
        }
    }
    const categoryPageUrlChange: UploadProps['onChange'] = ({ file }) => {
        if (file.status === 'removed') setCategoryPageUrl([])
        else {
            setCategoryPageUrl([file])
        }
    }
    const tagPageUrlChange: UploadProps['onChange'] = ({ file }) => {
        if (file.status === 'removed') setTagPageUrl([])
        else {
            setTagPageUrl([file])
        }
    }
    const aboutMePageUrlChange: UploadProps['onChange'] = ({ file }) => {
        if (file.status === 'removed') setAboutMePageUrl([])
        else {
            setAboutMePageUrl([file])
        }
    }
    return (
        <div className='page'>
            <Descriptions layout='horizontal' bordered contentStyle={{ textAlign: 'center' }} labelStyle={{ textAlign: 'center' }}  >
                <Descriptions.Item span={3} contentStyle={{ transform: 'translate(-5%)' }} >
                    <ImgCrop aspect={1 / 1}>
                        <Upload
                            name='image'
                            accept='image/*'
                            action="/api/file/admin/image/upload"
                            listType='picture-circle'
                            onChange={authorUrlChange}
                            fileList={authorUrl}
                        >
                            {
                                authorUrl.length > 0 ? '' :
                                    <div>
                                        <PlusOutlined /><div style={{ marginTop: 8 }}>头像</div>
                                    </div>
                            }
                        </Upload>
                    </ImgCrop>
                </Descriptions.Item>
                <Descriptions.Item label="网站名称" >
                    <Input allowClear value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                </Descriptions.Item>
                <Descriptions.Item label="网站简介">
                    <TextArea value={briefIntroduction} onChange={(e) => setBriefIntroduction(e.target.value)} />
                </Descriptions.Item>
                <Descriptions.Item label="Github地址">
                    <Input allowClear value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                </Descriptions.Item>
                <Descriptions.Item label="QQ地址">
                    <Input allowClear value={qqUrl} onChange={(e) => setQqUrl(e.target.value)} />
                </Descriptions.Item>
                <Descriptions.Item label="首页背景">
                    <ImgCrop aspect={1920 / 1080}>
                        <Upload
                            name='image'
                            accept='image/*'
                            action="/api/file/admin/image/upload"
                            listType='picture-card'
                            onChange={homePageUrlChange}
                            fileList={homePageUrl}
                        >
                            {
                                homePageUrl.length > 0 ? '' :
                                    <div>
                                        <PlusOutlined /><div style={{ marginTop: 8 }}>背景</div>
                                    </div>
                            }
                        </Upload>
                    </ImgCrop>
                </Descriptions.Item>
                <Descriptions.Item label="留言界面背景">
                    <ImgCrop aspect={1920 / 1080}>
                        <Upload
                            name='image'
                            accept='image/*'
                            action="/api/file/admin/image/upload"
                            listType='picture-card'
                            onChange={messagePageUrlChange}
                            fileList={messagePageUrl}
                        >
                            {
                                messagePageUrl.length > 0 ? '' :
                                    <div>
                                        <PlusOutlined /><div style={{ marginTop: 8 }}>背景</div>
                                    </div>
                            }
                        </Upload>
                    </ImgCrop>
                </Descriptions.Item>
                <Descriptions.Item label="分类界面背景">
                    <ImgCrop aspect={1920 / 1080}>
                        <Upload
                            name='image'
                            accept='image/*'
                            action="/api/file/admin/image/upload"
                            listType='picture-card'
                            onChange={categoryPageUrlChange}
                            fileList={categoryPageUrl}
                        >
                            {
                                categoryPageUrl.length > 0 ? '' :
                                    <div>
                                        <PlusOutlined /><div style={{ marginTop: 8 }}>背景</div>
                                    </div>
                            }
                        </Upload>
                    </ImgCrop>
                </Descriptions.Item>
                <Descriptions.Item label="标签界面背景">
                    <ImgCrop aspect={1920 / 1080}>
                        <Upload
                            name='image'
                            accept='image/*'
                            action="/api/file/admin/image/upload"
                            listType='picture-card'
                            onChange={tagPageUrlChange}
                            fileList={tagPageUrl}
                        >
                            {
                                tagPageUrl.length > 0 ? '' :
                                    <div>
                                        <PlusOutlined /><div style={{ marginTop: 8 }}>背景</div>
                                    </div>
                            }
                        </Upload>
                    </ImgCrop>
                </Descriptions.Item>
                <Descriptions.Item label="关于我界面背景">
                    <ImgCrop aspect={1920 / 1080}>
                        <Upload
                            name='image'
                            accept='image/*'
                            action="/api/file/admin/image/upload"
                            listType='picture-card'
                            onChange={aboutMePageUrlChange}
                            fileList={aboutMePageUrl}
                        >
                            {
                                aboutMePageUrl.length > 0 ? '' :
                                    <div>
                                        <PlusOutlined /><div style={{ marginTop: 8 }}>背景</div>
                                    </div>
                            }
                        </Upload>
                    </ImgCrop>
                </Descriptions.Item>

            </Descriptions>
            <Button onClick={submit} style={{ float: 'right', marginTop: 10, width: 100 }} type='primary'>提交</Button>
        </div>
    )
}
