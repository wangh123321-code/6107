import { create } from 'zustand';
import type { RacketConfig, RacketParams } from '@/types';
import { BLADES, getBladeById } from '@/data/blades';
import { RUBBERS, getRubberById } from '@/data/rubbers';
import { calculateRacketParams } from '@/utils/calcParams';

interface RacketState {
  config: RacketConfig;
  params: RacketParams;
  setBlade: (bladeId: string) => void;
  setForehandRubber: (rubberId: string) => void;
  setBackhandRubber: (rubberId: string) => void;
  setForehandSponge: (thickness: number) => void;
  setBackhandSponge: (thickness: number) => void;
  setHandleColor: (color: string) => void;
  setLogoUrl: (url: string | null) => void;
  setClipEnabled: (enabled: boolean) => void;
  setClipPosition: (position: number) => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: RacketConfig = {
  bladeId: 'wood-1',
  forehandRubberId: 'sticky-1',
  backhandRubberId: 'non-sticky-3',
  forehandSponge: 2.15,
  backhandSponge: 2.0,
  handleColor: '#1a1a1a',
  logoUrl: null,
  clipEnabled: false,
  clipPosition: 0.5,
};

function computeParams(config: RacketConfig): RacketParams {
  const blade = getBladeById(config.bladeId);
  const forehand = getRubberById(config.forehandRubberId);
  const backhand = getRubberById(config.backhandRubberId);

  if (!blade || !forehand || !backhand) {
    return { speed: 50, spin: 50, control: 50, elasticity: 50, weight: 150 };
  }

  return calculateRacketParams(
    blade,
    forehand,
    backhand,
    config.forehandSponge,
    config.backhandSponge,
  );
}

export const useRacketStore = create<RacketState>((set, get) => {
  const initialParams = computeParams(DEFAULT_CONFIG);

  return {
    config: DEFAULT_CONFIG,
    params: initialParams,

    setBlade: (bladeId: string) => {
      const blade = getBladeById(bladeId);
      if (!blade) return;
      set((state) => {
        const newConfig = { ...state.config, bladeId };
        return {
          config: newConfig,
          params: computeParams(newConfig),
        };
      });
    },

    setForehandRubber: (rubberId: string) => {
      const rubber = getRubberById(rubberId);
      if (!rubber) return;
      set((state) => {
        const sponge = rubber.spongeThickness.includes(state.config.forehandSponge)
          ? state.config.forehandSponge
          : rubber.spongeThickness[
              Math.floor(rubber.spongeThickness.length / 2)
            ];
        const newConfig = {
          ...state.config,
          forehandRubberId: rubberId,
          forehandSponge: sponge,
        };
        return {
          config: newConfig,
          params: computeParams(newConfig),
        };
      });
    },

    setBackhandRubber: (rubberId: string) => {
      const rubber = getRubberById(rubberId);
      if (!rubber) return;
      set((state) => {
        const sponge = rubber.spongeThickness.includes(state.config.backhandSponge)
          ? state.config.backhandSponge
          : rubber.spongeThickness[
              Math.floor(rubber.spongeThickness.length / 2)
            ];
        const newConfig = {
          ...state.config,
          backhandRubberId: rubberId,
          backhandSponge: sponge,
        };
        return {
          config: newConfig,
          params: computeParams(newConfig),
        };
      });
    },

    setForehandSponge: (thickness: number) => {
      set((state) => {
        const newConfig = { ...state.config, forehandSponge: thickness };
        return {
          config: newConfig,
          params: computeParams(newConfig),
        };
      });
    },

    setBackhandSponge: (thickness: number) => {
      set((state) => {
        const newConfig = { ...state.config, backhandSponge: thickness };
        return {
          config: newConfig,
          params: computeParams(newConfig),
        };
      });
    },

    setHandleColor: (color: string) => {
      set((state) => ({
        config: { ...state.config, handleColor: color },
      }));
    },

    setLogoUrl: (url: string | null) => {
      set((state) => ({
        config: { ...state.config, logoUrl: url },
      }));
    },

    setClipEnabled: (enabled: boolean) => {
      set((state) => ({
        config: { ...state.config, clipEnabled: enabled },
      }));
    },

    setClipPosition: (position: number) => {
      set((state) => ({
        config: { ...state.config, clipPosition: position },
      }));
    },

    resetConfig: () => {
      set({
        config: DEFAULT_CONFIG,
        params: computeParams(DEFAULT_CONFIG),
      });
    },
  };
});

export { BLADES, RUBBERS };
