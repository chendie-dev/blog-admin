import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
import './index.scss'
import { getTagListReq } from '../../requests/api';
import { utilFunc } from '../../hooks/utilFunc';
interface propsType {
  getTagId: (tagId: string[] | null) => void
}
const TagInput: React.FC<propsType> = React.memo(({ getTagId }) => {
  const [tagList, setTagList] = useState<tagItemType[]>([])
  const [searchVal, setSearchVal] = useState({ value: '', flag: true })
  const getTagList = utilFunc.useThrottle(async () => {
    let res = await getTagListReq({
      orderByFields: { createTime: false },
      pageNum: 1,
      pageSize: 5,
      queryParam: {
        isDelete: false,
        tagName: searchVal.value
      }
    })
    setTagList(res.data.data)
  }, 500)
  useEffect(() => {
    if (!searchVal.flag || searchVal.value === '') {
      getTagId(null)
      setTagList([])
      return
    }
    getTagList()
  }, [searchVal])
  const submit = (tagId: string) => {
    getTagId([tagId])
    setTagList([])
  }
  return (
    <div className='select-input'>
      <Input type='text'
        onChange={(e) => setSearchVal((last) => ({ ...last, value: e.target.value }))}
        onCompositionEnd={() => setSearchVal((last) => ({ ...last, flag: true }))}
        onCompositionStart={() => setSearchVal((last) => ({ ...last, flag: false }))}
        placeholder='请输入标签名'
        allowClear
      />
      <div className="search-box" style={{ display: tagList.length > 0 ? 'block' : 'none' }}>
        <div className="search-box__arrow"></div>
        <ul>
          {
            tagList.map(el => {
              return (
                <li key={el.tagId} onClick={() => submit(el.tagId)}><span>{el.tagName}</span></li>
              )
            })
          }
        </ul>
      </div>
    </div>

  )
}
)
export default TagInput

