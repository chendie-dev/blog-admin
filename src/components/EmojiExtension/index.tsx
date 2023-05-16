import React, { useState } from 'react';
import { DropdownToolbar } from 'md-editor-rt';
import { emojis } from './data';
import { InsertContentGenerator } from 'md-editor-rt/lib/types/MdEditor/type';
import MyIcon from '../MyIcon';
import './index.scss'
interface EmojiExtensionProp {
  onInsert: (generator: InsertContentGenerator) => void;
}

const EmojiExtension = (props: EmojiExtensionProp) => {
  const [state, setState] = useState({
    visible: false
  });

  const emojiHandler = (emoji: string) => {
    const generator: InsertContentGenerator = () => {
      return {
        targetValue: emoji,
        select: true,
        deviationStart: 0,
        deviationEnd: 0
      };
    };

    props.onInsert(generator);
  };

  const onChange = (visible: boolean) => {
    setState({
      visible
    });
  };

  return (
    <div className='extension'>
      <DropdownToolbar
        title="emoji"
        visible={state.visible}
        onChange={onChange}
        trigger={
          <MyIcon type="icon-biaoqingemoji" className='md-editor-icon' />
        }
        overlay={
          <div className="emoji-container">
            <ul className="emojis clearfix">
              {emojis.map((emoji, index) => {
                return (
                  <li
                    key={`emoji-${index}`}
                    onClick={() => {
                      emojiHandler(emoji);
                    }}
                  >
                    {emoji}
                  </li>
                );
              })}
            </ul>
          </div>
        }
      ></DropdownToolbar>
    </div>
  );
};

export default EmojiExtension;