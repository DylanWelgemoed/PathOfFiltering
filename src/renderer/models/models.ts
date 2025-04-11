import { Filter, Rule, RuleColor, Condition, ConditionType, ConditionItemType, RarityType, ConditionItemLevel, ConditionQuality, ConditionCorrupted, ConditionMirrored, ConditionWaystoneTier, ConditionStackableSize, ConditionSockets } from '../types/types';
import { ColorHelper } from '../utils/color-helper';

export class ConditionModel implements Condition {
  type: ConditionType;
  rarities: RarityType[];
  itemLevel: ConditionItemLevel;
  itemTypes: ConditionItemType[];
  quality: ConditionQuality;
  corrupted: ConditionCorrupted;
  mirrored: ConditionMirrored;
  waystoneTier: ConditionWaystoneTier;
  stackableSize: ConditionStackableSize;
  sockets: ConditionSockets;

  constructor(
    type: ConditionType, 
    rarities: RarityType[], 
    itemLevel: ConditionItemLevel, 
    itemTypes: ConditionItemType[],
    quality: ConditionQuality = { type: '=', value: 0 },
    corrupted: ConditionCorrupted = { value: false },
    mirrored: ConditionMirrored = { value: false },
    waystoneTier: ConditionWaystoneTier = { type: '=', value: 0 },
    stackableSize: ConditionStackableSize = { type: '=', value: 0 },
    sockets: ConditionSockets = { type: '=', value: 0 }
  ) {
    this.type = type;
    this.rarities = rarities;
    this.itemLevel = itemLevel;
    this.itemTypes = itemTypes;
    this.quality = quality;
    this.corrupted = corrupted;
    this.mirrored = mirrored;
    this.waystoneTier = waystoneTier;
    this.stackableSize = stackableSize;
    this.sockets = sockets;
  }

  setType(type: ConditionType): void {
    this.type = type;
  }

  clone(): ConditionModel {
    return new ConditionModel(
      this.type, 
      this.rarities, 
      this.itemLevel, 
      this.itemTypes,
      this.quality,
      this.corrupted,
      this.mirrored,
      this.waystoneTier,
      this.stackableSize,
      this.sockets
    );
  }
}

export class RuleModel implements Rule {
  action: 'Show' | 'Hide' | 'Recolor';
  color?: RuleColor;
  isEmphasized: boolean;
  hasMapIcon: boolean;
  mapIcon?: string;
  name: string;
  hasAreaLevelDependency: boolean;
  areaLevel?: number;
  conditions: Condition[];
  hasSoundEffect: boolean;
  soundEffect?: number;
  hasBeamEffect: boolean;

  constructor(
    action: 'Show' | 'Hide' | 'Recolor', 
    name: string, 
    color?: RuleColor,
    isEmphasized: boolean = false,
    hasMapIcon: boolean = false,
    mapIcon?: string,
    hasAreaLevelDependency: boolean = false,
    areaLevel?: number,
    conditions: Condition[] = [],
    hasSoundEffect: boolean = false,
    soundEffect?: number,
    hasBeamEffect: boolean = false
  ) {
    this.action = action;
    this.name = name;
    this.color = color;
    this.isEmphasized = isEmphasized;
    this.hasMapIcon = hasMapIcon;
    this.mapIcon = mapIcon;
    this.hasAreaLevelDependency = hasAreaLevelDependency;
    this.areaLevel = areaLevel;
    this.conditions = conditions;
    this.hasSoundEffect = hasSoundEffect;
    this.soundEffect = soundEffect;
    this.hasBeamEffect = hasBeamEffect;
  }

  setColor(color: RuleColor): void {
    if (this.action === 'Recolor') {
      this.color = color;
    }
  }

  setAction(action: 'Show' | 'Hide' | 'Recolor'): void {
    this.action = action;
    // If changing to recolor and no color is set, use the default color
    if (action === 'Recolor' && !this.color) {
      this.color = RuleColor.White;
    }
  }

  setContent(name: string): void {
    this.name = name;
  }

  setAreaLevelDependency(enabled: boolean, level?: number): void {
    this.hasAreaLevelDependency = enabled;
    this.areaLevel = enabled ? level : undefined;
  }

