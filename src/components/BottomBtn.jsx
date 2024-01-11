import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types'

const BottomBtn = ({ text, colorClass, icon, onClick }) => {
    return (
        <button
        onClick={onClick}
        type="button"
        className={`btn btn-block no-border ${colorClass}`}
        >
        <FontAwesomeIcon 
        className="mr-2" 
        size="lg" 
        icon={icon}/>
        {text}
        </button>
    )
}

BottomBtn.propTypes = {
    text: PropTypes.string,
    colorClass: PropTypes.string,
    icon: PropTypes.object.isRequired,
    onClick: PropTypes.func
}
BottomBtn.defaultProps = {
    text: "新建"
}
export default BottomBtn