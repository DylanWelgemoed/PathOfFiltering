import React, { useState, useEffect } from 'react';
import {
  Rule,
  RuleColor,
  ConditionType,
  MinimapIcon,
  Condition,
  RarityType,
  ConditionItemType,
} from '../../types/types';
import { IoClose, IoAddOutline } from 'react-icons/io5';
import MultiSelect from '../foundation/multi-select/multi-select';
import ItemTypeSelector from '../filter-editor-rule-edit-itemType-selector/filter-editor-rule-edit-itemType-selector';

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
  });
  const [showItemTypeSelector, setShowItemTypeSelector] = useState<number | null>(null);

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
      color: action === 'Recolor' ? RuleColor.NORMAL : undefined,
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedRule((prev) => ({
      ...prev,
      color: e.target.value,
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
    setEditedRule((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          type: 'Rarity',
          rarities: [],
          itemLevel: { type: '>', value: 0 },
          itemTypes: [],
        },
      ],
    }));
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

  const DisplayCondition = (condition: Condition, index: number) => {
    switch (condition.type) {
      case 'Rarity':
        return DisplayRarityCondition(condition);
      case 'ItemType':
        return DisplayItemTypeCondition(condition, index);
      case 'ItemLevel':
        return DisplayItemLevelCondition(condition);
    }

    return null;
  };

  const DisplayExtraCondition = (condition: Condition) => {
    switch (condition.type) {
      case 'ItemType':
        return DisplayItemTypeExtraCondition(condition);
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
                c === condition ? { ...c, rarities: selectedRarities as RarityType[] } : c
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
                  i === index ? { ...c, itemTypes: selectedItems } : c
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

  const DisplayItemTypeExtraCondition = (condition: Condition) => {
    return (
      <div className="flex flex-row gap-2 mt-3">
        <div className="w-full">
          <label className="float-right mr-4">Advanced Options</label>
        </div>
        <div className="w-full">
          <label className="block">Is Corrupted</label>
          <label className="block">Is Mirrored</label>
          <label className="block">Waystone Tier</label>
          <label className="block">Stackable Size <small>(Only use when currency is the only item type)</small></label>
        </div>
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
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                COLOR
              </label>
              <select
                value={editedRule.color}
                onChange={handleColorChange}
                className="w-full bg-onyx-400 text-white border border-onyx-300 p-2 rounded"
              >
                {Object.entries(RuleColor).map(([name, value]) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {editedRule.action === 'Recolor' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedRule.isEmphasized}
                onChange={handleEmphasizeToggle}
                className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
              />
              <label className="text-sm text-white">Emphasize</label>
            </div>
          )}

          {editedRule.action === 'Recolor' && (
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
              <div
                key={index}
                className="flex flex-col bg-onyx-500 p-2"
              >
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
                    <option value="Rarity">Rarity</option>
                    <option value="ItemType">Item Type</option>
                    <option value="ItemLevel">Item Level</option>
                  </select>
                  {DisplayCondition(condition, index)}
                  <button
                    onClick={() => handleRemoveCondition(index)}
                    className="button-error-icon w-10 flex items-center justify-center"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
                {DisplayExtraCondition(condition)}
              </div>
            ))}
            <button
              onClick={handleAddCondition}
              className="button-secondary tracking-wider w-min-10 flex items-center justify-center gap-2 min-h-10"
            >
              <IoAddOutline size={20} />
              ADD CONDITION
            </button>
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
