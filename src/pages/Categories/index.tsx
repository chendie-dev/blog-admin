import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface';
import './index.scss'
import { addCategoryReq, deleteCategoryReq, updateCategoryReq, recoverCategoryReq } from '../../requests/api'
import { useCategoryData, useCategoryDataDispatch } from '../../components/CategoryDataProvider';
import { validatevalue } from '../../hooks/validate';
import globalConstant from '../../utils/globalConstant';

export default function Categories() {
  useEffect(() => {
    document.title = '分类-管理系统'
  }, [])
  const [isShow, setIsShow] = useState(0);//1添加
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [category, setCategory] = useState<validateValType>({ value: '' });//添加/编辑分类名（校验）
  const [editRowId, setEditRowId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<categoryItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const categoryDispatch = useCategoryDataDispatch()
  const categoryData = useCategoryData()
  //获取分类列表
  const getCategoryList = async () => {
    setLoading(true)
    categoryDispatch({
      type: 'getCategorydata',
      payload: {
        orderByFields: { createTime: isDescend },
        pageNum: currentPage,
        pageSize: 5,
        queryParam: {
          categoryName: searchVal,
          isDelete: isAll === 2
        }
      }
    })
    setLoading(false)
  }
  useEffect(() => {
    getCategoryList()
  }, [currentPage, isDescend, isAll])
  //添加分类
  const addCategory = async () => {
    if (category.value.replace(/\s*/g, "") === '') {
      message.error('请输入分类名称')
      return
    } else if (category.value.replace(/\s*/g, "").length > 10) return
    let res = await addCategoryReq({ categoryName: category.value.replace(/\s*/g, "") })
    console.log(res);

    if (res.code !== 200) return
    message.success('添加成功！')
    setCategory({ value: '' })
    setIsShow(0)
    getCategoryList()
  }
  //回收站恢复
  const recoverCategory = async (row?: categoryItemType) => {
    let res;
    row ? res = await recoverCategoryReq([row.categoryId]) : res = await recoverCategoryReq(selectedRowKeys)
    if (res.code !== 200) return
    setSelectedRows([])
    setSelectedRowKeys([])
    getCategoryList()
  }
  //删除分类
  const deleteCategoryRows = async (row?: categoryItemType) => {
    let res;
    row ? res = await deleteCategoryReq([row.categoryId]) : res = await deleteCategoryReq(selectedRowKeys)
    if (res.code !== 200) return
    getCategoryList()
    setSelectedRows([])
    setSelectedRowKeys([])

  }
  const columns: ColumnsType<categoryItemType> = [
    {
      title: '分类ID',
      dataIndex: 'categoryId',
      width: '20%',

    },
    {
      title: '分类名',
      dataIndex: 'categoryName',
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
          <div style={{ display: isAll === 1 ? 'block' : 'none' }}>
            <a style={{ color: globalConstant().color }} onClick={() => { setIsShow(2); setCategory({ value: record.categoryName }); setEditRowId(record.categoryId) }}>编辑</a>
            <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deleteCategoryRows(record) }}>删除</a>
          </div>
          <div style={{ display: isAll === 2 ? 'block' : 'none' }}>
            <a style={{ color: 'red' }} onClick={() => recoverCategory(record)}>恢复</a>
          </div>
        </>
      ),
      width: '20%',
    },
  ];
  //选取分类行
  const rowSelection: TableRowSelection<categoryItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.categoryId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.categoryId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };

  //修改分类名
  const updateCategoryName = async () => {
    if (category.value.replace(/\s*/g, '') === '') {
      message.error("请输入分类名称！");
      return;
    } else if (category.value.replace(/\s*/g, '').length > 10) return
    let res = await updateCategoryReq({
      categoryId: editRowId,
      categoryName: category.value.replace(/\s*/g, ''),
    })
    if (res.code !== 200) return
    message.success('修改成功！')
    setIsShow(0)
    getCategoryList()
  }
  return (
    <div className='category'>
      <p className="category__title">分类管理</p>
      <div className='category__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? 'rgba(0, 0, 0, 0.45)' : globalConstant().color }}
          onClick={() => { setIsAll(2); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="category__operation-form">
        <Button type='primary' onClick={() => setIsShow(1)} disabled={isAll === 2}><PlusOutlined />添加</Button>
        <Button type='primary' danger style={{ marginLeft: '10px', display: isAll === 1 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => deleteCategoryRows()}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => recoverCategory()}
        ><PlusCircleOutlined />批量恢复</Button>
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getCategoryList} ><SearchOutlined />搜索</Button>
        <Input type="text" style={{ float: 'right' }} placeholder='请输入分类名称' allowClear prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getCategoryList() : ''} />
      </div>
      <Table columns={columns} dataSource={categoryData.data.data} rowKey='categoryId'
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: categoryData.data.totalPage * 5,//todo
          onChange: (page) => setCurrentPage(page),
        }}
        rowSelection={{ ...rowSelection }}
      />
      {/* 添加分类模态框 */}
      <Modal title="添加分类" okText='确定' cancelText='取消'
        open={isShow === 1} onOk={addCategory}
        onCancel={() => { setIsShow(0); setCategory({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={category.validateStatus}
            help={category.errorMsg}
          >
            <Input placeholder="请输入分类名称" allowClear style={{ margin: '20px 0' }}
              value={category.value}
              onKeyUp={(e) => e.keyCode === 13 ? addCategory() : ''}
              onChange={(e) => setCategory({ value: e.target.value, ...validatevalue(e.target.value,10) })} />
          </Form.Item>
        </Form>

      </Modal>
      {/* 编辑模态框 */}
      <Modal
        title="编辑分类"
        okText='确定'
        cancelText='取消'
        open={isShow === 2}
        onOk={updateCategoryName}
        onCancel={() => { setIsShow(0); setCategory({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={category.validateStatus}
            help={category.errorMsg}
          >
            <Input
              allowClear
              placeholder="请输入分类名称"
              style={{ margin: '20px 0' }}
              value={category.value}
              onKeyUp={(e) => e.keyCode === 13 ? updateCategoryName() : ''}
              onChange={(e) => setCategory({ value: e.target.value, ...validatevalue(e.target.value,10) })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
