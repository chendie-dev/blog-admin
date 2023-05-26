import { useEffect, useState } from 'react'
import { Button, Input, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { updateMessageReq, getMessageReq } from '../../requests/api'
import { FormatData } from '../../hooks/formatData';
import globalConstant from '../../utils/globalConstant';

export default function Messages() {
  useEffect(() => {
    document.title = '留言-管理系统'
  }, [])
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<messageItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [auditType, setAuditType] = useState(1)
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [messageList, setMessageList] = useState<messageItemType[]>([])
  const [totalPage, setTotalPage] = useState(0)
  //获取留言列表
  const getMessageList = async () => {
    setLoading(true)
    let res = await getMessageReq({
      orderByFields: { createTime: isDescend },
      pageNum: currentPage,
      pageSize: 5,
      queryParam: {
        auditType: auditType,
        messageContent: searchVal === '' ? null : searchVal,
      }
    })
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    res.data.data.map(el => {
      el.createTime = FormatData(el.createTime)
      return el
    })
    setMessageList(res.data.data)
    setTotalPage(res.data.totalPage)
    setLoading(false)
  }
  useEffect(() => {
    getMessageList()
  }, [currentPage, isDescend, isAll])
  //修改留言
  const updateMessage = async (row: messageItemType) => {
    let res = await updateMessageReq({
      auditType: row.auditType === 1 ? 2 : 1,
      messageId: row.messageId
    })
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    setSelectedRows([])
    setSelectedRowKeys([])
    getMessageList()
  }
  const columns: ColumnsType<messageItemType> = [
    {
      title: '留言ID',
      dataIndex: 'messageId',
      width: '20%',

    },
    {
      title: '留言名',
      dataIndex: 'messageContent',
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
          <a style={{ color: 'red' }} onClick={() => updateMessage(record)}>{isAll === 2 ? '取消通过' : '通过'}</a>
        </>
      ),
      width: '20%',
    },
  ];
  //选取留言行
  const rowSelection: TableRowSelection<messageItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.messageId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.messageId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };
  return (
    <div className='message'>
      <p className="message__title">留言管理</p>
      <div className='message__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1); setAuditType(1) }}
          disabled={selectedRows.length > 0}>未审核</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? 'rgba(0, 0, 0, 0.45)' : globalConstant().color }}
          onClick={() => { setIsAll(2); setCurrentPage(1); setAuditType(2) }}
          disabled={selectedRows.length > 0}>已审核</button>
      </div>
      <div className="message__operation-form">
        {/* <Button type='primary' danger style={{display: isAll === 1 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => updateMessage()}><DeleteOutlined />批量通过</Button>
        <Button type='primary' danger
          style={{ display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => updateMessage()}
        ><PlusCircleOutlined />批量取消通过</Button> */}
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getMessageList} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入留言名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getMessageList() : ''} />
      </div>
      <Table columns={columns} dataSource={messageList} rowKey='messageId'
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
