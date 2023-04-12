import React, { useEffect, useState } from 'react'
import { Button,Input,Modal, message } from 'antd'
import {PlusOutlined,DeleteOutlined,SearchOutlined} from '@ant-design/icons'
import './index.scss'
import { addTagReq } from '../../requests/api'
export default function Tags() {
  useEffect(()=>{
    document.title='标签-管理系统'
  },[])
  const [isShow,setIsShow]=useState(false);
  const [tagName,setTagName]=useState('')
  const tagSub=async ()=>{
    if(tagName.replace(/\s*/g,'')===''){
      message.error("请输入标签名称！");
      return;
    }
    let res=await addTagReq({tagName:tagName});
    if(res.code!==200)return 
    message.success("添加成功！")
    setTagName('')
    setIsShow(false)
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
      <Input placeholder="请输入标签名称" style={{margin:'20px 0'}} value={tagName} onKeyUp={(e)=>e.keyCode===13?tagSub():''} onChange={(e)=>setTagName(e.target.value)}/>
      </Modal>
    </div>
  )
}
