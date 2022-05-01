export class Node {
  constructor(position) {
    this.position = position; //Array [z,x]
    this.connections = {
      top: null,
      left: null,
      right: null,
      bottom: null,
    };
  }
  updateTopConnection(top) {
    this.connections.top = top;
  }
  updateLeftConnection(left) {
    this.connections.left = left;
  }
  updateRightConnection(right) {
    this.connections.right = right;
  }
  updateBottomConnection(bottom) {
    this.connections.bottom = bottom;
  }
}

export class TrafficCar {
  constructor(id, currentPosition) {
    this.id = id;
    this.direction = ''; //'top','left','right','bottom'
    this.prevNode = null;
    this.currentPosition = currentPosition;
  }
  updatePrevNode(prevNode) {
    this.prevNode = prevNode;
  }
  updateDirection(direction) {
    this.direction = direction;
  }
  updateCurrentPosition(currentPosition) {
    this.currentPosition = currentPosition;
  }
}

export class Rod {
  constructor(position, weight = 0, inclination, length, forConnection) {
    this.position = position;
    this.length = length;
    this.weight = weight;
    this.inclination = inclination;
    this.forConnection = forConnection;
  }
}

export class MyCar {
  constructor(currentPosition) {
    this.currentPosition = currentPosition;
    this.direction = 'top';
    this.speed = 1;
    this.prevNode = currentPosition;
  }
}
