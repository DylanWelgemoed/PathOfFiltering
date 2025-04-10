import React, { useState } from 'react';
import { Filter, Rule } from '../../types/types';
import FilterEditorDescriptionEdit from '../filter-editor-description-edit/filter-editor-description-edit';
import FilterEditorRuleEdit from '../filter-editor-rule-edit/filter-editor-rule-edit';
import {
  IoAddOutline,
  IoClose,
  IoInformationCircleOutline,
  IoReorderThreeOutline,
} from 'react-icons/io5';

interface FilterListProps {
  filters: Filter[];
  selectedFilterIndex: number;
  onSelectFilter: (index: number) => void;
  onAddFilter: () => void;
  onAddRule: () => void;
  onDeleteFilter: (index: number) => void;
  onExportFilter: (index: number) => void;
  onDragRule: (fromIndex: number, toIndex: number) => void;
  onUpdateFilter: (index: number, filter: Filter) => void;
  onDuplicateFilter: () => void;
  onDeleteRule: (ruleIndex: number) => void;
  onUpdateRule: (ruleIndex: number, rule: Rule) => void;
}

const FilterList: React.FC<FilterListProps> = ({
  filters,
  selectedFilterIndex,
  onSelectFilter,
  onAddFilter,
  onAddRule,
  onDeleteFilter,
  onExportFilter,
  onDragRule,
  onUpdateFilter,
  onDuplicateFilter,
  onDeleteRule,
  onUpdateRule,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number | null>(
    null,
  );
  const [isNewRule, setIsNewRule] = useState(false);
  const selectedFilter = filters[selectedFilterIndex];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (name: string, description: string) => {
    if (selectedFilter) {
      const updatedFilter = {
        ...selectedFilter,
        name,
        description,
      };
      onUpdateFilter(selectedFilterIndex, updatedFilter);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleRuleClick = (index: number) => {
    setSelectedRuleIndex(index);
    setIsNewRule(false);
  };

  const handleAddRule = () => {
    onAddRule();
    setSelectedRuleIndex(selectedFilter?.rules.length || 0);
    setIsNewRule(true);
  };

  const handleSaveRule = (rule: Rule) => {
    if (selectedRuleIndex !== null) {
      onUpdateRule(selectedRuleIndex, rule);
    }
  };

  const handleCancelRuleEdit = () => {
    setSelectedRuleIndex(null);
    setIsNewRule(false);
  };

  const getRuleColorClass = (rule: Rule) => {
    if (rule.action === 'Recolor') {
      switch (rule.color) {
        case '#00FF00':
          return 'text-green-500';
        case '#0000FF':
          return 'text-blue-500';
        case '#FF00FF':
          return 'text-purple-500';
        case '#FFFF00':
          return 'text-yellow-500';
        case '#FF0000':
          return 'text-red-500';
        default:
          return '';
      }
    }
    return '';
  };

  return (
    <div className="flex flex-row m-4 gap-2">
      <div className="relative bg-onyx-500 p-5 shadow-lg w-[600px] h-[850px] flex flex-col">
        <h1 className="text-center py-1 mb-5 text-2xl tracking-wider bg-onyx-400">
          LOOT FILTER
        </h1>

        <div className="flex flex-col flex-grow">
          <div className="mb-4">
            <label className="mb-1">SELECTED LOOT FILTER:</label>
            <div className="flex gap-2 items-center">
              <select
                value={selectedFilterIndex}
                onChange={(e) => onSelectFilter(Number(e.target.value))}
                className="flex-grow"
              >
                {filters.map((filter, index) => (
                  <option key={index} value={index}>
                    {filter.name}
                  </option>
                ))}
              </select>
              <button
                onClick={onAddFilter}
                className="button-primary-icon flex items-center justify-center"
              >
                <IoAddOutline size={20} />
              </button>
            </div>
          </div>

          {selectedFilter && (
            <>
              <div className="flex justify-between mb-5">
                <div>
                  <label className="mb-1">Description:</label>
                  <p>{selectedFilter.description}</p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={handleEdit}
                    className="button-secondary tracking-wider w-full flex items-center justify-center"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={onDuplicateFilter}
                    className="button-secondary tracking-wider w-full flex items-center justify-center"
                  >
                    DUPLICATE
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-5 items-center justify-center -mt-[30px]">
                <button
                  onClick={handleAddRule}
                  className="button-primary tracking-wider w-min-10 flex items-center justify-center gap-2 min-h-10"
                >
                  <IoAddOutline size={20} />
                  ADD RULE
                </button>
                <button className="button-secondary-icon tracking-wider w-10 flex items-center justify-center gap-2 min-h-10">
                  <IoInformationCircleOutline size={20} />
                </button>
              </div>

              <div className="text-center py-2.5 bg-gradient-to-r from-transparent via-onyx-400 to-transparent mb-4">
                <p>
                  RULES POSITIONED HIGHER IN THIS LIST OVERRULE THOSE BELOW THEM
                </p>
              </div>

              <div className="flex-grow overflow-hidden">
                <div className="h-[400px] overflow-y-auto border border-onyx-300 bg-onyx-400">
                  {selectedFilter.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 border-b border-onyx-300 last:border-b-0 hover:bg-onyx-500 cursor-pointer"
                      onClick={() => handleRuleClick(index)}
                    >
                      <div className="mr-4 cursor-grab text-white text-base">
                        <IoReorderThreeOutline size={20} />
                      </div>
                      <div className="flex-grow">
                        <p>
                          <label className="mr-2">
                            {rule.action === 'Recolor' && (
                              <span className={`${getRuleColorClass(rule)}`}>
                                Recolor
                              </span>
                            )}
                            {rule.action !== 'Recolor' && rule.action}
                          </label>
                          {rule.name}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          className="button-error-icon w-10 flex items-center justify-center gap-2 min-h-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRule(index);
                          }}
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-5 items-center mt-auto pt-4 bg-onyx-500">
                <button
                  onClick={() => onDeleteFilter(selectedFilterIndex)}
                  className="button-error tracking-wider w-full flex items-center justify-center gap-2 min-h-10"
                >
                  DELETE FILTER
                </button>
                <button
                  onClick={() => onExportFilter(selectedFilterIndex)}
                  className="button-primary tracking-wider w-full flex items-center justify-center gap-2 min-h-10"
                >
                  SAVE FILTER
                </button>
              </div>
            </>
          )}
        </div>

        {isEditing && selectedFilter && (
          <FilterEditorDescriptionEdit
            filter={selectedFilter}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
      {selectedRuleIndex !== null && selectedFilter && (
        <FilterEditorRuleEdit
          rule={isNewRule ? undefined : selectedFilter.rules[selectedRuleIndex]}
          onSave={handleSaveRule}
          onCancel={handleCancelRuleEdit}
          isNewRule={isNewRule}
        />
      )}
    </div>
  );
};

export default FilterList;
