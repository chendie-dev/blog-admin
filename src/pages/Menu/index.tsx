import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, FormInstance, Input, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { addMenuReq, deleteMenuReq, updateMenuReq, recoverMenuReq, getMenuListReq } from '../../requests/api'
import globalConstant from '../../utils/globalConstant';
import { utilFunc } from '../../hooks/utilFunc';
import MyIcon from '../../components/MyIcon';
let handleId = (data: menuItemType[], ids: React.Key[]) => {
  data.forEach(el => {
    ids.push(el.menuId)
    if (el.children?.length > 0) handleId(el.children, ids)
  })
  return
}

export default function Menu() {
  useEffect(() => {
    document.title = '菜单-管理系统'
  }, [])
  const [isShow, setIsShow] = useState(0);//1添加
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [menu, setMenu] = useState<validateValType>({ value: '' });//添加/编辑菜单名（校验）
  const [editRow, setEditRow] = useState<menuItemType>({} as menuItemType)
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<menuItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [MenuList, setMenuList] = useState<menuItemType[]>([])
  const formRef = useRef<FormInstance>(null);

  //获取菜单列表
  const getMenuList = async () => {
    setLoading(true)
    let res = await getMenuListReq({
      orderByFields: { createTime: isDescend },
      pageNum: currentPage,
      pageSize: 10,
      queryParam: {
        menuName: searchVal === '' ? null : searchVal,
        isDelete: isAll === 2
      }
    })
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    const handleTime = (data: menuItemType[]) => {
      data.forEach(el => {
        el.createTime = utilFunc.FormatData(el.createTime)
        if (el.children?.length > 0) handleTime(el.children)
      })
      return
    }
    handleTime(res.data.data)
    setMenuList(res.data.data)
    setLoading(false)
  }
  useEffect(() => {
    getMenuList()
  }, [currentPage, isDescend, isAll])
  //添加菜单
  const addMenu = async (value: addMenuParams) => {
    if(editRow.menuId)value.parentId=editRow.menuId
    let res = await addMenuReq(value)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    message.success('添加成功！')
    setMenu({ value: '' })
    setIsShow(0)
    getMenuList()
    setEditRow({} as menuItemType)
    formRef.current?.resetFields();
  }
  //回收站恢复
  const recoverMenu = async (row?: menuItemType) => {
    let ids: React.Key[] = []
    row ? handleId([row], ids) : ids = [...selectedRowKeys]
    let res = await recoverMenuReq(ids)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    setSelectedRows([])
    setSelectedRowKeys([])
    getMenuList()
  }
  //删除菜单
  const deleteMenuRows = async (row?: menuItemType) => {
    let ids: React.Key[] = []
    row ? handleId([row], ids) : ids = [...selectedRowKeys]
    let res = await deleteMenuReq(ids)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    getMenuList()
    setSelectedRows([])
    setSelectedRowKeys([])

  }
  const columns: ColumnsType<menuItemType> = [
    // {
    //   title: '菜单ID',
    //   dataIndex: 'menuId',
    // },
    {
      title: '菜单名',
      dataIndex: 'menuName',
      width: '16%'
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: '6%',
      render: (_, record) => (
        <>
          <MyIcon type={record.icon} />
        </>
      )
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      width: '15%'

    },
    {
      title: '组件路径',
      dataIndex: 'component',
      width: '15%'

    },
    {
      title: '备注',
      dataIndex: 'menuDesc',
      width: '10%'

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
            <a style={{ color: globalConstant().color }} onClick={() => { setIsShow(1); setEditRow(record) }}><PlusOutlined />添加</a>
            <a style={{ color: globalConstant().color, marginLeft: 10 }} onClick={() => { setIsShow(2); setEditRow(record);} }>编辑</a>
            <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deleteMenuRows(record) }}>删除</a>
          </div>
          <div style={{ display: isAll === 2 ? 'block' : 'none' }}>
            <a style={{ color: 'red' }} onClick={() => recoverMenu(record)}>恢复</a>
          </div>
        </>
      ),
      width: '35%',
    },
  ];
  //选取菜单行
  const rowSelection: TableRowSelection<menuItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.menuId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.menuId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };

  //修改菜单名
  const updateMenu = async (value: menuItemType) => {
    value.menuId = editRow.menuId
    let res = await updateMenuReq(value)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    message.success('修改成功！')
    setIsShow(0)
    getMenuList()
    setEditRow({} as menuItemType)
  }
  return (
    <div className='menu'>
      <p className="menu__title">菜单管理</p>
      <div className='menu__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? 'rgba(0, 0, 0, 0.45)' : globalConstant().color }}
          onClick={() => { setIsAll(2); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="menu__operation-form">
        <Button type='primary' onClick={() => setIsShow(1)} disabled={isAll === 2}><PlusOutlined />添加</Button>
        <Button type='primary' danger style={{ marginLeft: '10px', display: isAll === 1 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => deleteMenuRows()}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => recoverMenu()}
        ><PlusCircleOutlined />批量恢复</Button>
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getMenuList} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入菜单名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getMenuList() : ''} />
      </div>
      <Table columns={columns} dataSource={MenuList} rowKey='menuId'
        loading={loading}
        rowSelection={{ ...rowSelection, checkStrictly: false }}
      />
      {/* 添加菜单模态框 */}
      <Modal title="添加菜单" footer={[]}
        open={isShow === 1}
        onCancel={() => { setIsShow(0) }}
      >
        <Form
          labelCol={{ span: 4 }}
          labelAlign='left'
          layout='vertical'
          onFinish={addMenu}
          ref={formRef}
        >
          <Form.Item
            name='menuName'
            label='菜单名'
            rules={[{ required: true, message: '不能为空' }, { min: 2, max: 64, message: '长度2-64个字' }]}
          >
            <Input placeholder='请输入菜单名' allowClear />
          </Form.Item>
          <Form.Item
            name={'icon'}
            label='图标'
          >
            <Input placeholder='请输入图标' allowClear />
          </Form.Item>
          <Form.Item
            name='path'
            label='路由地址'
            rules={[{ required: true, message: '不能为空' }, { min: 1, max: 256, message: '长度1-256个字' },]}
          >
            <Input placeholder='请输入路由地址' allowClear />
          </Form.Item>
          <Form.Item
            label='组件路径'
            name={'component'}
            rules={[{ min: 1, max: 256, message: '长度1-256个字' },]}
          >
            <Input placeholder='请输入组件路径' allowClear />
          </Form.Item>
          <Form.Item
            label='备注'
            name={'menuDesc'}
          >
            <Input placeholder='请输入备注' allowClear />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit" style={{ float: 'right', width: '20%' }} >
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 编辑模态框 */}
      <Modal
        title="编辑菜单"
        open={isShow === 2}
        footer={[]}
        destroyOnClose={true}
        onCancel={() => { setIsShow(0); setMenu({ value: '' }); }}>
        
       <Form
          labelCol={{ span: 4 }}
          labelAlign='left'
          layout='vertical'
          onFinish={updateMenu}
        >
          <Form.Item
            name='menuName'
            label='菜单名'
            initialValue={editRow.menuName}
            rules={[{ required: true, message: '不能为空' }, { min: 2, max: 64, message: '长度2-64个字' }]}
          >
            <Input placeholder='请输入菜单名' allowClear />
          </Form.Item>
          <Form.Item
            name={'icon'}
            label='图标'
            initialValue={editRow.icon}
          >
            <Input placeholder='请输入图标' allowClear />
          </Form.Item>
          <Form.Item
            name='path'
            label='路由地址'
            initialValue={editRow.path}
            rules={[{ required: true, message: '不能为空' }, { min: 1, max: 256, message: '长度1-256个字' },]}
          >
            <Input placeholder='请输入路由地址' allowClear />
          </Form.Item>
          <Form.Item
            label='组件路径'
            name={'component'}
            initialValue={editRow.component}
            rules={[{ min: 1, max: 256, message: '长度1-256个字' },]}
          >
            <Input placeholder='请输入组件路径' allowClear />
          </Form.Item>
          <Form.Item
            label='备注'
            name={'menuDesc'}
            initialValue={editRow.menuDesc}
          >
            <Input placeholder='请输入备注' allowClear />
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
