import React from 'react';
import { useRef, useEffect } from 'react';
import rhino from './rhino.jpg';
import skull from './skull.png';
import jimi from './jimi.jpg';
import main from './destroyerFunctions';

export default function CanvasDestroyer( { currentPermittedWidth, finalWidth, secretResolve, secretSize, vOff }) {
  const bgCanvasRef = useRef(null);
  const secretCanvasRef = useRef(null);
  const destinationCanvasRef = useRef(null);

  useEffect(()=> {
    // function call here to external function
    main(
      skull,
      rhino,
      bgCanvasRef,
      secretCanvasRef,
      destinationCanvasRef,
      currentPermittedWidth,
      finalWidth,
	    secretResolve,
	    secretSize,
      vOff || null
      );
  })

  return (
    <div style={{}} className="textRendererWrapperInternal">
      <canvas
        ref = {bgCanvasRef}
        className="TextRendererCanvasInternal bg"
        style={{display: 'none'}}
      >
      </canvas>
      <canvas
        ref = {secretCanvasRef}
        className="TextRendererCanvasInternal secret"
        style={{display: 'none'}}
      >
      </canvas>
      <canvas
        ref = {destinationCanvasRef}
        className="TextRendererCanvasInternal destination"
        style={{}}
      >
      </canvas>
    </div>
  )
}