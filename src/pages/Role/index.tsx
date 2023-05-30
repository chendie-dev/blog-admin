import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, FormInstance, Input, Modal, Table, Transfer, Tree, TreeProps, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Key, TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { addRoleReq, deleteRoleReq, updateRoleReq, recoverRoleReq, getRoleListReq } from '../../requests/api'
import { validatevalue } from '../../hooks/validate';
import globalConstant from '../../utils/globalConstant';
import { useMenuItems, useMenuItemsDispatch } from '../../components/MenuItemsProvider';
import { DataNode } from 'antd/es/tree';
import { utilFunc } from '../../hooks/utilFunc';
import { TransferDirection } from 'antd/es/transfer';
import { useResource, useResourceDispatch } from '../../components/ResourceDateProvider';

function handleMenuData(data: menuItemType[]): DataNode[] {
    let menuItem: DataNode[] = []
    data.forEach(el => {
        let menuItem1 = {
            title: el.menuName,
            key: el.menuId,
            children: [] as DataNode[]
        }
        if (el.children?.length > 0) menuItem1.children = [...handleMenuData(el.children)]
        menuItem.push(menuItem1)
    })
    return menuItem
}
export default function Role() {
    useEffect(() => {
        document.title = '角色-管理系统'

    }, [])
    const [isShow, setIsShow] = useState(0);//1添加
    const [isDescend, setIsDescend] = useState(true);//创建时间升降序
    const [isAll, setIsAll] = useState(1)//1全部，2回收站
    const [role, setRole] = useState<validateValType>({ value: '' });//添加/编辑角色名（校验）
    const [editRow, setEditRow] = useState<roleItemType>({} as roleItemType)
    const [currentPage, setCurrentPage] = useState(1)//当前页
    const [selectedRows, setSelectedRows] = useState<roleItemType[]>([])//选取行
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
    const [searchVal, setSearchVal] = useState('')
    const [loading, setLoading] = useState(true)
    const [roleList, setRoleList] = useState<roleItemType[]>([])
    const [totalPage, setTotalPage] = useState(0)
    const [newMenuData, setNewMenuData] = useState<DataNode[]>([])
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [resourceIds, setResourceIds] = useState<string[]>([]);
    const formRef = useRef<FormInstance>(null);
    const menuData = useMenuItems()
    const menuDispatch = useMenuItemsDispatch()
    const resourceData = useResource()
    const resourceDispatch = useResourceDispatch()
    useEffect(() => {
        menuDispatch({
            type: 'getmenu',
            payload: {
                orderByFields: {},
                pageNum: 1,
                pageSize: 10,
                queryParam: {
                    isDelete: false
                }
            }
        })
        resourceDispatch({
            type: 'getresourcedata',
            payload: {
                orderByFields: {},
                pageNum: 1,
                pageSize: 100,
                queryParam: {
                    isDelete: false
                }
            }
        })
    }, [])
    useEffect(() => {
        if (menuData.length > 0) {
            setNewMenuData(handleMenuData(menuData).reverse())
        }
    }, [menuData])
    //获取角色列表
    const getRoleList = async () => {
        setLoading(true)
        let res = await getRoleListReq({
            orderByFields: { createTime: isDescend },
            pageNum: currentPage,
            pageSize: 5,
            queryParam: {
                roleName: searchVal === '' ? null : searchVal,
                isDelete: isAll === 2
            }
        })
        if (res.code !== 200) {
            message.error(res.msg)
            return
        }
        res.data.data.forEach(el => el.createTime = utilFunc.FormatData(el.createTime))
        setTotalPage(res.data.totalPage)
        setRoleList(res.data.data)
        setLoading(false)
    }
    useEffect(() => {
        getRoleList()
    }, [currentPage, isDescend, isAll])
    //添加角色
    const addRole = async (value: addRoleParams) => {
        console.log(value)
        value.menuIds = selectedKeys as string[]
        let res = await addRoleReq(value)
        console.log(res);
        if (res.code !== 200) return
        message.success('添加成功！')
        setIsShow(0)
        getRoleList()
        setSelectedKeys([])
        formRef.current?.resetFields()
    }
    //回收站恢复
    const recoverRole = async (row?: roleItemType) => {
        let res;
        row ? res = await recoverRoleReq([row.roleId]) : res = await recoverRoleReq(selectedRowKeys)
        if (res.code !== 200) {
            message.error(res.msg)
            return
        }
        setSelectedRows([])
        setSelectedRowKeys([])
        getRoleList()
    }
    //删除角色
    const deleteRoleRows = async (row?: roleItemType) => {
        let res;
        row ? res = await deleteRoleReq([row.roleId]) : res = await deleteRoleReq(selectedRowKeys)
        if (res.code !== 200) {
            message.error(res.msg)
            return
        }
        getRoleList()
        setSelectedRows([])
        setSelectedRowKeys([])

    }
    const columns: ColumnsType<roleItemType> = [
        {
            title: '角色ID',
            dataIndex: 'roleId',
            width: '20%',

        },
        {
            title: '角色名',
            dataIndex: 'roleName',
        },
        {
            title: '描述',
            dataIndex: 'roleDesc',
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
                        <a style={{ color: globalConstant().color }} onClick={() => { setIsShow(2); setEditRow(record) }}>菜单权限</a>
                        <a style={{ color: globalConstant().color, marginLeft: 10 }} onClick={() => { setIsShow(3); setEditRow(record);setResourceIds(record.resourceIds) }}>资源权限</a>
                        <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deleteRoleRows(record) }}>删除</a>
                    </div>
                    <div style={{ display: isAll === 2 ? 'block' : 'none' }}>
                        <a style={{ color: 'red' }} onClick={() => recoverRole(record)}>恢复</a>
                    </div>
                </>
            ),
            width: '20%',
        },
    ];
    //选取角色行
    const rowSelection: TableRowSelection<roleItemType> = {
        selectedRowKeys,
        onSelect: (record, selected, selectedRows) => {
            let arr: React.Key[] = []
            selectedRows.forEach(el => { arr.push(el.roleId) })
            setSelectedRowKeys(arr)
            setSelectedRows(selectedRows);
        },
        onSelectAll: (_, selectedRows) => {
            let arr: React.Key[] = []
            selectedRows.forEach(el => { arr.push(el.roleId) })
            setSelectedRowKeys(arr)
            setSelectedRows(selectedRows);
        },
    };

    //修改角色
    const updateRole = async (value: updateRoleParams) => {
        value.menuIds = selectedKeys.length>0?selectedKeys:null
        value.resourceIds=resourceIds.length>0?resourceIds:null
        value.roleId = editRow.roleId
        let res = await updateRoleReq(value)
        if (res.code !== 200) {
            message.error(res.msg)
            return
        }
        message.success('修改成功！')
        setIsShow(0)
        getRoleList()
        setSelectedKeys([])
        setEditRow({} as roleItemType)
    }

    return (
        <div className='role'>
            <p className="role__title">角色管理</p>
            <div className='role__status'><button>状态</button>
                <button
                    style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
                    onClick={() => { setIsAll(1); setCurrentPage(1) }}
                    disabled={selectedRows.length > 0}>全部</button>
                <button
                    style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? 'rgba(0, 0, 0, 0.45)' : globalConstant().color }}
                    onClick={() => { setIsAll(2); setCurrentPage(1) }}
                    disabled={selectedRows.length > 0}>回收站</button>
            </div>
            <div className="role__operation-form">
                <Button type='primary' onClick={() => setIsShow(1)} disabled={isAll === 2}><PlusOutlined />添加</Button>
                <Button type='primary' danger style={{ marginLeft: '10px', display: isAll === 1 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => deleteRoleRows()}><DeleteOutlined />批量删除</Button>
                <Button type='primary' danger
                    style={{ marginLeft: '10px', display: isAll === 2 ? 'inline-block' : 'none' }}
                    disabled={selectedRows.length === 0}
                    onClick={() => recoverRole()}
                ><PlusCircleOutlined />批量恢复</Button>
                <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getRoleList} ><SearchOutlined />搜索</Button>
                <Input type="text" style={{ float: 'right' }} placeholder='请输入角色名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getRoleList() : ''} />
            </div>
            <Table columns={columns} dataSource={roleList} rowKey='roleId'
                loading={loading}
                pagination={{
                    current: currentPage,
                    defaultPageSize: 5,
                    total: totalPage * 5,//todo
                    onChange: (page) => setCurrentPage(page),
                }}
                rowSelection={{ ...rowSelection }}
            />
            {/* 添加角色模态框 */}
            <Modal title="添加角色"
                open={isShow === 1}
                onCancel={() => { setIsShow(0); }}
                footer={[]}
                destroyOnClose={true}
            >
                <Form
                    labelCol={{ span: 4 }}
                    labelAlign='left'
                    layout='vertical'
                    onFinish={addRole}
                    ref={formRef}

                >
                    <Form.Item
                        label='角色名称'
                        rules={[{ required: true, message: '不能为空' }]}
                        name={'roleName'}
                    >
                        <Input placeholder="请输入角色名称" allowClear />
                    </Form.Item>
                    <Form.Item
                        label='角色描述'
                        name={'roleDesc'}
                    >
                        <Input placeholder="请输入角色描述" allowClear />
                    </Form.Item>
                    <Form.Item
                        label='权限菜单'
                    >
                        <Tree
                            checkable
                            treeData={newMenuData}
                            onCheck={(checkedKeys, e) => { setSelectedKeys([...e.halfCheckedKeys as string[], ...checkedKeys as string[]]); }}

                        // checkStrictly={true}
                        // multiple={true}
                        />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" style={{ float: 'right', width: '20%' }} >
                            添加
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
            {/* 权限模态框 */}
            <Modal title="编辑角色"
                open={isShow === 2}
                onCancel={() => { setIsShow(0); setEditRow({} as roleItemType) }}
                footer={[]}
                destroyOnClose={true}
            >
                <Form
                    labelCol={{ span: 4 }}
                    labelAlign='left'
                    layout='vertical'
                    onFinish={updateRole}
                >
                    <Form.Item
                        label='角色名称'
                        rules={[{ required: true, message: '不能为空' }]}
                        name={'roleName'}
                        initialValue={editRow.roleName}
                    >
                        <Input placeholder="请输入角色名称" allowClear />
                    </Form.Item>
                    <Form.Item
                        label='角色描述'
                        name={'roleDesc'}
                        initialValue={editRow.roleDesc}
                    >
                        <Input placeholder="请输入角色描述" allowClear />
                    </Form.Item>
                    <Form.Item
                        label='权限菜单'
                    >
                        <Tree
                            checkable
                            defaultExpandedKeys={editRow.menuIds}
                            defaultCheckedKeys={editRow.menuIds}
                            onCheck={(checkedKeys, e) => { setSelectedKeys([...e.halfCheckedKeys as string[], ...checkedKeys as string[]]); }}
                            treeData={newMenuData}
                        />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" style={{ float: 'right', width: '20%' }} >
                            确定
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
            {/* 资源模态框 */}
            <Modal title="编辑资源"
                open={isShow === 3}
                onCancel={() => { setIsShow(0); setEditRow({} as roleItemType);setResourceIds([]) }}
                footer={[]}
                destroyOnClose={true}
            >
                <Form
                    labelCol={{ span: 4 }}
                    labelAlign='left'
                    layout='vertical'
                    onFinish={updateRole}
                >
                    <Form.Item
                        label='角色名称'
                        rules={[{ required: true, message: '不能为空' }]}
                        name={'roleName'}
                        initialValue={editRow.roleName}
                    >
                        <Input placeholder="请输入角色名称" allowClear />
                    </Form.Item>
                    <Form.Item
                        label='角色描述'
                        name={'roleDesc'}
                        initialValue={editRow.roleDesc}
                    >
                        <Input placeholder="请输入角色描述" allowClear />
                    </Form.Item>
                    <Form.Item
                        label='资源权限'
                    >
                        <Transfer
                            dataSource={resourceData.data.data}
                            rowKey={(record) => record.resourceId}
                            titles={['禁用资源', '已获资源']}
                            showSearch
                            filterOption={(inputValue: string, option: resourceItemType) =>option.resourceName.indexOf(inputValue) > -1}
                            targetKeys={resourceIds}
                            onChange={(newTargetKeys: string[]) => {setResourceIds(newTargetKeys)}}
                            render={(item) => item.resourceName}
                            listStyle={{ width: '100%' }}
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
