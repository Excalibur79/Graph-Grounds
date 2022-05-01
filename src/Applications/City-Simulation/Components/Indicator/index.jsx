import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';

const Indicator = ({ maxRadius, position, color }) => {
  const indicatorMesh = useRef();
  useFrame(() => {
    if (indicatorMesh.current.scale.x >= 1) {
      indicatorMesh.current.scale.x =
        indicatorMesh.current.scale.y =
        indicatorMesh.current.scale.z =
          0;
    }

    indicatorMesh.current.scale.x =
      indicatorMesh.current.scale.y =
      indicatorMesh.current.scale.z +=
        0.01;
  });
  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={indicatorMesh}
    >
      <circleBufferGeometry attach="geometry" args={[maxRadius, 100]} />
      <meshBasicMaterial color={color} transparent={true} opacity={0.75} />
    </mesh>
  );
};
export default Indicator;
