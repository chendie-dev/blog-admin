import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
import './index.scss'
import { getTagListReq } from '../../requests/api';
interface propsType{
  getTagId:(tagId:string[]|null)=>void
}
const TagInput:React.FC<propsType>=({getTagId})=> {
  const [tagList,setTagList]=useState<tagItemType[]>([])
  const getTagList=async (search:string)=>{
    if(search===''){
      setTagList([])
      getTagId(null)
      return
    }
    let res=await getTagListReq({
      orderByFields: {createTime:false},
        pageNum: 1,
        pageSize: 5,
        queryParam: {
          isDelete:false,
          tagName: search
        }
    })
    setTagList(res.data.data)
  }
  const submit=(tagId:string)=>{
    getTagId([tagId])
    setTagList([])
  }
  return (
    <div className='select-input'>
      <Input type='text'
        onChange={(e) => getTagList(e.target.value)}
        placeholder='请输入标签名'
        allowClear
         />
         <div className="search-box" style={{ display: tagList.length>0 ? 'block' : 'none' }}>
          <div className="search-box__arrow"></div>
          <ul>
            {
              tagList.map(el=>{
                return(
                  <li key={el.tagId} onClick={()=>submit(el.tagId)}><span>{el.tagName}</span></li>
                )
              })
            }
          </ul>
        </div>
    </div>

  )
}
export default TagInput