  addCondition(type: ConditionType, rarities: RarityType[], itemLevel: ConditionItemLevel, itemTypes: ConditionItemType[], quality: ConditionQuality, corrupted: ConditionCorrupted, mirrored: ConditionMirrored, waystoneTier: ConditionWaystoneTier, stackableSize: ConditionStackableSize): void {
    this.conditions.push(new ConditionModel(type, rarities, itemLevel, itemTypes, quality, corrupted, mirrored, waystoneTier, stackableSize));
  }

  removeCondition(index: number): void {
    if (index >= 0 && index < this.conditions.length) {
      this.conditions.splice(index, 1);
    }
  }

  updateCondition(index: number, type: ConditionType, rarities: RarityType[], itemLevel: ConditionItemLevel, itemTypes: ConditionItemType[], quality: ConditionQuality, corrupted: ConditionCorrupted, mirrored: ConditionMirrored, waystoneTier: ConditionWaystoneTier, stackableSize: ConditionStackableSize): void {
    if (index >= 0 && index < this.conditions.length) {
      this.conditions[index] = new ConditionModel(type, rarities, itemLevel, itemTypes, quality, corrupted, mirrored, waystoneTier, stackableSize);
    }
  }

  clone(): RuleModel {
    return new RuleModel(
      this.action, 
      this.name, 
      this.color,
      this.isEmphasized,
      this.hasMapIcon,
      this.mapIcon,
      this.hasAreaLevelDependency,
      this.areaLevel,
      this.conditions.map(condition => {
        if (condition instanceof ConditionModel) {
          return condition.clone();
        }
        return new ConditionModel(condition.type, condition.rarities, condition.itemLevel, condition.itemTypes);
      }),
      this.hasSoundEffect,
      this.soundEffect,
      this.hasBeamEffect
    );
  }

