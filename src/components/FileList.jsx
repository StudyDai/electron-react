import React, { useState, useEffect,useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from 'prop-types'
import { faEdit, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import useKeyPress from "../hooks/useKeyPress";
const FileList = ({ files, onFileClick, onFileEdit, onFileDelete }) => {
    /* 是否是编辑状态,如果是,就将它的id保存给我身上 */
    const [editStatus, setEditStatus] = useState(false)
    /* 设置当前文件名称为点击的文件名称 */
    const [value, setValue] = useState('')
    /* 这个变量是用来存储当前是否有按空格键 */
    const enterPressed = useKeyPress(13)
    /* 这个变量是用来存储当前是否有按esc键 */
    const escPressed = useKeyPress(27)
    /* 设置一个ref来存储input的dom */
    const node = useRef(null)
    /* 点击关闭 */
    const closeSearch = (editItem) => {
        /* 设置编辑状态为默认 */
        setEditStatus(false)
        /* 设置默认值 */
        setValue('')
        /* 如果是刚建的属性的话 */
        if(editItem.isNew) {
            onFileDelete(editItem.id)
        }
    }
    /* 再搞一个effect */
    /* 这个事件已经抽成一个hook了 */
    useEffect(() => {
        const editItem = files.find(file => file.id == editStatus)
        if(enterPressed && editStatus) {
            if(!value.trim()) {
                return onFileDelete(editItem?.id)
            }
            onFileEdit(editItem.id, value, editItem.isNew)
            closeSearch(editItem)
        }
        if(escPressed && editStatus) {
            closeSearch(editItem)
        }
    })
    useEffect(() => {
        const newFiles = files.filter(file => file.isNew)
        /* filter是返回一个数组 */
        if(newFiles.length) {
            console.log(newFiles)
            /* 我刚进来的时候,我就是编辑状态 */
            setEditStatus(newFiles[0].id)
            /* 并且把我的默认值设置进去 */
            setValue(newFiles[0].title)
        }
    },[files])
    useEffect(() => {
        if(editStatus) {
            node.current?.focus()
        }
    },[editStatus])
    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map(file => (<li 
                    key={file.id}
                    className="list-group-item bg-light d-flex align-items-center file-item row">
                        {
                            ((file.id != editStatus) && !file.isNew) && 
                            <>
                                <span className="col-1">
                                    <FontAwesomeIcon
                                    title="markdown" 
                                    icon={faMarkdown}/>
                                </span>
                                <span 
                                onClick={() => { onFileClick(file.id) }}
                                className="col-8 c-link">
                                    {file.title}
                                </span>
                                <button
                                    type="button"
                                    className="icon-button col-1"
                                    onClick={() => {setEditStatus(file.id); setValue(file.title)}}
                                    >
                                        <FontAwesomeIcon 
                                        title="编辑"
                                        icon={faEdit}/>
                                    </button>
                                    <button
                                    type="button"
                                    className="icon-button col-1"
                                    onClick={() => {onFileDelete(file.id)}}
                                    >
                                        <FontAwesomeIcon 
                                        title="删除"
                                        icon={faTrash}/>
                                    </button>
                            </>
                        }
                        {
                            ((file.id == editStatus) || file.isNew) &&
                            <>
                            <div className="row">
                                <div className="col-11 input-search">
                                    <input 
                                    placeholder="请输入文件名称"
                                    className="form-control"
                                    value={value}
                                    ref={node}
                                    onChange={(e) => setValue(e.target.value)}
                                    type="text" />
                                </div>
                                <button
                                type="button"
                                className="icon-button edit-button col-1"
                                onClick={() => {closeSearch(file)}}
                                >
                                <FontAwesomeIcon 
                                title='关闭'
                                size="lg"
                                icon={faTimes}/>
                                </button>
                            </div>
                            </>
                        }
                    </li>))
            }
        </ul>
    )
}
FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func
}
export default FileList