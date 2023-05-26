import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Modal, Popover, Radio, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { addArticleReq, getImageListReq, updateArticleReq, uploadImageReq } from '../../requests/api';
import CategorySelect from './CategorySelect';
import TagSelect from './TagSelect';
import './index.scss';
import { useLocation } from 'react-router-dom';
import { useArticleListData } from '../../components/ArticleListDateProvider';
import EmojiExtension from '../../components/EmojiExtension';
import ReadExtension from '../../components/ReadExtension';
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt/lib/types/MdEditor/type';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function Articles() {
  useEffect(() => {
    document.title = '文章'
    getImageList()
  }, [])
  const [articleContent, setArticleContent] = useState('');//文章内容
  const [articleTitle, setArticleTitle] = useState('');//文章标题
  const [tagItems, setTagItems] = useState<tagItemType[]>([]);//标签items
  const [categoryItems, setCategoryItems] = useState<categoryItemType[]>([]);//分类items
  const [articleStatus, setArticleStatus] = useState(1);//文章状态值 1公开 2私密 3登录可见
  const [rank, setRank] = useState(0);//置顶排序
  const [fileList, setFileList] = useState<UploadFile[]>([]);//已上传图片
  const [previewOpen, setPreviewOpen] = useState(false);//图片预览模态框开关
  const [previewImage, setPreviewImage] = useState('');//图片路径
  const [previewTitle, setPreviewTitle] = useState('');//图片名称
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [totalPage, setTotalPage] = useState(1)//总页
  const [ImageList, setImageList] = useState<imageItemType[]>([])//图片列表
  const articleId = useLocation().pathname.split('/')[2]
  const articleListDate = useArticleListData()
  const [tagIds, setTagIds] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState<string>('')
  const [pageTitle, setPageTitle] = useState('发布文章')
  const [isPublish, setIsPublish] = useState(true)
  const [id] = useState('preview');
  useLayoutEffect(() => {
    let res = articleListDate.data.data.find(el => el.articleId == articleId)
    if (!res) return
    setPageTitle('修改文章')
    setArticleContent(res!.articleContent)
    setArticleTitle(res!.articleTitle)
    setArticleStatus(res!.articleStatus)
    setRank(res!.rank)
    if (res?.articleCoverUrl) {
      setFileList([{
        uid: res!.articleId,
        name: 'a',
        status: "done",
        response: { data: res.articleCoverUrl },
      }])
    }
    let newTagIds: string[] = res!.tagIds.map(el => el.split(',')[0])
    setTagIds(newTagIds)
    setCategoryId(res!.categoryId.split(',')[0])
  }, [])
  useEffect(() => {
    window.onbeforeunload = e => {
      if (isPublish) {
        return;
      }
      // 通知浏览器不要执行与事件关联的默认动作
      e.preventDefault();
      // Chrome 需要 returnValue 被设置成空字符串
      return '111';
    };
    return () => {
      window.onbeforeunload = null;
    }
  })
  useEffect(() => {

  }, [])
  //发布
  const publish = async () => {
    console.log('title', articleTitle, 'content', articleContent, 'tag', tagItems, 'category', categoryItems, 'rank', rank, 'img', fileList[0].response.data, 'status', articleStatus);
    if (articleTitle.replace(/\s*/g, '').length === 0) {
      setArticleTitle('【无标题】')
    } else if (articleTitle.replace(/\s*/g, '').length < 5) {
      message.error("标题长度不能小于5个字")
      return
    } else if (articleContent.length === 0) {
      message.error("请输入文章内容")
      return
    }
    if (tagItems.length === 0) {
      message.error("请设置文章标签")
      return
    }
    const tagIds = tagItems.map(el => el.tagId)
    if (articleId) {
      let res = await updateArticleReq({
        articleId: articleId,
        articleContent: articleContent,
        articleCoverUrl: fileList[0].response.data,
        articleStatus: articleStatus,
        articleTitle: articleTitle,
        categoryId: categoryItems[0].categoryId,
        rank: rank,
        tagIds: tagIds,
      })
      console.log(res)
      if (res.code !== 200){
        message.error(res.msg)
        return
      } 
      message.success('修改成功！')
      setIsPublish(true)
      return
    }
    let res = await addArticleReq({
      articleContent: articleContent,
      articleCoverUrl: fileList[0].response.data,
      articleStatus: articleStatus,
      articleTitle: articleTitle,
      categoryId: categoryItems[0].categoryId,
      rank: rank,
      tagIds: tagIds,
    })
    // console.log(res)
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    message.success('发布成功！')
    setIsPublish(true)
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
    console.log(file)
    if (file.status === 'removed') {
      setFileList([]);
    } else {

      setFileList([file]);
    }
    // console.log(7777, file);
    setIsPublish(false)

  }
  //获取图片
  const getImageList = async () => {
    let res = await getImageListReq({
      pageNum: currentPage,
      pageSize: 4,
      queryParam: {
      }
    })
    setTotalPage(res.data.totalPage)
    setImageList(res.data.data)
    setIsPublish(false)

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
      response: { data: el.imageUrl },
      url: el.imageUrl
    }
    setFileList([file])
    setIsPublish(false)

  }
  //上传文章内容图片
  const onUploadImg = async (files: string[], callback: (urls: string[]) => void) => {
    const res: imageUrlRes[] = await Promise.all(
      files.map((file) => {
        const form = new FormData();
        form.append('image', file);
        return uploadImageReq(form)
      })
    );
    callback(res.map((item) => item.data));
    setIsPublish(false)

  };
  const editorRef = useRef<ExposeParam>();
  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
  }, []);
  return (
    <div className='articals'>
      <p className="title">{pageTitle}</p>
      <div className="artical-form" >
        <Input placeholder="输入文章标题（5-50个字）" allowClear showCount maxLength={50} value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} />
        <Button type="primary" danger style={{ float: 'right' }} onClick={publish}>发布文章</Button>
        {/* <Button danger style={{ float: 'right', marginRight: '10px' }} onClick={publish}>保存草稿</Button> */}
      </div>
      <MdEditor
        ref={editorRef}
        editorId={id}
        modelValue={articleContent}
        onChange={setArticleContent}
        onUploadImg={onUploadImg}
        style={{ height: '500px', marginBottom: '20px' }}
        placeholder='开始编辑.....'
        // previewTheme='mk-cute'
        showCodeRowNumber={true}
        toolbarsExclude={['save']}
        // 识别vs code代码
        defToolbars={[
          <EmojiExtension onInsert={onInsert} key="emoji-extension" />,
          <ReadExtension mdText={articleContent} key="read-extension" />
        ]}
        autoDetectCode={true}
        toolbars={[
          'bold',
          'underline',
          'italic',
          'strikeThrough',
          '-',
          'title',
          'sub',
          'sup',
          'quote',
          'unorderedList',
          'orderedList',
          'task',
          '-',
          'codeRow',
          'code',
          'link',
          'image',
          'table',
          'mermaid',
          'katex',
          0,
          1,
          '-',
          'revoke',
          'next',
          'save',
          '=',
          'prettier',
          'pageFullscreen',
          // 'fullscreen',
          'preview',
          'htmlPreview',
          'catalog',
          'github'
        ]}
      />
      <p className="title">发布设置</p>
      <Form className='setting-form'>
        <Form.Item label="文章标签"  >
          <TagSelect tagData={useCallback((items: tagItemType[]) => setTagItems(items), [])} tagIds={tagIds} />
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
              <div className="setting-form__img-list">
                <div style={{ width: 100, height: 20 }}><span className='setting-form__next' onClick={handlePage}><RedoOutlined />换一批</span></div>
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
        <Form.Item label="文章分类" >
          <CategorySelect categoryData={useCallback((items: categoryItemType[]) => setCategoryItems(items), [])} categoryId={categoryId} />
        </Form.Item>
        <Form.Item label="可见范围">
          <Radio.Group onChange={(e) => setArticleStatus(e.target.value)} value={articleStatus}>
            <Radio value={1}>全部可见</Radio>
            <Radio value={2}>仅我可见</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否置顶">
          <Checkbox onChange={(e) => e.target.checked ? setRank(1) : setRank(0)} checked={rank === 1}>置顶</Checkbox>
        </Form.Item>
      </Form>
    </div>
  )
}
