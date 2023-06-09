import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Select, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { deleteUserReq, getRoleListReq, getUserListReq, recoverUserReq, updateRoleReq, updateUserRoleReq } from '../../requests/api'
import { utilFunc } from '../../hooks/utilFunc';
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
  const [isShow, setIsShow] = useState(false)
  const [editRow, setEditRow] = useState<userItemType>({} as userItemType)
  const [roleList, setRoleList] = useState<{value:string,label:string}[]>([])
  useEffect(() => {
    getRoleList()
  }, [])
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
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    res.data.data.map(el => {
      el.createTime = utilFunc.FormatData(el.createTime)
      return el
    })
    setuserList(res.data.data)
    setTotalPage(res.data.totalPage)
    setLoading(false)
  }
  //获取角色列表
  const getRoleList = async () => {
    setLoading(true)
    let res = await getRoleListReq({
      orderByFields: { createTime: isDescend },
      pageNum: 1,
      pageSize: 10,
      queryParam: {
        isDelete: false
      }
    })
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    let a=res.data.data.map(el =>{
      return {
        value:el.roleId,
        label:el.roleName
      }
    })
    setRoleList(a)
  }
  useEffect(() => {
    getUserList()
  }, [currentPage, isDescend, isDelete])
  // 修改用户
  const updateUser = async (value: { roleId: string, userId: string }) => {
    value.userId = editRow.userId
    let res = await updateUserRoleReq(value)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    message.success('修改成功')
    setSelectedRows([])
    setSelectedRowKeys([])
    getUserList()
    setIsShow(false)
  }
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
    // {
    //   title: '用户ID',
    //   dataIndex: 'userId',

    // },
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
      dataIndex: 'roleId',
      width: '9%',
      render:(_,record)=>(
        <>
        {
          roleList.map(el=>{
            if(el.value===record.roleId)return <span key={el.label}>{el.label}</span>
          })
        }
        </>
      )
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
              <a style={{ display: 'block', color: 'red' }} onClick={() => recoverUser([record.userId])} >恢复</a> :
              <>
                <a style={{ color: globalConstant().color }} onClick={() => { setIsShow(true); setEditRow(record) }} >更换角色</a>
                <a style={{ display: 'block', color: 'red' }} onClick={() => deleteUser([record.userId])} >删除</a>
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
      {/* 编辑模态框 */}
      <Modal
        title="编辑菜单"
        open={isShow}
        footer={[]}
        destroyOnClose={true}
        onCancel={() => { setIsShow(false); }}>

        <Form
          labelCol={{ span: 4 }}
          labelAlign='left'
          layout='vertical'
          onFinish={updateUser}
        >
          <Form.Item
            name='roleId'
            label='角色名'
            initialValue={editRow.roleId}
          >
            <Select
              options={roleList}
            />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit" style={{ float: 'right', width: '20%' }} >
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
