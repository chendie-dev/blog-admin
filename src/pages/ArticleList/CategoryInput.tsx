import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
import './index.scss'
import { getCategoryListReq } from '../../requests/api';
import { utilFunc } from '../../hooks/utilFunc';
interface propsType {
  getCategoryId: (CategoryId: string | null) => void
}
const CategoryInput: React.FC<propsType> = ({ getCategoryId }) => {
  const [CategoryList, setCategoryList] = useState<categoryItemType[]>([])
  const [searchVal,setSearchval]=useState({value:'',flag:true})
  const getCategoryList = utilFunc.useThrottle(async () => {
    let res = await getCategoryListReq({
      orderByFields: { createTime: false },
      pageNum: 1,
      pageSize: 5,
      queryParam: {
        isDelete: false,
        categoryName: searchVal.value
      }
    })
    setCategoryList(res.data.data)
  }, 1500)
  useEffect(()=>{
   if(!searchVal.flag||searchVal.value===''){
    getCategoryId(null)
    return
   }
    getCategoryList()
  },[searchVal])
  const submit = (CategoryId: string) => {
    getCategoryId(CategoryId)
    setCategoryList([])
  }
  return (
    <div className='select-input'>
      <Input type='text'
        onChange={(e) => setSearchval((last)=>({...last,value:e.target.value}))}
        onCompositionEnd={()=>setSearchval((last)=>({...last,flag:true}))}
        onCompositionStart={()=>setSearchval((last)=>({...last,flag:false}))}
        placeholder='请输入分类名'
        allowClear
      />
      <div className="search-box" style={{ display: CategoryList.length > 0 ? 'block' : 'none' }}>
        <div className="search-box__arrow"></div>
        <ul>
          {
            CategoryList.map(el => {
              return (
                <li key={el.categoryId} onClick={() => submit(el.categoryId)}><span>{el.categoryName}</span></li>
              )
            })
          }
        </ul>
      </div>
    </div>

  )
}
export default CategoryInput

