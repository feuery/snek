function rand(max) {
  return Math.floor(Math.random() * max);
}

function make_snek_node(position) {
    return {position, 
	    tail_node: null};
}

let head_node = make_snek_node([0,0]);
let direction = [0, 0]
let oldkey = null;
const grid_w = 50, grid_h = 50;
let current_goal_position = null;

function vec_plus (vec1, vec2) {
    let [x1, y1] = vec1,
	[x2, y2] = vec2;
    return [x1 + x2, y1 + y2];
}

function vec_eq (vec1, vec2) {
    let [x1, y1] = vec1,
	[x2, y2] = vec2;
    return x1 == x2 && y1 == y2;
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

    let [x, y] = head_node.position;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x * grid_w, y * grid_w, grid_w, grid_h);

    let [goal_x, goal_y] = current_goal_position;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(goal_x * grid_w, goal_y * grid_h, grid_w, grid_h);
}

function new_goal(canvas) {
    return [rand(canvas.width) / grid_w ,
	    rand(canvas.height) / grid_h].map(Math.floor);
}

function update() {
    
    let [ctx, canvas] = getCtx();

    head_node.position = vec_plus(head_node.position, direction);

    if (vec_eq(head_node.position, current_goal_position)) {
	current_goal_position = new_goal(canvas);
    }
    
    draw(canvas, ctx);

    document.querySelector('#report').innerText = `snek at ${head_node.position}, goal at ${current_goal_position}`;
    
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
    current_goal_position = new_goal(canvas);
    console.assert(ctx);
    draw(canvas, ctx);
    setInterval(update, 300);
});

document.addEventListener('keyup', keyup);
