import React, { useCallback, useRef, useState } from 'react'
import { MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css';
import { uploadImageReq } from '../../requests/api';
import './index.scss'
import { Button } from 'antd';
import EmojiExtension from '../../components/EmojiExtension';
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt/lib/types/MdEditor/type';
import ReadExtension from '../../components/ReadExtension';
export default function About() {
    const [id] = useState('about');
    const [content, setContent] = useState('');//内容
    //上传内容图片
    const onUploadImg = async (files: string[], callback: (urls: string[]) => void) => {
        const res: imageUrlRes[] = await Promise.all(
            files.map((file) => {
                const form = new FormData();
                form.append('image', file);
                return uploadImageReq(form)
            })
        );
        callback(res.map((item) => item.data));
    };
    const editorRef = useRef<ExposeParam>();
    const onInsert = useCallback((generator: InsertContentGenerator) => {
        editorRef.current?.insert(generator);
    }, []);

    return (
        <div className='about'>
            <p className="title">关于我</p>
            <MdEditor
                theme='light'
                previewTheme='default'
                codeTheme='atom'
                ref={editorRef}
                editorId={id}
                modelValue={content}
                onChange={setContent}
                onUploadImg={onUploadImg}
                style={{ height: '500px', margin: '15px 0' }}
                placeholder='开始编辑.....'
                showCodeRowNumber={true}
                toolbarsExclude={['save']}
                defToolbars={[
                    <EmojiExtension onInsert={onInsert} key="emoji-extension" />,
                    <ReadExtension mdText={content} key="read-extension" />
                ]}
                autoDetectCode={true}
                toolbars={[
                    'bold',
                    'underline',
                    'italic',
                    'strikeThrough',
                    '-',
                    'title',
                    'sub',
                    'sup',
                    'quote',
                    'unorderedList',
                    'orderedList',
                    'task',
                    '-',
                    'codeRow',
                    'code',
                    'link',
                    'image',
                    'table',
                    'mermaid',
                    'katex',
                    0,
                    1,
                    '-',
                    'revoke',
                    'next',
                    'save',
                    '=',
                    'prettier',
                    'pageFullscreen',
                    // 'fullscreen',
                    'preview',
                    'htmlPreview',
                    'catalog',
                    'github'
                ]}
            />
            <Button type='primary' style={{ float: 'right' }}>提交</Button>

        </div>
    )
}
