import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFiles'
function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
          <div className="col-3 left-panel">
            <FileSearch
            onFileSearch={(value) => {console.log(value)}}
            title="我的云文档"/>
            <FileList
            onFileDelete={(id) => {}}
            onFileClick={(id) => {}}
            files={defaultFiles}
             />
          </div>
          <div className="col-9 bg-primary right-panel">
            <h1>this is the right</h1>
          </div>
      </div>
    </div>
  );
}

export default App;
