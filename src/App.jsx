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
/* 引入我们的文件操作工具 */
import fileHelper from './utils/fileHelper'
import { useCallback, useEffect, useState } from 'react';
/* 引入node的api */
const { join, basename,extname,dirname } = window.require('path')
const remote = window.require('@electron/remote')
const Store = window.require('electron-store')
const store = new Store({'name': 'File Data'})
const {globalShortcut} = remote
/* 新建/重命名/删除调用 */
const saveFilesToStore = (files) => {
  
    const fileStoreObj = files.reduce((pre, current) => {
      const { id, path, title, createdAt } = current
        return [...pre, {
          id,
          path,
          title,
          createdAt
        }]
    },[])
    store.set('files', fileStoreObj)
}
function App() {
  /* 所有的文件 */
  const [files, setFiles] = useState(store.get('files') || [])
  /* 当前被激活的id */
  const [activeFileID, setActiveFileID] = useState('')
  /* 当前点开过的文件id */
  const [openFileIDs, setOpenFileIDs] = useState([])
  /* 未保存的文件id */
  const [unsaveFileIDs, setUnSaveFileIDs] = useState([])
  /* 用来存储和展示搜索结果的数组 */
  const [searchFiles, setSearchFiles ] = useState([])
  /* 保存当前的路径 */
  const saveLocation = remote.app.getAppPath('document')
  /* 保存当前markdow的内容 */
  const [bodyContent, setBodyContent] = useState('')
  /* 定义一个变量,如果我search有长度,就用我自己的 */
  const fileListarr = searchFiles.length ? searchFiles : files
  /* 这里要传递给显示的应该是完整的数据,而不能是只有id的数据 */
  const openedFiles = openFileIDs.map(fileID => {
    return files.find(file => file.id == fileID)
  })
  /* 拿到当前处于active的那个文件 */
  const activedFile = files.find(file => {
    if(file.id == activeFileID) {
      return true
    }
  })
  useEffect(() => {
    setBodyContent(activedFile.body)
  },[activedFile])
  /* 添加快捷键监听 */
  globalShortcut.register('control+s',() => {
  if(activeFileID && unsaveFileIDs.includes(activeFileID)) {
    /* 找到当前的高亮 */
      let editFile = files.find(file => file.id == activeFileID)
      /* 修改内容 */
      editFile.body = bodyContent
      /* 更新 */
      setFiles({...files})
      /* 将未保存状态修改掉 */
      let currentUnSaveFileIDs = unsaveFileIDs.filter(fileID => fileID !== activeFileID)
      setUnSaveFileIDs(currentUnSaveFileIDs)
  }
})
  /* 左侧列表项被点击触发的函数 */
  const fileClick = (id) => {
    /* 当前激活的id */
    setActiveFileID(id)
    /* 判断一下,当前我点击的文件,是否已经加载过了 */
    let currentFile = files.find(file => file.id == id)
    if(!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        currentFile.body = value
        currentFile.isLoaded = true
        setFiles([...files])
      })
    }
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
  const changeFileHandler = (value, id) => {
    setBodyContent(value)
    console.log(value)
    // /* 将我们写的那个玩意保存到unsaveid数组里面 */
    // if(!unsaveFileIDs.includes(id)) {
    //   setUnSaveFileIDs([...unsaveFileIDs, id])
    // }
  }
  const changeFile = useCallback(changeFileHandler,[])
  /* 删除左侧列表项 */
  const deleteFile = (id) => {
    const newFiles = files.filter(file => {
       return file.id !== id
    })
    const deleteFile = files.find(file => file.id == id)
    if(deleteFile.hasOwnProperty('isNew') && !deleteFile.isNew) {
      fileHelper.deleteFile(join(saveLocation,`${deleteFile.title}.md`)).then(res => {
            console.log('删除成功')
      })
    }else{
      fileHelper.deleteFile(join(dirname(deleteFile.path),`${deleteFile.title}.md`)).then(res => {
            console.log('删除成功')
      })
    }
    saveFilesToStore(newFiles)
    setFiles(newFiles)
    /* 如果我当前文件已经打开,那么就手动调用close关掉 */
    tabClose(id)
  }
  /* 更新文件名称,这是一种写法 */
  // const updateFileName = (id, value) => defaultFiles.find(item => item.id == id).title = value
  /* 另一种 */
  const updateFileName = (id,value,isNew = false) => {
    let newPath
    if(isNew) {
      newPath = join(saveLocation, `${value}.md`)
    }else{
      let currentPath = files.find(file => file.id == id)?.path
      /* path的dirname可以拿到除了文件名和后缀外的前面部分 user/appdata/..这样的格式 */
      newPath = join(dirname(currentPath), `${value}.md`)
    }
    const newFiles = files.map(file => {
      if(file.id == id) {
        if(file.isNew) {
          file.isNew = false
          fileHelper.writeFile(newPath,file?.body).then(res => {
            console.log('写入成功')
          })
        }else{
          fileHelper.renameFile(file.path,newPath).then(res => {
            console.log('修改成功')
          })
        }
        file.path = newPath
        file.title = value
      }
      return file
    })
    saveFilesToStore(newFiles)
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
        path: saveLocation,
        body: '### please enter markdown',
        createdAt: new Date().getTime(),
        isNew: true
      }])
  }
  // console.log(remote)
  /* 导入文件 */
  const inportFiles = () => {
      remote.dialog.showOpenDialog({
        title: '选择导入的markdown文件',
        filters: [
          {name: 'Markdown files', extensions:['md']}
        ],
        properties: ['openFile', 'multiSelections']
      }).then(paths => {
        let pathEl = paths.filePaths
        if(pathEl) {
          /* 拿到文件名称,id,title等 */
          console.log(files,pathEl)
          const filteredPath = pathEl.filter(path => {
            const alreadyAdded = files.find(file => file.path == path)
            return !alreadyAdded
          })
          /* 封装一下对象 */
          const importFileArr = filteredPath.map(path => {
            return {
              id: uuidv4(),
              title: basename(path, extname(path)),
              path: path
            }
          })
          /* 导入我们的文件 */
          let newFilesArr = [...files, ...importFileArr]
          setFiles(newFilesArr)
          saveFilesToStore(newFilesArr)
          let importLen = importFileArr.length
          if(importLen > 0) {
            remote.dialog.showMessageBox({
              info: 'info',
              title: '导入成功',
              message: `成功导入了${importLen}个文件`
            })
          }
        }
      })
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
                <BottomBtn 
                onClick={inportFiles}
                colorClass="btn-success rounded-0 cover" icon={faFileImport} text='导入'/>
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
                  value={bodyContent}
                  onChange={changeFile}
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
