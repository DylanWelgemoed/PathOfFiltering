// Armours
import helmetData from './armours/helmet.json';
import bodyArmourData from './armours/bodyArmour.json';
import gloveData from './armours/glove.json';
import bootData from './armours/boot.json';

// Jewellery
import beltData from './jewellery/belt.json';
import ringData from './jewellery/ring.json';
import amuletData from './jewellery/amulet.json';

// Offhands
import quiverData from './offhands/quivers.json';
import fociData from './offhands/focis.json';
import shieldData from './offhands/shields.json';
import bucklerData from './offhands/bucklers.json';

// Two Handed Weapons
import bowsData from './twoHandedWeapons/bows.json';
import crossbowsData from './twoHandedWeapons/crossbows.json';
import queaterstavesData from './twoHandedWeapons/quarterstaves.json';
import stavesData from './twoHandedWeapons/staves.json';
import twohandmacesData from './twoHandedWeapons/twoHandMaces.json';

// One Handed Weapons
import wandsData from './oneHandedWeapons/wands.json';
import onehandmacesData from './oneHandedWeapons/oneHandMaces.json';
import sceptresData from './oneHandedWeapons/sceptres.json';
import spearsData from './oneHandedWeapons/spears.json';

// Flasks
import lifeFlasksData from './flasks/lifeFlasks.json';
import manaFlasksData from './flasks/manaFlasks.json';
import charmsData from './flasks/charms.json';

// Currency
import stackableCurrencyData from './currency/stackableCurrency.json';
import distilledEmotionsData from './currency/distilledEmotions.json';
import essenceData from './currency/essence.json';
import splinterData from './currency/splinter.json';
import catalystsData from './currency/catalysts.json';

// Other
import skillGemsData from './other/skillGems.json';
import socketableData from './other/socketable.json';
import omenData from './other/omen.json';

import tabletData from './other/tablet.json';
import waystonesData from './other/waystones.json';

import relicsData from './other/relics.json';

import trialCoinsData from './other/trialCoins.json';
import inscribedUltimatumData from './other/inscribedUltimatum.json';
import pinnacleKeysData from './other/pinnacleKeys.json';
import expeditionLogbookData from './other/expeditionLogbook.json';




// Define the item type interface
export interface ItemType {
  class: string;
  baseType: string;
  defenceType?: string;
  requirements?: string;
  stats: string[];
}

export interface ItemCategory {
  category: string;
  classes: ItemClass[];
}

export interface ItemClass {
  class: string;
  classNameOverride?: string;
  types: ItemType[];
}

// Initialize arrays with proper typing

// Armours
const helmetTypes: ItemType[] = Array.isArray(helmetData) ? helmetData : [];
const bodyArmourTypes: ItemType[] = Array.isArray(bodyArmourData) ? bodyArmourData : [];
const gloveTypes: ItemType[] = Array.isArray(gloveData) ? gloveData : [];
const bootTypes: ItemType[] = Array.isArray(bootData) ? bootData : [];

// Jewellery
const beltTypes: ItemType[] = Array.isArray(beltData) ? beltData : [];
const ringTypes: ItemType[] = Array.isArray(ringData) ? ringData : [];
const amuletTypes: ItemType[] = Array.isArray(amuletData) ? amuletData : [];

// Offhands
const quiverTypes: ItemType[] = Array.isArray(quiverData) ? quiverData : [];
const fociTypes: ItemType[] = Array.isArray(fociData) ? fociData : [];
const shieldTypes: ItemType[] = Array.isArray(shieldData) ? shieldData : [];
const bucklerTypes: ItemType[] = Array.isArray(bucklerData) ? bucklerData : [];

// Two Handed Weapons
const bowsTypes: ItemType[] = Array.isArray(bowsData) ? bowsData : [];
const crossbowsTypes: ItemType[] = Array.isArray(crossbowsData) ? crossbowsData : [];
const queaterstavesTypes: ItemType[] = Array.isArray(queaterstavesData) ? queaterstavesData : [];
const stavesTypes: ItemType[] = Array.isArray(stavesData) ? stavesData : [];
const twohandmacesTypes: ItemType[] = Array.isArray(twohandmacesData) ? twohandmacesData : [];

// One Handed Weapons
const onehandmacesTypes: ItemType[] = Array.isArray(onehandmacesData) ? onehandmacesData : [];
const sceptresTypes: ItemType[] = Array.isArray(sceptresData) ? sceptresData : [];
const spearsTypes: ItemType[] = Array.isArray(spearsData) ? spearsData : [];
const wandsTypes: ItemType[] = Array.isArray(wandsData) ? wandsData : [];

// Flasks
const lifeFlasksTypes: ItemType[] = Array.isArray(lifeFlasksData) ? lifeFlasksData : [];
const manaFlasksTypes: ItemType[] = Array.isArray(manaFlasksData) ? manaFlasksData : [];
const charmsTypes: ItemType[] = Array.isArray(charmsData) ? charmsData : [];

