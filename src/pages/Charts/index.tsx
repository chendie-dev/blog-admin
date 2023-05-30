import React, { useCallback, useRef } from 'react'
import EmojiExtension from '../../components/EmojiExtension'
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt/lib/types/MdEditor/type';

export default function Charts() {
  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
}, []);
const editorRef = useRef<ExposeParam>();
  return (
    <div style={{height:'600px'}}>
      {/* <iframe src='http://8.130.107.218:28087/' style={{height:'100%',width:'1050px'}}></iframe> */}
    </div>
  )
}
