import React, { useEffect, useState } from 'react';
import { a, useSpring } from 'react-spring/three';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import {
  OrbitControls,
  MeshWobbleMaterial,
  meshStandardMaterial,
  AdaptiveDpr,
  useGLTF,
} from '@react-three/drei';

import CarModel from './NewCar';

const RandomCar = ({ car, correctionFactor, debugCarId }) => {
  const [clicked, setClicked] = useState(false);

  const getRotation = (direction) => {
    if (direction == 'top') return [0, -Math.PI / 2, 0];
    else if (direction == 'left') return [0, 0, 0];
    else if (direction == 'right') return [0, Math.PI, 0];
    else if (direction == 'bottom') return [0, Math.PI / 2, 0];
  };

  const { position, rotation, config } = useSpring({
    position: [
      car.currentPosition[1] - correctionFactor,
      0.05,
      car.currentPosition[0] - correctionFactor,
    ],
    rotation: car.direction ? getRotation(car.direction) : [0, Math.PI, 0],
    config: { duration: 1000 },
  });

  // useEffect(() => {
  //   if (car.id === debugCarId) console.log(car.currentPosition);
  // }, [car]);
  return (
    // <CarModel
    //   scale={[0.0013, 0.0013, 0.0013]}
    //   position={[
    //     car.currentPosition[1] - correctionFactor,
    //     0.05,
    //     car.currentPosition[0] - correctionFactor,
    //   ]}
    //   rotation={car.direction ? getRotation(car.direction) : [0, Math.PI, 0]}
    // />
    <a.mesh
      position={position}
      rotation={rotation}
      config={config}
      scale={[0.01, 0.01, 0.01]}
      onClick={() => {
        setClicked(!clicked);
        console.log('clicked');
      }}
    >
      {/* <torusBufferGeometry
        attach="geometry"
        args={[1, 0.4, 8, 100, Math.PI * 2]}
      />
      <meshStandardMaterial attach="material" color="red" /> */}
      <CarModel />
    </a.mesh>
  );
};
export default RandomCar;
