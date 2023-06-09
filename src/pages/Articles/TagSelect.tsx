import React, { memo, useEffect, useLayoutEffect, useState } from 'react'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popover, Tag } from 'antd'
import { addTagReq, getTagListReq } from '../../requests/api';
import { TweenOneGroup } from 'rc-tween-one';
import { InfiniteScroll } from 'antd-mobile';
import './index.scss'
import { validatevalue } from '../../hooks/validate';
import { utilFunc } from '../../hooks/utilFunc';
interface propsType {
  tagData: (items: tagItemType[]) => void,
  tagIds: string[]
}

const TagSelect: React.FC<propsType> = memo(({ tagData, tagIds }) => {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<tagItemType[]>([]);//已选择标签
  const [currentItemPage, setCurrentItemPage] = useState(0)//无限刷新第几页
  const [ItemData, setItemData] = useState<tagItemType[]>([])//无限刷新查询标签数据
  const [hasMore, setHasMore] = useState(true)//无限刷新是否还有更多
  const [search, setSearch] = useState<validateValType>({ value: '', flag: true })//搜索标签值
  const [searchList, setSearchList] = useState<tagItemType[]>([]);//搜索内容
  const [isShowErr, setIsShowErr] = useState(false)//1长度，2个数
  // console.log('ta改变');
  useEffect(() => {
    initSelectedItems()
  }, [tagIds])
  const initSelectedItems = async () => {
    if (!tagIds) return;
    const res = await Promise.all(
      tagIds.map((tagId) => {
        return getItemList(1, 1, tagId)
      })
    );
    let items: tagItemType[] = []
    res.forEach(el => {
      items.push(...el.data.data)
    })
    setSelectedItems(items)
  }
  //获取标签列表
  const getItemList = async (pageNum: number, pageSize: number, tagId?: string) => {
    return await getTagListReq({
      pageNum: pageNum,
      pageSize: pageSize,
      queryParam: {
        isDelete: false,
        tagName: search.value,
        tagId: tagId ? tagId : null
      }
    })
  }

  //选择/取消选择标签
  const checkItemChange = (Item: tagItemType, checked: boolean) => {
    if (checked && selectedItems.length === 5) {
      setIsShowErr(true)
      return
    }
    setIsShowErr(false)
    const nextSelectedItems = checked ? [...selectedItems, Item] : selectedItems.filter((t) => t.tagId !== Item.tagId);
    setSelectedItems(nextSelectedItems);
  };
  // 删除已选择标签
  const deleteSelectedItem = (itemId: string) => {
    const newItems = selectedItems.filter((item) => item.tagId !== itemId);
    setSelectedItems(newItems);
    setIsShowErr(false)
  };
  //无限刷新标签
  const loadItemMore = async () => {
    let res = await getItemList(currentItemPage + 1, 90)
    setCurrentItemPage(currentItemPage + 1)
    setItemData(val => [...val, ...res.data.data])
    setHasMore(res.data.data.length > 0)
  }
  useEffect(() => {
    if (search.flag && search.value.replace(/\s*/g, "") !== ''&&search.value.replace(/\s*/g, "").length<=5) {
      searchItemMore()
    } else {
      setSearchList([])
    }
  }, [search])
  //搜索标签
  const searchItemMore = utilFunc.useThrottle(async () => {
    let res = await getItemList(1, 5)
    setSearchList(res.data.data)
  }, 500)
  //添加标签
  const addItem = async () => {
    if (search.value.replace(/\s*/g, '') === '' || search.value.replace(/\s*/g, '').length > 5) return
    await addTagReq({ tagName: search.value })
    let res1 = await getItemList(1, 1)
    setSelectedItems(val => [...val, res1.data.data[0]])
    setSearch({ value: '', flag: true })
  }
  useEffect(() => {
    tagData(selectedItems)
  }, [selectedItems])
  const onOpenChange = (open: boolean) => {
    if (!open) setSearch({ value: '', flag: true })
    setOpen(open)
  }
  const content = (
    <>
      <div className="tag-select-content" >
        <h5>标签<CloseOutlined className='tag-select-content__cancel-icon' onClick={() => setOpen(false)} /></h5>
        <Form>
          <Form.Item
            validateStatus={search.validateStatus}
            help={search.errorMsg}
          >
            <Input type='text' value={search.value}
              onChange={(e) => setSearch((last) => ({ ...last, value: e.target.value, ...validatevalue(e.target.value, 5) }))}
              onCompositionEnd={() => setSearch((last) => ({ ...last, flag: true }))}
              onCompositionStart={() => setSearch((last) => ({ ...last, flag: false }))}
              placeholder='请输入文字搜索，按Enter键添加标签'
              onKeyUp={(e) => e.keyCode === 13 ? addItem() : ''} />
          </Form.Item>
        </Form>
        <div className="search-box" style={{ display: searchList.length > 0 ? 'block' : 'none' }}>
          <div className="search-box__arrow"></div>
          <ul>
            {
              searchList.map(el => {
                return (
                  <li key={el.tagId}>
                    <Tag.CheckableTag
                      key={el.tagId}
                      checked={selectedItems.find(item => el.tagId === item.tagId) !== undefined}
                      onChange={(checked) => checkItemChange(el, checked)}
                    >
                      {el.tagName}
                    </Tag.CheckableTag>
                  </li>
                )
              })
            }
          </ul>
        </div>
        {/* 标签列表 */}
        <div className="tag-select-content__items">
          {ItemData.map((item) => (
            <Tag.CheckableTag
              key={item.tagId}
              checked={selectedItems.find(el => el.tagId === item.tagId) !== undefined}
              onChange={(checked) => checkItemChange(item, checked)}
            >
              {item.tagName}
            </Tag.CheckableTag>
          ))}
          <InfiniteScroll loadMore={loadItemMore} hasMore={hasMore} />
        </div>
        <span className='tag-select-content__tip' style={{ display: isShowErr ? 'inline-block' : 'none' }}>最多可添加5个标签</span>
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
        <Button type="dashed" className='select-btn' style={{ display: selectedItems.length === 5 ? 'none' : 'inline-block', marginRight: 10 }}><PlusOutlined />添加文章标签</Button>
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
              <span key={Item.tagId} style={{ display: 'inline-block' }}>
                <Tag
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    deleteSelectedItem(Item.tagId);
                  }}
                  color='blue'
                >
                  {Item.tagName}
                </Tag>
              </span>
            );
          })
        }
      </TweenOneGroup>
    </>
  )
})
export default TagSelect
