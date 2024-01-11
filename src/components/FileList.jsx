import React, { useState, useEffect,useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from 'prop-types'
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const FileList = ({ files, onFileClick, onFileEdit, onFileDelete }) => {
    /* 是否是编辑状态,如果是,就将它的id保存给我身上 */
    const [editStatus, setEditStatus] = useState(false)
    /* 设置当前文件名称为点击的文件名称 */
    const [value, setValue] = useState('')
    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map(file => (<li 
                    key={file.id}
                    className="list-group-item bg-light d-flex align-items-center file-item row">
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