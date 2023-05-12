import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
import './index.scss'
import { getCategoryListReq } from '../../requests/api';
interface propsType{
  getCategoryId:(CategoryId:string|null)=>void
}
const CategoryInput:React.FC<propsType>=({getCategoryId})=> {
  const [CategoryList,setCategoryList]=useState<categoryItemType[]>([])
  const getCategoryList=async (search:string)=>{
    if(search===''){
      setCategoryList([])
      getCategoryId(null)
      return
    }
    let res=await getCategoryListReq({
      orderByFields: {createTime:false},
        pageNum: 1,
        pageSize: 5,
        queryParam: {
          isDelete:false,
          categoryName: search
        }
    })
    setCategoryList(res.data.data)
  }
  const submit=(CategoryId:string)=>{
    getCategoryId(CategoryId)
    setCategoryList([])
  }
  return (
    <div className='select-input'>
      <Input type='text'
        onChange={(e) => getCategoryList(e.target.value)}
        placeholder='请输入分类名'
        allowClear
         />
         <div className="search-box" style={{ display: CategoryList.length>0 ? 'block' : 'none' }}>
          <div className="search-box__arrow"></div>
          <ul>
            {
              CategoryList.map(el=>{
                return(
                  <li key={el.categoryId} onClick={()=>submit(el.categoryId)}><span>{el.categoryName}</span></li>
                )
              })
            }
          </ul>
        </div>
    </div>

  )
}
export default CategoryInput

