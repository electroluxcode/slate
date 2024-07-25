import React, { useMemo, useCallback } from 'react'
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  ReactEditor,
} from 'slate-react'
import {
  Transforms,
  createEditor,
} from 'slate'
import { withHistory } from 'slate-history'
//
const initialValue: any[] = [
  {
    type: 'p1',
    children: [
      {
        type:"three",
        children:[{
          text:"three5555555"
        }]
      },
    ],
  },
  {
    type: 'p2',
    children: [
      {
        text: 'p2',
      },
    ],
  },
]


const Demo = () => {
  const renderElement = useCallback(props => <ElementList {...props} />, [])
  const editor = useMemo(
    () => (withHistory(withReact(createEditor()))),
    []
  )
  // @ts-ignore
  window.editor = editor
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={renderElement}
        placeholder="Get to work…"
      />
    </Slate>
  )
}


const ElementList = props => {
  let editor = useSlateStatic()
  const { attributes, children, element } = props

  switch (element.type) {
    case 'one':
      return <div className='one' {...attributes}>{children}</div>
    case 'two':
        return <div className='two' {...attributes}>{children}</div>
    case 'three':
          return <div className='three' {...attributes}>{children}</div>
    case 'p1':
      return <div className='p1' {...attributes}

      onClick={() => {
        const path = ReactEditor.findPath(editor, element)
        const newProperties = {
          "type": "one",
          "children": [
            {
               text:"1111111",
              "type": "two",
              "children": [
                {
                  "type": "three",
                  children:[{
                    text:"shouldbe replace"
                  }]
                }
              ]
            }
          ]
        } as any
        console.log("click", path)
        console.log("editor.children", editor.children)

        // Transforms.delete(editor, { at: path, unit: "line" })
        Transforms.setNodes(editor, newProperties, { at: path , mode:"all"})
      }}
      >{children}</div>
    case 'p2':
      return <div className='p2' {...attributes}

      onClick={() => {
        const path = ReactEditor.findPath(editor, element)
        const newProperties = {
          "type": "one",
          children:[{
            text:"1111111",
          }]
        } as any
        console.log("click", path)
        console.log("editor.children", editor.children)

        // Transforms.delete(editor, { at: path, unit: "line" })
        // Transforms.setNodes(editor, newProperties, { at: path })
        Transforms.insertNodes(editor, newProperties, { at: path })
      }}
      >{children}</div>

  }
}



export default Demo
