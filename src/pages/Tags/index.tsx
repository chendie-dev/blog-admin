import React, { useEffect, useState } from 'react'
import { Button,Input,Modal } from 'antd'
import {PlusOutlined,DeleteOutlined,SearchOutlined} from '@ant-design/icons'
import './index.scss'
export default function Tags() {
  useEffect(()=>{
    document.title='标签-管理系统'
  },[])
  const [isShow,setIsShow]=useState(false);
  const [tagName,setTagName]=useState('')
  const tagSub=()=>{

  }
  return (
    <div className='tags'>
      <p className="card-title">标签管理</p>
      <div className="opt-form">
        <Button type='primary' onClick={()=>setIsShow(true)}><PlusOutlined />添加</Button>
        <Button type='primary' danger style={{marginLeft:'10px'}} disabled><DeleteOutlined />批量删除</Button>
        <Button type='primary' style={{float:'right',marginLeft:'10px'}}><SearchOutlined />搜索</Button>
        <Input type="text" style={{float:'right'}} placeholder='请输入标签名称' prefix={<SearchOutlined style={{color:'#aaa'}} />}/>

      </div>
      <Modal title="添加标签" okText='确定' cancelText='取消' open={isShow} onOk={tagSub} onCancel={()=>setIsShow(false)}>
      <Input placeholder="请输入标签名称" style={{margin:'20px 0'}} value={tagName} onChange={(e)=>setTagName(e.target.value)}/>
      </Modal>
    </div>
  )
}
