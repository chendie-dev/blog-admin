import { useEffect, useState } from 'react'
import { Button, Input, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { auditCommentReq, getCommentListReq } from '../../requests/api'
import { utilFunc } from '../../hooks/utilFunc';
import globalConstant from '../../utils/globalConstant';

export default function Comment() {
  useEffect(() => {
    document.title = '评论-管理系统'
  }, [])
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<commentItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [auditType, setAuditType] = useState(1)
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [commentList, setCommentList] = useState<commentItemType[]>([])
  const [totalPage, setTotalPage] = useState(0)
  //获取评论列表
  const getcommentList = async () => {
    setLoading(true)
    let res = await getCommentListReq({
      orderByFields: { createTime: isDescend },
      pageNum: currentPage,
      pageSize: 5,
      queryParam: {
        auditType: auditType,
        commentContent: searchVal === '' ? null : searchVal,
      }
    })
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    res.data.data.map(el => {
      el.createTime = utilFunc.FormatData(el.createTime)
      return el
    })
    console.log(res.data.data)
    setCommentList(res.data.data)
    setTotalPage(res.data.totalPage)
    setLoading(false)
  }
  useEffect(() => {
    getcommentList()
  }, [currentPage, isDescend, isAll])
  //修改评论
  const auditComment = async (row: commentItemType,auditType:number) => {
    let res = await auditCommentReq({
      auditType: auditType,
      commentId: row.commentId
    })
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    setSelectedRows([])
    setSelectedRowKeys([])
    getcommentList()
  }
  const columns: ColumnsType<commentItemType> = [
    {
      title: '评论ID',
      dataIndex: 'commentId',
      width: '20%',

    },
    {
      title: '内容',
      dataIndex: 'commentContent',
    },
    {
      title: () => {
        return <>
          <span >创建时间</span>
          <span style={{ position: 'relative', marginLeft: 5 }} onClick={() => setIsDescend((lastVa) => !lastVa)}>
            <CaretUpOutlined style={{ position: 'absolute', top: -2, color: isDescend ? globalConstant().color  : "#aaa" }} />
            <CaretDownOutlined style={{ position: 'absolute', top: 5, left: 0, color: isDescend ? "#aaa" : globalConstant().color  }} />
          </span>
        </>
      },
      dataIndex: 'createTime',
      width: '20%',

    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <a style={{ color: 'red',marginRight:10,display:isAll===2?'inline-block':'none' }} onClick={() => {auditComment(record,3)}}>取消通过</a>
          <a style={{ color: 'red',marginRight:10,display:isAll===2?'none':'inline-block' }} onClick={() => {auditComment(record,2)}}>通过</a>
          <a style={{ color: 'red',display:isAll===1?'inline-block':'none' }} onClick={() => {auditComment(record,3)}}>不通过</a>
        </>
      ),
      width: '20%',
    },
  ];
  //选取评论行
  const rowSelection: TableRowSelection<commentItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.commentId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.commentId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };
  return (
    <div className='comment'>
      <p className="comment__title">评论管理</p>
      <div className='comment__status'><button>状态</button>
      <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1); setAuditType(1) }}
          disabled={selectedRows.length > 0}>未审核</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 2 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(2); setCurrentPage(1); setAuditType(2) }}
          disabled={selectedRows.length > 0}>已通过</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 3 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)'}}
          onClick={() => { setIsAll(3); setCurrentPage(1); setAuditType(3) }}
          disabled={selectedRows.length > 0}>未通过</button>
      </div>
      <div className="comment__operation-form">
        {/* <Button type='primary' danger style={{display: isAll === 1 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => updatecomment()}><DeleteOutlined />批量通过</Button>
        <Button type='primary' danger
          style={{ display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => updatecomment()}
        ><PlusCircleOutlined />批量取消通过</Button> */}
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getcommentList} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入评论名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getcommentList() : ''} />
      </div>
      <Table columns={columns} dataSource={commentList} rowKey='commentId'
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: totalPage * 5,//todo
          onChange: (page) => setCurrentPage(page),
        }}
      // rowSelection={{ ...rowSelection }}
      />
    </div>
  )
}
