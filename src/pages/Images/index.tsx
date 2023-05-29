import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Table, Upload, message, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined, DeleteOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import './index.scss'
import { addImageReq, getImageListReq, deleteImagesReq, updateImageReq } from '../../requests/api'
import { TableRowSelection } from 'antd/es/table/interface';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps, RcFile } from 'antd/es/upload';
import globalConstant from '../../utils/globalConstant';
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
function formatMsToDate(ms: string) {
  let date = new Date(Number(ms)),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  return year + '-' + addZero(month) + '-' + addZero(day) + " " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec)

}
function addZero(nu: number) {
  return nu < 10 ? "0" + nu : nu
}
export default function Images() {
  useEffect(() => {
    document.title = '图片-管理系统'
  }, [])
  const [isShow, setIsShow] = useState(0);//1添加
  const [isDescend, setIsDescend] = useState(true);//创建时间升降序
  const [isAll, setIsAll] = useState(1)//1全部，2回收站
  const [ImageItem, setImageItem] = useState<{
    value: string;
    validateStatus?: ValidateStatus;
    errorMsg?: string | null;
  }>({ value: '' });//添加/编辑图片名（校验）
  const [editRowId, setEditRowId] = useState(0)
  const [ImageList, setImageList] = useState<imageItemType[]>([])//图片列表
  const [currentPage, setCurrentPage] = useState(1)//当前页
  const [selectedRows, setSelectedRows] = useState<imageItemType[]>([])//选取行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);//选中id
  const [totalPage, setTotalPage] = useState(1)//总页数
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [fileList, setFileList] = useState<UploadFile[]>([]);//已上传图片
  const [previewOpen, setPreviewOpen] = useState(false);//图片预览模态框开关
  const [previewImage, setPreviewImage] = useState('');//图片路径
  const [previewTitle, setPreviewTitle] = useState('');//图片名称
  const validateImageVal = (ImageVal: string,): {
    validateStatus: ValidateStatus;
    errorMsg: string | null;
  } => {
    if (ImageVal.replace(/\s*/g, '').length <= 10) {
      return {

        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: '图片名长度最长为10',
    };
  };
  //添加图片
  const addImage = async () => {
    if (ImageItem.value.replace(/\s*/g, "") === '') {
      message.error('请输入图片名称')
      return
    } else if (ImageItem.value.replace(/\s*/g, "").length > 10) return
    let res = await addImageReq({ imageName: ImageItem.value.replace(/\s*/g, ""), imageUrl: fileList[0].response.data })
    // console.log(888, res);
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    message.success('添加成功！')
    setImageItem({ value: '' })
    setIsShow(0)
    getImageList()
  }
  //回收站恢复
  const recoverImage = async (row?: imageItemType) => {
    let res;
    // row ? res = await recoverImageReq([row.imageId]) : res = await recoverImageReq(selectedRowKeys)
    // if (res.code !== 200){
    //   message.error(res.msg)
    //   return
    // } 
    // setSelectedRows([])
    // setSelectedRowKeys([])
    // getImageList()
  }
  //删除图片
  const deleteImageRows = async (row?: imageItemType) => {
    let res;
    row ? res = await deleteImagesReq([row.imageId]) : res = await deleteImagesReq(selectedRowKeys)
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    message.success('删除成功')
    getImageList()
    setSelectedRows([])
    setSelectedRowKeys([])

  }
  const columns: ColumnsType<imageItemType> = [
    {
      title: '图片ID',
      dataIndex: 'imageId',
      width: '20%',

    },
    {
      title: '图片名',
      dataIndex: 'imageName',
    },
    {
      title: '图片',
      key: 'imageUrl',
      render: (_, item) => (
        <>
          <Image
            width={50}
            src={item.imageUrl}
          />
        </>
      )
    },
    {
      title: () => {
        return <>
          <span >创建时间</span>
          <span style={{ position: 'relative', marginLeft: 5 }} onClick={() => setIsDescend((lastVa) => !lastVa)}>
            <CaretUpOutlined style={{ position: 'absolute', top: -2, color: isDescend ? globalConstant().color  : "#aaa" }} />
            <CaretDownOutlined style={{ position: 'absolute', top: 5, left: 0, color: isDescend ? "#aaa" : globalConstant().color  }} />
          </span>
        </>
      },
      dataIndex: 'createTime',
      width: '20%',

    },

    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <div style={{ display: isAll === 1 ? 'block' : 'none' }}>
            <a style={{ color: globalConstant().color }} onClick={() => { setIsShow(2); setImageItem({ value: record.imageName }); setEditRowId(record.imageId) }}>编辑</a>
            <a style={{ color: 'red', marginLeft: 10 }} onClick={() => { deleteImageRows(record) }}>删除</a>
          </div>
          <div style={{ display: isAll === 2 ? 'block' : 'none' }}>
            <a style={{ color: 'red' }} onClick={() => recoverImage(record)}>恢复</a>
          </div>
        </>
      ),
      width: '20%',
    },
  ];
  //选取图片行
  const rowSelection: TableRowSelection<imageItemType> = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.imageId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
    onSelectAll: (_, selectedRows) => {
      let arr: React.Key[] = []
      selectedRows.forEach(el => { arr.push(el.imageId) })
      setSelectedRowKeys(arr)
      setSelectedRows(selectedRows);
    },
  };
  //获取图片列表
  const getImageList = async () => {
    setLoading(true)
    let res = await getImageListReq({
      orderByFields: { createTime: isDescend },
      pageNum: currentPage,
      pageSize: 5,
      queryParam: {
        imageName: searchVal,
      }
    })
    setLoading(false)
    if (res.code !== 200){
      message.error(res.msg)
      return
    } 
    res.data.data.forEach(el => {
      el.createTime = formatMsToDate(el.createTime)
    })
    setImageList(res.data.data)
    setTotalPage(res.data.totalPage)
    // console.log(new Date());

  }
  useEffect(() => {
    getImageList()
  }, [currentPage, isDescend, isAll])
  //修改图片名
  const updateImageName = async () => {
    if (ImageItem.value.replace(/\s*/g, '') === '') {
      message.error("请输入图片名称！");
      return;
    } else if (ImageItem.value.replace(/\s*/g, '').length > 10) return
    let res = await updateImageReq({
      imageId: editRowId,
      imageName: ImageItem.value.replace(/\s*/g, ''),
    })
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    message.success('修改成功！')
    setIsShow(0)
    setImageItem({value:''})
    getImageList()
  }
  // 提交图片
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'removed') {
      setFileList([]);
    } else
      setFileList([file]);
    // console.log(7777, file);
  }
  //图片预览设置
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  return (
    <div className='images'>
      <p className="card-title">图片管理</p>
      <div className='image-status'><button>状态</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? globalConstant().color : 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => { setIsAll(1); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>全部</button>
        <button
          style={{ cursor: selectedRows.length > 0 ? 'no-drop' : 'pointer', color: isAll === 1 ? 'rgba(0, 0, 0, 0.45)' : globalConstant().color }}
          onClick={() => { setIsAll(2); setCurrentPage(1) }}
          disabled={selectedRows.length > 0}>回收站</button>
      </div>
      <div className="opt-form">
        <Button type='primary' onClick={() => setIsShow(1)} disabled={isAll === 2}><PlusOutlined />上传</Button>
        <Button type='primary' danger style={{ marginLeft: '10px', display: isAll === 1 ? 'inline-block' : 'none' }} disabled={selectedRows.length === 0} onClick={() => deleteImageRows()}><DeleteOutlined />批量删除</Button>
        <Button type='primary' danger
          style={{ marginLeft: '10px', display: isAll === 2 ? 'inline-block' : 'none' }}
          disabled={selectedRows.length === 0}
          onClick={() => recoverImage()}
        ><PlusCircleOutlined />批量恢复</Button>
        <Button type='primary' style={{ float: 'right', marginLeft: '10px' }} onClick={getImageList} ><SearchOutlined />搜索</Button>
        <Input type="text" allowClear style={{ float: 'right' }} placeholder='请输入图片名称' prefix={<SearchOutlined style={{ color: '#aaa' }} />} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyUp={(e) => e.keyCode === 13 ? getImageList() : ''} />
      </div>
      <Table columns={columns} dataSource={ImageList} rowKey='imageId'
        loading={loading}
        pagination={{
          current: currentPage,
          defaultPageSize: 5,
          total: totalPage * 5,//todo
          onChange: (page) => setCurrentPage(page),
        }}
        rowSelection={{ ...rowSelection }}
      />
      {/* 添加图片模态框 */}
      <Modal title="添加图片" okText='确定' cancelText='取消'
        open={isShow === 1} onOk={addImage}
        onCancel={() => { setIsShow(0); setImageItem({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={ImageItem.validateStatus}
            help={ImageItem.errorMsg}
          >
            <Input placeholder="请输入图片名称" style={{ margin: '20px 0' }}
              allowClear
              value={ImageItem.value}
              onChange={(e) => setImageItem({ value: e.target.value, ...validateImageVal(e.target.value) })} />
            <ImgCrop
              aspect={480 / 270}
            >
              <Upload
                name='image'
                accept='image/*'
                action="/api/file/admin/image/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
              >
                {
                  fileList.length >= 1 ? null :
                    <div>
                      <PlusOutlined /><div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                }
              </Upload>
            </ImgCrop>
            {/* 预览模态框 */}
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Form.Item>
        </Form>

      </Modal>
      {/* 编辑模态框 */}
      <Modal
        title="编辑图片"
        okText='确定'
        cancelText='取消'
        open={isShow === 2}
        onOk={updateImageName}
        onCancel={() => { setIsShow(0); setImageItem({ value: '' }) }}>
        <Form>
          <Form.Item
            validateStatus={ImageItem.validateStatus}
            help={ImageItem.errorMsg}
          >
            <Input
              allowClear
              placeholder="请输入图片名称"
              style={{ margin: '20px 0' }}
              value={ImageItem.value}
              onKeyUp={(e) => e.keyCode === 13 ? updateImageName() : ''}
              onChange={(e) => setImageItem({ value: e.target.value, ...validateImageVal(e.target.value) })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
