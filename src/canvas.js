const canvasModule = (function() {
	const canvas = document.querySelector('#draw');
	const ctx = canvas.getContext('2d');
	const clearButton = document.querySelector('.clear-button');
	const botButton = document.querySelector('.bot-button');

	let isBotDrawing = false;
	let isDrawing = false;
	
	let lastX = 0;
	let lastY = 0;
	let hue = 0;
	let lineWidth = 0;
	let increaseLineWidth = true;

	const resizeCanvas = () => {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
	};

	const setInitialStyles = () => {
		ctx.strokeStyle = hue;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	};
	
	const startDrawing = (ev) => {
		isDrawing = true;
		[lastX, lastY] = [ev.offsetX, ev.offsetY];
	};
	
	const draw = (ev) => {
		if (!isDrawing) return;

		ctx.strokeStyle = `hsl(${hue}, 90%, 50%)`;
		ctx.lineWidth = lineWidth;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(ev.offsetX, ev.offsetY);
		ctx.stroke();

		[lastX, lastY] = [ev.offsetX, ev.offsetY];
		updateHue();
		updateLineWidth();
	};


	const getNewXY = () => (
		[Math.floor(Math.random() * canvas.width + 1), Math.floor(Math.random() * canvas.height + 1)]
	);

	const clearCanvas = (ev) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	const updateHue = () => {
		hue = (hue + 1) % 360;
	};

	const updateLineWidth = () => {
		if (increaseLineWidth) {
			lineWidth++;
		} else {
			lineWidth--;
		}

		if (lineWidth > 50 || lineWidth < 1) {
			increaseLineWidth = !increaseLineWidth;
		}
	};

	const drawRandom = () => {
		if (!isBotDrawing) return;

		ctx.strokeStyle = `hsl(${hue}, 90%, 50%)`;
		ctx.lineWidth = lineWidth;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		[lastX, lastY] = getNewXY();
		ctx.lineTo(lastX, lastY);
		ctx.stroke();

		updateHue();
		updateLineWidth();

		setTimeout(drawRandom, 200);
	};

	const toggleBotDrawing = (ev) => {
		isBotDrawing = !isBotDrawing;
		[lastX, lastY] = getNewXY();
		botButton.textContent = isBotDrawing ? 'Stop' : 'Start';
		if (isBotDrawing) drawRandom();
	};

	const init = () => {
		resizeCanvas();
		setInitialStyles();

		canvas.addEventListener('mousemove', draw);
		canvas.addEventListener('mouseout', () => isDrawing = false);
		canvas.addEventListener('mousedown', startDrawing);
		canvas.addEventListener('mouseup', () => isDrawing = false);

		clearButton.addEventListener('click', clearCanvas);
		botButton.addEventListener('click', toggleBotDrawing);
	};

	return {
		init: init,
	};
})();

window.onload = () => canvasModule.init();
