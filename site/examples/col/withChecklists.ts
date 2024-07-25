export  const withChecklists = editor => {
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

  // editor.insertBreak = (...args) => {
  //   console.log("insertBreak:", args)
  //   insertBreak(...args)
  // }

  // editor.normalizeNode = (...args) => {
  //   console.log("normalizeNode:", args)
  //   normalizeNode(...args)
  // }
  // editor.insertNode = (...args) => {
  //   console.log("insertNode:", args)
  //   insertNode(...args)
  // }
  // editor.insertText = (...args) => {
  //   console.log("insertText:", args)
  //   insertText(...args)
  // }
  // editor.insertTextData = (...args) => {
  //   console.log("insertTextData:", args)
  //   insertTextData(...args)
  // }
  // editor.insertData = (...args) => {
  //   console.log("insertData:", args)
  //   insertData(...args)
  // }

  // editor.insertFragment = (...args) => {
  //   console.log("insertFragment:", args)
  //   insertFragment(...args)
  // }
  // editor.insertFragmentData = (...args) => {
  //   console.log("insertFragmentData:", args)
  //   insertFragmentData(...args)
  // }
  // editor.normalizeNode = (...args) => {
  //   console.log("normalizeNode:", args)
  //   normalizeNode(...args)
  // }
  // editor.normalize = (...args) => {
  //   console.log("normalize:", args)
  //   normalize(...args)
  // }
  return editor
}
