import * as THREE from 'three';

export function loadDecalTexture(imageUrl: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.premultiplyAlpha = true;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      (error) => reject(error),
    );
  });
}

export function uvToPosition(
  u: number,
  v: number,
  bladeWidth: number,
  bladeHeight: number,
  bladeCurve: number,
): THREE.Vector3 {
  const x = (u - 0.5) * bladeWidth;
  const y = (v - 0.5) * bladeHeight;
  const distFromCenter = Math.sqrt(x * x + y * y);
  const maxDist = Math.sqrt(
    (bladeWidth / 2) ** 2 + (bladeHeight / 2) ** 2,
  );
  const normalizedDist = distFromCenter / maxDist;
  const z = -Math.cos(normalizedDist * Math.PI * 0.5) * bladeCurve;

  return new THREE.Vector3(x, y, z);
}

export function getEdgeFeatherAlpha(u: number, v: number): number {
  const cx = 0.5;
  const cy = 0.5;
  const dist = Math.sqrt((u - cx) ** 2 + (v - cy) ** 2);
  const maxDist = 0.5;
  if (dist < 0.425) return 1;
  if (dist > 0.475) return 0;
  return 1 - (dist - 0.425) / 0.05;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
