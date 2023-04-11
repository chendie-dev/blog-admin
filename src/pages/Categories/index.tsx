import { useEffect, useState } from 'react'
import './index.scss'
import { Button,Input,Modal } from 'antd'
import {PlusOutlined,DeleteOutlined,SearchOutlined} from '@ant-design/icons'
import { addCategory,CategoryReq } from '../../requests/api'
export default function Categories() {
  const [isShow,setIsShow]=useState(false);
  const [categoryName,setCategoryName]=useState('')
  useEffect(()=>{
    document.title='分类-管理系统'
  },[])
  const categorieSub=async ()=>{
    let res=await addCategory({categoryName:categoryName})
    // let res=await CategoryReq('0')
    console.log(res);
    
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
      <Modal title="添加分类" okText='确定' cancelText='取消' open={isShow} onOk={categorieSub} onCancel={()=>setIsShow(false)}>
      <Input placeholder="请输入分类名称" style={{margin:'20px 0'}} value={categoryName} onChange={(e)=>setCategoryName(e.target.value)}/>
      </Modal>
    </div>
  )
}
