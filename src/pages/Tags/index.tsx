import { useEffect, useState } from 'react'
import { Button, Input, Modal, message, Table, Form } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { addTagReq, deleteTagListReq, updataTagNameReq, recoverTagReq } from '../../requests/api'
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { getTagList } from '../../store/reqDataSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import './index.scss'
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
export default function Tags() {
  useEffect(() => {
    document.title = '标签-管理系统'
  }, [])
  const [isShow, setIsShow] = useState(0);//1添加，2编辑
  const [tag, setTag] = useState<{
    value: string;
    validateStatus?: ValidateStatus;
    errorMsg?: string | null;
  }>({ value: '' });//添加/编辑标签名（校验）
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [searchTagName, setSearchTagName] = useState('')//搜索框值
  const [selectedRows, setSelectedRows] = useState<tagListType[]>([])//选取行
  const [editRowId, setEditRowId] = useState('')
  const dispatch = useAppDispatch()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const { tagList, totalNumber } = useAppSelector((state) => ({
    tagList: state.reqData.tagListData.data,
    totalNumber: state.reqData.tagListData.totalNumber
  }))
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    dispatchTagList()
  }, [isDescend, currentPage, isAll])
  //添加标签
  const addtag = async () => {
    if (tag.value.replace(/\s*/g, '') === '') {
      message.error("请输入标签名称！");
      return;
    } else if (tag.value.replace(/\s*/g, '').length > 5) return
    let res = await addTagReq({ tagName: tag.value });
    if (res.code !== 200) return
    message.success("添加成功！")
    setTag({ value: '' })
    setIsShow(0)
    dispatchTagList()
  }
  //获取标签
  const dispatchTagList = () => {
    setLoading(true)
    dispatch(getTagList(
      {
        orderByFields: { createTime: !isDescend },
        pageNum: currentPage,
        pageSize: 5,
        queryParam: {
          isDelete: isAll === 1 ? false : true,
          tagName: searchTagName
        }
      }
    ))
    setLoading(false)
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
          <div style={{ display: isAll === 1 ? 'block' : 'none' }}>
            <a style={{ color: '#1677ff' }} onClick={() => { setIsShow(2); setTag({ value: record.tagName }); setEditRowId(record.tagId) }}>编辑</a>
            <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deleteTagRows(record) }}>删除</a>
          </div>
          <div style={{ display: isAll === 2 ? 'block' : 'none' }}>
            <a style={{ color: 'red' }} onClick={() => recoverTag(record)}>恢复</a>
          </div>
        </>
      ),
      width: '20%',
    },
  ];
  //选取标签行
  const rowSelection: TableRowSelection<tagListType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.tagId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.tagId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };
  //修改标签名
  const editTagName = async () => {
    if (tag.value.replace(/\s*/g, '') === '') {
      message.error("请输入标签名称！");
      return;
    } else if (tag.value.replace(/\s*/g, '').length > 5) return
    let res = await updataTagNameReq({
      tagId: editRowId,
      tagName: tag.value,
    })
    if (res.code !== 200) return
    message.success('修改成功！')
    setIsShow(0)
    dispatchTagList()
  }
  //回收站恢复
  const recoverTag = async (row?: tagListType) => {
    let res;
    row ? res = await recoverTagReq([row.tagId]) : res = await recoverTagReq(selectedRowKeys)
    console.log('recover', res);
    if (res.code !== 200) return
    dispatchTagList()
    setSelectedRows([])
    setSelectedRowKeys([]);
  }
  //删除标签
  const deleteTagRows = async (row?: tagListType) => {
    console.log(row);
    let res;
    row ? res = await deleteTagListReq([row.tagId]) : res = await deleteTagListReq(selectedRowKeys)
    console.log('delete', res);
    if (res.code !== 200) return
    dispatchTagList()
    setSelectedRows([])
    setSelectedRowKeys([]);
  }

  const validateTagVal = (tagVal: string,): {
    validateStatus: ValidateStatus;
    errorMsg: string | null;
  } => {
    if (tagVal.replace(/\s*/g, '').length <= 5) {
      return {

        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: '标签名长度最长为5',
    };
  };


  return (
    <div className='tag'>
      <p className="tag__title">标签管理</p>
      <div className='tag__status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? '#1677ff' : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? 'rgba(0, 0, 0, 0.45)' : '#1677ff' }}
          onClick={() => { setIsAll(2); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="tag__operation-form">
        <Button type='primary'
          onClick={() => setIsShow(1)}
          disabled={isAll !== 1}><PlusOutlined />添加</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll === 1 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0} onClick={() => deleteTagRows()}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => recoverTag()}
        ><PlusCircleOutlined />批量恢复</Button>
        <Button type='primary'
          style={{ float: 'right', marginLeft: '10px' }}
          onClick={dispatchTagList}><SearchOutlined />搜索</Button>
        <Input value={searchTagName} allowClear onChange={(el) => setSearchTagName(el.target.value)}
          onKeyUp={(e) => e.keyCode === 13 ? dispatchTagList() : ''}
          type="text" style={{ float: 'right' }}
          placeholder='请输入标签名称'
          prefix={<SearchOutlined style={{ color: '#aaa' }} />} />
      </div>
      <Table columns={columns} dataSource={tagList} rowKey='tagId'
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: totalNumber * 5,
          onChange: (page) => setCurrentPage(page),
        }}
        rowSelection={{ ...rowSelection }}
      />
      {/* 添加模态框 */}
      <Modal
        title="添加标签"
        okText='确定'
        cancelText='取消'
        open={isShow === 1}
        onOk={addtag}
        onCancel={() => { setIsShow(0); setTag({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={tag.validateStatus}
            help={tag.errorMsg}
          >
            <Input
              allowClear
              placeholder="请输入标签名称"
              style={{ margin: '9px 0' }}
              value={tag.value}
              onKeyUp={(e) => e.keyCode === 13 ? addtag() : ''}
              onChange={(e) => setTag({ ...validateTagVal(e.target.value), value: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 编辑模态框 */}
      <Modal
        title="编辑标签"
        okText='确定'
        cancelText='取消'
        open={isShow === 2}
        onOk={editTagName}
        onCancel={() => { setIsShow(0); setTag({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={tag.validateStatus}
            help={tag.errorMsg}
          >
            <Input
              allowClear
              placeholder="请输入标签名称"
              style={{ margin: '20px 0' }}
              value={tag.value}
              onKeyUp={(e) => e.keyCode === 13 ? editTagName() : ''}
              onChange={(e) => setTag({ value: e.target.value, ...validateTagVal(e.target.value) })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