  static fromString(data: string): RuleModel[] {
    // Check if data is defined before splitting
    const lines = data ? data.split('\n') : [];

    const rules: RuleModel[] = [];

    try {
      for (let i = 0; i < lines.length; i++) {
        let currentRule: RuleModel | null = null;

        const line = lines[i].trim();

        let action: 'Show' | 'Hide' | 'Recolor' = 'Hide';
        let ruleName = "";
        let actionFound = false;

        // Get Action and Rule Name
        if (line === 'Show') {
          const actionRuleNameSplit = lines[i-1].replace('# ', '').trim().split(' - ');
          action = actionRuleNameSplit[0] as 'Show' | 'Hide' | 'Recolor';
          ruleName = actionRuleNameSplit[1];
          actionFound = true;
        } else if (line === 'Hide') {
          ruleName = lines[i-1].replace('# Hide - ', '').trim();
          actionFound = true;
        }

        // If we didn't find an action, skip this line
        if (!actionFound) {
          continue;
        }
        
        // Find the end of the rule block (marked by double newline or end of file)
        let endIndex = i;
        while (endIndex < lines.length - 1) {
          if (lines[endIndex] === '') {
            break;
          }
          endIndex++;
        }

        const ruleBlock = lines.slice(i, endIndex + 1);

        // Get Recolor Settings
        let isEmphasized = false;
        let hasMapIcon = false;
        let mapIcon = '';
        let color: RuleColor = RuleColor.White;

        if (action === 'Recolor') {
          // Extract color information from the rule block
          let textColor = '';
          let borderColor = '';
          let backgroundColor = '';

          for (const ruleLine of ruleBlock) {
            const trimmedLine = ruleLine.trim();
            if (trimmedLine.startsWith('SetTextColor')) {
              textColor = trimmedLine.replace('SetTextColor', '').trim();
            } else if (trimmedLine.startsWith('SetBorderColor')) {
              borderColor = trimmedLine.replace('SetBorderColor', '').trim();
            } else if (trimmedLine.startsWith('SetBackgroundColor')) {
              backgroundColor = trimmedLine.replace('SetBackgroundColor', '').trim();
            } else if (trimmedLine.startsWith('SetFontSize')) {
              const fontSize = parseInt(trimmedLine.replace('SetFontSize', '').trim());
              isEmphasized = fontSize >= 32;
            } else if (trimmedLine.startsWith('MinimapIcon')) {
              hasMapIcon = true;
              // Extract the map icon type from the line (format: MinimapIcon 1 Color IconType)
              const parts = trimmedLine.split(' ');
              if (parts.length >= 4) {
                mapIcon = parts[3];
              }
            }
          }
          
          // Determine the color based on the extracted values
          color = ColorHelper.getRuleColor(textColor, backgroundColor);
        }

        // Get Area Level Dependency
        let hasAreaLevelDependency = false;
        let areaLevel = 0;

        if (ruleBlock.some(line => line.includes('AreaLevel'))) {
          hasAreaLevelDependency = true;
          areaLevel = parseInt(ruleBlock.find(line => line.includes('AreaLevel'))?.replace('AreaLevel >= ', '').trim() || '0');
        }

        // Get Sound Effect
        let hasSoundEffect = false;
        let soundEffect = 0;

        if (ruleBlock.some(line => line.includes('PlayAlertSound'))) {
          hasSoundEffect = true;
          soundEffect = parseInt(ruleBlock.find(line => line.includes('PlayAlertSound'))?.replace('PlayAlertSound ', '').trim() || '0');
        }

        // Get Beam Effect
        let hasBeamEffect = false;

        if (ruleBlock.some(line => line.includes('PlayEffect'))) {
          hasBeamEffect = true;
        }

        // Get Conditions
        const conditions: Condition[] = [];
        const itemTypes: ConditionItemType[] = [];

        for (const line of ruleBlock) {
          if (line.includes('Rarity')) {
            const rarities = line.replace('Rarity ', '').trim().split(' ');
            conditions.push(new ConditionModel(
              'Rarity', 
              rarities.map(rarity => rarity as RarityType), 
              { type: '=', value: 0 }, 
              [],
              { type: '=', value: 0 },
              { value: false },
              { value: false },
              { type: '=', value: 0 },
              { type: '=', value: 0 }
            ));
          }

          if (line.includes('ItemLevel')) {
            const itemLevel = line.replace('ItemLevel ', '').trim().split(' ');
            conditions.push(new ConditionModel(
              'ItemLevel', 
              [], 
              { type: itemLevel[0] as '=' | '>' | '<', value: parseInt(itemLevel[1]) }, 
              [],
              { type: '=', value: 0 },
              { value: false },
              { value: false },
              { type: '=', value: 0 },
              { type: '=', value: 0 }
            ));
          }

          if (line.includes('Class') || line.includes('BaseType')) {
            const itemType = line.replace('Class ', '').replace('BaseType ', '').trim();
            itemTypes.push({ type: line.includes('Class') ? 'class' : 'basetype', value: itemType });
          }

          if (line.includes('Quality')) {
            const quality = line.replace('Quality ', '').trim().split(' ');
            conditions.push(new ConditionModel('Quality', [], { type: quality[0] as '=' | '>' | '<', value: parseInt(quality[1]) }, [], { type: quality[0] as '=' | '>' | '<', value: parseInt(quality[1]) }, { value: false }, { value: false }, { type: '=', value: 0 }, { type: '=', value: 0 }));
          }

          if (line.includes('Corrupted')) {
            const corrupted = line.replace('Corrupted ', '').trim();
            conditions.push(new ConditionModel('Corrupted', [], { type: '=', value: 0 }, [], { type: '=', value: 0 }, { value: corrupted.includes("True") }, { value: false }, { type: '=', value: 0 }, { type: '=', value: 0 }));
          }

          if (line.includes('Mirrored')) {
            const mirrored = line.replace('Mirrored ', '').trim();
            conditions.push(new ConditionModel('Mirrored', [], { type: '=', value: 0 }, [], { type: '=', value: 0 }, { value: false }, { value: mirrored.includes("True") }, { type: '=', value: 0 }, { type: '=', value: 0 }));
          }

          if (line.includes('WaystoneTier')) {
            const waystoneTier = line.replace('WaystoneTier ', '').trim().split(' ');
            conditions.push(new ConditionModel('WaystoneTier', [], { type: waystoneTier[0] as '=' | '>' | '<', value: parseInt(waystoneTier[1]) }, [], { type: '=', value: 0 }, { value: false }, { value: false }, { type: waystoneTier[0] as '=' | '>' | '<', value: parseInt(waystoneTier[1]) }, { type: '=', value: 0 }));
          }

          if (line.includes('StackSize')) {
            const stackableSize = line.replace('StackSize ', '').trim().split(' ');
            conditions.push(new ConditionModel('StackableSize', [], { type: stackableSize[0] as '=' | '>' | '<', value: parseInt(stackableSize[1]) }, [], { type: '=', value: 0 }, { value: false }, { value: false }, { type: '=', value: 0 }, { type: stackableSize[0] as '=' | '>' | '<', value: parseInt(stackableSize[1]) }));
          }

          if (line.includes('Sockets')) {
            const sockets = line.replace('Sockets ', '').trim().split(' ');
            conditions.push(new ConditionModel('Sockets', [], { type: sockets[0] as '=' | '>' | '<', value: parseInt(sockets[1]) }, [], { type: '=', value: 0 }, { value: false }, { value: false }, { type: '=', value: 0 }, { type: '=', value: 0 }, { type: sockets[0] as '=' | '>' | '<', value: parseInt(sockets[1]) }));
          }
        }

        if (itemTypes.length > 0) {
          conditions.push(new ConditionModel(
            'ItemType', 
            [], 
            { type: '=', value: 0 }, 
            itemTypes,
            { type: '=', value: 0 },
            { value: false },
            { value: false },
            { type: '=', value: 0 },
            { type: '=', value: 0 }
          ));
        }

        currentRule = new RuleModel(action, ruleName, color, isEmphasized, hasMapIcon, mapIcon, hasAreaLevelDependency, areaLevel, conditions, false, undefined, false);
        rules.push(currentRule);
      }
    }
    catch (error) {
      console.error('Error parsing filter:', error);
    }
    
    return rules;
  }

