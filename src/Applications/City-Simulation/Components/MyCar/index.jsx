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

import CarModel from './Car';

const MyCar = ({ car, correctionFactor }) => {
  const getRotation = (direction) => {
    if (direction == 'top') return [0, Math.PI, 0];
    else if (direction == 'left') return [0, -Math.PI / 2, 0];
    else if (direction == 'right') return [0, Math.PI / 2, 0];
    else if (direction == 'bottom') return [0, 0, 0];
  };
  const { position, rotation, config } = useSpring({
    position: [
      car.currentPosition[1] - correctionFactor,
      0.05,
      car.currentPosition[0] - correctionFactor,
    ],
    rotation: car.direction ? getRotation(car.direction) : [0, Math.PI, 0],
    config: { duration: car.speed * 200 },
  });

  return (
    <a.mesh
      position={position}
      rotation={rotation}
      config={config}
      scale={[0.0035, 0.0035, 0.0035]}
    >
      <CarModel />
    </a.mesh>
  );
};
export default MyCar;