// Currency
const stackableCurrencyTypes: ItemType[] = Array.isArray(stackableCurrencyData) ? stackableCurrencyData : [];
const distilledEmotionsTypes: ItemType[] = Array.isArray(distilledEmotionsData) ? distilledEmotionsData : [];
const essenceTypes: ItemType[] = Array.isArray(essenceData) ? essenceData : [];
const splinterTypes: ItemType[] = Array.isArray(splinterData) ? splinterData : [];
const catalystsTypes: ItemType[] = Array.isArray(catalystsData) ? catalystsData : [];

// Other
const skillGemsTypes: ItemType[] = Array.isArray(skillGemsData) ? skillGemsData : [];
const socketableTypes: ItemType[] = Array.isArray(socketableData) ? socketableData : [];
const omenTypes: ItemType[] = Array.isArray(omenData) ? omenData : [];
const tabletTypes: ItemType[] = Array.isArray(tabletData) ? tabletData : [];
const waystonesTypes: ItemType[] = Array.isArray(waystonesData) ? waystonesData : [];
const relicsTypes: ItemType[] = Array.isArray(relicsData) ? relicsData : [];
const trialCoinsTypes: ItemType[] = Array.isArray(trialCoinsData) ? trialCoinsData : [];
const inscribedUltimatumTypes: ItemType[] = Array.isArray(inscribedUltimatumData) ? inscribedUltimatumData : [];
const pinnacleKeysTypes: ItemType[] = Array.isArray(pinnacleKeysData) ? pinnacleKeysData : [];
const expeditionLogbookTypes: ItemType[] = Array.isArray(expeditionLogbookData) ? expeditionLogbookData : [];


// Combine all item data into a single array
export const allItemTypes: ItemCategory[] = [
  {
    category: 'Armours',
    classes: [{class: 'Helmets', types: helmetTypes}, {class: 'Body Armours', types: bodyArmourTypes}, {class: 'Gloves', types: gloveTypes}, {class: 'Boots', types: bootTypes}]
  },
  {
    category: 'Jewellery',
    classes: [{class: 'Belts', types: beltTypes}, {class: 'Rings', types: ringTypes}, {class: 'Amulets', types: amuletTypes}]
  },
  {
    category: 'Offhands',
    classes: [{class: 'Quivers', types: quiverTypes}, {class: 'Foci', types: fociTypes}, {class: 'Shields', types: shieldTypes}, {class: 'Bucklers', types: bucklerTypes}]
  },
  {
    category: 'Two-Handed Weapons',
    classes: [{class: 'Bows', types: bowsTypes}, {class: 'Crossbows', types: crossbowsTypes}, {class: 'Quarterstaves', types: queaterstavesTypes}, {class: 'Staves', types: stavesTypes}, {class: 'Two Handed Maces', types: twohandmacesTypes}]
  },
  {
    category: 'One-Handed Weapons',
    classes: [{class: 'Spears', types: spearsTypes}, {class: 'Wands', types: wandsTypes}, {class: 'Sceptres', types: sceptresTypes}, {class: 'One Handed Maces', types: onehandmacesTypes}]
  },
  {
    category: 'Flasks',
    classes: [{class: 'Life Flasks', types: lifeFlasksTypes}, {class: 'Mana Flasks', types: manaFlasksTypes}, {class: 'Charms', types: charmsTypes}]
  },
  {
    category: 'Currency',
    classes: [{class: 'Stackable Currency', types: stackableCurrencyTypes}, {class: 'Stackable Currency', classNameOverride: 'Distilled Emotions', types: distilledEmotionsTypes}, {class: 'Stackable Currency', classNameOverride: 'Essence', types: essenceTypes}, {class: 'Stackable Currency', classNameOverride: 'Splinter', types: splinterTypes}, {class: 'Stackable Currency', classNameOverride: 'Catalysts', types: catalystsTypes}]
  },
  {
    category: 'Other',
    classes: [{class: 'Skill Gems', types: skillGemsTypes}, {class: 'Socketable', types: socketableTypes}, {class: 'Omen', types: omenTypes}, {class: 'Tablet', types: tabletTypes}, {class: 'Waystones', types: waystonesTypes}, {class: 'Relics', types: relicsTypes}, {class: 'Trial Coins', types: trialCoinsTypes}, {class: 'Inscribed Ultimatum', types: inscribedUltimatumTypes}, {class: 'Pinnacle Keys', types: pinnacleKeysTypes}, {class: 'Expedition Logbook', types: expeditionLogbookTypes}]
  }
];

// Export individual item type arrays for specific use cases
export { helmetTypes, bodyArmourTypes, gloveTypes, bootTypes, beltTypes, ringTypes, amuletTypes };

