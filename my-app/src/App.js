import logo from './logo.svg';
import './App.css';

function App() {
  const test2 = Promise.resolve()

  console.log(test2, test2.constructor, test2.constructor.name)

  async function a() {

  }

  console.log(a, a().constructor, a().constructor.name)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
