import { useState } from 'react';
import './App.css';
import CanvasDestroyer from './components/CanvasDestroyer/CanvasDestroyer'


function App() {
  let currentPermittedWidth = 191;
  return (
    <>
      <CanvasDestroyer
       currentPermittedWidth={currentPermittedWidth}
       secretResolve = {191}
       finalWidth = {200}
       secretWidth = {121}
       vOff = {1}
       scaleMode = {'auto'}
       // SPECIFY custom CSS for the destination canvas
       //  scaleMode = {{injectReactCSS : {width: '100%', height: '100%', border: '1px solid'}}}
      />
    </>
  );
}
export default App;
