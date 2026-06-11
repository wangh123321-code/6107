import { useMemo } from 'react';
import * as THREE from 'three';
import type { BladeModel, Layer } from '@/types';

interface BladeProps {
  blade: BladeModel;
  clipEnabled: boolean;
  clipPlane?: THREE.Plane;
}

const BLADE_WIDTH = 1.5;
const BLADE_HEIGHT = 1.7;
const BLADE_CURVE = 0.05;
const EDGE_BEVEL = 0.02;

function createBladeShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const w = BLADE_WIDTH / 2;
  const h = BLADE_HEIGHT / 2;

  shape.moveTo(0, h);
  shape.bezierCurveTo(w * 0.3, h, w * 0.85, h * 0.9, w, h * 0.4);
  shape.bezierCurveTo(w * 1.02, 0, w * 0.9, -h * 0.5, w * 0.5, -h * 0.85);
  shape.bezierCurveTo(w * 0.25, -h * 0.98, -w * 0.25, -h * 0.98, -w * 0.5, -h * 0.85);
  shape.bezierCurveTo(-w * 0.9, -h * 0.5, -w * 1.02, 0, -w, h * 0.4);
  shape.bezierCurveTo(-w * 0.85, h * 0.9, -w * 0.3, h, 0, h);

  return shape;
}

function createLayerGeometry(layerThickness: number): THREE.BufferGeometry {
  const shape = createBladeShape();
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: layerThickness,
    bevelEnabled: true,
    bevelThickness: EDGE_BEVEL,
    bevelSize: EDGE_BEVEL,
    bevelSegments: 2,
    curveSegments: 48,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function BladeLayer({
  layer,
  yOffset,
  thicknessScale,
  clipPlane,
}: {
  layer: Layer;
  yOffset: number;
  thicknessScale: number;
  clipPlane?: THREE.Plane;
}) {
  const actualThickness = layer.thickness * thicknessScale;

  const geometry = useMemo(() => createLayerGeometry(actualThickness), [actualThickness]);

  const material = useMemo(() => {
    const isCarbon = layer.material.toLowerCase().includes('carbon');
    const isFiber = layer.material.toLowerCase().includes('arylate') || layer.material.toLowerCase().includes('zlc') || layer.material.toLowerCase().includes('alc');

    if (isCarbon) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(layer.color),
        metalness: 0.8,
        roughness: 0.3,
        side: THREE.DoubleSide,
        clippingPlanes: clipPlane ? [clipPlane] : undefined,
        clipShadows: true,
      });
    }

    if (isFiber) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(layer.color),
        metalness: 0.4,
        roughness: 0.4,
        side: THREE.DoubleSide,
        clippingPlanes: clipPlane ? [clipPlane] : undefined,
        clipShadows: true,
      });
    }

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(layer.color),
      metalness: 0.05,
      roughness: 0.75,
      side: THREE.DoubleSide,
      clippingPlanes: clipPlane ? [clipPlane] : undefined,
      clipShadows: true,
    });
  }, [layer.color, layer.material, clipPlane]);

  return (
    <mesh geometry={geometry} material={material} position={[0, yOffset, 0]} castShadow receiveShadow />
  );
}

export default function Blade({ blade, clipEnabled, clipPlane }: BladeProps) {
  const thicknessScale = 0.04;

  const layers = useMemo(() => {
    const totalThickness = blade.layerStructure.reduce((sum, l) => sum + l.thickness, 0);
    let currentY = -totalThickness * thicknessScale / 2;

    return blade.layerStructure.map((layer, index) => {
      const actualThickness = layer.thickness * thicknessScale;
      const yOffset = currentY + actualThickness / 2;
      currentY += actualThickness;

      return (
        <BladeLayer
          key={`${layer.name}-${index}`}
          layer={layer}
          yOffset={yOffset}
          thicknessScale={thicknessScale}
          clipPlane={clipEnabled ? clipPlane : undefined}
        />
      );
    });
  }, [blade, clipEnabled, clipPlane]);

  return <group>{layers}</group>;
}

export { BLADE_WIDTH, BLADE_HEIGHT, BLADE_CURVE };
