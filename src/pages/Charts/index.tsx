import React, { useEffect, useState } from 'react'
import { useCategoryDataDispatch } from '../../components/CategoryDataProvider';
import { useMenuItems } from '../../components/MenuItemsProvider';
import { Input } from 'antd';
import './index.scss'
import { getTagListReq } from '../../requests/api';
export default function Charts() {
  useEffect(() => {
    document.title = '博客-后台管理系统'
  })

  const data = useMenuItems()
  useEffect(() => {
    console.log('mu', data);


  }, [])
  const [tagList,setTagList]=useState<tagItemType[]>([])
  const getTagList=async (search:string)=>{
    if(search===''){
      setTagList([])
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
  return (
    <div>
      <Input type='text'
        onChange={(e) => getTagList(e.target.value)}
        placeholder='请输入标签名'
         />
         <div className="search-box" style={{ display: tagList.length>0 ? 'block' : 'none' }}>
          <div className="search-box__arrow"></div>
          <ul>
            {
              tagList.map(el=>{
                return(
                  <li><span>{el.tagName}</span></li>
                )
              })
            }
          </ul>
        </div>
    </div>

  )
}
