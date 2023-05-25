import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { addRoleReq, deleteRoleReq, updateRoleReq, recoverRoleReq, getRoleListReq } from '../../requests/api'
import { validatevalue } from '../../hooks/validate';
import globalConstant from '../../utils/globalConstant';

export default function Role() {
    useEffect(() => {
        document.title = '角色-管理系统'
    }, [])
    const [isShow, setIsShow] = useState(0);//1添加
    const [isDescend, setIsDescend] = useState(true);//创建时间升降序
    const [isAll, setIsAll] = useState(1)//1全部，2回收站
    const [role, setRole] = useState<validateValType>({ value: '' });//添加/编辑角色名（校验）
    const [editRowId, setEditRowId] = useState('')
    const [currentPage, setCurrentPage] = useState(1)//当前页
    const [selectedRows, setSelectedRows] = useState<roleItemType[]>([])//选取行
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
    const [searchVal, setSearchVal] = useState('')
    const [loading, setLoading] = useState(true)
    const [roleList,setRoleList]=useState<roleItemType[]>([])
    const [totalPage,setTotalPage]=useState(0)
    //获取角色列表
    const getRoleList = async () => {
        setLoading(true)
        let res = await getRoleListReq({
            orderByFields: { createTime: isDescend },
            pageNum: currentPage,
            pageSize: 5,
            queryParam: {
                roleName: searchVal===''?null:searchVal,
                isDelete: isAll === 2
            }
        })
        if(res.code!==200){
            message.error(res.msg)
            return
        }
        setTotalPage(res.data.totalPage)
        setRoleList(res.data.data)
        setLoading(false)
    }
    useEffect(() => {
        getRoleList()
    }, [currentPage, isDescend, isAll])
    //添加角色
      const addRole = async () => {
        if (role.value.replace(/\s*/g, "") === '') {
          message.error('请输入角色名称')
          return
        } else if (role.value.replace(/\s*/g, "").length > 10) return
        // let res = await addRoleReq({ roleName: role.value.replace(/\s*/g, "") })
        // console.log(res);

        // if (res.code !== 200) return
        message.success('添加成功！')
        setRole({ value: '' })
        setIsShow(0)
        getRoleList()
      }
    //回收站恢复
    const recoverRole = async (row?: roleItemType) => {
        let res;
        row ? res = await recoverRoleReq([row.roleId]) : res = await recoverRoleReq(selectedRowKeys)
        if (res.code !== 200) return
        setSelectedRows([])
        setSelectedRowKeys([])
        getRoleList()
    }
    //删除角色
    const deleteRoleRows = async (row?: roleItemType) => {
        let res;
        row ? res = await deleteRoleReq([row.roleId]) : res = await deleteRoleReq(selectedRowKeys)
        if (res.code !== 200) return
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
            title: '权限',
            dataIndex: 'menuIds',
            render: (_, record) => (
                <>
                    {
                        record.menuIds.map((el, index) => {
                            return <span key={index}>{el}</span>
                        })
                    }
                </>
            )
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
                        <a style={{ color: globalConstant().color }} onClick={() => { setIsShow(2); setRole({ value: record.roleName }); setEditRowId(record.roleId) }}>编辑</a>
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

    //修改角色名
      const updateRoleName = async () => {
        if (role.value.replace(/\s*/g, '') === '') {
          message.error("请输入角色名称！");
          return;
        } else if (role.value.replace(/\s*/g, '').length > 10) return
        // let res = await updateRoleReq({
        //   roleId: editRowId,
        //   roleName: role.value.replace(/\s*/g, ''),
        // })
        // if (res.code !== 200) return
        message.success('修改成功！')
        setIsShow(0)
        getRoleList()
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
            <Modal title="添加角色" okText='确定' cancelText='取消'
                open={isShow === 1} onOk={addRole}
                onCancel={() => { setIsShow(0); setRole({ value: '' }) }}>
                <Form>
                    <Form.Item
                        validateStatus={role.validateStatus}
                        help={role.errorMsg}
                    >
                        <Input placeholder="请输入角色名称" allowClear style={{ margin: '20px 0' }}
                            value={role.value}
                            onKeyUp={(e) => e.keyCode === 13 ? addRole() : ''}
                            onChange={(e) => setRole({ value: e.target.value, ...validatevalue(e.target.value, 10) })} />
                    </Form.Item>
                </Form>

            </Modal>
            {/* 编辑模态框 */}
            <Modal
                title="编辑角色"
                okText='确定'
                cancelText='取消'
                open={isShow === 2}
                onOk={updateRoleName}
                onCancel={() => { setIsShow(0); setRole({ value: '' }) }}>
                <Form>
                    <Form.Item
                        validateStatus={role.validateStatus}
                        help={role.errorMsg}
                    >
                        <Input
                            allowClear
                            placeholder="请输入角色名称"
                            style={{ margin: '20px 0' }}
                            value={role.value}
                            onKeyUp={(e) => e.keyCode === 13 ? updateRoleName() : ''}
                            onChange={(e) => setRole({ value: e.target.value, ...validatevalue(e.target.value, 10) })} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
