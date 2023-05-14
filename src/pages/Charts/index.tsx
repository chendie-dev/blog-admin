import React, { useState } from 'react';
import { MdPreview, MdCatalog } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

const editorId = 'my-editor';

export default () => {
  const [state] = useState({
    text: '# heading',
    scrollElement: document.documentElement
  });

  return (
    <>
      <MdPreview modelValue={state.text} editorId={editorId}  />
      <MdCatalog editorId={editorId} scrollElement={state.scrollElement} />
    </>
  );
};