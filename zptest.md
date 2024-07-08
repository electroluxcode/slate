# slate 0.88.1





# 0. 概念

- element 和 editor的子节点都有一个array<element>
- 默认是 block节点，可以通过editor.inInline来设置
- 关于图像的void，有一些元素我们需要定义他们不会作为文本被编辑。例如 image 需要时 void。我们可以将 editor.isVoid 设置成 true
- 
- 文本节点 实现类似粗体，斜体，代码等自定义格式的方式成为标记 mark

## 0.1 结构层级

- Editor: 根级节点

  - element：容器节点

    - text: 叶子节点(type: 'paragraph')

    - quote:

    - link

    - ```ts
      const paragraph = {
        type: 'paragraph',
        children: [{
        	text:"paragraph"
        }],
        url:''
      }
      ```

      



## 0.2 关于位置 | 光标 | 选区

- path 是 array<number> , 用来指示 位置的状态。 都是祖先节点的索引来的。注意编辑器的路径是[] 。例如调用 `Transforms.select(editor, [])` 选择编辑器的全部内容。

  - 例如 下面的节点他的 path就是 [0,0]

    ```ts
    const editor = {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'A line of text!',
            },
          ],
        },
      ]
    }
    ```

- Point： 接口如下 {path:path ,offset:numer}。如果想引用第一个位置，那么这样就可以了.point 可以被看作光标

  - ```ts
    const start = {
      path: [0, 0],
      offset: 0,
    }
    ```

- range | selection：指的是选区。例如选取范围.

  - ```ts
    interface Range {
      anchor: Point  // anchorNode: 指的是开始的节点 锚点
      focus: Point // focusNode: 指的是结束的节点 焦点
    }
    ```

  







## 0.3  数据结构

关于数据结构的转化

### 0.3.1 



### 0.3.2  `Range` | `path`

range 指的是文档范围，其中 

```ts
anchor
```







# 1. 使用



helloworld

```tsx
import React, { useRef, FC, useState, } from "react";
// 导入 Slate 编辑器工厂。
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' },{ text: 'A line of text in a paragraph.' }],
  },
]

export default function () {
  const [editor] = useState(() => withReact(createEditor()))
  let SlateRef = useRef()
  const clickTest = () => {
    console.log("点击我", editor)
  }
  return (
    <>
      <Slate editor={editor} initialValue={initialValue} >
        <Editable onKeyDown={event => {
          console.log(event.key)
        }} />
        <button onClick={clickTest}>测试</button>
      </Slate>
    </>
  );
}
```





## 1.1  页面元素

### 1.1.1 Slate | Editable

这两个一般配套使用，前者是上下文，上下文用过editor 属性拿到(通过withReact)

```tsx
<Slate editor={editor} initialValue={initialValue} >
    <Editable  />
    <button onClick={clickTest}>测试</button>
</Slate>
```

### 1.1.2  Editable 自己的属性

- spellCheck :自定校验
- autoFocus：自动聚焦





## 1.2 事件处理



match 是一个函数 match: (node, path) 这样 返回值也是  [node, path]

### 1.2.1 editor  事件 | slate 绑定的editor

这个是通过slate-react导出的方法来做事情的,editor 上属性如下,之后把 editor 这个变量绑定到 slate 上面就好了

```tsx
import React, { useRef, FC, useState, } from "react";
// 导入 Slate 编辑器工厂。
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
   
  )
}
```

下面放一个常见的属性

#### 1.2.1.1 找到临近选区最近的块 | unhangRange-

- `unhangRange`找到 range
- range 用 `common` 返回 common 和 path
- 顶级节点 直接返回第二步，如果不是顶级节点那么返回 Editor.above

#### 1.2.1.2 nodes | 查找节点

传入 editor 和 {match},返回的是匹配的node项目 数据结构是这样



```ts
const Elements = Editor.nodes(editor, {
  at: [], // 编辑器的路径
  match: (node, path) => {
      // paragraph	e
      return 'image' === node.type
  },
  // 模式默认是 “all”，所以也可以搜索编辑器的子元素
})
for (const nodeEntry of Elements) {
      console.log("nodeEntry:", nodeEntry)
}
```











#### 1.2.1.3 unhangRange

所有当前选区的父级的块

```ts
function getCommonBlock(editor) {
  const range = Editor.unhangRange(editor, editor.selection, { voids: true })

  let [common, path] = SlateNode.common(
    editor,
    range.anchor.path,
    range.focus.path
  )

  if (Editor.isBlock(editor, common) || Editor.isEditor(common)) {
    return [common, path]
  } else {
    return Editor.above(editor, {
      at: path,
      match: n => Editor.isBlock(editor, n) || Editor.isEditor(n),
    })
  }
}
```















### 1.1.2 Transform

#### 1.1.2.1 select

注意一下，似乎要先focus后才能够transform之类的

- 1.选择 path 可以有一套组合技

  - ```ts
    // editor 是绑定到 slate 的 变量 
    const Elements = Editor.nodes(editor, {
        at: [], // 编辑器的路径
        match: (node, path) => {
          // paragraph image
          return 'paragraph' === node.type
        },
        // 模式默认是 “all”，所以也可以搜索编辑器的子元素
    })
    let Loop = true
    while(Loop){
        let {value,done} = Elements.next()
        if(done){
            Loop = false
        }else{
             console.log(value,done)
            Transforms.select(editor, value[1])
        }
    }
    ```

- 2.选择指定范围

  - ```ts
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [1, 0], offset: 2 },
    })
    ```





