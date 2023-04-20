import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popover, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { addCategoryReq, getCategoryListReq } from '../../requests/api';
import { TweenOneGroup } from 'rc-tween-one';
import { InfiniteScroll } from 'antd-mobile';
import './index.scss'
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
interface data1 {
  categoryData: (items: categoryItemType[]) => void
}
const CategorySelect: React.FC<data1> = ({ categoryData }) => {
  const [open, setOpen] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false)//是否显示搜索内容
  const [selectedItems, setSelectedItems] = useState<categoryItemType[]>([]);//已选择分类
  const [currentItemPage, setCurrentItemPage] = useState(0)//无限刷新第几页
  const [ItemData, setItemData] = useState<categoryItemType[]>([])//无限刷新查询分类数据
  const [hasMore, setHasMore] = useState(true)//无限刷新是否还有更多
  const [search, setSearch] = useState<{
    value: string;
    validateStatus?: ValidateStatus;
    errorMsg?: string | null;
  }>({ value: '' })//搜索分类值
  const [searchList, setSearchList] = useState<categoryItemType[]>([]);//搜索内容
  const [isShowErr, setIsShowErr] = useState(false)//1长度，2个数
  //分类验证规则
  const validateItemVal = (ItemVal: string,): {
    validateStatus: ValidateStatus;
    errorMsg: string | null;
  } => {
    if (ItemVal.replace(/\s*/g, '').length <= 10) {
      return {

        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: '分类名长度最长为10',
    };
  };
  //获取分类列表
  const getItemList = async (pageNum: number, pageSize: number) => {
    return await getCategoryListReq({
      pageNum: pageNum,
      pageSize: pageSize,
      queryParam: {
        isDelete: false,
        categoryName: search.value
      }
    })
  }

  //选择/取消选择分类
  const checkItemChange = (Item: categoryItemType, checked: boolean) => {
    if (checked && selectedItems.length === 5) {
      setIsShowErr(true)
      return
    }
    setIsShowErr(false)
    const nextSelectedItems = checked ? [...selectedItems, Item] : selectedItems.filter((t) => t.categoryId !== Item.categoryId);
    setSelectedItems(nextSelectedItems);
  };
  // 删除已选择分类
  const deleteSelectedItem = (itemId: number) => {
    const newItems = selectedItems.filter((item) => item.categoryId !== itemId);
    setSelectedItems(newItems);
    setIsShowErr(false)
  };
  //无限刷新分类
  const loadItemMore = async () => {
    let res = await getItemList(currentItemPage + 1, 90)
    setCurrentItemPage(currentItemPage + 1)
    setItemData(val => [...val, ...res.data.data])
    setHasMore(res.data.data.length > 0)
  }
  useEffect(() => {
    searchItemMore()
  }, [search.value])
  //搜索分类
  const searchItemMore = async () => {
    let res = await getItemList(1, 5)
    setSearchList(res.data.data)
  }
  //添加分类
  const addItem = async () => {
    if (search.value.replace(/\s*/g, '') === '' || search.value.replace(/\s*/g, '').length > 5) return
    await addCategoryReq({ categoryName: search.value })
    let res1 = await getItemList(1, 1)
    setSelectedItems(val => [...val, res1.data.data[0]])
    setSearch({ value: '' })
  }
  useEffect(() => {
    categoryData(selectedItems)
  }, [selectedItems])
  const onOpenChange=(open:boolean)=>{
    if(!open)setSearch({value:''})
    setOpen(open)
  }
  const content = (
    <>
      <div className="slt-mdl" >
        <h5>分类<CloseOutlined className='cancel' onClick={() => setOpen(false)} /></h5>
        <Form>
          <Form.Item
            validateStatus={search.validateStatus}
            help={search.errorMsg}
          >
            <Input type='text' value={search.value}
              onChange={(e) => setSearch({ value: e.target.value, ...validateItemVal(e.target.value) })}
              onFocus={() => setIsShowSearch(true)}
              onBlur={() => { setTimeout(() => { setIsShowSearch(false) }, 250); }}
              placeholder='请输入文字搜索，按Enter键添加分类'
              onKeyUp={(e) => e.keyCode === 13 ? addItem() : ''} />
          </Form.Item>
        </Form>
        <div className="search-box" style={{ display: isShowSearch ? 'block' : 'none' }}>
          <div className="arrow"></div>
          <ul>
            {
              searchList.map(el => {
                return (
                  <li key={el.categoryId}>
                    <Tag.CheckableTag
                      key={el.categoryId}
                      checked={selectedItems.find(item => el.categoryId === item.categoryId) !== undefined}
                      onChange={(checked) => checkItemChange(el, checked)}
                    >
                      {el.categoryName}
                    </Tag.CheckableTag>
                  </li>
                )
              })
            }
          </ul>
        </div>
        {/* 分类列表 */}
        <div className="items">
          {ItemData.map((item) => (
            <Tag.CheckableTag
              key={item.categoryId}
              checked={selectedItems.find(el => el.categoryId === item.categoryId) !== undefined}
              onChange={(checked) => checkItemChange(item, checked)}
            >
              {item.categoryName}
            </Tag.CheckableTag>
          ))}
          <InfiniteScroll loadMore={loadItemMore} hasMore={hasMore} />
        </div>
        <span className='tip' style={{ display: isShowErr ? 'inline-block' : 'none' }}>最多可添加5个分类</span>
      </div>

    </>
  )
  return (
    <>

      <Popover
        placement="topLeft"
        content={content}
        trigger="click"
        arrow={false}
        open={open}
        onOpenChange={onOpenChange}
        style={{ display: 'inline-block' }}

      >
        <Button type="dashed" className='sel-btn' style={{ display: selectedItems.length === 5 ? 'none' : 'inline-block',marginRight:10 }}><PlusOutlined />添加文章分类</Button>
      </Popover>
      <TweenOneGroup
        style={{ display: 'inline-block' }}
        enter={{
          scale: 0.8,
          opacity: 0,
          type: 'from',
          duration: 100,
        }}
        onEnd={(e) => {
          if (e.type === 'appear' || e.type === 'enter') {
            (e.target as any).style = 'display: inline-block';
          }
        }}
        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
        appear={false}>
        {
          selectedItems.map((Item) => {
            return (
              <span key={Item.categoryId} style={{ display: 'inline-block' }}>
                <Tag
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    deleteSelectedItem(Item.categoryId);
                  }}
                  color='blue'
                >
                  {Item.categoryName}
                </Tag>
              </span>
            );
          })
        }
      </TweenOneGroup>
    </>
  )
}
export default CategorySelect
