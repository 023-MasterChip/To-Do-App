import './App.css';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">
      <h1 className='m-auto text-center my-5 font-bold text-3xl text-blue-300'>To-Do App</h1>
      <TaskList/>
    </div>
  );
}

export default App;
