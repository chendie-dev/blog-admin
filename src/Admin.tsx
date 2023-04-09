import React, { useEffect } from 'react'
import { getAdminListReq } from './requests/api'
export default function Admin() {
  async function a(){
    let res=await getAdminListReq({page:1})
    console.log(res);
    
  }
  useEffect(()=>{
    a()
  })
  return (
    <div>
      111
    </div>
  )
}
