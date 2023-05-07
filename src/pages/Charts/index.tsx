import React, { useEffect } from 'react'
import { getArticleListReq } from '../../requests/api'
import { useCategoryDataDispatch } from '../../components/CategoryDataProvider';
import { useMenuItems } from '../../components/MenuItemsProvider';
export default function Charts() {
  useEffect(() => {
    document.title = '博客-后台管理系统'
  })
  async function a() {
    let res = await getArticleListReq();
    console.log('list', res);

  }
  const data=useMenuItems()
  useEffect(() => {
    console.log('mu',data);
    
    
    a()
  }, [])
  return (
    <div>
      112345
    </div>
  )
}
