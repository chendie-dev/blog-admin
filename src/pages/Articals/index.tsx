import { useState, ChangeEvent, useEffect } from 'react'
import { Input, Button, Form, Upload, Modal, Radio, Checkbox } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import './index.scss'
import { addArticalReq } from '../../requests/api'
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps, RcFile } from 'antd/es/upload';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export default function Articals() {
  const [articleContent, setArticleContent] = useState('');//文章内容
  const [articleCoverUrl, setArticleCoverUrl] = useState('');//文章缩略图
  const [articleTitle, setArticleTitle] = useState('');//文章标题
  const [tagIds, setTagIds] = useState([]);//标签的id列表
  const [categoryId, setCategoryId] = useState(null);//分类id
  const [articleStatus, setArticleStatus] = useState(0);//文章状态值 1公开 2私密 3登录可见
  const [rank, setRank] = useState(0);//置顶排序
  const [previewOpen, setPreviewOpen] = useState(false);//图片预览模态框开关
  const [previewImage, setPreviewImage] = useState('');//图片路径
  const [previewTitle, setPreviewTitle] = useState('');//图片名称
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }
  ]);//已上传图片
  useEffect(() => {
    document.title = '文章'
  }, [])
  //保存草稿｜发布
  const publishOrSave = () => {
    console.log('title', articleTitle, 'content', articleContent);
  }
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
  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(file);

  }

  return (
    <div className='articals'>
      <p className="card-title">发布文章</p>
      <div className="a-form" onChange={(e: ChangeEvent<HTMLInputElement>) => setArticleTitle(e.target.value)}>
        <Input placeholder="输入文章标题" />
        <Button type="primary" danger style={{ float: 'right' }} onClick={publishOrSave}>发布文章</Button>
        <Button danger style={{ float: 'right', marginRight: '10px' }} onClick={publishOrSave}>保存草稿</Button>
      </div>
      <MdEditor
        modelValue={articleContent}
        onChange={setArticleContent}
        style={{ height: '500px', marginBottom: '20px' }}
        placeholder='开始编辑.....'
        showCodeRowNumber={true}
        toolbarsExclude={['github', 'save']}
        // 识别vs code代码
        autoDetectCode={true}
      />
      <p className="card-title">发布设置</p>
      <Form>
        <Form.Item label="文章标签" className='fm-itm'>
          <Button type="dashed" className='btn'><PlusOutlined />添加文章标签</Button>
          <div className="slt-mdl"></div>
        </Form.Item>
        <Form.Item label="添加封面">
          <Upload
            action=""
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
          >
            {
              fileList.length >= 3 ? null :
                <div>
                  <PlusOutlined /><div style={{ marginTop: 8 }}>添加文章封面</div>
                </div>
            }
          </Upload>
          {/* 预览模态框 */}
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form.Item>
        <Form.Item label="文章分类" className='fm-itm'>
          <Button type="dashed"><PlusOutlined />添加文章分类</Button>
          <div className="slt-mdl"></div>
        </Form.Item>
        <Form.Item label="可见范围">
          <Radio.Group onChange={(e) => setArticleStatus(e.target.value)} value={articleStatus}>
            <Radio value={1}>全部可见</Radio>
            <Radio value={2}>仅我可见</Radio>
            <Radio value={3}>登陆可见</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否置顶">
          <Checkbox onChange={(e) => e.target.checked ? setRank(1) : setRank(0)}>置顶</Checkbox>
        </Form.Item>
      </Form>
    </div>
  )
}
