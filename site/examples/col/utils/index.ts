import { Transforms } from "slate"
import { ReactEditor } from "slate-react"

/**
 * @description 得到兄弟path之前的路径
 * @param path
 */
export const beforeSiblingPath = (path) => {
	if (!Array.isArray) {
		return []
	}

	let lastPath = path.at(-1)
	lastPath--
	if (lastPath < 0) {
		path[path.length - 1] = 0
		return path
	}
	path[path.length - 1] = lastPath
}

/**
 * @description 得到兄弟path之后的路径
 * @param path
 */
export const afterSiblingPath = (path) => {
	path = JSON.parse(JSON.stringify(path))
	if (!Array.isArray) {
		return []
	}
	let lastPath = path.at(-1)
	lastPath++
	path[path.length - 1] = lastPath
	return path
}

export function throttle (func, delay) {
	let timer = null
	let lastArgs = null // 用于存储最后一次函数调用时的参数

	return function a () {
		const context = this
		const args = arguments

		if (!timer) {
			// 如果没有定时器，即第一次调用或者定时器已经执行完成
			timer = setTimeout(() => {
				func.apply(context, lastArgs) // 使用最后一次调用时的参数执行函数
				timer = null
			}, delay)
			lastArgs = args // 存储本次调用时的参数
		}
	}
}

export function debounce (func, delay) {
	let timeoutId = null

	return function a () {
		const context = this
		const args = arguments

		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			func.apply(context, args)
		}, delay)
	}
}

/**
 * @description 传入正在拖动的元素,计算宽度等值
 * @param param0
 */
export function useDragElement ({ element, endX, startX, PADDING, curElementWidth }) {
	let curRadio = 0
	const DRAG_COUNT = element.parentElement.children.length / 2 - 1
	let containerElementWidth = element.parentElement.clientWidth
	const deltaX = endX - startX

	// 避免最后一次的异常
	if (endX === 0) {
		return
	}
	if (deltaX) {
		curRadio = Math.floor(
			((deltaX + curElementWidth) /
        (containerElementWidth - PADDING * DRAG_COUNT)) *
      100
		)
	}
	return {
		curRadio
	}
}

/**
 * @description 得到目前的节点和他的兄弟节点(特定结构)
 * @param param0
 * @returns
 */
export const getCurAndNextNodes = ({ element, type = "col-item", editor, curRadio, dragElement }) => {

	// 得到目前的 path 路径
	const path = ReactEditor.findPath(editor, element)
	const nextPath = afterSiblingPath(path)

	// 得到目前的 node 节点的值
	// 用findNode 替换 editor.nodes，因为没有?
	const curElement = editor.nodes({
		at: {
			path,
			offset: 0
		},
		match: n => n.type === type
	})
	const nextElement = editor.nodes({
		at: {
			path: nextPath,
			offset: 0
		},
		match: n => n.type === type
	})

	// 得到节点值并且计算后一个元素的比例
	const [curOriginType] = curElement.next().value
	const [nextOriginType] = nextElement.next().value

	const curOriginRadio = Math.floor(curOriginType.width.replace("%", ""))
	const nextOriginRadio = Math.floor(nextOriginType.width.replace("%", ""))

	const diffCurRadio = curRadio - curOriginRadio

	const renderNextRadio = nextOriginRadio - diffCurRadio

	let renderCurElement = dragElement?.previousSibling
	let renderNextElement = dragElement?.nextSibling
	return {
		curElement, nextElement, path, nextPath, renderNextRadio, renderCurElement, renderNextElement
	}
}

/**
 * @description 设置元素style
 * @param {*} param0
 */
export const setColElement = ({
	element,
	key,
	value
}) => {
	if (!element || !key) {
		throw new Error("setColElement null")
	}
	element.style[key] = `${value}`
}




/**
 * @description 添加后重新计算
 */

export const addColReCount = ({editor,element}) => {
  const path = ReactEditor.findPath(editor, element)
  const curElement = editor.nodes({
		at: {
			path,
			offset: 0
		},
		match: n => n.type === "col"
	})
  const nextPath = afterSiblingPath(path)

  let [nowElement,path1] = curElement.next().value
  console.log(nowElement.children,path)

  let length = nowElement.children.length
  let shouldRenderSize = 100 / length;

  for(let i in nowElement.children){
    let curRenderSize =Math.floor(((Math.floor(nowElement.children[i].width.replace("%",""))) / (shouldRenderSize + 100)) * 100)
    const curpath = ReactEditor.findPath(editor, nowElement.children[i])
    console.log("ceshi", {curpath,curRenderSize, shouldRenderSize}, nowElement.children[i].width,
      nowElement.children[i].width
    )
    Transforms.setNodes(editor, { width: `${curRenderSize}%` }, { at: curpath })
  }

  let insertShouldRenderSize = Math.floor((shouldRenderSize / (shouldRenderSize + 100)) * 100)
  Transforms.insertNodes(editor,
    [{
      type: "col_item",
      width: `${insertShouldRenderSize}%`,
      children: [{
        type: 'paragraph',
        children: [{ text: '下一个' }],
      },]
    }],  { at: nextPath }
  )

}
