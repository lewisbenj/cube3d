const width = 100;   // vừa phải
const height = 40;   // vừa phải
let ax = 0, ay = 0, az = 0;

// Cube kích thước trung bình (±2)
const points = [
  [-2,-2,-2],[-2,-2, 2],[-2, 2,-2],[-2, 2, 2],
  [ 2,-2,-2],[ 2,-2, 2],[ 2, 2,-2],[ 2, 2, 2],
];

const edges = [
  [0,1],[0,2],[0,4],
  [1,3],[1,5],
  [2,3],[2,6],
  [3,7],
  [4,5],[4,6],
  [5,7],
  [6,7]
];

function rotate(x,y,z, ax, ay, az) {
  let cosa = Math.cos(ax), sina = Math.sin(ax);
  let cosb = Math.cos(ay), sinb = Math.sin(ay);
  let cosc = Math.cos(az), sinc = Math.sin(az);

  // X
  let y1 = y * cosa - z * sina;
  let z1 = y * sina + z * cosa;
  y = y1; z = z1;

  // Y
  let x1 = x * cosb + z * sinb;
  z1 = -x * sinb + z * cosb;
  x = x1; z = z1;

  // Z
  x1 = x * cosc - y * sinc;
  y1 = x * sinc + y * cosc;
  x = x1; y = y1;

  return [x,y,z];
}

function project(x,y,z, width, height, scale=25, dist=8) {
  const factor = scale / (z + dist);
  const px = Math.floor(width/2 + factor * x * 2);
  const py = Math.floor(height/2 - factor * y);
  return [px,py];
}

function draw() {
  let screen = Array.from({length: height}, () => Array(width).fill(" "));

  const proj = [];
  for (let p of points) {
    let [x,y,z] = rotate(p[0], p[1], p[2], ax, ay, az);
    let [px,py] = project(x,y,z,width,height);
    proj.push([px,py]);
  }

  for (let [a,b] of edges) {
    let [x1,y1] = proj[a];
    let [x2,y2] = proj[b];

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (x1 >=0 && x1 < width && y1 >=0 && y1 < height) {
        screen[y1][x1] = "#";
      }
      if (x1 === x2 && y1 === y2) break;
      let e2 = 2*err;
      if (e2 > -dy) { err -= dy; x1 += sx; }
      if (e2 < dx) { err += dx; y1 += sy; }
    }
  }

  console.clear();
  for (let row of screen) {
    console.log(row.join(""));
  }

  ax += 0.05;
  ay += 0.03;
  az += 0.02;
}

setInterval(draw, 50);
