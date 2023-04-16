import React, { useEffect } from 'react'
import { getArticleListReq } from '../../requests/api'
export default function Charts() {
  useEffect(()=>{
    document.title='博客-后台管理系统'
  })
  async function a(){
    let res=await getArticleListReq();
    console.log('list',res);
    
  }
  useEffect(()=>{
    a()
  },[])
  return (
    <div>
      112345
    </div>
  )
}
