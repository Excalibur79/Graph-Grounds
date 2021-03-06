/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: OneSteven (https://sketchfab.com/Steven007)
license: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
source: https://sketchfab.com/3d-models/aston-martin-v12-vantage-6be077153b59488288f62d7a4bca8bc2
title: Aston-Martin V12 Vantage
*/

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/MyCar/scene.gltf');
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group
            position={[85.59, 35.38, -137.9]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[1.08, 1.09, 1.09]}
          >
            <mesh
              geometry={nodes.wheel003_Material003_0.geometry}
              material={nodes.wheel003_Material003_0.material}
            />
            <mesh
              geometry={nodes.wheel003_Material002_0.geometry}
              material={nodes.wheel003_Material002_0.material}
            />
            <mesh
              geometry={nodes.wheel003_RimChrome001_0.geometry}
              material={nodes.wheel003_RimChrome001_0.material}
            />
            <mesh
              geometry={nodes.wheel003_blob_0.geometry}
              material={nodes.wheel003_blob_0.material}
            />
            <mesh
              geometry={nodes.wheel003_Chrome001_0.geometry}
              material={nodes.wheel003_Chrome001_0.material}
            />
          </group>
          <group
            position={[86.26, 35.38, -137.9]}
            rotation={[0.07, 0, 0]}
            scale={[0.94, 0.95, 0.95]}
          >
            <mesh
              geometry={nodes.cal003_Material001_0.geometry}
              material={nodes.cal003_Material001_0.material}
            />
          </group>
          <group
            position={[-85.59, 35.38, -137.9]}
            rotation={[-Math.PI / 2, 0, -Math.PI]}
            scale={[1.08, 1.09, 1.09]}
          >
            <mesh
              geometry={nodes.wheel002_Material003_0.geometry}
              material={nodes.wheel002_Material003_0.material}
            />
            <mesh
              geometry={nodes.wheel002_Material002_0.geometry}
              material={nodes.wheel002_Material002_0.material}
            />
            <mesh
              geometry={nodes.wheel002_RimChrome001_0.geometry}
              material={nodes.wheel002_RimChrome001_0.material}
            />
            <mesh
              geometry={nodes.wheel002_blob_0.geometry}
              material={nodes.wheel002_blob_0.material}
            />
            <mesh
              geometry={nodes.wheel002_Chrome001_0.geometry}
              material={nodes.wheel002_Chrome001_0.material}
            />
          </group>
          <group
            position={[-86.26, 35.38, -137.9]}
            rotation={[0.07, 0, 0]}
            scale={[-0.94, 0.95, 0.95]}
          >
            <mesh
              geometry={nodes.cal002_Material001_0.geometry}
              material={nodes.cal002_Material001_0.material}
            />
          </group>
          <group
            position={[-85.46, 36.08, 131.59]}
            rotation={[2.89, 0.31, 0.08]}
            scale={[-0.94, 0.94, 0.94]}
          >
            <mesh
              geometry={nodes.cal001_Material001_0.geometry}
              material={nodes.cal001_Material001_0.material}
            />
          </group>
          <group
            position={[-84.83, 36.08, 131.8]}
            rotation={[-Math.PI / 2, 0, 2.83]}
            scale={[1.07, 1.07, 1.07]}
          >
            <mesh
              geometry={nodes.wheel001_Material003_0.geometry}
              material={nodes.wheel001_Material003_0.material}
            />
            <mesh
              geometry={nodes.wheel001_Material002_0.geometry}
              material={nodes.wheel001_Material002_0.material}
            />
            <mesh
              geometry={nodes.wheel001_RimChrome001_0.geometry}
              material={nodes.wheel001_RimChrome001_0.material}
            />
            <mesh
              geometry={nodes.wheel001_blob_0.geometry}
              material={nodes.wheel001_blob_0.material}
            />
            <mesh
              geometry={nodes.wheel001_Chrome001_0.geometry}
              material={nodes.wheel001_Chrome001_0.material}
            />
          </group>
          <group position={[0, 84.49, 96.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object014_refl_0.geometry}
              material={materials.refl}
            />
          </group>
          <group position={[0, 65.27, 175.92]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object013_lightchr_0.geometry}
              material={materials.lightchr}
            />
          </group>
          <group position={[0, 84, -204.52]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object011_remit_0.geometry}
              material={materials.remit}
            />
          </group>
          <group position={[0, 84, -203.13]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object010_red_0.geometry}
              material={materials.material}
            />
          </group>
          <group position={[0, 67.32, -0.74]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object009_glack_0.geometry}
              material={materials.glack}
            />
          </group>
          <group position={[0, 105.73, -55.81]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object007_GLASS_0.geometry}
              material={materials.GLASS}
            />
          </group>
          <group position={[0, 74.41, -9.69]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object006_LightsGlassFront_0.geometry}
              material={materials.LightsGlassFront}
            />
          </group>
          <group position={[0, 61.69, -25.09]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object005_red2_0.geometry}
              material={materials.red2}
            />
          </group>
          <group position={[0, 62.74, 187.82]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object004_xenon_0.geometry}
              material={materials.xenon}
            />
          </group>
          <group position={[0, 77.71, -7.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object003_Chrome_0.geometry}
              material={materials.Chrome}
            />
          </group>
          <group position={[0, 53.75, -2.62]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object002_flack_0.geometry}
              material={materials.flack}
            />
          </group>
          <group position={[0, 73.11, -2.23]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object000_WhitePaint_0.geometry}
              material={materials.WhitePaint}
            />
          </group>
          <group
            position={[0.04, 35.27, 204.94]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <mesh
              geometry={nodes.object012_grill_0.geometry}
              material={materials.grill}
            />
          </group>
          <group position={[0, 110.59, -97.11]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object001_BlackPaint_0.geometry}
              material={materials.BlackPaint}
            />
          </group>
          <group
            position={[85.46, 36.08, 131.8]}
            rotation={[2.89, 0.31, 0.08]}
            scale={[0.94, 0.94, 0.94]}
          >
            <mesh
              geometry={nodes.cal_Material001_0.geometry}
              material={nodes.cal_Material001_0.material}
            />
          </group>
          <group
            position={[84.83, 36.08, 131.59]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 10]}
            scale={[1.07, 1.07, 1.07]}
          >
            <mesh
              geometry={nodes.wheel_Material003_0.geometry}
              material={nodes.wheel_Material003_0.material}
            />
            <mesh
              geometry={nodes.wheel_Material002_0.geometry}
              material={nodes.wheel_Material002_0.material}
            />
            <mesh
              geometry={nodes.wheel_RimChrome001_0.geometry}
              material={nodes.wheel_RimChrome001_0.material}
            />
            <mesh
              geometry={nodes.wheel_blob_0.geometry}
              material={nodes.wheel_blob_0.material}
            />
            <mesh
              geometry={nodes.wheel_Chrome001_0.geometry}
              material={nodes.wheel_Chrome001_0.material}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/scene.gltf');
