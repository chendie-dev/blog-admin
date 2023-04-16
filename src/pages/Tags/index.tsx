import React, { useEffect, useState } from 'react'
import { Button, Input, Modal, message, Table, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import './index.scss'
import { addTagReq, getTagList } from '../../requests/api'
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
interface DataType {
  tagId: string;
  tagName: string;
  createTime: string;
}

function formatMsToDate(ms: string) {
  let date = new Date(Number(ms)),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  return year + '-' + addZero(month) + '-' + addZero(day) + " " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec)

}
function addZero(nu: number) {
  return nu < 10 ? "0" + nu : nu
}
export default function Tags() {
  useEffect(() => {
    getTabList()
    document.title = '标签-管理系统'
  }, [])

  const [isShow, setIsShow] = useState(false);
  const [tagName, setTagName] = useState('')
  const [tadList, setTagList] = useState<DataType[]>()
  const [tagListRes, settagListRes] = useState<tagListRes>()
  const [currentPage, setCurrentPage] = useState(1)
  const [isDescend, setIsDescend] = useState(true);
  const [isSelected, setIsSelected] = useState(false)
  const [selTagName, setSelTagName] = useState('')
  useEffect(() => {
    getTabList()
  }, [isDescend, currentPage])
  const tagSub = async () => {
    if (tagName.replace(/\s*/g, '') === '') {
      message.error("请输入标签名称！");
      return;
    }
    let res = await addTagReq({ tagName: tagName });
    if (res.code !== 200) return
    console.log(res);
    
    message.success("添加成功！")
    setTagName('')
    setIsShow(false)
    getTabList()
  }
  const getTabList = async () => {
    let res = await getTagList({
      orderByFields: { createTime: !isDescend },
      pageNum: currentPage,
      pageSize: 5,
      queryParam: {
        isDelete: false,
        tagName: selTagName
      }
    })
    settagListRes(res)
    let newTabList = res.data.data;
    newTabList.forEach(el => {
      el.createTime = formatMsToDate(el.createTime)
    })
    setTagList(newTabList)
  }
  const columns: ColumnsType<DataType> = [
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
        <Space size="middle">
          <a style={{color:'#1677ff'}}>编辑</a>
          <a style={{color:'red'}}>删除</a>
        </Space>
      ),
      width: '20%',
    },
  ];
  const rowSelection: TableRowSelection<DataType> = {
    // onChange: (selectedRowKeys, selectedRows) => {
    //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    // },
    onSelect: (record, selected, selectedRows) => {
      setIsSelected(selectedRows.length > 0)
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      setIsSelected(selectedRows.length > 0)

      console.log(selected, selectedRows, changeRows);
    },
  };
  return (
    <div className='tags'>
      <p className="card-title">标签管理</p>
      <div className="opt-form">
        <Button type='primary' onClick={() => setIsShow(true)}><PlusOutlined />添加</Button>
        <Button type='primary' danger style={{ marginLeft: '10px' }} disabled={!isSelected}><DeleteOutlined />批量删除</Button>
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getTabList}><SearchOutlined />搜索</Button>
        <Input value={selTagName} onChange={(el) => setSelTagName(el.target.value)}
          type="text" style={{ float: 'right' }}
          placeholder='请输入标签名称'
          prefix={<SearchOutlined style={{ color: '#aaa' }} />} />
      </div>
      <Table columns={columns} dataSource={tadList} rowKey='tagId'
        pagination={{
          defaultCurrent: currentPage,
          defaultPageSize: 5,
          total: tagListRes?.totalNumber,
          onChange: getTabList,
        }}
        rowSelection={{ ...rowSelection }}
      />
      <Modal title="添加标签" okText='确定' cancelText='取消' open={isShow} onOk={tagSub} onCancel={() => setIsShow(false)}>
        <Input placeholder="请输入标签名称" style={{ margin: '20px 0' }} value={tagName} onKeyUp={(e) => e.keyCode === 13 ? tagSub() : ''} onChange={(e) => setTagName(e.target.value)} />
      </Modal>
    </div>
  )
}
