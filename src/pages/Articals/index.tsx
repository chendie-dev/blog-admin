import { useState, useEffect } from 'react'
import { Input, Button, Form, Upload, Modal, Radio, Checkbox, Popover, message } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import MdEditor from 'md-editor-rt';
import ImgCrop from 'antd-img-crop';
import 'md-editor-rt/lib/style.css';
import './index.scss'
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps, RcFile } from 'antd/es/upload';
import TagSelect from './TagSelect';
import CategorySelect from './CategorySelect';
import { getImageListReq, uploadImageReq } from '../../requests/api';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export default function Articals() {
  useEffect(() => {
    document.title = '文章'
    getImageList()
  }, [])
  const [articleContent, setArticleContent] = useState('');//文章内容
  const [articleTitle, setArticleTitle] = useState('');//文章标题
  const [tagItems, setTagItems] = useState<tagListType[]>([]);//标签items
  const [categoryItems, setCategoryItems] = useState<categoryItemType[]>([]);//分类items
  const [articleStatus, setArticleStatus] = useState(1);//文章状态值 1公开 2私密 3登录可见
  const [rank, setRank] = useState(0);//置顶排序
  const [fileList, setFileList] = useState<UploadFile[]>([]);//已上传图片
  const [previewOpen, setPreviewOpen] = useState(false);//图片预览模态框开关
  const [previewImage, setPreviewImage] = useState('');//图片路径
  const [previewTitle, setPreviewTitle] = useState('');//图片名称
  const [currentPage, setCurrentPage] = useState(0)//当前页
  const [totalPage, setTotalPage] = useState(1)//总页
  const [ImageList, setImageList] = useState<imageItemType[]>([])//图片列表

  //保存草稿｜发布
  const publishOrSave = () => {
    console.log('title', articleTitle, 'content', articleContent);
    if(articleTitle.replace(/\s*/g, '').length===0){
      setArticleTitle('【无标题】')
    }else if(articleTitle.replace(/\s*/g, '').length<5){
      message.error("标题长度不能小于5个字")
      return
    }else if(articleContent.length===0){
      message.error("请输入文章内容")
      return
    }
    if(tagItems.length===0){
      message.error("请设置文章标签")
      return
    }
    
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
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'removed') {
      setFileList([]);
    }else
      setFileList([file]);
    console.log(7777, file);
  }
  //获取图片
  const getImageList = async () => {
    let res = await getImageListReq({
      pageNum: currentPage,
      pageSize: 4,
      queryParam: {
        isDelete: false
      }
    })
    setTotalPage(res.data.totalNumber)
    setImageList(res.data.data)
  }
  //换一批
  const handlePage = () => {
    if (currentPage >= totalPage) setCurrentPage(currentPage - totalPage + 1)
    else setCurrentPage(currentPage + 1)
    getImageList()
  }
  //选取图片
  const selectImg = (el: imageItemType) => {
    let file: UploadFile = {
      uid: el.imageId.toString(),
      name: el.imageName,
      status: 'done',
      url: el.imageUrl,
    }
    setFileList([file])
  }
  //上传文章内容图片
  const onUploadImg = async (files:string[],callback:(urls:string[])=>void) => {
    const res:imageUrlRes[] = await Promise.all(
      files.map((file) => {
          const form = new FormData();
          form.append('image', file);
          return uploadImageReq(form)
        })
    );
    callback(res.map((item) => item.data));
  };
  return (
    <div className='articals'>
      <p className="card-title">发布文章</p>
      <div className="a-form" >
        <Input placeholder="输入文章标题（5-50个字）" value={articleTitle}  onChange={(e) => setArticleTitle(e.target.value)}/>
        <Button type="primary" danger style={{ float: 'right' }} onClick={publishOrSave}>发布文章</Button>
        <Button danger style={{ float: 'right', marginRight: '10px' }} onClick={publishOrSave}>保存草稿</Button>
      </div>
      <MdEditor
        modelValue={articleContent}
        onChange={setArticleContent}
        onUploadImg={onUploadImg}
        style={{ height: '500px', marginBottom: '20px' }}
        placeholder='开始编辑.....'
        
        showCodeRowNumber={true}
        toolbarsExclude={['github', 'save']}
        // 识别vs code代码
        autoDetectCode={true}
      />
      <p className="card-title">发布设置</p>
      <Form>
        <Form.Item label="文章标签" className='fm-itm' >
          <TagSelect tagData={(items: tagListType[]) => setTagItems(items)} />
        </Form.Item>
        <Form.Item label="添加封面" style={{ height: 110 }}>
          <ImgCrop
            aspect={480 / 270}
          >
            <Upload
              name='image'
              accept='image/*'
              action="/api/file/admin/image/upload"
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              onPreview={handlePreview}
            >
              {
                fileList.length >= 1 ? null :
                  <div>
                    <PlusOutlined /><div style={{ marginTop: 8 }}>添加文章封面</div>
                  </div>
              }
            </Upload>
          </ImgCrop>
          {
            fileList.length >= 1 ? null :
              <div className="imgList">
                <div className='clearfix' style={{width:100,height:20}}><span className='exchange clearfix' onClick={handlePage}><RedoOutlined/>换一批</span></div>
                <ul>
                  {ImageList.map(el => {
                    return (
                      <li onClick={() => selectImg(el)} key={el.imageId}>
                        <Popover
                          placement="bottom"
                          content={(<img alt="example " style={{ width: 500 }} src={el.imageUrl} />)}
                          arrow={false}
                        >
                          <img alt="example" style={{ width: '100%' }} src={el.imageUrl} />
                        </Popover>
                      </li>
                    )
                  })}
                </ul>
              </div>
          }
          {/* 预览模态框 */}
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form.Item>
        <Form.Item label="文章分类" className='fm-itm'>
          <CategorySelect categoryData={(items: categoryItemType[]) => setCategoryItems(items)} />
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
