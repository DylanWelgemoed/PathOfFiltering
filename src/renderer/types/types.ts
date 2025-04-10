export interface Filter {
  name: string;
  importedFrom?: string;
  description?: string;
  rules: Rule[];
}

export enum RuleColor {
  NORMAL = '#FFFFFF',
  GREEN = '#00FF00',
  BLUE = '#0000FF',
  PURPLE = '#FF00FF',
  YELLOW = '#FFFF00',
  RED = '#FF0000',
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

export interface Rule {
  action: 'Show' | 'Hide' | 'Recolor';
  color?: string;
  isEmphasized: boolean;
  hasMapIcon: boolean;
  mapIcon?: string;
  name: string;
  hasAreaLevelDependency: boolean;
  areaLevel?: number;
  conditions: Condition[];
}

export type ConditionType = 'Rarity' | 'ItemType' | 'ItemLevel';
export type RarityType = 'Normal' | 'Magic' | 'Rare' | 'Unique';

export interface Condition {
  type: ConditionType;

  rarities: RarityType[];
  itemLevel: ConditionItemLevel;
  itemTypes: ConditionItemType[];  
}

export interface ConditionItemLevel {
  type: '=' | '>' | '<';
  value: number;
}

export interface ConditionItemType {
  type: 'class' | 'defense' | 'basetype';
  value: string;
}


