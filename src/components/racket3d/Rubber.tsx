import { useMemo } from 'react';
import * as THREE from 'three';
import type { RubberModel } from '@/types';

interface RubberProps {
  rubber: RubberModel;
  spongeThickness: number;
  side: 'forehand' | 'backhand';
  bladeThickness: number;
  clipEnabled: boolean;
  clipPlane?: THREE.Plane;
}

const RUBBER_TOP_THICKNESS = 0.008;
const THICKNESS_SCALE = 0.04;
const BLADE_WIDTH = 1.5;
const BLADE_HEIGHT = 1.7;
const EDGE_BEVEL = 0.015;

function createRubberShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const w = BLADE_WIDTH / 2 - 0.02;
  const h = BLADE_HEIGHT / 2 - 0.02;

  shape.moveTo(0, h);
  shape.bezierCurveTo(w * 0.3, h, w * 0.85, h * 0.9, w, h * 0.4);
  shape.bezierCurveTo(w * 1.02, 0, w * 0.9, -h * 0.5, w * 0.5, -h * 0.85);
  shape.bezierCurveTo(w * 0.25, -h * 0.98, -w * 0.25, -h * 0.98, -w * 0.5, -h * 0.85);
  shape.bezierCurveTo(-w * 0.9, -h * 0.5, -w * 1.02, 0, -w, h * 0.4);
  shape.bezierCurveTo(-w * 0.85, h * 0.9, -w * 0.3, h, 0, h);

  return shape;
}

function createRubberGeometry(totalThickness: number): THREE.BufferGeometry {
  const shape = createRubberShape();
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: totalThickness,
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

function createTextureCanvas(rubber: RubberModel, isSponge: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  if (isSponge) {
    const baseColor = '#f5a860';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 3 + 1;
      const alpha = Math.random() * 0.4 + 0.1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 100, 40, ${alpha})`;
      ctx.fill();
    }
  } else {
    ctx.fillStyle = rubber.color;
    ctx.fillRect(0, 0, 256, 256);

    if (rubber.type === 'sticky') {
      for (let y = 0; y < 256; y += 6) {
        for (let x = 0; x < 256; x += 6) {
          const offsetX = (y / 6) % 2 === 0 ? 0 : 3;
          ctx.beginPath();
          ctx.arc(x + offsetX, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.15)';
          ctx.fill();
        }
      }
    } else {
      for (let y = 0; y < 256; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= 256; x += 10) {
          const amp = Math.sin(x * 0.05 + y * 0.1) * 2;
          ctx.lineTo(x, y + amp);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 180);
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export default function Rubber({
  rubber,
  spongeThickness,
  side,
  bladeThickness,
  clipEnabled,
  clipPlane,
}: RubberProps) {
  const actualSpongeThickness = spongeThickness * THICKNESS_SCALE;
  const totalThickness = RUBBER_TOP_THICKNESS + actualSpongeThickness;
  const sign = side === 'forehand' ? 1 : -1;
  const yOffset = sign * (bladeThickness * THICKNESS_SCALE / 2 + totalThickness / 2);

  const topGeometry = useMemo(() => createRubberGeometry(RUBBER_TOP_THICKNESS), []);
  const spongeGeometry = useMemo(() => createRubberGeometry(actualSpongeThickness), [actualSpongeThickness]);

  const topTexture = useMemo(() => createTextureCanvas(rubber, false), [rubber]);
  const spongeTexture = useMemo(() => createTextureCanvas(rubber, true), [rubber]);

  const topMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: topTexture,
    metalness: 0.05,
    roughness: rubber.type === 'sticky' ? 0.85 : 0.6,
    side: THREE.DoubleSide,
    clippingPlanes: clipEnabled ? [clipPlane!] : undefined,
    clipShadows: true,
  }), [topTexture, rubber.type, clipEnabled, clipPlane]);

  const spongeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: spongeTexture,
    metalness: 0.0,
    roughness: 0.95,
    side: THREE.DoubleSide,
    clippingPlanes: clipEnabled ? [clipPlane!] : undefined,
    clipShadows: true,
  }), [spongeTexture, clipEnabled, clipPlane]);

  const spongeYOffset = sign * (bladeThickness * THICKNESS_SCALE / 2 + actualSpongeThickness / 2);
  const topYOffset = sign * (bladeThickness * THICKNESS_SCALE / 2 + actualSpongeThickness + RUBBER_TOP_THICKNESS / 2);

  return (
    <group>
      <mesh geometry={spongeGeometry} material={spongeMaterial} position={[0, spongeYOffset, 0]} castShadow receiveShadow />
      <mesh geometry={topGeometry} material={topMaterial} position={[0, topYOffset, 0]} castShadow receiveShadow />
    </group>
  );
}
