import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

import normal from '../../Assets/Textures/Rods/normal.jpg';
import albedo from '../../Assets/Textures/Rods/albedo.jpg';
import roughness from '../../Assets/Textures/Rods/roughness.jpg';

const Visualization = ({ visualRods, correctionFactor }) => {
  const [normalMap, roughnessMap, albedoMap] = useLoader(TextureLoader, [
    normal,
    roughness,
    albedo,
  ]);
  const getRotation = (inclination) => {
    if (inclination == 'vertical') return [Math.PI / 2, 0, 0];
    else return [Math.PI / 2, 0, Math.PI / 2];
  };
  return (
    <>
      {visualRods.map((rod) => {
        return (
          <mesh
            position={[
              rod.position[0] - correctionFactor,
              rod.position[1],
              rod.position[2] - correctionFactor,
            ]}
            rotation={getRotation(rod.inclination)}
          >
            <cylinderGeometry
              attach="geometry"
              args={[0.05, 0.05, rod.length]}
            />
            <meshStandardMaterial
              attach="material"
              transparent={true}
              color="#7B241C"
              opacity={0.85}
              emissive="#7B241C"
            />
          </mesh>
        );
      })}
    </>
  );
};
export default Visualization;
