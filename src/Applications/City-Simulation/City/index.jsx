import React, { useState, useEffect, Suspense, useRef } from 'react';
import { clone } from 'ramda';
import './City.scss';
import route from '../Assets/Icons/route.png';
import check from '../Assets/Icons/check.png';
import grid from '../Assets/Icons/grid.png';
import start from '../Assets/Icons/start.png';

import Light from '../Environment/Lights';
import Plane from '../Environment/Plane';
import InstancedBuilding1 from '../Environment/Instances/Building1';
import InstancedBuilding2 from '../Environment/Instances/Building2';
import InstancedBuilding3 from '../Environment/Instances/Building3';
import InstancedGrass from '../Environment/Instances/Grass';
import InstancedWater from '../Environment/Instances/Water';
import InstancedRoadHorizontal from '../Environment/Instances/RoadHorizontal';
import InstancedRoadVertical from '../Environment/Instances/RoadVertical';
import InstancedRoadCrossing from '../Environment/Instances/RoadCrossing';

import MapPointer from '../Components/MapPointer/MapPointer';
import Indicator from '../Components/Indicator';

import { PerlinNoise } from '../Utility/functions';
import { Node } from '../Utility/Classes';

import Traffic from '../Components/Traffic';
import ShortestPath from '../Components/ShortestPath';

import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import {
  OrbitControls,
  MeshWobbleMaterial,
  meshStandardMaterial,
  AdaptiveDpr,
  PerspectiveCamera,
} from '@react-three/drei';

