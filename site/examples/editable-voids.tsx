import React, { useState, useMemo } from 'react'
import { Transforms, createEditor, Descendant } from 'slate'
import { Slate, Editable, useSlateStatic, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'

import RichTextEditor from './richtext'
import { Button, Icon, Toolbar } from '../components'
import { EditableVoidElement } from './custom-types.d'
import {
  useReadOnly,
  ReactEditor,
} from 'slate-react'



const EditableVoidsExample = () => {
  const editor = useMemo(
    () => withEditableVoids(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <InsertEditableVoidButton />
        {/* fdsdf */}
      </Toolbar>

      <Editable
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  )
}

const withEditableVoids = editor => {
  const { isVoid } = editor

  // 知识点2:设置空元素，就是这个元素不能够被编辑
  // video 元素似乎也是这样
  // editor.isVoid = element => {
  //   return element.type === 'editable-void' ? true : isVoid(element)
  // }

  return editor
}

// 知识点1: 插入数据示例，其实也不难哈哈。 单纯的: EditableVoidElement.insertNode 就可以了
const insertEditableVoid = editor => {
  const text = { text: '' }
  const voidNode = {
    type: 'editable-void',
    children: [text],
    textValue:"插入数据示例"
  } as  EditableVoidElement
  Transforms.insertNodes(editor, voidNode)
}

const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'editable-void':
      return <EditableVoid {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const unsetWidthStyle = css`
  width: unset;
`

const EditableVoid = ({ attributes, children, element }) => {
  const [inputValue, setInputValue] = useState(element?.textValue)
  // const [inputValue, setInputValue] = useState(element?.text)

  // 知识点1.1 每一次setNode都会重渲染
  const editor = useSlateStatic()

  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div
        className={css`
          box-shadow: 0 0 0 3px #ddd;
          padding: 8px;
        `}
      >
        <h4>Name:</h4>
        <input
          className={css`
            margin: 8px 0;
            opacity: ${inputValue>1 ? 1 : 0.2};
          `}
          type="text"
          value={inputValue || ''}
          onChange={(e:any) => {
            setInputValue(e.target.value)
            const path = ReactEditor.findPath(editor, element)
            const newProperties:any = {
              textValue: e.target.value,
            }
            // 会触发重渲染 setNodes 的 第二个参数会被添加到 element里面
            Transforms.setNodes(editor, newProperties, { at: path })
          }}
        />

        <h4>Tell us about yourself:</h4>
        <div
          className={css`
            padding: 20px;
            border: 2px solid #ddd;
          `}
        >
          <RichTextEditor />
        </div>
      </div>
      {children}
    </div>
  )
}

const InsertEditableVoidButton = () => {
  const editor = useSlateStatic()
  return (
    <Button
      onMouseDown={event => {
        event.preventDefault()
        insertEditableVoid(editor)
      }}
    >
      <Icon>add</Icon>
    </Button>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to nodes that contain editable text, you can insert void nodes, which can also contain editable elements, inputs, or an entire other Slate editor.',
      },
    ],
  },
  {
    type: 'editable-void',
    children: [{ text: '5555' }],
    textValue: "dsadda2sd"
  },

] as Descendant[]

export default EditableVoidsExample
