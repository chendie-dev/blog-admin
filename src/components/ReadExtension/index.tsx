import React, { useState } from 'react';
import { MdPreview, ModalToolbar } from 'md-editor-rt';
import MyIcon from '../MyIcon';
import './index.scss'
interface ReadExtensionProp {
    mdText: string;
}

/**
 * modal-toolbar组件不会再关闭时销毁子组件，这时需要区别预览扩展组件的标题ID生成方式和编辑器的标题ID生成方式
 *
 * @see https://github.com/imzbf/md-editor-v3/issues/207
 **/
const readingHeadingId = (_text: string, _level: number, index: number) => {
    return `read-ex-heading-${index}`;
};

const ReadExtension = (props: ReadExtensionProp) => {
    const [state, setState] = useState({
        visible: false,
        modalFullscreen: false
    });


    return (
        <div className="extension1">
            <ModalToolbar
                visible={state.visible}
                isFullscreen={state.modalFullscreen}
                showAdjust
                title="弹窗预览"
                modalTitle="编辑预览"
                width="870px"
                height="600px"
                onClick={() => {
                    setState({
                        ...state,
                        visible: true
                    });
                }}
                onClose={() => {
                    setState({
                        ...state,
                        visible: false
                    });
                }}
                onAdjust={() => {
                    setState({
                        ...state,
                        modalFullscreen: !state.modalFullscreen
                    });
                }}
                trigger={
                    <MyIcon type='icon-yulan' className='md-editor-icon' />
                }
            >
                <div
                    style={{
                        height: '100%',
                        padding: '20px',
                        overflow: 'auto'
                    }}
                >
                    <MdPreview
                        //   theme={store.theme}
                        //   language={store.lang}
                        //   previewTheme={store.previewTheme}
                        //   codeTheme={store.codeTheme}
                        theme='light'
                        previewTheme='default'
                        codeTheme='atom'
                        editorId="edit2preview"
                        modelValue={props.mdText}
                        mdHeadingId={readingHeadingId}
                    />
                </div>
            </ModalToolbar>
        </div>
    );
};

export default ReadExtension;