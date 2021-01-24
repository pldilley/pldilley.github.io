import logo from './logo.svg';
import './App.css';

function App() {

  const f = function() {
    const r = () => {}
    r.constructor = f
    return r
  }
  console.log(f(), f().constructor, f().constructor.name)
  console.log(f`p`, f`p`.constructor, f`p`.constructor.name)

  const test2 = Promise.resolve()
  console.log(test2, test2.constructor, test2.constructor.name)

  async function a() {}
  console.log(a, a().constructor, a().constructor.name)

  const z = state => true
  console.log(z, z().constructor, z().constructor.name)

  const x = {}
  console.log(x, x.constructor, x.constructor.name)

  const y = []
  console.log(y, y.constructor, y.constructor.name)

  const e = []
  console.log(e, e.constructor, e.constructor.name)

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
