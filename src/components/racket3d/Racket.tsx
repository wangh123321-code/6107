import { useMemo } from 'react';
import * as THREE from 'three';
import Blade from './Blade';
import Rubber from './Rubber';
import Handle from './Handle';
import Decal from './Decal';
import { useRacketStore } from '@/store/useRacketStore';
import { getBladeById } from '@/data/blades';
import { getRubberById } from '@/data/rubbers';

export default function Racket() {
  const config = useRacketStore((s) => s.config);

  const blade = useMemo(() => getBladeById(config.bladeId)!, [config.bladeId]);
  const forehandRubber = useMemo(
    () => getRubberById(config.forehandRubberId)!,
    [config.forehandRubberId],
  );
  const backhandRubber = useMemo(
    () => getRubberById(config.backhandRubberId)!,
    [config.backhandRubberId],
  );

  const clipPlane = useMemo(() => {
    if (!config.clipEnabled) return undefined;
    const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    const offset = (config.clipPosition - 0.5) * 1.5;
    plane.constant = -offset;
    return plane;
  }, [config.clipEnabled, config.clipPosition]);

  return (
    <group rotation={[0, 0, 0]}>
      <Blade
        blade={blade}
        clipEnabled={config.clipEnabled}
        clipPlane={clipPlane}
      />
      <Rubber
        rubber={forehandRubber}
        spongeThickness={config.forehandSponge}
        side="forehand"
        bladeThickness={blade.thickness}
        clipEnabled={config.clipEnabled}
        clipPlane={clipPlane}
      />
      <Rubber
        rubber={backhandRubber}
        spongeThickness={config.backhandSponge}
        side="backhand"
        bladeThickness={blade.thickness}
        clipEnabled={config.clipEnabled}
        clipPlane={clipPlane}
      />
      <Handle
        color={config.handleColor}
        clipEnabled={config.clipEnabled}
        clipPlane={clipPlane}
      />
      <Decal
        logoUrl={config.logoUrl}
        clipEnabled={config.clipEnabled}
        clipPlane={clipPlane}
      />
    </group>
  );
}
