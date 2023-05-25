import React, { useEffect, useState } from 'react'
import { Button, Input, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { deleteUserReq, getUserListReq, recoverUserReq } from '../../requests/api'
import { FormatData } from '../../hooks/formatData';
import globalConstant from '../../utils/globalConstant';

export default function User() {
  useEffect(() => {
    document.title = '用户-管理系统'
  }, [])
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<userItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [userList, setuserList] = useState<userItemType[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const [isDelete, setIsDelete] = useState(false)
  //获取用户列表
  const getUserList = async () => {
    setLoading(true)
    let res = await getUserListReq({
      orderByFields: { createTime: isDescend },
      pageNum: currentPage,
      pageSize: 5,
      queryParam: {
        isDelete: isDelete,
        username: searchVal ? searchVal : null
      }
    })
    if (res.code !== 200) return
    res.data.data.map(el => {
      el.createTime = FormatData(el.createTime)
      return el
    })
    setuserList(res.data.data)
    setTotalPage(res.data.totalPage)
    setLoading(false)
  }
  useEffect(() => {
    getUserList()
  }, [currentPage, isDescend, isDelete])
  //修改用户
  // const updateuser = async (row: userItemType) => {
  //   let res = await updateuserReq({
  //     auditType: row.auditType === 1 ? 2 : 1,
  //     userId: row.userId
  //   })
  //   if (res.code !== 200) return
  //   setSelectedRows([])
  //   setSelectedRowKeys([])
  //   getuserList()
  // }
  const deleteUser = async (ids: React.Key[]) => {
    let res = await deleteUserReq(ids)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    getUserList()
    setSelectedRows([])
    setSelectedRowKeys([])
  }
  const recoverUser = async (ids: React.Key[]) => {
    let res = await recoverUserReq(ids)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    getUserList()
    setSelectedRows([])
    setSelectedRowKeys([])

  }
  const columns: ColumnsType<userItemType> = [
    {
      title: '用户ID',
      dataIndex: 'userId',

    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: '9%'
    },
    {
      title: '真实姓名',
      dataIndex: 'nickname',
      width: '10%'
    },
    {
      title: '角色名',
      dataIndex: 'roleName',
      width: '9%'
    },
    {
      title: '性别',
      dataIndex: 'sexEnum',
      render: (_, record) => (
        <>
          <span>{record.sexEnum === '0' ? '未知' : record.sexEnum === '1' ? '男' : '女'}</span>
        </>
      ),
      width: '7%'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: '10%'
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber'
    },
    {
      title: () => {
        return <>
          <span >创建时间</span>
          <span style={{ position: 'relative', marginLeft: 5 }} onClick={() => setIsDescend((lastVa) => !lastVa)}>
            <CaretUpOutlined style={{ position: 'absolute', top: -2, color: isDescend ? globalConstant().color : "#aaa" }} />
            <CaretDownOutlined style={{ position: 'absolute', top: 5, left: 0, color: isDescend ? "#aaa" : globalConstant().color }} />
          </span>
        </>
      },
      dataIndex: 'createTime',
      width: '15%',

    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          {
            isDelete ?
              <a style={{ display:'block',color: 'red' }} onClick={() => recoverUser([record.userId])} >恢复</a> :
              <>
                <a style={{ display:'block',color: 'red' }} onClick={() => deleteUser([record.userId])} >删除</a>
                <a style={{ color: 'red' }} >更换角色</a>
              </>
          }
        </>
      ),
      width: '10%',
    },
  ];
  //选取用户行
  const rowSelection: TableRowSelection<userItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.userId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.userId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };
  return (
    <div className='users'>
      <p className="users__title">用户管理</p>
      <div className='users__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: !isDelete ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsDelete(false); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: !isDelete ? 'rgba(0, 0, 0, 0.45)' : globalConstant().color }}
          onClick={() => { setIsDelete(true); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="users__operation-form">
        <Button type='primary' danger style={{ marginLeft: '10px' }} disabled={selectedRows.length === 0} onClick={() => isDelete ? recoverUser(selectedRowKeys) : deleteUser(selectedRowKeys)}>
          {!isDelete ? <><DeleteOutlined />批量删除</>
            : <><PlusCircleOutlined />批量恢复</>}
        </Button>
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getUserList} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入用户名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getUserList() : ''} />
      </div>
      <Table columns={columns} dataSource={userList} rowKey='userId'
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
