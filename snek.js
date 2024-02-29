let position = [0, 0]
let direction = [0, 0]
let oldkey = null;
const grid_w = 10, grid_h = 10;

function vec_plus (vec1, vec2) {
    let [x1, y1] = vec1,
	[x2, y2] = vec2;
    return [x1 + x2, y1 + y2];
}

function getCtx() {
    const canvas = document.querySelector('#canv');
    if(!canvas.getContext) {
	alert('no getContext on canvas, please run a modern browser');
	return null;
    }

    return [canvas.getContext("2d"), canvas];
}

function draw(canvas, ctx) {
    console.assert(ctx);

    let [x, y] = position;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x * grid_w, y * grid_w, grid_w, grid_h);
}

function update() {
    
    let [ctx, canvas] = getCtx();

    position = vec_plus(position, direction);
    
    draw(canvas, ctx);
}

function keyup(e) {
    if (e.key == oldkey)
    {
	direction = [0, 0]
	return;
    }
    
    switch(e.key) {
    case 'ArrowUp':
	direction = [0, -1];
	break;
    case 'ArrowDown':
	direction = [0, 1];
	break;
    case 'ArrowLeft':
	direction = [-1, 0];
	break;
    case 'ArrowRight':
	direction = [1, 0];
	break;
    }

    oldkey = e.key;
}

document.addEventListener('DOMContentLoaded', e => {
    let [ctx, canvas] = getCtx();
    console.assert(ctx);
    draw(canvas, ctx);
    setInterval(update, 100);
});

document.addEventListener('keyup', keyup);
