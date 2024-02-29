function rand(max) {
  return Math.floor(Math.random() * max);
}

function make_snek_node(position) {
    return {position, 
	    tail_node: null};
}

function snek_len(node, acc = 1) {
    if (node.tail_node) {
	return snek_len(node.tail_node, acc + 1);
    }
    return acc;
}

let head_node = make_snek_node([0,0]);
let direction = [0, 0]
let oldkey = null;
const grid_w = 50, grid_h = 50;
let current_goal_position = null;
let score = 0;
let lost = false;

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

function draw_step(node, ctx) {
    let [x,y] = node.position;
    ctx.fillRect(x * grid_w, y * grid_w, grid_w, grid_h);

    if(node.tail_node) draw_step (node.tail_node, ctx);
}    

function draw(canvas, ctx) {
    console.assert(ctx);

    let [x, y] = head_node.position;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    draw_step(head_node, ctx);

    let [goal_x, goal_y] = current_goal_position;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(goal_x * grid_w, goal_y * grid_h, grid_w, grid_h);
}

function new_goal(canvas) {
    return [rand(canvas.width) / grid_w ,
	    rand(canvas.height) / grid_h].map(Math.floor);
}

function final_node(node) {
    if (!node.tail_node) return node;
    else return (final_node(node.tail_node));
}

function snek_step(node, previous_old_position = null) {
    let old_position = node.position;
    if(!previous_old_position) {
	node.position = vec_plus(node.position, direction);
    }
    else node.position = previous_old_position;

    if(node.tail_node) snek_step(node.tail_node, old_position);
}

function max_dimensions(canvas) {
    return [canvas.width / grid_w,  
	    canvas.height / grid_h].map(Math.floor);
}

function snek_collides(head_node) {
    let snek_array = []
    for(let node = head_node; node; node = node.tail_node) {
	snek_array.push(node);
    }
    

    let position_array = snek_array.map(n => n.position);

    for(let [x, y] of position_array) {
	let count = 0;
	for (let [x2, y2] of position_array) {
	    if (x == x2 && y == y2) count++;
	}

	if (count > 1) return true;
    }

    return false;
}
    

function update() {
    if(lost) return;
    
    let [ctx, canvas] = getCtx();

    let [d_x, d_y] = direction
    if (d_x != 0 || d_y != 0)
	snek_step(head_node);

    if (vec_eq(head_node.position, current_goal_position)) {
	current_goal_position = new_goal(canvas);
	score++;
	let final_node_el = final_node(head_node);
	final_node_el.tail_node = make_snek_node(vec_plus(final_node_el.position, [-1, -1]));
    }

    let [x, y] = head_node.position;
    let [max_x, max_y] = max_dimensions(canvas);
    if ( x >= max_x || y >= max_y || x < 0 || y < 0 || snek_collides(head_node)) {	
	alert('You lost!');
	lost = true;
    }
    
    draw(canvas, ctx);

    let len = snek_len(head_node);
    document.querySelector('#report').innerText = `score is ${score}, snek_len is ${len}, snek at ${head_node.position}, goal at ${current_goal_position}`;
    
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
