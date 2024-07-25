// @ts-nocheck
import React, { useMemo, useCallback, useState } from 'react'
import isHotkey from 'is-hotkey'
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

import { withChecklists } from './col/withChecklists'

import { ColContainer } from './col/components/ColContainer'
import { ColItem } from './col/components/ColItem'
import { initialValue } from './col/const'



const ColExample = () => {
  const renderElement = useCallback(props => <ElementList {...props} />, [])
  const editor = useMemo(
    () => withChecklists(withHistory(withReact(createEditor()))),
    []
  )

const useOnKeydown = (editor: Editor, element) => {
  const onKeyDown: React.KeyboardEventHandler = useCallback(
    e => {
      console.log("触发热键", editor)
      if (isHotkey("mod+a", e)) {
        let cellEntry = Editor.nodes(editor, {
          match: n => n.type === 'col_item',
          at:editor.selection
        })
        if (!cellEntry) {
          return
        }
       let {value:[curElement, cellPath]} = cellEntry.next()

        let range = Editor.range(editor, cellPath)
        Transforms.select(editor, range)
        e.preventDefault()
			  e.stopPropagation()

      }
    },
    [editor]
  )

  return onKeyDown
}
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const onKeyDown = useOnKeydown(editor)
  // 知识点1: 插入键盘事件


  const add = () => {
    const pos = Editor.nodes(editor, {
      at: [], // 编辑器的路径
      match: (node, path) => node.type === 'col-item',
      // 模式默认是 “all”，所以也可以搜索编辑器的子元素
    })
    const arr = []
    for (const i of pos) {
      console.log('test:', pos, i)
      arr.push(i)
    }
    console.log('pos', arr)
    const voidNode = {
      type: 'col-item',
      width: '33%',
      children: [
        {
          type: 'paragraph',
          children: [{ text: '22' }],
        },
      ],
    } as any
    Transforms.insertNodes(editor, voidNode, {
      at: arr[0][1],
    })
  }

  const add2 = () => {

    const voidNode =
      {
        type: "col",
        children: [
          {
            type: "col-item",
            width: "20%",
            children: [
              {
                type: "p",
                children: [{ text: "" }]
              }
            ]
          },
          {
            type: "col-item",
            width: "20%",
            children: [
              {
                type: "p",
                children: [{ text: "" }]
              }
            ]
          },
          {
            type: "col-item",
            width: "20%",
            children: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            type: "col-item",
            width: "20%",
            children: [
              {
                type: "paragraph",
                children: [{ text: "22" }]
              }
            ]
          },
          {
            type: "col-item",
            width: "20%",
            children: [
              {
                type: "paragraph",
                children: [{ text: "22" }]
              }
            ]
          }
        ]
      } as any
    Transforms.insertNodes(editor, voidNode, {
      at: {
        path: [],
        offset: 0
      }
    })
  }
  return (
    <>
      <Button onClick={add2}>click me add</Button>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          placeholder="Get to work…"
          onKeyDown={onKeyDown}
        />
      </Slate>
    </>
  )
}

// 知识点2: 插件

// ElementList
const ElementList = props => {
  const { attributes, children, element } = props
  // console.log("element:", { attributes, children, element } )
  switch (element.type) {
    case 'col':
      return <ColContainer {...props} />
    case 'col_item':
      return <ColItem element={element} children={children} />
    default:
      return <p {...props} children={children} />
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  return <span {...attributes}>{children}</span>
}

export default ColExample
