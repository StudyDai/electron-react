import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'
import classNames from "classnames";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './TabList.css'
const TabList = ({ files, activeId, unSaveIds, onTabClick, onCloseTab }) => {
    return (
        <ul className="nav nav-pills tablist-container">
            {
                files.map(file => {
                    /* 是否需要添加小红点,就是是否有保存,没保存给点 */
                    const withUnsaveMark = unSaveIds?.includes(file.id)
                    /* 拼接我们的类名 */
                    const fclassName = classNames({
                        'nav-link': true,
                        'active': activeId == file.id,
                        'd-flex': true,
                        'align-items-center': true,
                        'withUnsaveMark': withUnsaveMark
                    })
                    return (<li className="nav-item" key={file.id}>
                        <a
                        className={fclassName} 
                        onClick={(e) => {
                            e.preventDefault()
                            onTabClick(file.id)
                        }}
                        href="#">
                            {file.title}
                            {
                                withUnsaveMark && 
                                <span className="
                                ml-2
                                rounded-circle 
                                unsaved-icon">
                                </span>
                            }
                            <span 
                            onClick={(e) => {
                                e.stopPropagation()
                                onCloseTab(file.id)
                            }}
                            className="close-icon ml-2 d-flex align-items-center">
                                <FontAwesomeIcon 
                                title='关闭'
                                size="sm"
                                icon={faTimes}/>
                            </span>
                        </a>
                    </li>)
                })
            }
        </ul>
    )
}
TabList.propTypes = {
    files: PropTypes.array,
    activeId: PropTypes.string,
    unSaveIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onCloseTab: PropTypes.func
}
export default TabList