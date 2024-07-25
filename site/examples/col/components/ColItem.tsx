// @ts-nocheck
/***
 * @description 分栏组件
 * 1. curprop 和 nextProp 对应着 当前拖动的 分栏条左右的元素，在拖动时对其进行变化
 * 2. 拖动的时候不发送请求只改变页面dom，在dragend事件才发送事件并且改变dom
 */

import { useRef, useCallback } from "react"
import { Transforms } from "slate"
import { useSlateStatic } from "slate-react"

import { getCurAndNextNodes, throttle, useDragElement, setColElement,addColReCount } from "../utils"
const PADDING = 18

export const ColItem = ({ element, children }) => {
	const { width } = element
	const editor = useSlateStatic()
	let startX = null, curElementWidth = null

	const colElement = useRef(null)
	const dragElement = useRef(null)
	const statElement = useRef(null)
	const draglineElement = useRef(null)
	let renderRadioEnd = 0
	let renderNextRadioEnd = 0

	const dragStart = useCallback(event => {
		event.stopPropagation()
		event.dataTransfer.setDragImage(new Image(), 0, 0)
		curElementWidth = dragElement.current.previousSibling.clientWidth
		startX = event.clientX
		colElement.current.parentElement.classList.add("active")
		draglineElement.current.classList.add("opacity-100")
	}, [])

	// 正在拖拽
	const drag = useCallback(event => {
		event.stopPropagation()
		let { curRadio } = useDragElement({
			element: dragElement.current, endX: event.clientX, startX, PADDING, curElementWidth
		}) ?? {}
		if (!curRadio || curRadio < 5) {
			return
		}

		let {renderNextRadio} = getCurAndNextNodes({
			element, type: "col_item", editor, curRadio
		})

		if (renderNextRadio < 5) {
			return
		}

		// 只改变数据 等到dragEnd 才发起请求
		renderRadioEnd = curRadio
		renderNextRadioEnd = renderNextRadio
		setColElement({
			element: dragElement.current.previousSibling,
			key: "width",
			value: `${curRadio}%`
		})
		setColElement({
			element: dragElement.current.nextElementSibling,
			key: "width",
			value: `${renderNextRadio}%`
		})

		// 改变 统计视图
		statElement.current.innerText = `${curRadio}%`
		dragElement
			.current
			.nextElementSibling
			.querySelector(".col-stat")
			.innerText = `${renderNextRadio}%`
	}, [curElementWidth])

	const dragEnd = useCallback(event => {
		// 移除dnd的影响与 终止ui 拖拽状态
		event.stopPropagation()
		colElement.current.parentElement.classList.remove("active")
		draglineElement.current.classList.remove("opacity-100")
		let { curRadio } = useDragElement({
			element: dragElement.current, endX: event.clientX, startX, PADDING, curElementWidth
		}) ?? {}
		let {path, nextPath} = getCurAndNextNodes({
			element, type: "col_item", editor, curRadio
		})
		const curProps = {
			width: `${renderRadioEnd}%`
		}
		Transforms.setNodes(editor, curProps, { at: path })

		const nextProps = {
			width: `${renderNextRadioEnd}%`
		}
		Transforms.setNodes(editor, nextProps, { at: nextPath })
	}, [])

  const plus = ()=>{
    console.log("plus", element)
    addColReCount({
      editor,element
    })
  }
	let dr = throttle(drag, 10)
	return (
		<>
			<div
				style={{ width, padding: "3px 10px" }}
				className="col_item"
				ref={colElement}
				suppressContentEditableWarning
			>
				<div className="col-stat" ref={statElement}>{width}</div>
				{children}
			</div>
			<div
				className="col-drag"
				draggable="true"
				onDragEnd={dragEnd}
				onDragStart={dragStart}
				onDragOver={(event)=>{
					event.stopPropagation()
				}}
				onDrag={dr}
				ref={dragElement}
			>
        <div className="col-drag-plus" onClick={plus} contentEditable="false"></div>
				<div className="col-drag-line"  contentEditable="false" ref={draglineElement}/>
			</div>
		</>
	)
}
