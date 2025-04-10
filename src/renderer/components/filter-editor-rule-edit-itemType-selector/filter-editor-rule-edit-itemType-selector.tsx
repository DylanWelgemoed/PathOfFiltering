import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ConditionItemType } from '../../types/types';
import { IoChevronDown, IoChevronForward, IoClose } from 'react-icons/io5';

interface ItemTypeSelectorProps {
  onSelect: (selectedItems: ConditionItemType[]) => void;
  onClose: () => void;
  initialSelectedItems?: ConditionItemType[];
}

interface ItemTypeHierarchy {
  [key: string]: {
    classes: {
      [key: string]: string[];
    };
  };
}

// Example item type hierarchy - this should be replaced with actual data
const itemTypeHierarchy: ItemTypeHierarchy = {
  Weapons: {
    classes: {
      'One Handed': ['Sword', 'Axe', 'Mace', 'Dagger', 'Claw'],
      'Two Handed': ['Sword', 'Axe', 'Mace', 'Staff', 'Bow'],
    },
  },
  Armour: {
    classes: {
      'Body Armour': ['Body Armour'],
      Helmet: ['Helmet'],
      Gloves: ['Gloves'],
      Boots: ['Boots'],
      Shield: ['Shield'],
    },
  },
  Accessories: {
    classes: {
      Amulet: ['Amulet'],
      Ring: ['Ring'],
      Belt: ['Belt'],
    },
  },
  Currency: {
    classes: {
      Currency: ['Currency', 'Fragment', 'Divination Card'],
    },
  },
  Jewels: {
    classes: {
      Jewel: ['Jewel', 'Abyss Jewel'],
    },
  },
  Flasks: {
    classes: {
      Flask: ['Life Flask', 'Mana Flask', 'Hybrid Flask', 'Utility Flask'],
    },
  },
  Maps: {
    classes: {
      Map: ['Map', 'Map Fragment'],
    },
  },
};

