import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
/* 引入类型验证 */
import PropTypes from 'prop-types'
/* 则是输入框的组件 */
const FileSearch = ({ title, onFileSearch }) => {
    /* 搜索框默认的状态,以及修改搜索框状态的方法 */
    const [inputActive, setInputActive] = useState(false)
    /* 搜索框输入的值,以及修改搜索框值的方法 */
    const [value, setValue] = useState('')
    /* 设置一个ref用来绑定input输入框 */
    const node = useRef(null)
    useEffect(() => {
        /* 在这里面可以拿到ref那个对象,这个对象里面的current属性就是原生的dom */
        if(inputActive) {
            node.current.focus()
        }
        /* 点搜索按钮切换的时候,才会触发useEffect回调 */
    },[inputActive])
    /* 点击关闭按钮时候触发的回调 */
    const closeSearch = (e) => {
        /* 阻止默认行为 */
        e && e.preventDefault()
        /* 设置搜索框隐藏 */
        setInputActive(false)
        /* 设置搜索内容为空 */
        setValue('')
    }
    useEffect(() => {
        /* 组件刚加载完事,就会触发一次 */
        /* 每按一次键盘就会触发这个事件 */
        const handleInputEvent = (event) => {
            const { keyCode } = event
            /* 判断我当前输入的是是不是空格,如果是就查询 */
            if(+keyCode === 13 && inputActive) {
                onFileSearch(value)
                /* 判断我当前输入的是不是esc,如果是就关闭 */
            }else if (+keyCode === 27 && inputActive) {
                closeSearch()
            }
        }
        document.addEventListener('keyup', handleInputEvent)
        return () => {
            /* 这个返回的函数会在函数被摧毁的时候调用 */
            document.removeEventListener('keyup', handleInputEvent)
        }
    })
    return (
        <div className="alert alert-primary">
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
    onFileSearch: PropTypes.func.isRequired
}
/* 设置初始值 */
FileSearch.defaultProps = {
    title: '我的云文档'
}
export default FileSearch