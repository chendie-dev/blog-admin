import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, FormInstance, Input, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import {  TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { addResourceReq, deleteResourceReq, updateResourceReq, recoverResourceReq } from '../../requests/api'
import globalConstant from '../../utils/globalConstant';
import { useResource, useResourceDispatch } from '../../components/ResourceDateProvider';

export default function Resource() {
  useEffect(() => {
    document.title = '接口-管理系统'

  }, [])
  const [isShow, setIsShow] = useState(0);//1添加
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [editRow, setEditRow] = useState<resourceItemType>({} as resourceItemType)
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<resourceItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [resourceList, setresourceList] = useState<resourceItemType[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const formRef = useRef<FormInstance>(null);
  const resourceDate=useResource()
  const resourceDispatch=useResourceDispatch()
  useEffect(()=>{
    if(!resourceDate.data.data)return
    setresourceList(resourceDate.data.data)
    setTotalPage(resourceDate.data.totalPage)
  },[resourceDate])
  //获取接口列表
  const getResourceList = async () => {
    setLoading(true)
    resourceDispatch({
      type:'getresourcedata',
      payload:{
        orderByFields: { createTime: isDescend },
        pageNum: currentPage,
        pageSize: 5,
        queryParam: {
          resourceName: searchVal === '' ? null : searchVal,
          isDelete: isAll === 2
        }
      }
    })
    setLoading(false)
  }
  useEffect(() => {
    getResourceList()
  }, [currentPage, isDescend, isAll])
  //添加接口
  const addResource = async (value: addResourceParams) => {
    let res = await addResourceReq(value)
    console.log(res);
    if (res.code !== 200) return
    message.success('添加成功！')
    setIsShow(0)
    getResourceList()
    formRef.current?.resetFields()
  }
  //回收站恢复
  const recoverresource = async (row?: resourceItemType) => {
    let res;
    row ? res = await recoverResourceReq([row.resourceId]) : res = await recoverResourceReq(selectedRowKeys)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    setSelectedRows([])
    setSelectedRowKeys([])
    getResourceList()
  }
  //删除接口
  const deleteresourceRows = async (row?: resourceItemType) => {
    let res;
    row ? res = await deleteResourceReq([row.resourceId]) : res = await deleteResourceReq(selectedRowKeys)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    getResourceList()
    setSelectedRows([])
    setSelectedRowKeys([])

  }
  const columns: ColumnsType<resourceItemType> = [
    {
      title: '接口名称',
      dataIndex: 'resourceName',
      width: '20%',

    },
    {
      title: '接口uri地址',
      dataIndex: 'uri',
    },
    {
      title: '描述',
      dataIndex: 'resourceDesc',
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
      width: '20%',

    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <div style={{ display: isAll === 1 ? 'block' : 'none' }}>
            <a style={{ color: globalConstant().color }} onClick={() => { setIsShow(2); setEditRow(record) }}>编辑</a>
            <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deleteresourceRows(record) }}>删除</a>
          </div>
          <div style={{ display: isAll === 2 ? 'block' : 'none' }}>
            <a style={{ color: 'red' }} onClick={() => recoverresource(record)}>恢复</a>
          </div>
        </>
      ),
      width: '20%',
    },
  ];
  //选取接口行
  const rowSelection: TableRowSelection<resourceItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.resourceId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.resourceId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };

  //修改接口
  const updateresource = async (value: updateResourceParams) => {
    value.resourceId = editRow.resourceId
    // console.log(value)
    let res = await updateResourceReq(value)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    message.success('修改成功！')
    setIsShow(0)
    getResourceList()
  }
  return (
    <div className='resource'>
      <p className="resource__title">接口管理</p>
      <div className='resource__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? 'rgba(0, 0, 0, 0.45)' : globalConstant().color }}
          onClick={() => { setIsAll(2); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="resource__operation-form">
        <Button type='primary' onClick={() => setIsShow(1)} disabled={isAll === 2}><PlusOutlined />添加</Button>
        <Button type='primary' danger style={{ marginLeft: '10px', display: isAll === 1 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => deleteresourceRows()}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => recoverresource()}
        ><PlusCircleOutlined />批量恢复</Button>
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getResourceList} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入接口名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getResourceList() : ''} />
      </div>
      <Table columns={columns} dataSource={resourceList} rowKey='resourceId'
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: totalPage * 5,//todo
          onChange: (page) => setCurrentPage(page),
        }}
        rowSelection={{ ...rowSelection }}
      />
      {/* 添加接口模态框 */}
      <Modal title="添加接口"
        open={isShow === 1}
        onCancel={() => { setIsShow(0); }}
        footer={[]}
      >
        <Form
          labelCol={{ span: 4 }}
          labelAlign='left'
          layout='vertical'
          onFinish={addResource}
          ref={formRef}
        >
          <Form.Item
            label='接口名称'
            rules={[{ required: true, message: '不能为空' }]}
            name={'resourceName'}
          >
            <Input placeholder="请输入接口名称" allowClear />
          </Form.Item>
          <Form.Item
            label='接口uri'
            rules={[{ required: true, message: '不能为空' }]}
            name={'uri'}
          >
            <Input placeholder="请输入接口uri" allowClear />
          </Form.Item>
          <Form.Item
            label='接口描述'
            name={'resourceDesc'}
          >
            <Input placeholder="请输入接口描述" allowClear />
          </Form.Item>

          <Form.Item >
            <Button type="primary" htmlType="submit" style={{ float: 'right', width: '20%' }} >
              添加
            </Button>
          </Form.Item>
        </Form>

      </Modal>
      {/* 编辑模态框 */}
      <Modal title="编辑接口"
        open={isShow === 2}
        onCancel={() => { setIsShow(0); }}
        footer={[]}
      >
        <Form
          labelCol={{ span: 4 }}
          labelAlign='left'
          layout='vertical'
          onFinish={updateresource}
        >
          <Form.Item
            label='接口名称'
            rules={[{ required: true, message: '不能为空' }]}
            name={'resourceName'}
            initialValue={editRow.resourceName}
          >
            <Input placeholder="请输入接口名称" allowClear />
          </Form.Item>
          <Form.Item
            label='接口uri'
            rules={[{ required: true, message: '不能为空' }]}
            name={'uri'}
            initialValue={editRow.uri}
          >
            <Input placeholder="请输入接口uri" allowClear />
          </Form.Item>
          <Form.Item
            label='接口描述'
            name={'resourceDesc'}
            initialValue={editRow.resourceDesc}
          >
            <Input placeholder="请输入接口描述" allowClear />
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
