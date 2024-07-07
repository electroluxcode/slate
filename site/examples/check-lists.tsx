import React, { useMemo, useCallback } from 'react'
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
//
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'With Slate you can build complex block types that have their own embedded content and behaviors, like rendering checkboxes inside check list items!',
      },
    ],
  },
  {
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Slide to the left.' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Slide to the right.' }],
  },
]


const CheckListsExample = () => {
  const renderElement = useCallback(props => <ElementList {...props} />, [])
  const editor = useMemo(
    () => withChecklists(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={renderElement}
        placeholder="Get to work…"
      />
    </Slate>
  )
}

// 知识点2: 插件
const withChecklists = editor => {
  const { deleteBackward } = editor

  // 知识点: 2.1 : 在delete的时候 | 首个字符的时候 设置默认格式
  // editor.deleteBackward = (...args) => {
  //   const { selection } = editor
  //     const [match] = Editor.nodes(editor, {
  //       match: n =>
  //         !Editor.isEditor(n) &&
  //         SlateElement.isElement(n) &&
  //         n.type === 'check-list-item',
  //     })
  //     // match 拿到的是 删除前的值
  //     console.log("back",{
  //       selection,
  //       isCollapsed:Range.isCollapsed(selection),
  //       match,
  //       args
  //     })

  //   // 确定是代码块，
  //   if (selection && Range.isCollapsed(selection)) {
  //     // 插件匹配目前状态
  //     const [match] = Editor.nodes(editor, {
  //       match: n =>
  //         !Editor.isEditor(n) &&
  //         SlateElement.isElement(n) &&
  //         n.type === 'check-list-item',
  //     })

  //     if (match) {
  //       const [, path] = match
  //       const start = Editor.start(editor, path)
  //       // 回退是在 首位的时候 setNode
  //       console.log(start,selection)
  //       if (Point.equals(selection.anchor, start)) {
  //         const newProperties: Partial<SlateElement> = {
  //           type: 'paragraph',
  //         }
  //         Transforms.setNodes(editor, newProperties, {
  //           match: n =>
  //             !Editor.isEditor(n) &&
  //             SlateElement.isElement(n) &&
  //             n.type === 'check-list-item',
  //         })
  //         return
  //       }
  //     }
  //   }

  //   deleteBackward(...args)
  // }



  return editor
}

/**
 *
 render element 属性
 attr
 children
 element

 */


 // ElementList
const ElementList = props => {
  // c
  const { attributes, children, element } = props

  switch (element.type) {
    case 'check-list-item':
      return <CheckListItemElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}


// 知识点1:元素怎么编写
// 目前看 attr没有用
// children 是真实节点
// element是 渲染的 属性
const CheckListItemElement = ({ attributes, children, element }) => {
  // 知识点1.1 每一次setNode都会重渲染
  const editor = useSlateStatic()
  // const readOnly = useReadOnly()
  const { checked } = element
  console.log("测试:", { attributes, children, element })
  return (
    <div
      // {...attributes}
      className={css`
        display: flex;
        flex-direction: row;
        align-items: center;


      `}
    >
      <span
        contentEditable={false}
        className={css`
          margin-right: 0.75em;
        `}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={event => {
            const path = ReactEditor.findPath(editor, element)
            const newProperties: Partial<SlateElement> = {
              checked: event.target.checked,
            }
            // 会触发重渲染 setNodes 的 第二个参数会被添加到 element里面
            Transforms.setNodes(editor, newProperties, { at: path })
          }}
        />
      </span>
      {/*  */}
      <span
        contentEditable={true}
        suppressContentEditableWarning
        className={css`
          flex: 1;
          opacity: ${checked ? 0.666 : 1};
          text-decoration: ${!checked ? 'none' : 'line-through'};

          &:focus {
            outline: none;
          }
        `}
      >
        {children}
      </span>
    </div>
  )
}

export default CheckListsExample
