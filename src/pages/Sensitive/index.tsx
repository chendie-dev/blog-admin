import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { addSensitiveReq, deleteSensitiveReq, updateSensitveReq, recoverSensitiveReq, getSensitiveListReq } from '../../requests/api'
import { validatevalue } from '../../hooks/validate';
import { FormatData } from '../../hooks/formatData';
import globalConstant from '../../utils/globalConstant';

export default function Sensitive() {
  useEffect(() => {
    document.title = '敏感词-管理系统'
  }, [])
  const [isShow, setIsShow] = useState(0);//1添加
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [isAll, setIsAll] = useState(1)//1白名单，2回收站，3黑名单
  const [sensitive, setSensitive] = useState<validateValType>({ value: '' });//添加/编辑敏感词名（校验）
  const [editRowId, setEditRowId] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<sensitiveItemType[]>([])//选取行
  const [sensitiveList, setSensitiveList] = useState<sensitiveItemType[]>([])//表格数据
  const [totalPage, setTotalPage] = useState(1)//总页数
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [sensitiveType, setSensitiveType] = useState(1)//敏感类型,可用值:0,1,2
  //获取敏感词列表
  const getSensitiveList = async () => {
    setLoading(true)
    let res = await getSensitiveListReq(
      {
        orderByFields: { createTime: isDescend },
        pageNum: currentPage,
        pageSize: 5,
        queryParam: {
          isDelete: isAll == 2 ? true : false,
          sensitiveType:isAll===2?null:sensitiveType,
          word:searchVal
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
    // console.log(res.data)
    setSensitiveList(res.data.data)
    setTotalPage(res.data.totalPage)
    setLoading(false)
  }
  useEffect(() => {
    getSensitiveList()
  }, [currentPage, isDescend, isAll])
  //添加敏感词
  const addSensitive = async () => {
    if (sensitive.value.replace(/\s*/g, "") === '') {
      message.error('请输入敏感词名称')
      return
    } else if (sensitive.value.replace(/\s*/g, "").length > 10) return
    let res = await addSensitiveReq({ sensitiveType: sensitiveType, word: sensitive.value.replace(/\s*/g, "") })
    // console.log(res);

     if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    message.success('添加成功！')
    setSensitive({ value: '' })
    setIsShow(0)
    getSensitiveList()
  }
  //回收站恢复
  const recoverSensitive = async (row?: sensitiveItemType) => {
    let res;
    row ? res = await recoverSensitiveReq([row.sensitiveId]) : res = await recoverSensitiveReq(selectedRowKeys)
     if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    setSelectedRows([])
    setSelectedRowKeys([])
    getSensitiveList()
  }
  //删除敏感词
  const deleteSensitiveRows = async (row?: sensitiveItemType) => {
    let res;
    row ? res = await deleteSensitiveReq([row.sensitiveId]) : res = await deleteSensitiveReq(selectedRowKeys)
     if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    getSensitiveList()
    setSelectedRows([])
    setSelectedRowKeys([])

  }
  const baseColumns: ColumnsType<sensitiveItemType> = [
    {
      title: '敏感词ID',
      dataIndex: 'sensitiveId',
      width: '20%',

    },
    {
      title: '敏感词名',
      dataIndex: 'word',
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

  ];
  const recycleColumn: ColumnsType<sensitiveItemType> = [
    ...baseColumns,
    {
      title: '所属分类',
      dataIndex: 'sensitiveType',
      width: '20%',
      render: (_, record) => (
        <span>{record.sensitiveType === 1 ? '白名单' : '黑名单'}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <a style={{ color: 'red' }} onClick={() => recoverSensitive(record)}>恢复</a>
        </>
      ),
      width: '20%',
    },

  ]
  const columns: ColumnsType<sensitiveItemType> = [
    ...baseColumns,
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <a style={{ color: globalConstant().color  }} onClick={() => { setIsShow(2); setSensitive({ value: record.word }); setEditRowId(record.sensitiveId) }}>编辑</a>
          <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deleteSensitiveRows(record) }}>删除</a>
          <a style={{ color: 'red', marginLeft: 10 }} onClick={() => {updateSensitive(false,record.sensitiveId); }}>加入{isAll === 1 ? '黑名单' : '白名单'}</a>
        </>
      ),
      width: '20%',
    },
  ]
  //选取敏感词行
  const rowSelection: TableRowSelection<sensitiveItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.sensitiveId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.sensitiveId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };

  //修改敏感词名
  const updateSensitive = async (isEdit?: boolean,editId?:number) => {
    if (isEdit) {
      if (sensitive.value.replace(/\s*/g, '') === '') {
        message.error("请输入敏感词名称！");
        return;
      } else if (sensitive.value.replace(/\s*/g, '').length > 10) return
    }
    let res = isEdit ? await updateSensitveReq({
      sensitiveId: editRowId,
      word: sensitive.value.replace(/\s*/g, ''),
    }) :
      await updateSensitveReq({
        sensitiveId: editId!,
        sensitiveType: sensitiveType == 1 ? 2 : 1
      })
     if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    setSensitive({value:''})
    setIsShow(0)
    getSensitiveList()
  }
  return (
    <div className='sensitive'>
      <p className="sensitive__title">敏感词管理</p>
      <div className='sensitive__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color  : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1); setSensitiveType(1) }}
          disabled={selectedRows.length > 0}>白名单</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 3 ? globalConstant().color  : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(3); setCurrentPage(1); setSensitiveType(2) }}
          disabled={selectedRows.length > 0}>黑名单</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 2 ? globalConstant().color  : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(2); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="sensitive__operation-form">
        <Button type='primary' onClick={() => setIsShow(1)} disabled={isAll === 2}><PlusOutlined />添加</Button>
        <Button type='primary' danger style={{ marginLeft: '10px', display: isAll === 2 ? 'none' : 'inline-block' }} disabled={selectedRows.length === 0} onClick={() => deleteSensitiveRows()}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => recoverSensitive()}
        ><PlusCircleOutlined />批量恢复</Button>
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={() => getSensitiveList()} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入敏感词名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getSensitiveList() : ''} />
      </div>
      <Table columns={isAll === 2 ? recycleColumn : columns} dataSource={sensitiveList} rowKey='sensitiveId'
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: totalPage * 5,//todo
          onChange: (page) => setCurrentPage(page),
        }}
        rowSelection={{ ...rowSelection }}
      />
      {/* 添加敏感词模态框 */}
      <Modal title="添加敏感词" okText='确定' cancelText='取消'
        open={isShow === 1} onOk={addSensitive}
        onCancel={() => { setIsShow(0); setSensitive({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={sensitive.validateStatus}
            help={sensitive.errorMsg}
          >
            <Input placeholder="请输入敏感词名称" allowClear style={{ margin: '20px 0' }}
              value={sensitive.value}
              onKeyUp={(e) => e.keyCode === 13 ? addSensitive() : ''}
              onChange={(e) => setSensitive({ value: e.target.value, ...validatevalue(e.target.value, 10) })} />
          </Form.Item>
        </Form>

      </Modal>
      {/* 编辑模态框 */}
      <Modal
        title="编辑敏感词"
        okText='确定'
        cancelText='取消'
        open={isShow === 2}
        onOk={() => updateSensitive(true)}
        onCancel={() => { setIsShow(0); setSensitive({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={sensitive.validateStatus}
            help={sensitive.errorMsg}
          >
            <Input
              allowClear
              placeholder="请输入敏感词名称"
              style={{ margin: '20px 0' }}
              value={sensitive.value}
              onKeyUp={(e) => e.keyCode === 13 ? updateSensitive(true) : ''}
              onChange={(e) => setSensitive({ value: e.target.value, ...validatevalue(e.target.value, 10) })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
