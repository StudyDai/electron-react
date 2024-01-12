/* 因为我们这个是在node环境运行,无需window */
const fs = window.require('fs').promises
const fileHelper = {
    /* 读文件 */
    readFile(path) {
        return fs.readFile(path, { encoding: 'utf-8' })
    },
    /* 写文件 */
    writeFile(path, content) {
        return fs.writeFile(path, content, { encoding: 'utf-8' })
    },
    /* 文件重命名 */
    renameFile(path, newPath) {
        return fs.rename(path, newPath)
    },
    /* 删除文件 */
    deleteFile(path) {
        return fs.unlink(path)
    }
}

export default fileHelper