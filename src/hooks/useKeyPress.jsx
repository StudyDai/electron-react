import { useState, useEffect} from "react";
/* 创建一个自定义hook来实现鼠标操作 */
const useKeyPress = (targetKeyCode) => {
    const [keyPressed, setKeyPress] = useState(false)
    const keyDownHandler = ({ keyCode }) => {
        if(+targetKeyCode === keyCode) {
            setKeyPress(true)
        }
    }
    const keyUpHandler = ({ keyCode }) => {
        if(+targetKeyCode === keyCode) {
            setKeyPress(false)
        }
    }
    /* 使用useEffect,刚进来就添加这俩监听 */
    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)
        /* 销毁的时候会触发 */
        return () => {
            document.removeEventListener('keydown', keyDownHandler)
            document.removeEventListener('keyup', keyUpHandler)
        }
    },[]) /* 它并没有什么依赖,就是刚加载进来就触发一次即可 */
    /* 返回当前键盘状态 */
    return keyPressed
}
export default useKeyPress