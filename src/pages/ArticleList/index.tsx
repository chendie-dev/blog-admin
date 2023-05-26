import { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Input, Switch, Table, Image, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { recoverArticleReq, deleteArticleReq, updateArticleReq, getTagListReq, getCategoryListReq } from '../../requests/api'
import { useArticleListData, useArticleListDataDispatch } from '../../components/ArticleListDateProvider';
import { useNavigate } from 'react-router-dom';
import TageInput from './TagInput'
import CategoryInput from './CategoryInput';
import globalConstant from '../../utils/globalConstant';

export default function ArticleList() {
  useEffect(() => {
    document.title = '文章列表-管理系统'
  }, [])
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [status, setStatus] = useState(0)//0全部1公开2私密3回收站
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<articleItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [categoryId, setCategoryId] = useState<string|null>(null)//条件查询
  const [tagIds, setTagIds] = useState<string[]|null>(null)//条件查询
  const articleDispatch = useArticleListDataDispatch()
  const articleListContext = useArticleListData()
  const [articleList, setArticleList] = useState<articleItemType[]>()
  const [totalPage, setTotalPage] = useState(0)
  const [articleStatus,setArticleStatus]=useState<number|null>(null)
  const navigateTo = useNavigate()
  useEffect(() => {
    matchId(articleListContext)
  }, [articleListContext])
  const matchId = async (articleListContext: articleListRes) => {
    let newarticleListContext:articleListRes=JSON.parse(JSON.stringify(articleListContext))
    let articleList = await Promise.all(
      newarticleListContext.data.data.map(async (el) => {
        let res = await Promise.all(
          el.tagIds.map(el1 => {
            return getTagListReq({
              orderByFields: {},
              pageNum: 1,
              pageSize: 1,
              queryParam: {
                isDelete: false,
                tagId: el1,
              }
            });
          })
        );
        for(let i=0;i<res.length;i++){
          el.tagIds[i]=res[i].data.data[0].tagName;
        }
        let res1 = await getCategoryListReq({
          orderByFields: {},
          pageNum: 1,
          pageSize: 1,
          queryParam: {
            isDelete: false,
            categoryId: el.categoryId,
          }
        });
        el.categoryId=res1.data.data[0].categoryName
        return el
      })
    )
    console.log(articleList)
    setArticleList(articleList)
    setTotalPage(articleListContext.data.totalPage)
  }
  //获取文章列表
  const getarticleList = async () => {
    setLoading(true)
    articleDispatch({
      type: 'getArticleListData',
      payload: {
        orderByFields: { createTime: !isDescend },
        pageNum: currentPage,
        pageSize: 5,
        queryParam: {
          isDelete: status === 3 ? true : false,
          articleTitle: searchVal===''?null:searchVal,
          categoryId: categoryId==='?'?null:categoryId,
          tagIds: tagIds,
          articleStatus:articleStatus
        }
      }
    })
    setLoading(false)
  }
  useLayoutEffect(() => {
    getarticleList()
  }, [currentPage, isDescend, status,tagIds,categoryId])

  //回收站恢复
  const recoverarticle = async (row?: articleItemType) => {
    let res;
    row ? res = await recoverArticleReq([row.articleId]) : res = await recoverArticleReq(selectedRowKeys)
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    setSelectedRows([])
    setSelectedRowKeys([])
    getarticleList()
  }
  //删除文章
  const deletearticleRows = async (row?: articleItemType) => {
    let res;
    row ? res = await deleteArticleReq([row.articleId]) : res = await deleteArticleReq(selectedRowKeys)
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    getarticleList()
    setSelectedRows([])
    setSelectedRowKeys([])

  }
  const columns: ColumnsType<articleItemType> = [

    {
      title: '文章ID',
      dataIndex: 'articleId',
      width: '5%'

    },
    {
      title: '文章封面',
      dataIndex: 'articleCoverUrl',
      width: '10%',
      render: (_, record) => (
        <>
          <Image
            width={50}
            src={record.articleCoverUrl}
          />
        </>
      )
    },
    {
      title: '文章标题',
      width: '20%',
      dataIndex: 'articleTitle',
    },
    {
      title: '文章分类',
      dataIndex: 'categoryId',
      width: '10%',
      render: (_, record) => (
        <>
          <span>{record.categoryId}</span>
        </>
      )
    },
    {
      title: '文章标签',
      dataIndex: 'tagIds',
      width: '10%',
      render: (_, record) => {
        return (
          <>
            {record.tagIds.map((el,index) => {
              return (<Tag key={index} color="geekblue" style={{ marginBottom: 5 }}>{el}</Tag>)
            })}
          </>
        )
      }
    },
    {
      title: () => {
        return <>
          <span >发布时间</span>
          <span style={{ position: 'relative', marginLeft: 5 }} onClick={() => setIsDescend((lastVa) => !lastVa)}>
            <CaretUpOutlined style={{ position: 'absolute', top: -2, color: isDescend ? globalConstant().color  : "#aaa" }} />
            <CaretDownOutlined style={{ position: 'absolute', top: 5, left: 0, color: isDescend ? "#aaa" : globalConstant().color  }} />
          </span>
        </>
      },
      dataIndex: 'createTime',
      width: '15%',

    },
    {
      title: '置顶',
      dataIndex: 'rank',
      width: '5%',
      render: (_, record) => (
        <>
          <Switch checked={record.rank === 1} onChange={(e) => { updateArticle(e, record.articleId) }} />
        </>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <div style={{ display: status !== 3 ? 'block' : 'none' }}>
            <a style={{ color: globalConstant().color }} onClick={() => navigateTo(`/articles/${record.articleId}`)}>编辑</a>
            <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deletearticleRows(record) }}>删除</a>
          </div>
          <div style={{ display: status === 3 ? 'block' : 'none' }}>
            <a style={{ color: 'red' }} onClick={() => recoverarticle(record)}>恢复</a>
          </div>
        </>
      ),
      width: '20%',
    },
  ]
  //选取文章行
  const rowSelection: TableRowSelection<articleItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.articleId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.articleId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };
  //置顶
  const updateArticle = async (val: boolean, articleId: string) => {
    let res = await updateArticleReq({ rank: val ? 1 : 0, articleId: articleId })
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    getarticleList()
  }
  return (
    <div className='article'>
      <p className="article__title">文章管理</p>
      <div className='article__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: status === 0 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setStatus(0); setCurrentPage(1); setArticleStatus(null)}}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: status === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setStatus(1); setCurrentPage(1);setArticleStatus(1) }}
          disabled={selectedRows.length > 0}>公开</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: status === 2 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setStatus(2); setCurrentPage(1);setArticleStatus(2) }}
          disabled={selectedRows.length > 0}>私密</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: status === 3 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setStatus(3); setCurrentPage(1);setArticleStatus(null) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="article__operation-form">
        <Button type='primary' danger style={{ display: status !== 3 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => deletearticleRows()}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ display: status === 3 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => recoverarticle()}
        ><PlusCircleOutlined />批量恢复</Button>

        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={() => getarticleList()} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入关键字' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getarticleList() : ''} />
        <TageInput getTagId={(tagId)=>setTagIds(tagId)} />
        <CategoryInput getCategoryId={(CategoryId)=>setCategoryId(CategoryId)}/>
      </div>
      <Table columns={columns} dataSource={articleList} rowKey="articleId"
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: totalPage * 5,//todo
          onChange: (page) => setCurrentPage(page),
        }}
        rowSelection={{ ...rowSelection }}
      />

    </div>
  )
}
