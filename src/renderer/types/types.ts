export interface Filter {
  name: string;
  importedFrom?: string;
  description?: string;
  rules: Rule[];
}

export enum RuleColor {
  White,
  Red,
  Green,
  Blue,
  Brown,
  Yellow,
  Cyan,
  Grey,
  Orange,
  Pink,
  Purple,  
  WhiteSolid,
  RedSolid,
  GreenSolid,
  BlueSolid,
  BrownSolid,
  YellowSolid,
  CyanSolid,
  GreySolid,
  OrangeSolid,
  PinkSolid,
  PurpleSolid
} 

export enum MinimapIcon {
  Circle = 'Circle',
  Diamond = 'Diamond',
  Hexagon = 'Hexagon',
  Square = 'Square',
  Star = 'Star',
  Triangle = 'Triangle',
  Cross = 'Cross',
  Moon = 'Moon',
  Raindrop = 'Raindrop',
  Kite = 'Kite',
  Pentagon = 'Pentagon',
  UpsideDownHouse = 'UpsideDownHouse'
} 

export enum SoundEffect {
  Dodoosh = 1,
  Gong = 2,
  Gonger = 3,
  Weeoow = 4,
  Shweeoow = 5,
  Seeof = 6,
  Ominous = 7,
  OminousHarsh = 8,
  Ominousish = 9,
  Anvil = 10,
  Bang = 11,
  Dong = 12,
  Sheesh = 13,
  OminousDistant = 14,
  RollingSymbol = 15,
  Doof = 16
}

export interface Rule {
  action: 'Show' | 'Hide' | 'Recolor';
  color?: RuleColor;
  isEmphasized: boolean;
  hasMapIcon: boolean;
  mapIcon?: string;
  hasSoundEffect?: boolean;
  soundEffect?: number;
  hasBeamEffect?: boolean;
  name: string;
  hasAreaLevelDependency: boolean;
  areaLevel?: number;
  conditions: Condition[];
}

export type ConditionType = 'Rarity' | 'ItemType' | 'ItemLevel' | 'Quality' | 'Corrupted' | 'Mirrored' | 'WaystoneTier' | 'StackableSize';
export type RarityType = 'Normal' | 'Magic' | 'Rare' | 'Unique';

export interface Condition {
  type: ConditionType;

  rarities: RarityType[];
  itemLevel: ConditionItemLevel;
  itemTypes: ConditionItemType[];  
  quality: ConditionQuality;
  corrupted: ConditionCorrupted;
  mirrored: ConditionMirrored;
  waystoneTier: ConditionWaystoneTier;
  stackableSize: ConditionStackableSize;
}

export interface ConditionItemLevel {
  type: '=' | '>' | '<';
  value: number;
}

export interface ConditionItemType {
  type: 'class' | 'defense' | 'basetype';
  value: string;
}

export interface ConditionQuality {
  type: '=' | '>' | '<';
  value: number;
}

export interface ConditionCorrupted {
  value: boolean;
}

export interface ConditionMirrored {
  value: boolean;
}

export interface ConditionWaystoneTier {
  type: '=' | '>' | '<';
  value: number;
}

export interface ConditionStackableSize {
  type: '=' | '>' | '<';
  value: number;
}