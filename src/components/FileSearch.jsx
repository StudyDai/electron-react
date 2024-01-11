import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
/* 引入类型验证 */
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'
/* 则是输入框的组件 */
const FileSearch = ({ title, onFileSearch, onCloseSearch }) => {
    /* 搜索框默认的状态,以及修改搜索框状态的方法 */
    const [inputActive, setInputActive] = useState(false)
    /* 搜索框输入的值,以及修改搜索框值的方法 */
    const [value, setValue] = useState('')
    /* 设置一个ref用来绑定input输入框 */
    const node = useRef(null)
    /* 键盘判定 */
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)
    useEffect(() => {
        /* 在这里面可以拿到ref那个对象,这个对象里面的current属性就是原生的dom */
        if(inputActive) {
            node.current.focus()
        }
        /* 点搜索按钮切换的时候,才会触发useEffect回调 */
    },[inputActive])
    /* 点击关闭按钮时候触发的回调 */
    const closeSearch = (e) => {
        /* 设置搜索框隐藏 */
        setInputActive(false)
        /* 设置搜索内容为空 */
        setValue('')
        /* 调用父亲的方法 */
        onCloseSearch()
    }
    useEffect(() => {
        /* 组件刚加载完事,就会触发一次 */
        /* 每按一次键盘就会触发这个事件 */
        if(enterPressed && inputActive) {
            onFileSearch(value)
        }
        if(escPressed && inputActive) {
            closeSearch()
        }
    })
    return (
        <div className="alert alert-primary rounded-0 mb-0">
            {!inputActive && 
             <div 
             className="d-flex justify-content-between align-items-center">
                <span>{title}</span>
                <button
                type="button"
                className="icon-button"
                onClick={() => {setInputActive(true)}}
                >
                <FontAwesomeIcon
                title="搜素"
                size="lg"
                icon={faSearch}/>
                </button>
             </div>
            }
            {
                inputActive &&
                <div className="row">
                    <div className="col-8 input-search">
                        <input 
                    className="form-control col-8"
                    value={value}
                    ref={node}
                    onChange={(e) => setValue(e.target.value)}
                    type="text" />
                    </div>
                    <button
                    type="button"
                    className="icon-button col-4"
                    onClick={closeSearch}
                    >
                    <FontAwesomeIcon 
                    title='关闭'
                    size="lg"
                    icon={faTimes}/>
                    </button>
                </div>
            }
        </div>
    )
}
/* 添加属性检查 */
FileSearch.propTypes = {
    /* 字符串类型 */
    title: PropTypes.string,
    /* 函数类型,必传 */
    onFileSearch: PropTypes.func.isRequired,
    onCloseSearch: PropTypes.func
}
/* 设置初始值 */
FileSearch.defaultProps = {
    title: '我的云文档'
}
export default FileSearch