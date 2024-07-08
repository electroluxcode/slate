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
//
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'With Slate xes inside check list items!',
      },
    ],
  },
  {
    type: 'docx-grid-block',
    checked: true,
    children: [{ text: 'Slide to the left.', width: "33%" }, { text: 'Slide to the left.', width: "33%" }, { text: 'Slide to the left.', width: "33%" }],
  },

]


const CheckListsExample = () => {
  const renderElement = useCallback(props => <ElementList {...props} />, [])
  const editor = useMemo(
    () => withChecklists(withHistory(withReact(createEditor()))),
    []
  )
  const [target, setTarget] = useState<Range | undefined>()
  const onKeyDown = useCallback(
    event => {
      if (target) {
        switch (event.key) {
          case 'Enter':
            event.preventDefault()
            Transforms.select(editor, target)
            setTarget(null)
            break
        }
      }
    },
    [editor, target]
  )
  window.editor = editor
  return (
    <Slate editor={editor} initialValue={initialValue}

    >
      <Editable
        renderElement={renderElement}
        placeholder="Get to work…"

      />
    </Slate>
  )
}

// 知识点2: 插件
const withChecklists = editor => {
  const {
    deleteBackward,
    insertBreak,
    normalizeNode,
    insertNode,
    insertText ,
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
  // c
  const { attributes, children, element } = props

  switch (element.type) {
    case 'docx-grid-block':
      return <CheckListItemElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}



const insertMention = (editor) => {
  const mention = {
    type: 'p',
    children: [{ text: '' }],
  }
  // Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}


const singleCol = ({ text, width, key, children }) => {
  const editor = useSlateStatic()
  let [value, setValue] = useState(text)
  let onChange = (e) => {
    setValue(e.target.value)
  }
  let onInput = (e) => {
    setValue(e.target.value)
  }
  const [target, setTarget] = useState<Range | undefined>()

  return <span key={key} contentEditable={true} style={{ width: width }}
    onChange={onInput}
    suppressContentEditableWarning>
    {value}
  </span>

}



const CheckListItemElement = ({ attributes, children, element }) => {

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

      {
        element.children.map((e, index) => {
          return (
            singleCol({ text: e.text, width: e.width, key: index, children })
          );
        })
      }

    </div>
  )
}

export default CheckListsExample
