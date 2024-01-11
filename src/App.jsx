import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn';
import TabList from './components/TabList';
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import 'default-passive-events'
import { v4 as uuidv4 } from 'uuid'
import { faPlus,faFileImport } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
function App() {
  /* 所有的文件 */
  const [files, setFiles] = useState(defaultFiles)
  /* 当前被激活的id */
  const [activeFileID, setActiveFileID] = useState('')
  /* 当前点开过的文件id */
  const [openFileIDs, setOpenFileIDs] = useState([])
  /* 未保存的文件id */
  const [unsaveFileIDs, setUnSaveFileIDs] = useState([])
  /* 用来存储和展示搜索结果的数组 */
  const [searchFiles, setSearchFiles ] = useState([])
  /* 定义一个变量,如果我search有长度,就用我自己的 */
  const fileListarr = searchFiles.length ? searchFiles : files
  /* 这里要传递给显示的应该是完整的数据,而不能是只有id的数据 */
  const openedFiles = openFileIDs.map(fileID => {
    return files.find(file => file.id == fileID)
  })
  /* 拿到当前处于active的那个文件 */
  const activedFile = files.find(file => file.id == activeFileID)
  /* 左侧列表项被点击触发的函数 */
  const fileClick = (id) => {
    /* 当前激活的id */
    setActiveFileID(id)
    /* 判断一下,如果我当前点击的是我里面已经添加的,那么就不进行添加 */
    if(!openFileIDs.includes(id)) {
      /* 添加到点开过的id */
      setOpenFileIDs([...openFileIDs, id])
    }
  }
  /* 点击顶部列表进行切换 */
  const tabClick = (id) => {
    setActiveFileID(id)
  }
  /* 点击叉号关闭顶部列表 */
  const tabClose = (id) => {
    const tabWidthout = openFileIDs.filter(fileId => fileId != id)
    const argmentsLength = tabWidthout.length
    setOpenFileIDs(tabWidthout)
    /* 我删掉之后,如果当前的高亮是我,那默认显示最后一个 */
    if(id == activeFileID) {
      setActiveFileID(tabWidthout[argmentsLength - 1])
    }
  }
  /* 修改里面md数据,会调用我这个函数 */
  const fileChange = (value, id) => {
    /* 对数据进行包装 */
    const newFiles = files.map(file => {
      /* 找到那个文件,对里面的body进行重新赋值 */
      if(file.id == id) {
        file.body = value
      }
      return file
    })
    // setFiles(newFiles)
    // /* 将我们写的那个玩意保存到unsaveid数组里面 */
    if(!unsaveFileIDs.includes(id)) {
      setUnSaveFileIDs([...unsaveFileIDs, id])
    }
  }
  /* 删除左侧列表项 */
  const deleteFile = (id) => {
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
    /* 如果我当前文件已经打开,那么就手动调用close关掉 */
    tabClose(id)
  }
  /* 更新文件名称,这是一种写法 */
  // const updateFileName = (id, value) => defaultFiles.find(item => item.id == id).title = value
  /* 另一种 */
  const updateFileName = (id,value) => {
    const newFiles = files.map(file => {
      if(file.id == id) {
         file.title = value
      }
      if(file.isNew) {
        file.isNew = false
      }
      return file
    })
    setFiles(newFiles)
  }
  /* 搜索输入 */
  const fileSearch = (keyword) => {
    if(!keyword) {
      return setFiles(defaultFiles)
    }
    /* 字符串的includes可以查询包含了我文字的项 */
     const newFiles = files.filter(file => file.title.includes(keyword))
     setSearchFiles(newFiles)
  }
  /* 点击关闭按钮的时候,恢复最初的files */
  const getDefaultFiles = () => {
      setSearchFiles([...files])
  }
  /* 新建文件 */
  const createNewFile = () => {
      const uuid = uuidv4()
      setFiles([...files,{
        id: uuid,
        title: '',
        body: '### please enter markdown',
        createdAt: new Date().getTime(),
        isNew: true
      }])
  }
  return (
    <div className="App container-fluid">
      <div className="row">
          <div className="col-3 left-panel no-gutters">
            <FileSearch
            onCloseSearch={getDefaultFiles}
            onFileSearch={fileSearch}
            title="我的云文档"/>
              <FileList
              onFileEdit={updateFileName}
              onFileDelete={deleteFile}
              onFileClick={fileClick}
              files={fileListarr}
              />
            <div className='bottom-btn row mx-0'>
              <div className='col px-0'>
                <BottomBtn 
                onClick={createNewFile}
                colorClass="btn-primary rounded-0 cover" icon={faPlus}/>
              </div>
              <div className='col px-0'>
                <BottomBtn colorClass="btn-success rounded-0 cover" icon={faFileImport} text='导入'/>
              </div>
            </div>
          </div>
          <div className="col-9 right-panel">
            {
              !activeFileID &&
              <div className="start-page">
                请选择或者创建一个新的 Markdown 文档
              </div>
            }
            {
              activeFileID &&
                <>
                    <TabList 
                activeId={activeFileID}
                unSaveIds={unsaveFileIDs}
                onCloseTab={tabClose}
                onTabClick={tabClick}
                files={openedFiles}/>
                <SimpleMDE
                  key={activedFile && activedFile.id}
                  value={activedFile?.body}
                  onChange={(value) => fileChange(value,activedFile?.id)}
                  options={{
                    "minHeight": '515px'
                  }}
                />
                </>
              }
          </div>
      </div>
    </div>
  );
}

export default App;
