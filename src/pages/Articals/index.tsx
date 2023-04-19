import { InfiniteScroll } from 'antd-mobile'
import { useState, ChangeEvent, useEffect } from 'react'
import { Input, Button, Form, Upload, Modal, Radio, Checkbox, Tag } from 'antd'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import MdEditor from 'md-editor-rt';
import { TweenOneGroup } from 'rc-tween-one';
import 'md-editor-rt/lib/style.css';
import './index.scss'
import { addArticalReq, getTagListReq } from '../../requests/api'
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps, RcFile } from 'antd/es/upload';
import { addTagReq } from '../../requests/api';
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

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
  }, [])
  const [articleContent, setArticleContent] = useState('');//文章内容
  const [articleCoverUrl, setArticleCoverUrl] = useState('');//文章缩略图
  const [articleTitle, setArticleTitle] = useState('');//文章标题
  const [categoryId, setCategoryId] = useState(null);//分类id
  const [articleStatus, setArticleStatus] = useState(0);//文章状态值 1公开 2私密 3登录可见
  const [rank, setRank] = useState(0);//置顶排序
  const [previewOpen, setPreviewOpen] = useState(false);//图片预览模态框开关
  const [previewImage, setPreviewImage] = useState('');//图片路径
  const [previewTitle, setPreviewTitle] = useState('');//图片名称
  const [isShow, setIsShow] = useState(0)//1标签，2分类
  const [isShowSearch, setIsShowSearch] = useState(false)//是否显示搜索内容
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }
  ]);//已上传图片
  const [selectedTags, setSelectedTags] = useState<tagListType[]>([]);//已选择标签
  const [currentPage, setCurrentPage] = useState(0)//无限刷新第几页
  const [data, setData] = useState<tagListType[]>([])//无限刷新查询数据
  const [hasMore, setHasMore] = useState(true)//无限刷新是否还有更多
  const [search, setSearch] = useState<{
    value: string;
    validateStatus?: ValidateStatus;
    errorMsg?: string | null;
  }>({ value: '' })//搜索值
  const [searchList, setSearchList] = useState<tagListType[]>([]);//搜索内容
  const [isShowErr, setIsShowErr] = useState(false)//1长度，2个数
  //标签验证规则
  const validateTagVal = (tagVal: string,): {
    validateStatus: ValidateStatus;
    errorMsg: string | null;
  } => {
    if (tagVal.replace(/\s*/g, '').length <= 5) {
      return {

        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: '标签名长度最长为5',
    };
  };
  //获取标签列表
  const getTagList = async (pageNum: number, pageSize: number) => {
    return await getTagListReq({
      pageNum: pageNum,
      pageSize: pageSize,
      queryParam: {
        isDelete: false,
        tagName: search.value
      }
    })
  }
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
  // 删除已选择标签
  const handleClose = (tagId: string) => {
    const newTags = selectedTags.filter((tag) => tag.tagId !== tagId);
    setSelectedTags(newTags);
  };
  //选择/取消选择标签
  const checkChange = (tag: tagListType, checked: boolean) => {
    if (checked && selectedTags.length === 5) {
      setIsShowErr(true)
      return
    }
    setIsShowErr(false)
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t.tagId !== tag.tagId);
    setSelectedTags(nextSelectedTags);
  };
  //无限刷新标签
  const loadMore = async () => {
    let res = await getTagList(currentPage + 1, 90)
    setCurrentPage(currentPage + 1)
    setData(val => [...val, ...res.data.data])
    setHasMore(res.data.data.length > 0)
  }
  useEffect(() => {
    searchMore()
  }, [search.value])
  //搜索标签
  const searchMore = async () => {
    let res = await getTagList(1, 20)
    setSearchList(res.data.data)
  }
  //添加标签
  const addTag = async () => {
    if (search.value.replace(/\s*/g, '') == '' || search.value.replace(/\s*/g, '').length > 5) return
    await addTagReq({ tagName: search.value })
    let res1 = await getTagList(1, 1)
    setSelectedTags(val => [...val, res1.data.data[0]])
    setSearch({ value: '' })
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
          <div className="slt-mdl" style={{ display: isShow == 0 ? 'none' : 'block' }}>
            <h5>标签<CloseOutlined className='cancel' onClick={() => setIsShow(0)} /></h5>
            <Form.Item
              validateStatus={search.validateStatus}
              help={search.errorMsg}
            >
              <Input type='text' value={search.value}
                onChange={(e) => setSearch({ value: e.target.value, ...validateTagVal(e.target.value) })}
                onFocus={() => setIsShowSearch(true)}
                onBlur={() => { setTimeout(() => { setIsShowSearch(false) }, 250); }}
                placeholder='请输入文字搜索，按Enter键添加标签'
                onKeyUp={(e) => e.keyCode == 13 ? addTag() : ''} />
            </Form.Item>
            <div className="search-box" style={{ display: isShowSearch ? 'block' : 'none' }}>
              <div className="arrow"></div>
              <ul>
                {
                  searchList.map(el => {
                    return (
                      <li key={el.tagId}>
                        <Tag.CheckableTag
                          key={el.tagId}
                          checked={selectedTags.find(item => el.tagId == item.tagId) !== undefined}
                          onChange={(checked) => checkChange(el, checked)}
                        >
                          {el.tagName}
                        </Tag.CheckableTag>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            {/* 标签列表 */}
            <div className="tags">
              {data.map((item) => (
                <Tag.CheckableTag
                  key={item.tagId}
                  checked={selectedTags.find(el => el.tagId == item.tagId) !== undefined}
                  onChange={(checked) => checkChange(item, checked)}
                >
                  {item.tagName}
                </Tag.CheckableTag>
              ))}
              <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </div>
            <span className='tip' style={{ display: isShowErr ? 'inline-block' : 'none' }}>最多可添加5个标签</span>
          </div>
          <TweenOneGroup
            style={{ display: 'inline-block' }}
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
            }}
            onEnd={(e) => {
              if (e.type === 'appear' || e.type === 'enter') {
                (e.target as any).style = 'display: inline-block';
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}>
            {
              selectedTags.map((tag) => {
                return (
                  <span key={tag.tagId} style={{ display: 'inline-block' }}>
                    <Tag
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        handleClose(tag.tagId);
                      }}
                      color='blue'
                    >
                      {tag.tagName}
                    </Tag>
                  </span>
                );
              })
            }
          </TweenOneGroup>
          <Button type="dashed" className='btn' onClick={() => setIsShow(isShow == 1 ? 0 : 1)} style={{ display: selectedTags.length >= 5 ? 'none' : 'inline-block' }}><PlusOutlined />添加文章标签</Button>
        </Form.Item>
        <Form.Item label="文章分类" className='fm-itm'>
          <Button type="dashed"><PlusOutlined />添加文章分类</Button>
          {/* <div className="slt-mdl"></div> */}
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
