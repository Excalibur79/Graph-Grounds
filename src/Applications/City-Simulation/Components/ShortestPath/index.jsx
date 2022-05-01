import React, { useState, useEffect, Suspense } from 'react';
import { clone } from 'ramda';
import Dijkstra from '../../Utility/Dijkstra';
import { getInclinationAndLength } from '../../Utility/functions';
import { Rod } from '../../Utility/Classes';
import Visualization from '../Visualization';
import { MyCar } from '../../Utility/Classes';

import MyCarModel from '../MyCar';

const ShortestPath = ({
  graph,
  cityMatrix,
  startPosition,
  endPosition,
  algorithm,
  numberOfNodes,
  correctionFactor,
  setMyCarState,
  setTotalTime,
  setJourneyCompleted,
}) => {
  const [start, setStart] = useState(startPosition);
  const [end, setEnd] = useState(endPosition);
  const [presentShortestPath, setPresentShortestPath] = useState([]);
  const [visualRods, setVisualRods] = useState(null);
  const shortestPathAlgorithms = {
    Dijkstra: Dijkstra,
  };
  const [myCarObject, setMyCarObject] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [carTimePerUnit, setCarTimePerUnit] = useState(0);

  useEffect(() => {
    if (myCarObject) setMyCarState(myCarObject);
  }, [myCarObject]);

  useEffect(() => {
    setMyCarObject(new MyCar(startPosition));
    setJourneyStarted(true);
  }, [startPosition]);

  useEffect(() => {
    if (journeyStarted) increaseStep();
  }, [journeyStarted]);

  useEffect(() => {
    if (currentStep > 0) increaseStep();
  }, [currentStep]);

  useEffect(() => {
    if (presentShortestPath) updateVisualization();
  }, [presentShortestPath]);

  useEffect(() => {
    if (totalDistance !== 0 && carTimePerUnit !== 0)
      setTotalTime((totalDistance * carTimePerUnit) / 1000);
  }, [totalDistance, carTimePerUnit]);

  // useEffect(() => {
  //   let { shortestPath, myCarDirection } = shortestPathAlgorithms[algorithm](
  //     graph,
  //     numberOfNodes,
  //     start,
  //     end
  //   );
  //   setPresentShortestPath(shortestPath);
  // }, [graph]);

  const updateVisualization = () => {
    setTotalDistance(0);
    let pointer = 1;
    let tailingPointer = 0;
    let rods = [];
    let distance = 0;
    while (presentShortestPath[pointer]) {
      let { length, inclination, position, forConnection } =
        getInclinationAndLength(
          presentShortestPath[tailingPointer],
          presentShortestPath[pointer]
        );
      distance += length;
      rods.push(new Rod(position, 1, inclination, length, forConnection));
      pointer++;
      tailingPointer++;
    }
    setTotalDistance(distance);
    setVisualRods(rods);
    // console.log(rods);
  };

  const increaseStep = async () => {
    let car = clone(myCarObject);
    if (JSON.stringify(endPosition) === JSON.stringify(car.currentPosition)) {
      console.log('Journey Completed !');
      setJourneyCompleted();
      return;
    }
    if (cityMatrix[car.currentPosition[0]][car.currentPosition[1]] === -3) {
      let { shortestPath, myCarDirection } = await shortestPathAlgorithms[
        algorithm
      ](graph, numberOfNodes, car.currentPosition, end);
      setPresentShortestPath(shortestPath);
      car.direction = myCarDirection;
      car.prevNode = car.currentPosition;
    }

    let weight =
      graph[`${car.prevNode[0]}-${car.prevNode[1]}`].connections[car.direction]
        .weight;
    car.speed = weight == 0 ? 1 : weight * 5;
    setCarTimePerUnit(car.speed * 200);
    let [carPositionZ, carPositionX] = car.currentPosition;
    if (car.direction == 'left')
      car.currentPosition = [carPositionZ, carPositionX - 1];
    else if (car.direction == 'top')
      car.currentPosition = [carPositionZ - 1, carPositionX];
    else if (car.direction == 'right')
      car.currentPosition = [carPositionZ, carPositionX + 1];
    else if (car.direction == 'bottom')
      car.currentPosition = [carPositionZ + 1, carPositionX];

    setTimeout(() => {
      setMyCarObject(car);
      setCurrentStep(currentStep + 1);
    }, car.speed * 200);
  };

  return (
    <>
      <Suspense fallback={null}>
        {visualRods && (
          <Visualization
            visualRods={visualRods}
            correctionFactor={correctionFactor}
          />
        )}
      </Suspense>
      <Suspense fallback={null}>
        {myCarObject && (
          <MyCarModel car={myCarObject} correctionFactor={correctionFactor} />
        )}
      </Suspense>
    </>
  );
};
export default ShortestPath;
