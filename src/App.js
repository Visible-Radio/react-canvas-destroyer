import './App.css';
import CanvasDestroyer from './components/CanvasDestroyer/CanvasDestroyer'

function App() {
  return (
    <div className="App">
      <CanvasDestroyer
       currentPermittedWidth={200}
       finalWidth = {200}
       secretResolve = {191}
       secretSize = {124}
       vOff = {-4}
      />
    </div>
  );
}

export default App;
