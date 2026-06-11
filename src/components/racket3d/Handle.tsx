import { useMemo } from 'react';
import * as THREE from 'three';

interface HandleProps {
  color: string;
  clipEnabled: boolean;
  clipPlane?: THREE.Plane;
}

const HANDLE_WIDTH = 0.28;
const HANDLE_HEIGHT = 0.18;
const HANDLE_LENGTH = 1.0;
const TAPER_AMOUNT = 0.04;
const FLARE_AMOUNT = 0.02;

function createHandleShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const w = HANDLE_WIDTH / 2;
  const h = HANDLE_HEIGHT / 2;

  shape.moveTo(-w, 0);
  shape.bezierCurveTo(-w, -h, -w * 0.5, -h, 0, -h);
  shape.bezierCurveTo(w * 0.5, -h, w, -h, w, 0);
  shape.bezierCurveTo(w, h, w * 0.5, h, 0, h);
  shape.bezierCurveTo(-w * 0.5, h, -w, h, -w, 0);

  return shape;
}

export default function Handle({ color, clipEnabled, clipPlane }: HandleProps) {
  const handleGeometry = useMemo(() => {
    const shape = createHandleShape();

    const points: THREE.Vector2[] = [];
    const segments = 12;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let scale = 1;

      if (t < 0.15) {
        const k = t / 0.15;
        scale = 1.1 - k * 0.08 + FLARE_AMOUNT * (1 - k);
      } else if (t > 0.85) {
        const k = (t - 0.85) / 0.15;
        scale = 1.02 + k * TAPER_AMOUNT;
      } else {
        const midT = (t - 0.15) / 0.7;
        scale = 1.02 - Math.sin(midT * Math.PI) * 0.04;
      }

      points.push(new THREE.Vector2(scale, t * HANDLE_LENGTH - HANDLE_LENGTH / 2));
    }

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 16,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
      extrudePath: new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(0, p.y, 0)),
      ),
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateY(Math.PI / 2);

    return geometry;
  }, []);

  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const baseColor = color;
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 256, 512);

    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 512;
      const height = Math.random() * 8 + 2;
      const alpha = Math.random() * 0.15 + 0.05;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, y, 256, height);
    }

    for (let i = 0; i < 30; i++) {
      const y = Math.random() * 512;
      const alpha = Math.random() * 0.1 + 0.03;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 256; x += 20) {
        const offset = Math.sin(x * 0.02 + y * 0.01) * 3;
        ctx.lineTo(x, y + offset);
      }
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 2);
    return texture;
  }, [color]);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    map: woodTexture,
    metalness: 0.05,
    roughness: 0.8,
    side: THREE.DoubleSide,
    clippingPlanes: clipEnabled ? [clipPlane!] : undefined,
    clipShadows: true,
  }), [woodTexture, clipEnabled, clipPlane]);

  const endCapGeometry = useMemo(() => {
    return new THREE.SphereGeometry(HANDLE_WIDTH / 2 + 0.01, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  }, []);

  const endCapMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2a2a2a'),
    metalness: 0.6,
    roughness: 0.4,
    clippingPlanes: clipEnabled ? [clipPlane!] : undefined,
  }), [clipEnabled, clipPlane]);

  return (
    <group position={[0, 0, -BLADE_HEIGHT / 2 - HANDLE_LENGTH / 2 + 0.05]}>
      <mesh geometry={handleGeometry} material={material} castShadow receiveShadow />
      <mesh geometry={endCapGeometry} material={endCapMaterial} position={[0, -HANDLE_LENGTH / 2 + 0.01, 0]} rotation={[Math.PI, 0, 0]} castShadow />
    </group>
  );
}

const BLADE_HEIGHT = 1.7;
