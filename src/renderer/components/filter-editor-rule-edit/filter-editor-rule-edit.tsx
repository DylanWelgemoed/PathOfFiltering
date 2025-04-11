import React, { useState, useEffect } from 'react';
import {
  Rule,
  RuleColor,
  ConditionType,
  MinimapIcon,
  Condition,
  RarityType,
  SoundEffect,
} from '../../types/types';
import { IoClose, IoAddOutline } from 'react-icons/io5';
import MultiSelect from '../foundation/multi-select/multi-select';
import ItemTypeSelector from '../filter-editor-rule-edit-itemType-selector/filter-editor-rule-edit-itemType-selector';
import ColorPicker from '../filter-editor-rule-edit-color-picker/filter-editor-rule-edit-color-picker';

interface FilterEditorRuleEditProps {
  rule?: Rule;
  onSave: (rule: Rule) => void;
  onCancel: () => void;
  isNewRule?: boolean;
}

const FilterEditorRuleEdit: React.FC<FilterEditorRuleEditProps> = ({
  rule,
  onSave,
  onCancel,
  isNewRule = false,
}) => {
  const [editedRule, setEditedRule] = useState<Rule>({
    action: 'Show',
    name: '',
    isEmphasized: false,
    hasMapIcon: false,
    mapIcon: '',
    hasAreaLevelDependency: false,
    conditions: [],
    hasSoundEffect: false,
    soundEffect: undefined,
    hasBeamEffect: false,
  });
  const [showItemTypeSelector, setShowItemTypeSelector] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (rule) {
      setEditedRule(rule);
    } else {
      setEditedRule({
        action: 'Show',
        name: '',
        isEmphasized: false,
        hasMapIcon: false,
        mapIcon: '',
        hasAreaLevelDependency: false,
        conditions: [],
        hasSoundEffect: false,
        soundEffect: undefined,
        hasBeamEffect: false,
      });
    }
  }, [rule]);

  const handleSave = () => {
    onSave(editedRule);
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value as 'Show' | 'Hide' | 'Recolor';
    setEditedRule((prev) => ({
      ...prev,
      action,
      color: action === 'Recolor' ? RuleColor.White : undefined,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleAreaLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setEditedRule((prev) => ({
      ...prev,
      areaLevel: isNaN(value) ? undefined : value,
    }));
  };

  const handleAreaLevelToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      hasAreaLevelDependency: e.target.checked,
      areaLevel: e.target.checked ? prev.areaLevel || 1 : undefined,
    }));
  };

  const handleMapIconToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      hasMapIcon: e.target.checked,
      mapIcon: e.target.checked ? prev.mapIcon || '' : '',
    }));
  };

  const handleMapIconChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      mapIcon: e.target.value,
    }));
  };

  const handleEmphasizeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      isEmphasized: e.target.checked,
    }));
  };

  const handleAddCondition = () => {
    const usedTypes = editedRule.conditions.map(condition => condition.type);
    const allTypes: ConditionType[] = [
      'Rarity',
      'ItemType',
      'ItemLevel',
      'Quality',
      'Corrupted',
      'Mirrored',
      'WaystoneTier',
      'StackableSize',
      'Sockets'
    ];
    const availableType = allTypes.find(type => !usedTypes.includes(type));

    if (availableType) {
      setEditedRule((prev) => ({
        ...prev,
        conditions: [
          ...prev.conditions,
          {
            type: availableType,
            rarities: [],
            itemLevel: { type: '>', value: 0 },
            itemTypes: [],
            quality: { type: '=', value: 0 },
            corrupted: { value: false },
            mirrored: { value: false },
            waystoneTier: { type: '=', value: 0 },
            stackableSize: { type: '=', value: 0 },
            sockets: { type: '=', value: 0 }
          },
        ],
      }));
    }
  };

  const handleRemoveCondition = (index: number) => {
    setEditedRule((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const handleConditionTypeChange = (index: number, type: ConditionType) => {
    setEditedRule((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, type } : condition,
      ),
    }));
  };

  const handleSoundEffectToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      hasSoundEffect: e.target.checked,
      soundEffect: e.target.checked ? prev.soundEffect || 1 : undefined,
    }));
  };

  const handleSoundEffectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      soundEffect: parseInt(e.target.value, 10),
    }));
  };

  const handleBeamEffectToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      hasBeamEffect: e.target.checked,
    }));
  };

  const getAvailableConditionTypes = (currentCondition: Condition, index: number): ConditionType[] => {
    const usedTypes = editedRule.conditions
      .filter((_, i) => i !== index) // Exclude current condition
      .map(condition => condition.type);

    const allTypes: ConditionType[] = [
      'Rarity',
      'ItemType',
      'ItemLevel',
      'Quality',
      'Corrupted',
      'Mirrored',
      'WaystoneTier',
      'StackableSize',
      'Sockets'
    ];

    return allTypes.filter(type => !usedTypes.includes(type));
  };

  const canAddNewCondition = (): boolean => {
    const usedTypes = editedRule.conditions.map(condition => condition.type);
    const allTypes: ConditionType[] = [
      'Rarity',
      'ItemType',
      'ItemLevel',
      'Quality',
      'Corrupted',
      'Mirrored',
      'WaystoneTier',
      'StackableSize',
      'Sockets'
    ];

    return usedTypes.length < allTypes.length;
  };

  const DisplayCondition = (condition: Condition, index: number) => {
    switch (condition.type) {
      case 'Rarity':
        return DisplayRarityCondition(condition);
      case 'ItemType':
        return DisplayItemTypeCondition(condition, index);
      case 'ItemLevel':
        return DisplayItemLevelCondition(condition);
      case 'Quality':
        return DisplayQualityCondition(condition);
      case 'Corrupted':
        return DisplayCorruptedCondition(condition);
      case 'Mirrored':
        return DisplayMirroredCondition(condition);
      case 'WaystoneTier':
        return DisplayWaystoneTierCondition(condition);
      case 'StackableSize':
        return DisplayStackableSizeCondition(condition);
      case 'Sockets':
        return DisplaySocketsCondition(condition);
    }

    return null;
  };

  const DisplayRarityCondition = (condition: Condition) => {
    const rarityOptions = [
      { value: 'Normal', label: 'Normal' },
      { value: 'Magic', label: 'Magic' },
      { value: 'Rare', label: 'Rare' },
      { value: 'Unique', label: 'Unique' },
    ];

    return (
      <div className="w-full">
        <MultiSelect
          options={rarityOptions}
          value={condition.rarities}
          onChange={(selectedRarities) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? { ...c, rarities: selectedRarities as RarityType[] }
                  : c,
              ),
            }));
          }}
          placeholder="Select rarities..."
        />
      </div>
    );
  };

  const DisplayItemTypeCondition = (condition: Condition, index: number) => {
    return (
      <div className="w-full">
        <button
          onClick={() => setShowItemTypeSelector(index)}
          className="w-full bg-onyx-400 text-white border border-onyx-300 p-2 rounded hover:bg-onyx-300"
        >
          {condition.itemTypes.length > 0
            ? `${condition.itemTypes.length} item type(s) selected`
            : 'Select item types...'}
        </button>
        {showItemTypeSelector === index && (
          <ItemTypeSelector
            onSelect={(selectedItems) => {
              setEditedRule((prev) => ({
                ...prev,
                conditions: prev.conditions.map((c, i) =>
                  i === index ? { ...c, itemTypes: selectedItems } : c,
                ),
              }));
              setShowItemTypeSelector(null);
            }}
            onClose={() => setShowItemTypeSelector(null)}
            initialSelectedItems={condition.itemTypes}
          />
        )}
      </div>
    );
  };

  const DisplayItemLevelCondition = (condition: Condition) => {
    return (
      <div className="w-full flex items-center gap-2">
        <select
          value={condition.itemLevel.type}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c, i) =>
                c === condition
                  ? {
                      ...c,
                      itemLevel: {
                        type: e.target.value as '=' | '>' | '<',
                        value: condition.itemLevel.value,
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        >
          <option value="=">=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
        <input
          type="number"
          value={condition.itemLevel.value}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c, i) =>
                c === condition
                  ? {
                      ...c,
                      itemLevel: {
                        type: condition.itemLevel.type,
                        value: parseInt(e.target.value, 10),
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        />
      </div>
    );
  };

  const DisplayQualityCondition = (condition: Condition) => {
    return (
      <div className="w-full flex items-center gap-2">
        <select
          value={condition.quality.type}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      quality: {
                        type: e.target.value as '=' | '>' | '<',
                        value: condition.quality.value,
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        >
          <option value="=">=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
        <input
          type="number"
          value={condition.quality.value}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      quality: {
                        type: condition.quality.type,
                        value: parseInt(e.target.value, 10),
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        />
      </div>
    );
  };

  const DisplayCorruptedCondition = (condition: Condition) => {
    return (
      <div className="w-full flex items-center gap-2">
        <select
          value={condition.corrupted.value ? "True" : "False"}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      corrupted: {
                        value: e.target.value === "True",
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        >
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
      </div>
    );
  };

  const DisplayMirroredCondition = (condition: Condition) => {
    return (
      <div className="w-full flex items-center gap-2">
        <select
          value={condition.mirrored.value ? "True" : "False"}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      mirrored: {
                        value: e.target.value === "True",
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        >
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
      </div>
    );
  };

  const DisplayWaystoneTierCondition = (condition: Condition) => {
    return (
      <div className="w-full flex items-center gap-2">
        <select
          value={condition.waystoneTier.type}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      waystoneTier: {
                        type: e.target.value as '=' | '>' | '<',
                        value: condition.waystoneTier.value,
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        >
          <option value="=">=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
        <input
          type="number"
          value={condition.waystoneTier.value}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      waystoneTier: {
                        type: condition.waystoneTier.type,
                        value: parseInt(e.target.value, 10),
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        />
      </div>
    );
  };

  const DisplayStackableSizeCondition = (condition: Condition) => {
    return (
      <div className="w-full flex items-center gap-2">
        <select
          value={condition.stackableSize.type}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      stackableSize: {
                        type: e.target.value as '=' | '>' | '<',
                        value: condition.stackableSize.value,
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        >
          <option value="=">=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
        <input
          type="number"
          value={condition.stackableSize.value}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      stackableSize: {
                        type: condition.stackableSize.type,
                        value: parseInt(e.target.value, 10),
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        />
      </div>
    );
  };

  const DisplaySocketsCondition = (condition: Condition) => {
    return (
      <div className="w-full flex items-center gap-2">
        <select
          value={condition.sockets.type}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      sockets: {
                        type: e.target.value as '=' | '>' | '<',
                        value: condition.sockets.value,
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        >
          <option value="=">=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
        <input
          type="number"
          value={condition.sockets.value}
          onChange={(e) => {
            setEditedRule((prev) => ({
              ...prev,
              conditions: prev.conditions.map((c) =>
                c === condition
                  ? {
                      ...c,
                      sockets: {
                        type: condition.sockets.type,
                        value: parseInt(e.target.value, 10),
                      },
                    }
                  : c,
              ),
            }));
          }}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <div className="bg-onyx-500 p-5 pt-2 shadow-lg w-[1000px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="w-full text-center">
          {isNewRule ? 'New Rule' : 'Edit Rule'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-200"
        >
          <IoClose size={24} />
        </button>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-1 text-white">
          RULE NAME
        </label>
        <div className="relative">
          <input
            type="text"
            value={editedRule.name}
            onChange={handleNameChange}
            className="w-full bg-onyx-400 text-white border border-onyx-300 p-2 rounded pl-20!"
            placeholder="Enter rule name..."
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-300 px-2 py-1 bg-onyx-600 rounded text-sm">
            {editedRule.action}
          </span>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="space-y-4">
          <label className="block text-center border-b-2 border-onyx-300 pb-2 mb-4">
            RULE
          </label>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              VISIBILITY
            </label>
            <select
              value={editedRule.action}
              onChange={handleActionChange}
              className="w-full bg-onyx-400 text-white border border-onyx-300 p-2 rounded"
            >
              <option value="Recolor">Recolor</option>
              <option value="Show">Show</option>
              <option value="Hide">Hide</option>
            </select>
          </div>

          {editedRule.action === 'Recolor' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  COLOR
                </label>
                <ColorPicker
                  value={editedRule.color || RuleColor.White}
                  onChange={(color) => {
                    setEditedRule((prev) => ({
                      ...prev,
                      color,
                    }));
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedRule.isEmphasized}
                  onChange={handleEmphasizeToggle}
                  className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                />
                <label className="text-sm text-white">Emphasize</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedRule.hasBeamEffect}
                  onChange={handleBeamEffectToggle}
                  className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                />
                <label className="text-sm text-white">Beam Effect</label>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedRule.hasMapIcon}
                    onChange={handleMapIconToggle}
                    className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                  />
                  <label className="text-sm text-white">Map Icon</label>
                </div>
                {editedRule.hasMapIcon && (
                  <select
                    value={editedRule.mapIcon}
                    onChange={handleMapIconChange}
                    className="block w-full"
                  >
                    {Object.entries(MinimapIcon).map(([name, value]) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedRule.hasSoundEffect}
                    onChange={handleSoundEffectToggle}
                    className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                  />
                  <label className="text-sm text-white">Sound Effect</label>
                </div>
                {editedRule.hasSoundEffect && (
                  <select
                    value={editedRule.soundEffect}
                    onChange={handleSoundEffectChange}
                    className="block w-full"
                  >
                    {Object.entries(SoundEffect)
                      .filter(([key]) => isNaN(Number(key)))
                      .map(([name, value]) => (
                        <option key={value} value={value}>
                          {name}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedRule.hasAreaLevelDependency}
                onChange={handleAreaLevelToggle}
                className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
              />
              <label className="text-sm text-white">
                Area Level Dependency
              </label>
            </div>
            {editedRule.hasAreaLevelDependency && (
              <>
                <label>Area Level: </label>
                <input
                  type="number"
                  value={editedRule.areaLevel || ''}
                  onChange={handleAreaLevelChange}
                  className="block w-20 bg-onyx-400 text-white border border-onyx-300 p-2"
                  min="1"
                />
              </>
            )}
          </div>
        </div>

        <div className="ml-4 space-y-4 w-full">
          <div className="flex justify-between items-center">
            <label className="block border-b-2 border-onyx-300 pb-2 mb-4 w-full text-center">
              CONDITIONS
            </label>
            <label className="block border-b-2 border-onyx-300 pb-2 mb-4 w-full text-center">
              PROPERTIES
            </label>
          </div>

          <div className="space-y-2 bg-onyx-400 p-2 pt-3 overflow-y-auto min-h-[570px] max-h-[570px]">
            {editedRule.conditions.map((condition, index) => (
              <div key={index} className="flex flex-col bg-onyx-500 p-2">
                <div className="flex flex-row items-center gap-2">
                  <select
                    value={condition.type}
                    onChange={(e) =>
                      handleConditionTypeChange(
                        index,
                        e.target.value as ConditionType,
                      )
                    }
                    className="w-full"
                  >
                    {getAvailableConditionTypes(condition, index).map(type => (
                      <option key={type} value={type}>
                        {type === 'ItemType' ? 'Item Type' :
                         type === 'ItemLevel' ? 'Item Level' :
                         type === 'WaystoneTier' ? 'Waystone Tier' :
                         type === 'StackableSize' ? 'Stackable Size' :
                         type === 'Sockets' ? 'Sockets' :
                         type}
                      </option>
                    ))}
                  </select>
                  {DisplayCondition(condition, index)}
                  <button
                    onClick={() => handleRemoveCondition(index)}
                    className="button-error-icon w-10 flex items-center justify-center"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            ))}
            {canAddNewCondition() && (
              <button
                onClick={handleAddCondition}
                className="button-secondary tracking-wider w-min-10 flex items-center justify-center gap-2 min-h-10"
              >
                <IoAddOutline size={20} />
                ADD CONDITION
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleSave}
          className="button-primary tracking-wider w-full flex items-center justify-center"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default FilterEditorRuleEdit;
