import { useEffect, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { loadDecalTexture } from '@/utils/decalMapping';

interface DecalProps {
  logoUrl: string | null;
  clipEnabled: boolean;
  clipPlane?: THREE.Plane;
}

const BLADE_WIDTH = 1.5;
const BLADE_HEIGHT = 1.7;

export default function Decal({ logoUrl, clipEnabled, clipPlane }: DecalProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!logoUrl) {
      setTexture(null);
      return;
    }

    let cancelled = false;
    loadDecalTexture(logoUrl)
      .then((t) => {
        if (!cancelled) setTexture(t);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [logoUrl]);

  const decalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = BLADE_WIDTH * 0.35;
    const h = BLADE_HEIGHT * 0.35;
    const r = 0.02;

    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);

    const geometry = new THREE.ShapeGeometry(shape, 32);
    geometry.center();
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + y * y);
      const maxDist = Math.sqrt((BLADE_WIDTH / 2) ** 2 + (BLADE_HEIGHT / 2) ** 2);
      const normalizedDist = Math.min(dist / maxDist, 1);
      const curve = -Math.cos(normalizedDist * Math.PI * 0.5) * 0.02;
      pos.setZ(i, z + curve);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  const decalMaterial = useMemo(() => {
    if (!texture) return null;
    return new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      metalness: 0.1,
      roughness: 0.6,
      side: THREE.DoubleSide,
      clippingPlanes: clipEnabled ? [clipPlane!] : undefined,
    });
  }, [texture, clipEnabled, clipPlane]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  if (!texture || !decalMaterial) return null;

  const totalBladeHalf = 0.004 + 2.15 * 0.04 + 5.8 * 0.04 / 2 + 0.001;

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={decalGeometry}
        material={decalMaterial}
        position={[0, totalBladeHalf, 0.1]}
        castShadow
      />
    </group>
  );
}
