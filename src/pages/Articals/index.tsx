import { useState, ChangeEvent } from 'react'
import { Input, Button } from 'antd'
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
// import './index.css'
import './index.scss'
export default function Articals() {
  const [text, setText] = useState('');
  const [articalTitle, setArticalTitle] = useState('')
  const publishOrSave=()=>{
    console.log('title',articalTitle,'content',text);
  }
  return (
    <div className='articals'>
      <p className="card-title">发布文章</p>
      <div className="a-form" onChange={(e: ChangeEvent<HTMLInputElement>) => setArticalTitle(e.target.value)}>
        <Input placeholder="输入文章标题" />
        <Button type="primary" danger style={{ float: 'right' }} onClick={publishOrSave}>发布文章</Button>
        <Button danger style={{ float: 'right', marginRight: '10px' }} onClick={publishOrSave}>保存草稿</Button>
      </div>
      <MdEditor
        modelValue={text}
        onChange={setText}
        style={{ height: '500px',marginBottom:'20px' }}
        placeholder='开始编辑.....'
        showCodeRowNumber={true}
        toolbarsExclude={['github', 'save']}
        // 识别vs code代码
        autoDetectCode={true}
        
      />
      <p className="card-title">发布设置</p>
      <div className="setting-form"></div>
    </div>
  )
}
