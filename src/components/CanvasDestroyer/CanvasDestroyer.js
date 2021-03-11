import React from 'react';
import { useRef, useEffect } from 'react';
import rhino from './rhino.jpg';
import skull from './skull.png';
import jimi from './jimi.jpg';
import main from './destroyerFunctions';

export default function CanvasDestroyer( { currentPermittedWidth,
  finalWidth,
  secretResolve,
  secretWidth,
  vOff,
  scaleMode
 })
 {
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
	    secretWidth,
      vOff || null
      );
  })

  // depending on scale mode, inject different styles into destinationCanvas element
  // scaleMode will be auto, fixed, or injectCSS

  const innerStyles = () => {
    if (!scaleMode || scaleMode === 'fixed') return null;
    if (scaleMode === 'auto') return {width: '100%', height: '100%'}
    if (typeof scaleMode === 'object' && scaleMode.hasOwnProperty('injectReactCSS')) {
      return scaleMode.injectReactCSS;
    }
  }

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
        style={innerStyles()}
      >
      </canvas>
    </div>
  )
}