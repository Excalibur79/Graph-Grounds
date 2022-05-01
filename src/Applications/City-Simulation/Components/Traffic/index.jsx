import React, { useEffect, useState, useRef } from 'react';
import { clone } from 'ramda';
import uuid from 'react-uuid';

import { TrafficCar } from '../../Utility/Classes';
import RandomCar from '../RandomCar/index';

const Traffic = ({
  graph,
  updateGraph,
  numberOfCars,
  instances,
  correctionFactor,
  cityMatrix,
  setTrafficCarsTimer,
}) => {
  const [cars, setCars] = useState(null);
  const [startAnimations, setStartAnimations] = useState(false);
  const [spawn, setSpawn] = useState(false);
  const carsRef = useRef();
  const graphRef = useRef();
  const [debugCarId, setDebugCarId] = useState(null);

  useEffect(() => {
    if (instances.length > 0) setSpawn(true);
  }, [numberOfCars, instances]);

  useEffect(() => {
    graphRef.current = graph;
  }, [graph]);

  useEffect(() => {
    carsRef.current = cars;
  }, [cars]);

  useEffect(() => {
    if (startAnimations) startMovement();
  }, [startAnimations]);

  useEffect(() => {
    if (spawn) spawnCars();
  }, [spawn]);

  const spawnCars = () => {
    // console.log('Spawned');
    let carsCreated = 0;
    let indexesIncluded = [];
    let trafficCars = {};
    while (carsCreated < numberOfCars) {
      let randomNumber = Math.floor(Math.random() * instances.length);
      let id = uuid();
      let car = new TrafficCar(id, instances[randomNumber]);
      trafficCars[id] = car;
      setDebugCarId(id);
      carsCreated++;
    }
    setCars(trafficCars);
    setStartAnimations(true);
  };

  const getOppositeDirection = (direction) => {
    if (direction == 'top') return 'bottom';
    else if (direction == 'bottom') return 'top';
    else if (direction == 'left') return 'right';
    else return 'left';
  };

  const startMovement = () => {
    let directions = ['left', 'top', 'right', 'bottom'];
    setTrafficCarsTimer(
      setInterval(() => {
        let clonedGraph = clone(graphRef.current);
        let clonedCars = clone(carsRef.current);
        Object.keys(clonedCars).map((key) => {
          let trafficCar = clonedCars[key];
          let [carPositionZ, carPositionX] = trafficCar.currentPosition;
          if (cityMatrix[carPositionZ][carPositionX] === -3) {
            let currentNode = clonedGraph[`${carPositionZ}-${carPositionX}`];
            if (trafficCar.prevNode && trafficCar.direction) {
              let prevNode =
                clonedGraph[
                  `${trafficCar.prevNode[0]}-${trafficCar.prevNode[1]}`
                ];
              prevNode.connections[trafficCar.direction].weight -= 1;
              currentNode.connections[
                getOppositeDirection(trafficCar.direction)
              ].weight -= 1;
            }
            let accessibleDirections = [];
            for (let i = 0; i < 4; i++) {
              if (currentNode.connections[directions[i]])
                accessibleDirections.push(directions[i]);
            }
            let randomDirection =
              accessibleDirections[
                Math.floor(Math.random() * accessibleDirections.length)
              ];
            currentNode.connections[randomDirection].weight += 1;
            let nextNodeId = currentNode.connections[randomDirection].id;

            let nextNode = clonedGraph[nextNodeId];
            // console.log(
            //   nextNode.connections[getOppositeDirection(randomDirection)],
            //   'next node id:',
            //   nextNodeId,
            //   'direction :',
            //   getOppositeDirection(randomDirection)
            // );
            nextNode.connections[
              getOppositeDirection(randomDirection)
            ].weight += 1;

            trafficCar.prevNode = [carPositionZ, carPositionX];
            trafficCar.direction = randomDirection;
          }
          if (trafficCar.direction == 'left')
            trafficCar.currentPosition = [carPositionZ, carPositionX - 1];
          else if (trafficCar.direction == 'top')
            trafficCar.currentPosition = [carPositionZ - 1, carPositionX];
          else if (trafficCar.direction == 'right')
            trafficCar.currentPosition = [carPositionZ, carPositionX + 1];
          else if (trafficCar.direction == 'bottom')
            trafficCar.currentPosition = [carPositionZ + 1, carPositionX];

          // trafficCar.currentPosition = [
          //   trafficCar.currentPosition[0] - 1,
          //   trafficCar.currentPosition[1],
          // ];
        });
        updateGraph(clonedGraph);
        setCars(clonedCars);
      }, 1000)
    );
  };

  return (
    <group>
      {cars &&
        Object.keys(cars).map((key) => (
          <RandomCar
            key={key}
            car={cars[key]}
            correctionFactor={correctionFactor}
            debugCarId={debugCarId}
          />
        ))}
    </group>
  );
};
export default Traffic;