#### 1.1.2.2 move | insert

- 3.光标移动(向后移动三个单词)

  - ```ts
    Transforms.move(editor, {
      distance: 3,
      unit: 'word',
      reverse: true,
    })
    ```

- insert

  - 不加上 at 就会在光标处插入

  - ```ts
    Transforms.insertNodes(
      editor,
      {
        text: 'A new string of text.',
      },
      {
       at: { path: [0, 0], offset: 3 },
      }
    )
    ```

- insert

  - ```ts
    Transforms.delete(editor, {
      at: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [1, 0], offset: 2 },
      },
    })
    ```

- move

  - ```javascript
    Transforms.moveNodes(editor, {
      at: [0, 0],
      to: [0, 1],
    })
    ```





### 1.2.15 键盘处理 

绑定一个事件就可以了，像这样

```tsx
 <Slate editor={editor} initialValue={initialValue} >
    <Editable onKeyDown={event => {
            console.log(event.key)
        }} />
    <button onClick={clickTest}>测试</button>
</Slate>
```

注意可以通过上下文来 进行事件处理



### 1.2.3 加粗,倾斜

主要是通过 renderLeaf 来进行事件的渲染

- 当用户触发事件的时候
- editor.addMark(editor,"")
- 数据会被传递到 props.leaf 中去，element元素在 prop.element

```tsx
// @ts-nocheck
import React, { useRef, FC, useState, useCallback, useEffect, } from "react";

// 导入 Slate 编辑器工厂。
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Editor, Transforms, Element } from 'slate'
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const PElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}


export default function App()  {
  const [editor] = useState(() => withReact(createEditor()))

  // 渲染元素
  const PBoldElement = useCallback(props => {
    
    useEffect(()=>{
      console.log("特定元素", props)
    },[])
    return <span {...props.attributes} style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}>{props.children}</span>
  },[])

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
          return <PElement {...props} />
    }
  }, [])

  return (
    <>
      <Slate editor={editor} initialValue={initialValue} >
      <Editable
        renderElement={renderElement}
        renderLeaf={PBoldElement}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }
          switch (event.key) {
            // 当按下 “`” 时，保留现有的代码块逻辑。
            case '`': {
              event.preventDefault()
              const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
              })
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                { match: n => Editor.isBlock(editor, n) }
              )
              break
            }

            // 当按下 “B” 时，所选内容进行文本加粗
            // Editor.addMark 的时候会触发renderLeaf的重渲染
            case 'b': {
              event.preventDefault()
              Editor.addMark(editor, 'bold', true)
              break
            }
          }
        }}
      />
      
      </Slate>
    </>
  );
}
```







## 1.2 云文档 | 操作

### 1.2.1 apply 

主要通过 apply函数进行 累加,就像下面这样

```ts
editor.apply({
  type: 'insert_text',
  path: [0, 0],
  offset: 15,
  text: 'A new string of text to be inserted.',
  properties: {
    anchor: { path: [0, 0], offset: 0 },
  },
  newProperties: {
    anchor: { path: [0, 0], offset: 15 },
  },
})
```









## 1.3 自定义元素

传递的元素有两个

- attr: 单纯的属性
- children: 元素



主要要做的事情 | 注意一下似乎会覆盖默认的元素

- 定义fn 。传入 prop 和 children
- 一个工具函数通过判断 props.element.type来自定义渲染
- Editable 元素中渲染 renderElement 就可以了



```jsx
import React, { useRef, FC, useState, useCallback, } from "react";
// 导入 Slate 编辑器工厂。
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Editor, Transforms, Element } from 'slate'

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

export default function () {
  const [editor] = useState(() => withReact(createEditor()))
  const clickTest = () => {
    console.log("点击我", editor)
  }
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
    }
  }, [])
  
  return (
    <>
      <Slate editor={editor} initialValue={initialValue} >
        <Editable 
        renderElement={renderElement}
        onKeyDown={event => {
          if (event.key === '`' && event.ctrlKey) {
            // 默认防止插入 “`”。
            // event.preventDefault()
            // 否则，将当前已选块类型设置为 “code”。
            Transforms.setNodes(
              editor,
              // @ts-ignore
              { type: 'code' },
              { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
          }
        }} />
        <button onClick={clickTest}>测试</button>
      </Slate>
    </>
  );
}



```



```ts
import React, { useRef, FC, useState, useCallback, } from "react";
// 导入 Slate 编辑器工厂。
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Editor, Transforms, Element } from 'slate'
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' },{ text: 'A line of text in a paragraph.' }],
  },
]

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}


const PElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}
export default function () {
  const [editor] = useState(() => withReact(createEditor()))
  const clickTest = () => {
    console.log("点击我", editor)
  }
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <PElement {...props} />
    }
  }, [])
  
  return (
    <>
      <Slate editor={editor} initialValue={initialValue} >
        <Editable 
        renderElement={renderElement}
        onKeyDown={event => {
          if (event.key === '`' && event.ctrlKey) {
            // 默认防止插入 “`”。
            // event.preventDefault()
            // 否则，将当前已选块类型设置为 “code”。
            Transforms.setNodes(
              editor,
              // @ts-ignore
              { type: 'code' },
              { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
          }
        }} />
        <button onClick={clickTest}>测试</button>
      </Slate>
    </>
  );
}


```





## 1.4 格式化 | 标准化

当粘贴文本内容的时候可能会引发数据结构不一致的情况这个时候我们需要用到

`normalizeNode`







## 1.5 plugin 插件