  toString() {
    let string = '';
    string += `# ${this.action} - ${this.name} \n`;

    string += `${this.action  === 'Recolor' ? "Show" : this.action} \n`;

    if (this.action === 'Recolor') {
      string += `\tSetTextColor ${ColorHelper.getTextColor(this.color as RuleColor)} \n`;
      string += `\tSetBorderColor ${ColorHelper.getBorderColor(this.color as RuleColor)} \n`;
      string += `\tSetBackgroundColor ${ColorHelper.getBackgroundColor(this.color as RuleColor)} \n`;
    }

    if (this.isEmphasized) {
      string += `\tSetFontSize 36 \n`;
    } else {
      string += `\tSetFontSize 30 \n`;
    }

    if (this.hasMapIcon) {
      string += `\tMinimapIcon 1 ${ColorHelper.getRuleColorName(this.color as RuleColor)} ${this.mapIcon} \n`;
    }

    if (this.hasAreaLevelDependency) {
      string += `\tAreaLevel >= ${this.areaLevel} \n`;
    }

    if (this.hasSoundEffect && this.soundEffect) {
      string += `\tPlayAlertSound ${this.soundEffect} 200 \n`;
    }

    if (this.hasBeamEffect) {
      string += `\tPlayEffect ${ColorHelper.getRuleColorName(this.color as RuleColor)}  \n`;
    }

    for (const condition of this.conditions) {
      switch (condition.type) {
        case 'Rarity':
          string += `\tRarity ${condition.rarities.map(rarity => rarity).join(' ')} \n`;
          break;
        case 'ItemLevel':
          string += `\tItemLevel ${condition.itemLevel.type} ${condition.itemLevel.value} \n`;
          break;
        case 'ItemType':
          if (condition.itemTypes.filter(itemType => itemType.type === 'class').length > 0) {
            string += `\tClass == ${condition.itemTypes.filter(itemType => itemType.type === 'class').map(itemType => `"${itemType.value}"`).join(' ')} \n`;
          }
          if (condition.itemTypes.filter(itemType => itemType.type === 'basetype').length > 0) {
            string += `\tBaseType == ${condition.itemTypes.filter(itemType => itemType.type === 'basetype').map(itemType => `"${itemType.value}"`).join(' ')} \n`;
          }
          break;
        case 'Quality':
          string += `\tQuality ${condition.quality.type} ${condition.quality.value} \n`;
          break;
        case 'Corrupted':
          string += `\tCorrupted ${condition.corrupted.value ? "True" : "False"} \n`;
          break;
        case 'Mirrored':
          string += `\tMirrored ${condition.mirrored.value ? "True" : "False"} \n`;
          break;
        case 'WaystoneTier':
          string += `\tWaystoneTier ${condition.waystoneTier.type} ${condition.waystoneTier.value} \n`;
          break;
        case 'StackableSize':
          string += `\tStackSize ${condition.stackableSize.type} ${condition.stackableSize.value} \n`;
          break;
        case 'Sockets':
          string += `\tSockets ${condition.sockets.type} ${condition.sockets.value} \n`;
          break;
      }
    }

    string += `\n`;

    return string;
  }
}

