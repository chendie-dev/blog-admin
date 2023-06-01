import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Table, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import globalConstant from '../../utils/globalConstant'
import { getOplogListReq, getUserInfoByIdReq } from '../../requests/api'
import './index.scss'
import { utilFunc } from '../../hooks/utilFunc'
export default function Oplog() {
  const [loading, setLoading] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [logList,setLogList]=useState<oplogItemType[]>([])
  useEffect(()=>{
    getLogList()
  },[])
  const getLogList=async ()=>{
    setLoading(true)
    let res=await getOplogListReq({
      orderByFields:{createTime:isDescend},
      pageSize:5,
      pageNum:currentPage,
      queryParam:{

      }
    })
    if(res.code!==200){
      message.error(res.msg)
      return
    }
    let set=new Set<String>()
    res.data.data.forEach(el=>{
      set.add(el.userId)
    })
    let idArr:string[]=Array.from(set) as string[]
    let useInfo=await Promise.all(
      idArr.map(el=>{
        return getUserInfoByIdReq(el)
      })
    )
    let newLogList=res.data.data.map(el=>{
      let obj:oplogItemType={...el}
      let findRes=useInfo.find(el1=>el1.data.userId===el.userId)
      obj.username=findRes!.data.username
      obj.createTime=utilFunc.FormatData(el.createTime)
      return obj
    })
    setLogList(newLogList)
    setTotalPage(res.data.totalPage)
    setLoading(false)
  }
  const columns: ColumnsType<oplogItemType> = [
    {
      title: '操作人',
      dataIndex: 'username',
    },
    {
      title: '操作内容',
      dataIndex: 'operatorContent',
    },
    {
      title: '操作阶段',
      dataIndex: 'operatorStage',
    },
    {
      title: '操作类型',
      dataIndex: 'operatorType',
    },
    {
      title: () => {
        return <>
          <span >创建时间</span>
          <span style={{ position: 'relative', marginLeft: 5 }} onClick={() => setIsDescend((lastVa) => !lastVa)}>
            <CaretUpOutlined style={{ position: 'absolute', top: -2, color: isDescend ? globalConstant().color : "#aaa" }} />
            <CaretDownOutlined style={{ position: 'absolute', top: 5, left: 0, color: isDescend ? "#aaa" : globalConstant().color }} />
          </span>
        </>
      },
      dataIndex: 'createTime',
      width: '20%',

    },
   
  ];
  return (
    <div className='log'>
      <p className="log__title">接口管理</p>
      <Table columns={columns} dataSource={logList} rowKey='resourceId'
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: totalPage * 5,//todo
          onChange: (page) => setCurrentPage(page),
        }}
        style={{marginTop:20}}
      />
    </div>
  )
}
