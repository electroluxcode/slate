import React, { useMemo, useCallback, useState } from 'react'
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  useReadOnly,
  ReactEditor,
} from 'slate-react'
import {
  Editor,
  Transforms,
  Range,
  Point,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'
import { css } from '@emotion/css'
import { withHistory } from 'slate-history'
import { Button } from '../components'
//
const initialValue: Descendant[] = [

  {
    type: 'docx-grid-block',
    children: [
      {
        type: "grid-item",
        width: "33%",
        children: [{
          type: 'paragraph',
          children: [{ text: '11' }],
        },]
      },
      {
        type: "grid-item",
        width: "33%",
        children: [{
          type: 'paragraph',
          children: [{ text: '22' }],
        },]
      },{
        type: "grid-item",
        width: "33%",
        children: [{
          type: 'paragraph',
          children: [{ text: '22' }],
        },]
      },
    ],
  },

]


const CheckListsExample = () => {
  const renderElement = useCallback(props => <ElementList {...props} />, [])
  const editor = useMemo(
    () => withChecklists(withHistory(withReact(createEditor()))),
    []
  )
    setTimeout(() => {


    }, 1000);
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  window.editor = editor

  const add = ()=>{
    const pos = Editor.nodes(editor, {
      at: [], // 编辑器的路径
      match: (node, path) => 'grid-item' === node.type,
      // 模式默认是 “all”，所以也可以搜索编辑器的子元素
    })
    let arr = []
    for(let i of pos){
      console.log("test:",pos,i)
      arr.push(i)
    }
    console.log("pos",arr)
    const voidNode ={
      type: "grid-item",
      width: "33%",
      children: [{
        type: 'paragraph',
        children: [{ text: '22' }],
      },]
    }  as any
    Transforms.insertNodes(editor, voidNode,{
      at:arr[0][1]
    })
  }
  return (
    <>
    <Button onClick={add}>click me add</Button>
    <Slate editor={editor} initialValue={initialValue}
    >
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        placeholder="Get to work…"

      />
    </Slate>
    </>

  )
}

// 知识点2: 插件
const withChecklists = editor => {
  const {
    deleteBackward,
    insertBreak,
    normalizeNode,
    insertNode,
    insertText,
    insertTextData,
    insertData,
    insertFragment,
    insertFragmentData,
    normalize

  } = editor
  console.log("插件注册:", editor)

  editor.insertBreak = (...args) => {
    console.log("insertBreak:", args)
    insertBreak(...args)
  }

  editor.normalizeNode = (...args) => {
    console.log("normalizeNode:", args)
    normalizeNode(...args)
  }
  editor.insertNode = (...args) => {
    console.log("insertNode:", args)
    insertNode(...args)
  }
  editor.insertText = (...args) => {
    console.log("insertText:", args)
    insertText(...args)
  }
  editor.insertTextData = (...args) => {
    console.log("insertTextData:", args)
    insertTextData(...args)
  }
  editor.insertData = (...args) => {
    console.log("insertData:", args)
    insertData(...args)
  }

  editor.insertFragment = (...args) => {
    console.log("insertFragment:", args)
    insertFragment(...args)
  }
  editor.insertFragmentData = (...args) => {
    console.log("insertFragmentData:", args)
    insertFragmentData(...args)
  }
  editor.normalizeNode = (...args) => {
    console.log("normalizeNode:", args)
    normalizeNode(...args)
  }
  editor.normalize = (...args) => {
    console.log("normalize:", args)
    normalize(...args)
  }
  return editor
}


// ElementList
const ElementList = props => {
  const { attributes, children, element } = props
  console.log("element:", { attributes, children, element } )
  switch (element.type) {
    case 'docx-grid-block':
      return <CheckListItemElement {...props} />
    case 'grid-item':
      return <SingleCol width={element.width}  children={children}></SingleCol>
    default:
      return <p {...props} children={children}></p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  return <span {...attributes}>{children}</span>
}


const insertMention = (editor) => {
  const mention = {
    type: 'p',
    children: [{ text: '' }],
  }
  // Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}


const SingleCol = ({ text, width, key, children }= prop) => {
  const editor = useSlateStatic()
  let [value, setValue] = useState(text)

  console.log("这个组件xuanran：",value)

  return <div key={key} style={{ width: width }}
    suppressContentEditableWarning>
    {children}
  </div>

}



const CheckListItemElement = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  // const readOnly = useReadOnly()
  const { checked } = element
  console.log("测试:", { attributes, children, element })
  const path = ReactEditor.findPath(editor,element)
  console.log("path:",path)

  return (
    <div
      // {...attributes}
      className={css`
        display: flex;
        flex-direction: row;
        align-items: center;
      `}
    >
      {children}
    </div>
  )
}

export default CheckListsExample