export class FilterModel implements Filter {
  name: string;
  importedFrom?: string;
  description?: string;
  lastEdited: string;
  rules: Rule[];

  constructor(name: string, importedFrom?: string, description?: string, rules: Rule[] = []) {
    this.name = name;
    this.importedFrom = importedFrom;
    this.description = description;
    this.lastEdited = new Date().toISOString();
    this.rules = rules;
  }

  addRule(rule: Rule): void {
    this.rules.unshift(rule);
    this.updateLastEdited();
  }

  removeRule(index: number): void {
    if (index >= 0 && index < this.rules.length) {
      this.rules.splice(index, 1);
      this.updateLastEdited();
    }
  }

  moveRule(fromIndex: number, toIndex: number): void {
    if (
      fromIndex >= 0 && 
      fromIndex < this.rules.length && 
      toIndex >= 0 && 
      toIndex < this.rules.length
    ) {
      const rule = this.rules[fromIndex];
      this.rules.splice(fromIndex, 1);
      this.rules.splice(toIndex, 0, rule);
      this.updateLastEdited();
    }
  }

  updateRule(index: number, updatedRule: Rule): void {
    if (index >= 0 && index < this.rules.length) {
      this.rules[index] = new RuleModel(updatedRule.action, updatedRule.name, updatedRule.color, updatedRule.isEmphasized, updatedRule.hasMapIcon, updatedRule.mapIcon, updatedRule.hasAreaLevelDependency, updatedRule.areaLevel, updatedRule.conditions, updatedRule.hasSoundEffect, updatedRule.soundEffect, updatedRule.hasBeamEffect);
      this.updateLastEdited();
    }
  }

  setName(name: string): void {
    this.name = name;
    this.updateLastEdited();
  }

  setDescription(description: string): void {
    this.description = description;
    this.updateLastEdited();
  }

  updateLastEdited(): void {
    this.lastEdited = new Date().toISOString();
  }

  clone(): FilterModel {
    return new FilterModel(
      this.name,
      this.importedFrom,
      this.description,
      this.rules.map(rule => {
        if (rule instanceof RuleModel) {
          return rule.clone();
        }
        return new RuleModel(rule.action, rule.name, rule.color);
      })
    );
  }

  static fromString(importedFrom: string, data: string): FilterModel {
    // Check if data is defined before splitting
    const lines = data ? data.split('\n') : [];
    // Default values in case we can't parse them from the file
    let name = "Imported Filter (ERROR WHEN IMPORTING)";
    let description = "";
    const rules: RuleModel[] = [];

    try {
      // Check if the file has content and contains our expected header format
      if(lines.length > 0 && lines[1].includes("# Path of Filtering - for Path of Exile 2 Loot Filter")) {
        name = lines[3].replace('# ', '').trim();
        description = lines[4].replace('# ', '').trim();
      }

      // Parse rules
      const ruleModels = RuleModel.fromString(data);
      rules.push(...ruleModels);
    }
    catch (error) {
      console.error('Error parsing filter:', error);
    }
    
    return new FilterModel(name, importedFrom, description, rules);
  }

  toString() {
    let string = ``;
    string += `#=============================================================================================================== \n`
    string += `# Path of Filtering - for Path of Exile 2 Loot Filter \n`
    string += `#=============================================================================================================== \n`

    string += `# ${this.name} \n`;
    string += `# ${this.description} \n`;
    string += `# Last Edited: ${this.lastEdited} \n`;
    string += `#=============================================================================================================== \n`;
    string += `# Rules \n`;
    string += `#=============================================================================================================== \n`;
    this.rules.forEach(rule => {
      string += `${rule.toString()} \n`;
    });
    return string;
  }
} 