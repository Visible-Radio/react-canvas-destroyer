export default function main(
	image1,
	image2,
	bgCanvasRef,
	secretCanvasRef,
	destinationCanvasRef,
	currentPermittedWidth,
	finalWidth,
	secretResolve,
	secretWidth,
	vOff = 0
	){

	// create img DOM node for the secret image
	const secretImg = new Image()
	secretImg.src = image1;

	// create img DOM node for the background image
	const bgImg = new Image();
	bgImg.src = image2;

	let secretLoaded = false;
	let bgLoaded = false;

	secretImg.addEventListener('load', (event) => {
		secretLoaded = true;
	});

	bgImg.addEventListener('load', (event) => {
		bgLoaded = true;
	});

	const loadMonitorTimer = setInterval(()=> {
		if (secretLoaded && bgLoaded) {
			clearInterval(loadMonitorTimer);
			backgroundOnload(bgImg, secretImg, currentPermittedWidth);
		}
	},1);


	function backgroundOnload(bgImg, secretImg, currentPermittedWidth) {
		// get the pixel information for the background image
		const sourceData = (getSourceData(bgCanvasRef, finalWidth, bgImg));
		// set up the destination canvas
		const canvas = destinationCanvasRef.current;
		const ctx = canvas.getContext('2d');
		const pixelScale = 4;
		// ctx.canvas.width = sourceData.width * pixelScale;
		ctx.canvas.width = currentPermittedWidth * pixelScale;
		ctx.canvas.height = sourceData.height * pixelScale;
		applySecretImage(sourceData, secretResolve, secretImg);
		draw(currentPermittedWidth, sourceData, ctx, pixelScale);
	}

	function getSourceData(canvasRef, targetWidth, DOM_Img_Node) {
		// get the canvas context
		const source_ctx = canvasRef.current.getContext('2d');
		const scaleFactor = (DOM_Img_Node.width / targetWidth);
		const targetHeight = (DOM_Img_Node.height / scaleFactor);

		source_ctx.canvas.height = targetHeight;
		source_ctx.canvas.width = targetWidth;

		// console.log(DOM_Img_Node);
		// console.log(source_ctx.canvas.width, 'resampled width');
		// console.log(source_ctx.canvas.height, 'resampled height');

		// console.log(DOM_Img_Node.width, 'actual image width');
		// console.log(DOM_Img_Node.height, 'actual image height');

		// input scaling happens here based on second pair of args
		// this draws the image onto the source canvas, which is hidden using CSS
		source_ctx.drawImage(DOM_Img_Node, 0, 0, targetWidth, targetHeight);

		// retrieve the pixel data from the source canvas
		const imageData = source_ctx.getImageData(0, 0, targetWidth, targetHeight);
		// run the functions that reduce the bit depth and convert to grayscale
		const destroyedImg = destroyImg(imageData);

		return {
			pixelArr: destroyedImg,
			width: imageData.width,
			height: imageData.height,
			scaleFactor
		}
	}

	function secretOnload(secretImg){
		const secretPixels = getSourceData(secretCanvasRef, secretWidth, secretImg);
		// create an array of functions
		// each function describes where that pixel should be in a grid given a width
		let functionArr = [];
		secretPixels.pixelArr.forEach((pixel, index) => {
			const row = Math.floor(index/secretPixels.width);
			const offset = index % secretPixels.width;
			functionArr.push((width) => (width*row + offset));
		});
		return {
			pixelArr: secretPixels.pixelArr,
			functionArr: functionArr,
		}
	}

	function applySecretImage(sourceData, resolveWidth, secretImg) {
		const secretOffset = calculateOffsets();
		const secretData = secretOnload(secretImg);
		// reduce brightness of background
		for (let i = 0; i < sourceData.pixelArr.length; i++) {
			sourceData.pixelArr[i] -= 50;
		}
		for (let i = 0; i < secretData.functionArr.length; i+=3) {
			// don't apply black or white pixels
			if (secretData.pixelArr[i] === 0 || secretData.pixelArr[i] > 250 ) continue;
			// using the functions in the function array to supply indicies
			// insert the pixels from the secret image into the background image
			sourceData.pixelArr[secretData.functionArr[i](resolveWidth)-secretOffset] = secretData.pixelArr[i]+5;
		}
	}

	function calculateOffsets() {
		// always draw the secret in the center of the currentPermitted width
		const hOff = Math.floor(((secretResolve - secretWidth) / 2) + 0);

		const bgScaleFactor = (bgImg.width / finalWidth);
		const bgHeight = (bgImg.height / bgScaleFactor);
		const secretScaleFactor = (secretImg.width / secretWidth);
		const secretHeight = (secretImg.height / secretScaleFactor);
		const verticalCenter = Math.floor((bgHeight - secretHeight) / 2);

		console.log('bgHeight :>> ', bgHeight);
		console.log('secretHeight :>> ', secretHeight);
		console.log('verticalCenter :>> ', verticalCenter);

		const secretOffset = -(secretResolve*(verticalCenter+vOff)) - hOff;

		return secretOffset;
	}

	function draw(permittedWidth, sourceData, ctx, pixelScale) {
	// draw	a frame at a given permitted width
		const length = sourceData.pixelArr.length;
		const pixelsToDraw = (sourceData.height * permittedWidth)-1;

		let counter = 0;

		outer: for (let column = 0; column < sourceData.height; column++) {
							for (let row = 0; row < permittedWidth; row++){
								// which pixel do I select from sourceData based on column and row?
								let pixelIndex = row + (column*permittedWidth)
								if (pixelIndex > pixelsToDraw) break outer;
								let pixel = sourceData.pixelArr[pixelIndex];
								ctx.fillStyle = `rgba(0,0,0,0)`;
								ctx.fillRect(row*pixelScale, column*pixelScale, pixelScale, pixelScale);
								ctx.fillStyle = `rgba(${pixel-25},${pixel-25},${pixel+10},1)`;
								ctx.fillRect(row*pixelScale, column*pixelScale, pixelScale, pixelScale);

								counter++;
							}
		}

		// use the remaining pixels to "fill in" the empty part of the canvass
		// let remaining = length - counter;

		// for (let column = 0; column < sourceData.height; column++) {
		// 	for (let row = permittedWidth; row < sourceData.width; row++) {
		// 		let pixel = sourceData.pixelArr[length-remaining]/2;
		// 		ctx.fillStyle = `rgb(${pixel-25},${pixel-25},${pixel},1)`;
		// 		ctx.fillRect(row*pixelScale, column*pixelScale, pixelScale, pixelScale-0);
		// 		remaining--;
		// 	}
		// }
	}

	function bitReduce(channel) {
		return parseInt((channel / 255) * 127)*2;
	}
	function bitReduceChannels(channels) {
		return channels.map(channel => bitReduce(channel));
	}
	function avgChannels(channels) {
		return parseInt(channels.reduce((acc, channel) => acc += channel, 0) /3);
	}
	function destroyImg(imageData) {
		let destroyedImg = [];
		for (let i=0; i < imageData.data.length; i+=4) {
		const channels = bitReduceChannels([
			imageData.data[i],
			imageData.data[i+1],
			imageData.data[i+2]
			]);
			destroyedImg.push(avgChannels(channels));
		}
		return destroyedImg;
	}
}