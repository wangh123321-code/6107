export type BladeMaterial = 'wood' | 'carbon' | 'arylate';

export type RubberType = 'sticky' | 'non-sticky';

export interface Layer {
  name: string;
  material: string;
  thickness: number;
  color: string;
}

export interface BladeModel {
  id: string;
  name: string;
  material: BladeMaterial;
  layers: number;
  thickness: number;
  weight: number;
  speed: number;
  spin: number;
  control: number;
  elasticity: number;
  layerStructure: Layer[];
  description: string;
}

export interface RubberModel {
  id: string;
  name: string;
  type: RubberType;
  spongeThickness: number[];
  spongeHardness: number;
  speed: number;
  spin: number;
  control: number;
  elasticity: number;
  weight: number;
  color: string;
  texture: string;
  description: string;
}

export interface RacketParams {
  speed: number;
  spin: number;
  control: number;
  elasticity: number;
  weight: number;
  hardness: number;
}

export interface RacketConfig {
  bladeId: string;
  forehandRubberId: string;
  backhandRubberId: string;
  forehandSponge: number;
  backhandSponge: number;
  handleColor: string;
  logoUrl: string | null;
  clipEnabled: boolean;
  clipPosition: number;
}

export type HandleColorOption = {
  name: string;
  value: string;
};

export const HANDLE_COLORS: HandleColorOption[] = [
  { name: '经典黑', value: '#1a1a1a' },
  { name: '深红木', value: '#6b2c2c' },
  { name: '原木棕', value: '#8b6914' },
  { name: '海军蓝', value: '#1e3a5f' },
  { name: '森林绿', value: '#2d5a3d' },
  { name: '炫酷紫', value: '#4a2c5c' },
];