const ItemTypeSelector: React.FC<ItemTypeSelectorProps> = ({
  onSelect,
  onClose,
  initialSelectedItems = [],
}) => {
  const [selectedItems, setSelectedItems] =
    useState<ConditionItemType[]>(initialSelectedItems);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(
    new Set(),
  );

  const categoryCheckboxRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});
  const classCheckboxRefs = useRef<{ [key: string]: HTMLInputElement | null }>(
    {},
  );

  useEffect(() => {
    // Update indeterminate state for category checkboxes
    Object.entries(itemTypeHierarchy).forEach(([category]) => {
      const checkbox = categoryCheckboxRefs.current[category];
      if (checkbox) {
        const state = getCategorySelectionState(category);
        checkbox.indeterminate = state === 'partial';
      }
    });

    // Update indeterminate state for class checkboxes
    Object.entries(itemTypeHierarchy).forEach(([category, data]) => {
      Object.keys(data.classes).forEach((className) => {
        const key = `${category}-${className}`;
        const checkbox = classCheckboxRefs.current[key];
        if (checkbox) {
          const state = getClassSelectionState(category, className);
          checkbox.indeterminate = state === 'partial';
        }
      });
    });
  }, [selectedItems]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleClass = (category: string, className: string) => {
    const key = `${category}-${className}`;
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedClasses(newExpanded);
  };

  const getCategorySelectionState = (category: string) => {
    const allItems = Object.entries(
      itemTypeHierarchy[category].classes,
    ).flatMap(([_, baseTypes]) => baseTypes);
    const selectedCount = allItems.filter((baseType) =>
      selectedItems.some(
        (item) => item.type === 'basetype' && item.value === baseType,
      ),
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === allItems.length) return 'all';
    return 'partial';
  };

  const getClassSelectionState = (category: string, className: string) => {
    const baseTypes = itemTypeHierarchy[category].classes[className];
    const selectedCount = baseTypes.filter((baseType) =>
      selectedItems.some(
        (item) => item.type === 'basetype' && item.value === baseType,
      ),
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === baseTypes.length) return 'all';
    return 'partial';
  };

  const toggleCategorySelection = (category: string) => {
    const allItems = Object.entries(
      itemTypeHierarchy[category].classes,
    ).flatMap(([_, baseTypes]) => baseTypes);
    const currentState = getCategorySelectionState(category);

    let newSelectedItems = [...selectedItems];

    if (currentState === 'all') {
      // Remove all items from this category
      newSelectedItems = newSelectedItems.filter(
        (item) => !allItems.includes(item.value),
      );
    } else {
      // Add all items from this category
      const itemsToAdd = allItems
        .filter(
          (baseType) =>
            !newSelectedItems.some(
              (item) => item.type === 'basetype' && item.value === baseType,
            ),
        )
        .map((baseType) => ({
          type: 'basetype' as const,
          value: baseType,
        }));
      newSelectedItems = [...newSelectedItems, ...itemsToAdd];
    }

    setSelectedItems(newSelectedItems);
  };

  const toggleClassSelection = (category: string, className: string) => {
    const baseTypes = itemTypeHierarchy[category].classes[className];
    const currentState = getClassSelectionState(category, className);

    let newSelectedItems = [...selectedItems];

    if (currentState === 'all') {
      // Remove all items from this class
      newSelectedItems = newSelectedItems.filter(
        (item) => !baseTypes.includes(item.value),
      );
    } else {
      // Add all items from this class
      const itemsToAdd = baseTypes
        .filter(
          (baseType) =>
            !newSelectedItems.some(
              (item) => item.type === 'basetype' && item.value === baseType,
            ),
        )
        .map((baseType) => ({
          type: 'basetype' as const,
          value: baseType,
        }));
      newSelectedItems = [...newSelectedItems, ...itemsToAdd];
    }

    setSelectedItems(newSelectedItems);
  };

  const toggleItemType = (
    category: string,
    className: string,
    baseType: string,
  ) => {
    const newSelectedItems = [...selectedItems];
    const itemType: ConditionItemType = {
      type: 'basetype',
      value: baseType,
    };

    const existingIndex = newSelectedItems.findIndex(
      (item) => item.type === 'basetype' && item.value === baseType,
    );

    if (existingIndex >= 0) {
      newSelectedItems.splice(existingIndex, 1);
    } else {
      newSelectedItems.push(itemType);
    }

    setSelectedItems(newSelectedItems);
  };

  const handleSave = () => {
    onSelect(selectedItems);
    onClose();
  };

  const getCheckboxState = (state: 'none' | 'partial' | 'all') => {
    return state === 'all';
  };

  return (
    <div className="fixed inset-0 bg-onyx-transparent flex items-center justify-center z-50">
      <div className="bg-onyx-500 p-4 w-[600px]">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold w-full text-center">
            Select Item Types{' '}
            {selectedItems.length > 0
              ? `(${selectedItems.length} selected)`
              : ''}
          </h2>
          <button onClick={onClose} className="text-white hover:text-error">
            <IoClose size={24} />
          </button>
        </div>

        <div className="w-full max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            {Object.entries(itemTypeHierarchy).map(([category, data]) => {
              const categoryState = getCategorySelectionState(category);
              return (
                <div key={category} className="bg-onyx-400 rounded p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      ref={(el) => {
                        categoryCheckboxRefs.current[category] = el;
                      }}
                      checked={getCheckboxState(categoryState)}
                      onChange={() => toggleCategorySelection(category)}
                      className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                    />
                    <div
                      className="flex items-center justify-between cursor-pointer flex-1"
                      onClick={() => toggleCategory(category)}
                    >
                      <span className="font-medium">{category}</span>
                      <span>
                        {expandedCategories.has(category) ? (
                          <IoChevronDown />
                        ) : (
                          <IoChevronForward />
                        )}
                      </span>
                    </div>
                  </div>

                  {expandedCategories.has(category) && (
                    <div className="mt-2 space-y-2 pl-4">
                      {Object.entries(data.classes).map(
                        ([className, baseTypes]) => {
                          const classState = getClassSelectionState(
                            category,
                            className,
                          );
                          const classKey = `${category}-${className}`;
                          return (
                            <div
                              key={className}
                              className="bg-onyx-500 rounded p-2"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  ref={(el) => {
                                    classCheckboxRefs.current[classKey] = el;
                                  }}
                                  checked={getCheckboxState(classState)}
                                  onChange={() =>
                                    toggleClassSelection(category, className)
                                  }
                                  className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                                />
                                <div
                                  className="flex items-center justify-between cursor-pointer flex-1"
                                  onClick={() =>
                                    toggleClass(category, className)
                                  }
                                >
                                  <span>{className}</span>
                                  <span>
                                    {expandedClasses.has(classKey) ? (
                                      <IoChevronDown />
                                    ) : (
                                      <IoChevronForward />
                                    )}
                                  </span>
                                </div>
                              </div>

                              {expandedClasses.has(classKey) && (
                                <div className="mt-2 space-y-1 pl-4">
                                  {baseTypes.map((baseType) => (
                                    <div
                                      key={baseType}
                                      className="flex items-center gap-2 cursor-pointer hover:bg-onyx-400 p-1 rounded"
                                      onClick={() =>
                                        toggleItemType(
                                          category,
                                          className,
                                          baseType,
                                        )
                                      }
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedItems.some(
                                          (item) =>
                                            item.type === 'basetype' &&
                                            item.value === baseType,
                                        )}
                                        readOnly
                                        className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                                      />
                                      <span>{baseType}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-onyx-400 text-white rounded hover:bg-onyx-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemTypeSelector;
