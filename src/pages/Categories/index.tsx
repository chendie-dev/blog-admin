import { useEffect, useState } from 'react'
import { Button,Input,Modal, message } from 'antd'
import {PlusOutlined,DeleteOutlined,SearchOutlined} from '@ant-design/icons'
import './index.scss'
import { addCategoryReq,addTagReq } from '../../requests/api'
export default function Categories() {
  const [isShow,setIsShow]=useState(false);
  const [categoryName,setCategoryName]=useState('')
  useEffect(()=>{
    document.title='分类-管理系统'
  },[])
  const categorieSub=async ()=>{
    if(categoryName.replace(/\s*/g,"")===''){
      message.error('请输入分类名称')
      return
    }    
    let res=await addCategoryReq({categoryName:categoryName})
      if(res.code!==200)return
      message.success('添加成功！')
      setCategoryName('')
      setIsShow(false)
  }
  return (
    <div className='categories'>
      <p className="card-title">分类管理</p>
      <div className="opt-form">
        <Button type='primary' onClick={()=>setIsShow(true)}><PlusOutlined />添加</Button>
        <Button type='primary' danger style={{marginLeft:'10px'}} disabled><DeleteOutlined />批量删除</Button>
        <Button type='primary' style={{float:'right',marginLeft:'10px'}}><SearchOutlined />搜索</Button>
        <Input type="text" style={{float:'right'}} placeholder='请输入分类名称' prefix={<SearchOutlined style={{color:'#aaa'}} />}/>

      </div>
      <Modal title="添加分类" okText='确定' cancelText='取消' open={isShow} onOk={categorieSub} onCancel={()=>{setIsShow(false);setCategoryName('')}}>
      <Input placeholder="请输入分类名称" style={{margin:'20px 0'}} value={categoryName} onKeyUp={(e)=>e.keyCode===13?categorieSub():''} onChange={(e)=>setCategoryName(e.target.value)}/>
      </Modal>
    </div>
  )
}