const City = () => {
  const [cityMatrix, setCityMatrix] = useState([]);
  const [instances, setInstances] = useState({
    building1: [],
    building2: [],
    building3: [],
    grass: [],
    water: [],
    roadHorizontal: [],
    roadVertical: [],
    roadCrossing: [],
  });
  const [graph, setGraph] = useState(null);
  const [mapSize, setMapSize] = useState(50);
  const [roadFrequency, setRoadFrequency] = useState(8);
  const [buildingFrequency, setBuildingFrequency] = useState(8);
  const [trafficCarsFrequency, setTrafficCarsFrequency] = useState(20);
  const [trafficCarsTimer, setTrafficCarsTimer] = useState(null);
  const [showDropdownOptions, setShowDropdownOptions] = useState(false);
  const [showOribitalControls, setShowOrbitalControls] = useState(true);
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [showAlgoriths, setShowAlgorithms] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [algorithm, setAlgorithm] = useState('Dijkstra');
  const [algorithmStarted, setAlgorithmStarted] = useState(false);
  const [myCarState, setMyCarState] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [journeyCompleted, setJourneyCompleted] = useState(false);

  useEffect(() => {
    if (cityMatrix.length > 0 && mapSize > 0) countInstances();
  }, [cityMatrix]);

  useEffect(() => {
    if (instances.roadCrossing.length > 0 && cityMatrix.length > 0)
      generateGraph();
  }, [instances]);

  const resetCity = () => {
    console.log('city reset');
    setCityMatrix([]);
    setInstances({
      building1: [],
      building2: [],
      building3: [],
      grass: [],
      water: [],
      roadHorizontal: [],
      roadVertical: [],
      roadCrossing: [],
    });
    setGraph(null);
    setMapSize(50);
    setRoadFrequency(8);
    setBuildingFrequency(8);
    setTrafficCarsFrequency(20);
    clearInterval(trafficCarsTimer);
    setTrafficCarsTimer(null);
    setStartPosition(null);
    setEndPosition(null);
    setAlgorithmStarted(false);
    setJourneyCompleted(false);
    setTotalTime(0);
  };

  const generateCity = () => {
    if (mapSize > 9 && mapSize < 201) {
      setShowDropdownOptions(false);
      let side = mapSize;
      let matrix = [];
      let data = [];

      for (let i = 0; i < side; i++) {
        data = [];
        for (let j = 0; j < side; j++) {
          let perlinValue = Math.round(
            PerlinNoise.noise(i / 10.012, j / 10.021, 0.6) *
              (8 + (10 - buildingFrequency))
          );
          data.push(perlinValue);
        }
        matrix.push(data);
      }
      //horizontal roads
      let randomRow = 0;
      for (let i = 0; i < 50; i++) {
        for (let j = 0; j < side; j++) {
          matrix[randomRow][j] = -1;
        }
        randomRow += Math.floor(Math.random() * 6 + 2 + (8 - roadFrequency));
        if (randomRow > side - 1) break;
      }
      //vertical roads
      let randomColumn = 0;
      for (let i = 0; i < 50; i++) {
        for (let j = 0; j < side; j++) {
          if (matrix[j][randomColumn] == -1) matrix[j][randomColumn] = -3;
          else matrix[j][randomColumn] = -2;
        }
        randomColumn += Math.floor(Math.random() * 6 + 2 + (8 - roadFrequency));
        if (randomColumn > side - 1) break;
      }
      setCityMatrix(matrix);
    } else {
      console.log('Map Size Not Valid!');
    }
  };

  const countInstances = () => {
    let building1 = [];
    let building2 = [];
    let building3 = [];
    let grass = [];
    let water = [];
    let roadHorizontal = [];
    let roadVertical = [];
    let roadCrossing = [];
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        let value = cityMatrix[i][j];
        if (value === -1) roadHorizontal.push([i, j]);
        else if (value === -2) roadVertical.push([i, j]);
        else if (value === -3) roadCrossing.push([i, j]);
        else if (value < 3) building3.push([i, j]);
        else if (value < 5) building2.push([i, j]);
        else if (value < 6) building1.push([i, j]);
        else if (value < 8) grass.push([i, j]);
        else if (value < 9) water.push([i, j]);
      }
    }
    setInstances({
      building1: building1,
      building2: building2,
      building3: building3,
      grass: grass,
      water: water,
      roadHorizontal: roadHorizontal,
      roadVertical: roadVertical,
      roadCrossing: roadCrossing,
    });
  };

  const generateGraph = () => {
    let graph = {};
    let nodePositions = instances.roadCrossing;
    for (let i = 0; i < nodePositions.length; i++) {
      let position = nodePositions[i];
      let node = new Node(position);
      let tempZ = position[0],
        tempX = position[1] - 1;
      //Getting Left Connection
      while (tempX >= 0) {
        let testPosition = cityMatrix[tempZ][tempX];
        if (testPosition === -3) {
          node.updateLeftConnection({
            id: `${tempZ}-${tempX}`,
            weight: 0,
          });
          break;
        }
        tempX--;
      }
      //Getting Top Connection
      tempZ = position[0] - 1;
      tempX = position[1];
      while (tempZ >= 0) {
        let testPosition = cityMatrix[tempZ][tempX];
        if (testPosition === -3) {
          node.updateTopConnection({
            id: `${tempZ}-${tempX}`,
            weight: 0,
          });
          break;
        }
        tempZ--;
      }
      //Getting Right Connection
      tempZ = position[0];
      tempX = position[1] + 1;
      while (tempX < mapSize) {
        let testPosition = cityMatrix[tempZ][tempX];
        if (testPosition === -3) {
          node.updateRightConnection({
            id: `${tempZ}-${tempX}`,
            weight: 0,
          });
          break;
        }
        tempX++;
      }
      //Getting Bottom Connection
      tempZ = position[0] + 1;
      tempX = position[1];
      while (tempZ < mapSize) {
        let testPosition = cityMatrix[tempZ][tempX];
        if (testPosition === -3) {
          node.updateBottomConnection({
            id: `${tempZ}-${tempX}`,
            weight: 0,
          });
          break;
        }
        tempZ++;
      }
      graph[`${position[0]}-${position[1]}`] = node;
    }
    setGraph(graph);
  };

  const handleShowAlgorithms = () => {
    let elements = document.getElementsByClassName('Canvas_div__Algorithms');
    if (!elements[0].classList.contains('show')) {
      let i = 0;
      const id = setInterval(() => {
        if (i === elements.length) clearInterval(id);
        else elements[i++].classList.add('show');
      }, 300);
    } else {
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('show');
      }
    }
  };

  const regesterMarkers = (pos) => {
    if (!algorithmStarted) {
      if (JSON.stringify(pos) === JSON.stringify(startPosition)) {
        setStartPosition(null);
      } else if (JSON.stringify(pos) === JSON.stringify(endPosition)) {
        setEndPosition(null);
      } else {
        if (!startPosition) setStartPosition(pos);
        else {
          if (JSON.stringify(pos) !== JSON.stringify(startPosition)) {
            setEndPosition(pos);
          } else {
            console.log('Start and end cant have same positions!');
          }
        }
      }
    }
  };

  const startAlgorithm = () => {
    setAlgorithmStarted(true);
  };

  return (
    <div className="City_div">
      <div className="City">
        <div className="City__Config">
          {!graph && (
            <div className="City__Buttons" onClick={generateCity}>
              Generate
            </div>
          )}
          {!graph && (
            <div
              className="City__Buttons"
              onClick={() => setShowDropdownOptions(!showDropdownOptions)}
            >
              Options
            </div>
          )}
          <div
            className="City__Buttons"
            onClick={() => setShowOrbitalControls(!showOribitalControls)}
          >
            Info
          </div>
          <div className="City__Buttons" onClick={resetCity}>
            Reset
          </div>
        </div>
        {showDropdownOptions && (
          <div className="Config__DropDown">
            <div className="Config__DropDown_Row">
              <div>Map Size</div>
              <div>
                <span
                  class="input-number-decrement"
                  onClick={() => {
                    if (mapSize > 10) setMapSize(mapSize - 1);
                  }}
                >
                  –
                </span>
                <input
                  class="input-number"
                  type="number"
                  min={10}
                  max={200}
                  value={mapSize}
                />
                <span
                  class="input-number-increment"
                  onClick={() => {
                    if (mapSize < 200) setMapSize(mapSize + 1);
                  }}
                >
                  +
                </span>
              </div>
            </div>
            <div className="Config__DropDown_Row">
              <div>Building Frequency</div>
              <div>
                <span
                  class="input-number-decrement"
                  onClick={() => {
                    if (buildingFrequency > 8)
                      setBuildingFrequency(buildingFrequency - 1);
                  }}
                >
                  –
                </span>
                <input
                  className="input-number"
                  type="number"
                  min={8}
                  max={10}
                  value={buildingFrequency}
                />
                <span
                  class="input-number-increment"
                  onClick={() => {
                    if (buildingFrequency < 10)
                      setBuildingFrequency(buildingFrequency + 1);
                  }}
                >
                  +
                </span>
              </div>
            </div>
            <div className="Config__DropDown_Row">
              <div>Road Frequency</div>
              <div>
                <span
                  class="input-number-decrement"
                  onClick={() => {
                    if (roadFrequency > 2) setRoadFrequency(roadFrequency - 1);
                  }}
                >
                  –
                </span>
                <input
                  className="input-number"
                  type="number"
                  min={2}
                  max={8}
                  value={roadFrequency}
                />
                <span
                  class="input-number-increment"
                  onClick={() => {
                    if (roadFrequency < 8) setRoadFrequency(roadFrequency + 1);
                  }}
                >
                  +
                </span>
              </div>
            </div>
            <div className="Config__DropDown_Row">
              <div>Traffic Cars </div>
              <div>
                <span
                  class="input-number-decrement"
                  onClick={() => {
                    if (trafficCarsFrequency > 1)
                      setTrafficCarsFrequency(trafficCarsFrequency - 1);
                  }}
                >
                  –
                </span>
                <input
                  className="input-number"
                  type="number"
                  min={1}
                  max={140}
                  value={trafficCarsFrequency}
                />
                <span
                  class="input-number-increment"
                  onClick={() => {
                    if (trafficCarsFrequency < 140)
                      setTrafficCarsFrequency(trafficCarsFrequency + 1);
                  }}
                >
                  +
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="Canvas_div">
        <div className="Canvas_and_Algorithm_Configs_Icons">
          <img src={route} onClick={handleShowAlgorithms} />
          <img src={grid} onClick={() => setShowGrid(!showGrid)} />
          {startPosition && endPosition && algorithm && !algorithmStarted && (
            <img
              src={start}
              style={{ transform: 'rotate(-90deg)' }}
              onClick={startAlgorithm}
            />
          )}
          {(totalTime > 0 || journeyCompleted) && (
            <div>Estimated Time : {totalTime} secs</div>
          )}
        </div>
        <div
          className="Canvas_div__Algorithms"
          id="Dijkstra"
          onClick={() => setAlgorithm('Dijkstra')}
        >
          <div>Dijkstra</div>
          {algorithm == 'Dijkstra' && <img src={check} />}
        </div>
        <div
          className="Canvas_div__Algorithms"
          id="Bidirectional-Dijkstra"
          onClick={() => setAlgorithm('Bi-directional Dijkstra')}
        >
          <div>Bi-directional Dijkstra</div>
          {algorithm == 'Bi-directional Dijkstra' && <img src={check} />}
        </div>

        <Canvas
          shadows={true}
          colorManagement
          camera={{
            position: [0, mapSize, 0],
            fov: 60,
          }}
          className="City__Canvas"
          onClick={(e) => console.log(e)}
        >
          {showOribitalControls && (
            <OrbitControls enablePan enableRotate enableZoom />
          )}
          {showGrid && (
            <>
              <axesHelper position={[0, 0.11, 0]} args={[2]} />
              <gridHelper args={[1000, 1000, 'white', 'grey']} />
            </>
          )}

          <Light />
          <Suspense fallback={null}>
            {mapSize > 0 && <Plane side={mapSize} />}
          </Suspense>
          <Suspense fallback={null}>
            {mapSize > 0 && instances.building1.length > 0 && (
              <InstancedBuilding1
                instances={instances.building1}
                correctionFactor={(mapSize - 1) / 2}
              />
            )}
            {mapSize > 0 && instances.building2.length > 0 && (
              <InstancedBuilding2
                instances={instances.building2}
                correctionFactor={(mapSize - 1) / 2}
              />
            )}
            {mapSize > 0 && instances.building3.length > 0 && (
              <InstancedBuilding3
                instances={instances.building3}
                correctionFactor={(mapSize - 1) / 2}
              />
            )}
            {mapSize > 0 && instances.grass.length > 0 && (
              <InstancedGrass
                instances={instances.grass}
                correctionFactor={(mapSize - 1) / 2}
              />
            )}
            {/* {side > 0 && instances.water.length > 0 && (
            <InstancedWater
              instances={instances.water}
              correctionFactor={(side - 1) / 2}
            />
          )} */}
            {mapSize > 0 && instances.roadHorizontal.length > 0 && (
              <InstancedRoadHorizontal
                instances={instances.roadHorizontal}
                correctionFactor={(mapSize - 1) / 2}
              />
            )}
            {mapSize > 0 && instances.roadVertical.length > 0 && (
              <InstancedRoadVertical
                instances={instances.roadVertical}
                correctionFactor={(mapSize - 1) / 2}
              />
            )}
            {mapSize > 0 && instances.roadCrossing.length > 0 && (
              <InstancedRoadCrossing
                instances={instances.roadCrossing}
                correctionFactor={(mapSize - 1) / 2}
                regesterMarkers={regesterMarkers}
              />
            )}
          </Suspense>
          <Suspense fallback={null}>
            {startPosition && (
              <MapPointer
                position={[
                  startPosition[1] - (mapSize - 1) / 2 + 0.25,
                  0,
                  startPosition[0] - (mapSize - 1) / 2 + 0.25,
                ]}
                scale={[0.5, 0.5, 0.5]}
              />
            )}
            {endPosition && (
              <MapPointer
                position={[
                  endPosition[1] - (mapSize - 1) / 2 + 0.25,
                  0,
                  endPosition[0] - (mapSize - 1) / 2 + 0.25,
                ]}
                scale={[0.5, 0.5, 0.5]}
              />
            )}
            {endPosition && journeyCompleted && (
              <Indicator
                maxRadius={mapSize * 0.1}
                position={[
                  endPosition[1] - (mapSize - 1) / 2,
                  0.2,
                  endPosition[0] - (mapSize - 1) / 2,
                ]}
                color="#01EEFC"
              />
            )}
            {startPosition && journeyCompleted && (
              <Indicator
                maxRadius={mapSize * 0.1}
                position={[
                  startPosition[1] - (mapSize - 1) / 2,
                  0.2,
                  startPosition[0] - (mapSize - 1) / 2,
                ]}
                color="#01EEFC"
              />
            )}
          </Suspense>
          <Suspense fallback={null}>
            {graph && instances.roadCrossing.length > 0 && (
              <Traffic
                graph={graph}
                updateGraph={(graph) => setGraph(graph)}
                numberOfCars={trafficCarsFrequency}
                instances={instances.roadCrossing}
                correctionFactor={(mapSize - 1) / 2}
                cityMatrix={cityMatrix}
                setTrafficCarsTimer={(id) => setTrafficCarsTimer(id)}
              />
            )}
          </Suspense>
          <Suspense fallback={null}>
            {algorithmStarted && (
              <ShortestPath
                graph={graph}
                cityMatrix={cityMatrix}
                startPosition={startPosition}
                endPosition={endPosition}
                algorithm={algorithm}
                numberOfNodes={instances.roadCrossing.length}
                correctionFactor={(mapSize - 1) / 2}
                setMyCarState={(carState) => setMyCarState(carState)}
                setTotalTime={(time) => setTotalTime(time)}
                setJourneyCompleted={() => {
                  setJourneyCompleted(true);
                  setTotalTime(0);
                }}
              />
            )}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
export default City;
