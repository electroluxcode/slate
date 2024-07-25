import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { matchPath } from '../utils/match-path'
import { Element } from '../interfaces/element'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { Node } from '../interfaces/node'


import { Point } from '../interfaces/point'
import { Text } from '../interfaces/text'
import { getDefaultInsertLocation } from '../utils'
import { batchDirtyPaths } from '../core/batch-dirty-paths'
import { BaseInsertNodeOperation } from '../interfaces'
import { updateDirtyPaths } from '../core/update-dirty-paths'


export const setNodes: NodeTransforms['setNodes'] = (
  editor,
  props: any,
  options:any = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    let { match, at = editor.selection, compare, merge,
      hanging = false,
      mode = 'lowest',
      split = false,
      voids = false,
      select,
      replace = false,
      batchDirty = true,

    } = options


      // 删除功能

    if (!at) {
      return
    }

    if (match == null) {
      match = Path.isPath(at)
        ? matchPath(editor, at)
        : n => Element.isElement(n) && Editor.isBlock(editor, n)
    }

    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, { voids })
    }

    const depths = Editor.nodes(editor, { at, match, mode, voids })
    const pathRefs = Array.from(depths, ([, p]) => Editor.pathRef(editor, p))

    for (const pathRef of pathRefs) {
      const path = pathRef.unref()!

      if (path) {
        const [node] = Editor.node(editor, path)
        editor.apply({ type: 'remove_node', path, node })
      }
    }




    // 增强

    let nodes = [props]
    // 新增功能


    // if (Node.isNode(nodes)) {
    //   nodes = [nodes]
    // }

    if (nodes.length === 0) {
      return
    }

    const [node] = nodes

    if (!at) {
      at = getDefaultInsertLocation(editor)
      if (select !== false) {
        select = true
      }
    }

    if (select == null) {
      select = false
    }

    if (Range.isRange(at)) {
      if (!hanging) {
        at = Editor.unhangRange(editor, at, { voids })
      }

      if (Range.isCollapsed(at)) {
        at = at.anchor
      } else {
        const [, end] = Range.edges(at)
        const pointRef = Editor.pointRef(editor, end)
        Transforms.delete(editor, { at })
        at = pointRef.unref()!
      }
    }

    if (Point.isPoint(at)) {
      if (match == null) {
        if (Text.isText(node)) {
          match = n => Text.isText(n)
        } else if (editor.isInline(node)) {
          match = n => Text.isText(n) || Editor.isInline(editor, n)
        } else {
          match = n => Element.isElement(n) && Editor.isBlock(editor, n)
        }
      }

      const [entry] = Editor.nodes(editor, {
        at: at.path,
        match,
        mode,
        voids,
      })

      if (entry) {
        const [, matchPath] = entry
        const pathRef = Editor.pathRef(editor, matchPath)
        const isAtEnd = Editor.isEnd(editor, at, matchPath)
        Transforms.splitNodes(editor, { at, match, mode, voids })
        const path = pathRef.unref()!
        at = isAtEnd ? Path.next(path) : path
      } else {
        return
      }
    }

    const parentPath = Path.parent(at)
    let index = at[at.length - 1]

    if (!voids && Editor.void(editor, { at: parentPath })) {
      return
    }

    if (batchDirty) {
      // PERF: batch update dirty paths
      // batched ops used to transform existing dirty paths
      const batchedOps: BaseInsertNodeOperation[] = []
      const newDirtyPaths: Path[] = Path.levels(parentPath)
      batchDirtyPaths(
        editor,
        () => {
          for (const node of nodes as Node[]) {
            const path = parentPath.concat(index)
            index++

            const op: BaseInsertNodeOperation = {
              type: 'insert_node',
              path,
              node,
            }
            editor.apply(op)
            at = Path.next(at as Path)

            batchedOps.push(op)
            if (!Text.isText) {
              newDirtyPaths.push(path)
            } else {
              newDirtyPaths.push(
                ...Array.from(Node.nodes(node), ([, p]) => path.concat(p))
              )
            }
          }
        },
        () => {
          updateDirtyPaths(editor, newDirtyPaths, p => {
            let newPath: Path | null = p
            for (const op of batchedOps) {
              if (Path.operationCanTransformPath(op)) {
                newPath = Path.transform(newPath, op)
                if (!newPath) {
                  return null
                }
              }
            }
            return newPath
          })
        }
      )
    } else {
      for (const node of nodes as Node[]) {
        const path = parentPath.concat(index)
        index++

        editor.apply({ type: 'insert_node', path, node })
        at = Path.next(at as Path)
      }
    }

    at = Path.previous(at)
    Transforms.move(editor, at)
    if (select) {
      const point = Editor.end(editor, at)

      if (point) {
        Transforms.select(editor, point)
      }
    }

  })
}
