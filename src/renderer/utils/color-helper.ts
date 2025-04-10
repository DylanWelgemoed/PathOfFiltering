import { RuleColor } from '../types/types';

export class ColorHelper {

  static getRuleColor(textColor: string, backgroundColor: string): RuleColor {
    // Check for solid background colors first
    const solidBackgroundMap: Record<string, RuleColor> = {
      '255 0 0 255': RuleColor.RedSolid,
      '0 255 0 255': RuleColor.GreenSolid,
      '0 0 255 255': RuleColor.BlueSolid,
      '255 255 0 255': RuleColor.YellowSolid,
      '128 0 128 255': RuleColor.PurpleSolid,
      '255 165 0 255': RuleColor.OrangeSolid,
      '255 192 203 255': RuleColor.PinkSolid,
      '139 69 19 255': RuleColor.BrownSolid,
      '128 128 128 255': RuleColor.GreySolid,
      '255 255 255 255': RuleColor.WhiteSolid,
      '0 255 255 255': RuleColor.CyanSolid
    };
    
    if (backgroundColor in solidBackgroundMap) {
      return solidBackgroundMap[backgroundColor];
    }
    
    // Then check text colors
    const textColorMap: Record<string, RuleColor> = {
      '255 0 0 255': RuleColor.Red,
      '0 255 0 255': RuleColor.Green,
      '0 0 255 255': RuleColor.Blue,
      '255 255 0 255': RuleColor.Yellow,
      '128 0 128 255': RuleColor.Purple,
      '255 165 0 255': RuleColor.Orange,
      '255 192 203 255': RuleColor.Pink,
      '139 69 19 255': RuleColor.Brown,
      '128 128 128 255': RuleColor.Grey,
      '255 255 255 255': RuleColor.White,
      '0 255 255 255': RuleColor.Cyan
    };
    
    return textColorMap[textColor] || RuleColor.White;
  }

  static getRuleColorName(color: RuleColor): string {
    const colorMap: Record<RuleColor, string> = {
      [RuleColor.Red]: 'Red',
      [RuleColor.Green]: 'Green',
      [RuleColor.Blue]: 'Blue',
      [RuleColor.Yellow]: 'Yellow',
      [RuleColor.Purple]: 'Purple',
      [RuleColor.Orange]: 'Orange',
      [RuleColor.Pink]: 'Pink',
      [RuleColor.Brown]: 'Brown',
      [RuleColor.Grey]: 'Grey',
      [RuleColor.White]: 'White',
      [RuleColor.Cyan]: 'Cyan',
      [RuleColor.RedSolid]: 'Red',
      [RuleColor.GreenSolid]: 'Green',
      [RuleColor.BlueSolid]: 'Blue',
      [RuleColor.YellowSolid]: 'Yellow',
      [RuleColor.PurpleSolid]: 'Purple',
      [RuleColor.OrangeSolid]: 'Orange',
      [RuleColor.PinkSolid]: 'Pink',
      [RuleColor.BrownSolid]: 'Brown',
      [RuleColor.GreySolid]: 'Grey',
      [RuleColor.WhiteSolid]: 'White',
      [RuleColor.CyanSolid]: 'Cyan'
    };
    
    return colorMap[color] || "White";
  }

  static getTextColor(color: RuleColor): string {
    switch (color) {
      case RuleColor.Red:
        return '255 0 0 255';
      case RuleColor.Green:
        return '0 255 0 255';
      case RuleColor.Blue:
        return '0 0 255 255';
      case RuleColor.Yellow:
        return '255 255 0 255';
      case RuleColor.Purple:
        return '128 0 128 255';
      case RuleColor.Orange:
        return '255 165 0 255';
      case RuleColor.Pink:
        return '255 192 203 255';
      case RuleColor.Brown:
        return '139 69 19 255';
      case RuleColor.Grey:
        return '128 128 128 255';
      case RuleColor.White:  
        return '255 255 255 255';
      case RuleColor.Cyan:
        return '0 255 255 255';
    }

    return '0 0 0 255';
  }

  static getBorderColor(color: RuleColor): string {
    return ColorHelper.getTextColor(color);
  }

  static getBackgroundColor(color: RuleColor): string {
    switch (color) {
      case RuleColor.RedSolid:
        return '255 0 0 255';
      case RuleColor.GreenSolid:
        return '0 255 0 255';
      case RuleColor.BlueSolid:
        return '0 0 255 255';
      case RuleColor.YellowSolid:
        return '255 255 0 255';
      case RuleColor.PurpleSolid:
        return '128 0 128 255';
      case RuleColor.OrangeSolid:
        return '255 165 0 255';
      case RuleColor.PinkSolid:
        return '255 192 203 255';
      case RuleColor.BrownSolid:
        return '139 69 19 255';
      case RuleColor.GreySolid:
        return '128 128 128 255';
      case RuleColor.WhiteSolid:
        return '255 255 255 255';
      case RuleColor.CyanSolid:
        return '0 255 255 255';
    }

    return '255 255 255 40';
  }

  static getTextColorClassName(color: RuleColor): string {
    switch (color) {
      case RuleColor.Red:
        return 'text-poe-red';
      case RuleColor.Green:
        return 'text-poe-green';
      case RuleColor.Blue:
        return 'text-poe-blue';
      case RuleColor.Yellow:
        return 'text-poe-yellow';
      case RuleColor.Purple:
        return 'text-poe-purple';
      case RuleColor.Orange:
        return 'text-poe-orange';
      case RuleColor.Pink:
        return 'text-poe-pink';
      case RuleColor.Brown:
        return 'text-poe-brown';
      case RuleColor.Grey:
        return 'text-poe-grey';
      case RuleColor.White:
        return 'text-poe-white';
      case RuleColor.Cyan:
        return 'text-poe-cyan';
    }

    return 'text-black';
  }

  static getBorderColorClassName(color: RuleColor): string {
    switch (color) {
      case RuleColor.Red:
        return 'border-poe-red';
      case RuleColor.Green:
        return 'border-poe-green';
      case RuleColor.Blue:
        return 'border-poe-blue';
      case RuleColor.Yellow:
        return 'border-poe-yellow';
      case RuleColor.Purple:
        return 'border-poe-purple';
      case RuleColor.Orange:
        return 'border-poe-orange';
      case RuleColor.Pink:
        return 'border-poe-pink';
      case RuleColor.Brown:
        return 'border-poe-brown';
      case RuleColor.Grey:
        return 'border-poe-grey';
      case RuleColor.White:
        return 'border-poe-white';
      case RuleColor.Cyan:
        return 'border-poe-cyan';
    }

    return 'border-black';
  }

  static getBackgroundColorClassName(color: RuleColor): string {
    switch (color) {
      case RuleColor.RedSolid:
        return 'bg-poe-red';
      case RuleColor.GreenSolid:
        return 'bg-poe-green';
      case RuleColor.BlueSolid:
        return 'bg-poe-blue';
      case RuleColor.YellowSolid:
        return 'bg-poe-yellow';
      case RuleColor.PurpleSolid:
        return 'bg-poe-purple';
      case RuleColor.OrangeSolid:
        return 'bg-poe-orange';
      case RuleColor.PinkSolid:
        return 'bg-poe-pink';
      case RuleColor.BrownSolid:
        return 'bg-poe-brown';
      case RuleColor.GreySolid:
        return 'bg-poe-grey';
      case RuleColor.WhiteSolid:
        return 'bg-poe-white';
      case RuleColor.CyanSolid:
        return 'bg-poe-cyan';
    }

    return 'bg-poe-white-transparent';
  }
}
