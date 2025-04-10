import helmetData from './helmet.json';
import bodyArmourData from './bodyArmour.json';
import gloveData from './glove.json';
import bootData from './boot.json';
import beltData from './belt.json';
import ringData from './ring.json';
import amuletData from './amulet.json';

// Define the item type interface
export interface ItemType {
  class: string;
  baseType: string;
  defenceType?: string;
  requirements?: string;
  stats: string[];
}

// Initialize arrays with proper typing
const helmetTypes: ItemType[] = Array.isArray(helmetData) ? helmetData : [];
const bodyArmourTypes: ItemType[] = Array.isArray(bodyArmourData) ? bodyArmourData : [];
const gloveTypes: ItemType[] = Array.isArray(gloveData) ? gloveData : [];
const bootTypes: ItemType[] = Array.isArray(bootData) ? bootData : [];
const beltTypes: ItemType[] = Array.isArray(beltData) ? beltData : [];
const ringTypes: ItemType[] = Array.isArray(ringData) ? ringData : [];
const amuletTypes: ItemType[] = Array.isArray(amuletData) ? amuletData : [];

// Combine all item data into a single array
export const allItemTypes: ItemType[] = [
  ...helmetTypes,
  ...bodyArmourTypes,
  ...gloveTypes,
  ...bootTypes,
  ...beltTypes,
  ...ringTypes,
  ...amuletTypes
];

// Export individual item type arrays for specific use cases
export { helmetTypes, bodyArmourTypes, gloveTypes, bootTypes, beltTypes, ringTypes, amuletTypes };
