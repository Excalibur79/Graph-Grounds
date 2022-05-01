import { getDistance } from './functions';
const FastPriorityQueue = require('fastpriorityqueue');
// const Dijkstra = (graph, numberOfNodes, start, end) => {
//   const PriorityQueue = new FastPriorityQueue();
//   let visited = {};
//   let dist = {};
//   let prev = {};
//   let pathLength = {};
//   let directions = ['top', 'left', 'right', 'bottom'];
//   Object.keys(graph).map((key) => {
//     visited[key] = false;
//     dist[key] = Number.MAX_SAFE_INTEGER;
//     prev[key] = null;
//     pathLength[key] = Number.MAX_SAFE_INTEGER;
//   });
//   dist[`${start[0]}-${start[1]}`] = 0;
//   pathLength[`${start[0]}-${start[1]}`] = 0;
//   // console.log('d', dist);
//   PriorityQueue.add((0, [0, `${start[0]}-${start[1]}`]));
//   while (!PriorityQueue.isEmpty()) {
//     let [minValue, id] = PriorityQueue.poll();
//     visited[id] = true;
//     if (dist[id] < minValue) continue;
//     let thisNode = graph[id];
//     //console.log('minvalue', minValue, 'id', id, 'this node', thisNode);
//     for (let i = 0; i < directions.length; i++) {
//       let data = thisNode.connections[directions[i]];
//       if (data) {
//         if (visited[data.id]) continue;
//         let newDist = dist[id] + data.weight;
//         if (newDist <= dist[data.id]) {
//           dist[data.id] = newDist;
//           if (pathLength[id] + 1 < pathLength[data.id]) {
//             prev[data.id] = id;
//             pathLength[data.id] = pathLength[id] + 1;
//           }
//           PriorityQueue.add((newDist, [newDist, data.id]));
//         }
//       }
//     }
//     if (id === `${end[0]}-${end[1]}`) break;
//   }
//   let path = [];
//   let at = prev[`${end[0]}-${end[1]}`];
//   //console.log(prev);
//   path.push(`${end[0]}-${end[1]}`);
//   while (at) {
//     path.push(at);
//     at = prev[at];
//   }
//   //console.log(path.reverse());
//   path = path.reverse();
//   let direction = '';
//   let pointAIndexes = path[0].split('-');
//   let pointBIndexes = path[1].split('-');
//   if (pointBIndexes[0] - pointAIndexes[0] > 0) direction = 'bottom';
//   else if (pointBIndexes[0] - pointAIndexes[0] < 0) direction = 'top';
//   else if (pointBIndexes[1] - pointAIndexes[1] > 0) direction = 'right';
//   else if (pointBIndexes[1] - pointAIndexes[1] < 0) direction = 'left';

//   return { shortestPath: path, myCarDirection: direction };
// };

// export default Dijkstra;

const Dijkstra = (graph, numberOfNodes, start, end) => {
  return new Promise((resolve, reject) => {
    //if it works
    const PriorityQueue = new FastPriorityQueue();
    let visited = {};
    let dist = {};
    let prev = {};
    let pathLength = {};
    let directions = ['top', 'left', 'right', 'bottom'];
    Object.keys(graph).map((key) => {
      visited[key] = false;
      dist[key] = Number.MAX_SAFE_INTEGER;
      prev[key] = null;
      pathLength[key] = Number.MAX_SAFE_INTEGER;
    });
    dist[`${start[0]}-${start[1]}`] = 0;
    pathLength[`${start[0]}-${start[1]}`] = 0;
    // console.log('d', dist);
    PriorityQueue.add((0, [0, `${start[0]}-${start[1]}`]));
    while (!PriorityQueue.isEmpty()) {
      let [minValue, id] = PriorityQueue.poll();
      visited[id] = true;
      if (dist[id] < minValue) continue;
      let thisNode = graph[id];
      //console.log('minvalue', minValue, 'id', id, 'this node', thisNode);
      for (let i = 0; i < directions.length; i++) {
        let data = thisNode.connections[directions[i]];
        if (data) {
          if (visited[data.id]) continue;
          let newDist = dist[id] + data.weight;
          if (newDist < dist[data.id]) {
            dist[data.id] = newDist;
            prev[data.id] = id;
            pathLength[data.id] = pathLength[id] + getDistance(id, data.id);
            PriorityQueue.add((newDist, [newDist, data.id]));
          } else if (
            newDist === dist[data.id] &&
            pathLength[id] + getDistance(id, data.id) < pathLength[data.id]
          ) {
            prev[data.id] = id;
            pathLength[data.id] = pathLength[id] + getDistance(id, data.id);
            PriorityQueue.add((newDist, [newDist, data.id]));
          }
        }
      }
      if (id === `${end[0]}-${end[1]}`) break;
    }
    let path = [];
    let at = prev[`${end[0]}-${end[1]}`];
    path.push(`${end[0]}-${end[1]}`);
    while (at) {
      path.push(at);
      at = prev[at];
    }
    path = path.reverse();
    let direction = '';
    let pointAIndexes = path[0].split('-');
    let pointBIndexes = path[1].split('-');
    if (pointBIndexes[0] - pointAIndexes[0] > 0) direction = 'bottom';
    else if (pointBIndexes[0] - pointAIndexes[0] < 0) direction = 'top';
    else if (pointBIndexes[1] - pointAIndexes[1] > 0) direction = 'right';
    else if (pointBIndexes[1] - pointAIndexes[1] < 0) direction = 'left';
    //console.log(pathLength);
    resolve({ shortestPath: path, myCarDirection: direction });
    //============
  });
};
export default Dijkstra;
