import { useEffect, useState } from 'react'
import { Button, Input, Modal, message, Table } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { addTagReq, deleteTagListReq, updataTagNameReq, recoverTagReq } from '../../requests/api'
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { getTagList } from '../../store/reqDataSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import './index.scss'

export default function Tags() {
  useEffect(() => {
    document.title = '标签-管理系统'
  }, [])
  const [isShow, setIsShow] = useState(0);//1添加，2编辑
  const [tagName, setTagName] = useState('')//标签名（添加）
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [searchTagName, setSearchTagName] = useState('')//搜索框值
  const [selectedRows, setSelectedRows] = useState<tagListType[]>([])//选取行
  const [editRowName, setEditRowname] = useState('')//标签名（编辑）
  const [editRowId, setEditRowId] = useState('')
  const dispatch = useAppDispatch()
  const { tagList, totalNumber } = useAppSelector((state) => ({
    tagList: state.reqData.tagListData.data,
    totalNumber: state.reqData.tagListData.totalNumber
  }))
  useEffect(() => {
    dispatchTagList()
  }, [isDescend, currentPage, isAll])
  //添加标签
  const addtag = async () => {
    if (tagName.replace(/\s*/g, '') == '') {
      message.error("请输入标签名称！");
      return;
    }
    let res = await addTagReq({ tagName: tagName });
    if (res.code !== 200) return
    console.log(res);

    message.success("添加成功！")
    setTagName('')
    setIsShow(0)
    dispatchTagList()
  }
  //获取标签
  const dispatchTagList = () => {
    dispatch(getTagList(
      {
        orderByFields: { createTime: !isDescend },
        pageNum: currentPage,
        pageSize: 5,
        queryParam: {
          isDelete: isAll == 1 ? false : true,
          tagName: searchTagName
        }
      }
    ))
  }
  const columns: ColumnsType<tagListType> = [
    {
      title: '标签ID',
      dataIndex: 'tagId',
      width: '20%',

    },
    {
      title: '标签名',
      dataIndex: 'tagName',
    },
    {
      title: () => {
        return <>
          <span >创建时间</span>
          <span style={{ position: 'relative', marginLeft: 5 }} onClick={() => setIsDescend((lastVa) => !lastVa)}>
            <CaretUpOutlined style={{ position: 'absolute', top: -2, color: isDescend ? "#1677ff" : "#aaa" }} />
            <CaretDownOutlined style={{ position: 'absolute', top: 5, left: 0, color: isDescend ? "#aaa" : "#1677ff" }} />
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
          <div style={{ display: isAll == 1 ? 'block' : 'none' }}>
            <a style={{ color: '#1677ff' }} onClick={() => { setIsShow(2); setEditRowname(record.tagName); setEditRowId(record.tagId) }}>编辑</a>
            <a style={{ color: 'red', marginLeft: 10 }} onClick={() => {deleteTagRows(record) }}>删除</a>
          </div>
          <div style={{ display: isAll == 2 ? 'block' : 'none' }}>
            <a style={{ color: 'red' }} onClick={()=>recoverTag(record)}>恢复</a>
          </div>
        </>
      ),
      width: '20%',
    },
  ];
  //选取标签行
  const rowSelection: TableRowSelection<tagListType> = {
    onSelect: (record, selected, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  //修改标签名
  const editTagName = async () => {
    if (editRowName.replace(/\s*/g, '') == '') {
      message.error("请输入标签名称！");
      return;
    }
    let res = await updataTagNameReq({
      tagId: editRowId,
      tagName: editRowName,
      userId: '1'//todo
    })
    if (res.code !== 200) return
    message.success('修改成功！')
    setIsShow(0)
    dispatchTagList()
  }
  //回收站恢复
  const recoverTag = async (row?:tagListType) => {
    let arr: number[] = []
    if(row){
      arr.push(Number(row.tagId))
    }else{
      selectedRows.forEach(el => {
        arr.push(Number(el.tagId))
      })
    }
    let res = await recoverTagReq(arr)
    console.log('recover',res);
    if (res.code !== 200) return
    dispatchTagList()
  }
  //删除标签
  const deleteTagRows = async (row?:tagListType) => {
    let arr: number[] = []
    if(row){
      arr.push(Number(row.tagId))
    }else{
      selectedRows?.forEach(el => {
        arr.push(Number(el.tagId))
      })
    }
    let res = await deleteTagListReq(arr);
    console.log('delete',res);
    if (res.code !== 200) return
    message.success('删除成功！')
    dispatchTagList()
  }
  return (
    <div className='tags'>
      <p className="card-title">标签管理</p>
      <div className='tag-status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll == 1 ? '#1677ff' : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => setIsAll(1)}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll == 1 ? 'rgba(0, 0, 0, 0.45)' : '#1677ff' }}
          onClick={() => setIsAll(2)}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="opt-form">
        <Button type='primary'
          onClick={() => setIsShow(1)}
          disabled={isAll !== 1}><PlusOutlined />添加</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll == 1 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length == 0} onClick={()=>deleteTagRows}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll == 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length == 0}><PlusCircleOutlined />批量恢复</Button>
        <Button type='primary'
          style={{ float: 'right', marginLeft: '10px' }}
          onClick={dispatchTagList}><SearchOutlined />搜索</Button>
        <Input value={searchTagName} onChange={(el) => setSearchTagName(el.target.value)}
          onKeyUp={(e) => e.keyCode == 13 ? dispatchTagList() : ''}
          type="text" style={{ float: 'right' }}
          placeholder='请输入标签名称'
          prefix={<SearchOutlined style={{ color: '#aaa' }} />} />
      </div>
      <Table columns={columns} dataSource={tagList} rowKey='tagId'
        pagination={{
          defaultCurrent: currentPage,
          defaultPageSize: 5,
          total: totalNumber * 5,
          onChange: (page) => setCurrentPage(page),
        }}
        rowSelection={{ ...rowSelection }}
      />
      <Modal
        title="添加标签"
        okText='确定'
        cancelText='取消'
        open={isShow == 1}
        onOk={addtag}
        onCancel={() => setIsShow(0)}>
        <Input
          placeholder="请输入标签名称"
          style={{ margin: '20px 0' }}
          value={tagName}
          onKeyUp={(e) => e.keyCode == 13 ? addtag() : ''}
          onChange={(e) => setTagName(e.target.value)} />
      </Modal>
      <Modal
        title="编辑标签"
        okText='确定'
        cancelText='取消'
        open={isShow == 2}
        onOk={editTagName}
        onCancel={() => setIsShow(0)}>
        <Input
          placeholder="请输入标签名称"
          style={{ margin: '20px 0' }}
          value={editRowName}
          onKeyUp={(e) => e.keyCode == 13 ? editTagName() : ''}
          onChange={(e) => setEditRowname(e.target.value)} />
      </Modal>
    </div>
  )
}
