const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let isDrawing = false;
let nodes = [];
let selectedNode = null;
const nodeWidth = 120;
const nodeHeight = 60;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawNodes();
}

function redrawNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => {
        drawNode(node);
        node.connections.forEach(connectedNode => {
            drawCurve(node, connectedNode);
        });
    });
}

function drawNode(node) {
    const { x, y} = node;
    ctx.fillStyle = '#007bff';
    ctx.strokeStyle = '#0056b3';
    ctx.lineWidth = 2;
    ctx.fillRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
    ctx.strokeRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
    
}

function drawCurve(nodeFrom, nodeTo) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(nodeFrom.x, nodeFrom.y);
    ctx.quadraticCurveTo(nodeFrom.x, (nodeFrom.y + nodeTo.y) / 2, nodeTo.x, nodeTo.y);
    ctx.stroke();
}

function addNode(x, y) {
    const newNode = {
        x,
        y,
        connections: []
    };
    nodes.push(newNode);
    return newNode;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (nodes.length === 0) {
        // If no nodes exist, create the first node at the click position
        addNode(x, y);
        redrawNodes();
    } else {
        selectedNode = nodes.find(node => {
            return x >= node.x - nodeWidth / 2 && x <= node.x + nodeWidth / 2 &&
                   y >= node.y - nodeHeight / 2 && y <= node.y + nodeHeight / 2;
        });

        isDrawing = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing && selectedNode) {
        redrawNodes();

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(selectedNode.x, selectedNode.y);
        ctx.quadraticCurveTo(selectedNode.x, (selectedNode.y + e.clientY) / 2, e.clientX, e.clientY);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && selectedNode) {
        const newX = e.clientX;
        const newY = e.clientY;

        // Create a new node at the mouse release position
        const newNode = addNode(newX, newY);
        
        // Connect the selected node to the new node
        selectedNode.connections.push(newNode);

        redrawNodes();
    }

    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});



