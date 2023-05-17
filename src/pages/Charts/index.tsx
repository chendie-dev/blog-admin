import React, { useCallback, useRef } from 'react'
import EmojiExtension from '../../components/EmojiExtension'
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt/lib/types/MdEditor/type';

export default function Charts() {
  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
}, []);
const editorRef = useRef<ExposeParam>();
  return (
    <div>
      <a href="">11233</a>
    </div>
  )
}
