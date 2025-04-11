import React, { useState, useRef, useEffect } from 'react';
import { ConditionItemType } from '../../types/types';
import { IoChevronDown, IoChevronForward, IoClose } from 'react-icons/io5';
import {
  allItemTypes,
  ItemCategory,
  ItemClass,
  ItemType,
} from '../../data/data';

interface ItemTypeSelectorProps {
  onSelect: (selectedItems: ConditionItemType[]) => void;
  onClose: () => void;
  initialSelectedItems?: ConditionItemType[];
}

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
  const [expandedDefenseTypes, setExpandedDefenseTypes] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState('');

  const categoryCheckboxRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});
  const classCheckboxRefs = useRef<{ [key: string]: HTMLInputElement | null }>(
    {},
  );

  // Function to check if an item matches the search query
  const matchesSearch = (category: ItemCategory, itemClass: ItemClass, type: ItemType) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.category.toLowerCase().includes(query) ||
      itemClass.class.toLowerCase().includes(query) ||
      type.baseType.toLowerCase().includes(query)
    );
  };

  // Function to check if a category has any matching items
  const categoryHasMatches = (category: ItemCategory) => {
    if (!searchQuery) return true;
    return category.classes.some(itemClass =>
      itemClass.types.some(type => matchesSearch(category, itemClass, type))
    );
  };

  // Function to check if a class has any matching items
  const classHasMatches = (category: ItemCategory, itemClass: ItemClass) => {
    if (!searchQuery) return true;
    return itemClass.types.some(type => matchesSearch(category, itemClass, type));
  };

  // Function to check if a defense type has any matching items
  const defenseTypeHasMatches = (category: ItemCategory, itemClass: ItemClass, defenseType: string) => {
    if (!searchQuery) return true;
    return itemClass.types.some(type => 
      type.defenceType === defenseType && matchesSearch(category, itemClass, type)
    );
  };

  // Update expanded states based on search
  useEffect(() => {
    if (!searchQuery) return;

    const newExpandedCategories = new Set<string>();
    const newExpandedClasses = new Set<string>();
    const newExpandedDefenseTypes = new Set<string>();

    allItemTypes.forEach(category => {
      if (categoryHasMatches(category)) {
        newExpandedCategories.add(category.category);
        
        category.classes.forEach(itemClass => {
          if (classHasMatches(category, itemClass)) {
            const classKey = `${category.category}-${itemClass.class}`;
            newExpandedClasses.add(classKey);

            if (category.category === 'Armours') {
              const itemsWithDefenseType = itemClass.types.filter(type => type.defenceType);
              const defenseTypes = new Set(
                itemsWithDefenseType
                  .map(type => type.defenceType)
                  .filter((defenseType): defenseType is string => defenseType !== undefined)
              );

              defenseTypes.forEach(defenseType => {
                if (defenseTypeHasMatches(category, itemClass, defenseType)) {
                  newExpandedDefenseTypes.add(defenseType);
                }
              });
            }
          }
        });
      }
    });

    setExpandedCategories(newExpandedCategories);
    setExpandedClasses(newExpandedClasses);
    setExpandedDefenseTypes(newExpandedDefenseTypes);
  }, [searchQuery]);

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

  const toggleDefenseType = (defType: string) => {
    const newExpanded = new Set(expandedDefenseTypes);
    if (newExpanded.has(defType)) {
      newExpanded.delete(defType);
    } else {
      newExpanded.add(defType);
    }
    setExpandedDefenseTypes(newExpanded);
  };

  const getCategorySelectionState = (category: ItemCategory) => {
    const allItems = category.classes.flatMap((itemClass) =>
      itemClass.types.map((type) => type.baseType),
    );
    const selectedCount = allItems.filter((baseType) =>
      selectedItems.some(
        (item) => item.type === 'basetype' && item.value === baseType,
      ),
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === allItems.length) return 'all';
    return 'partial';
  };

  const getClassSelectionState = (
    category: ItemCategory,
    itemClass: ItemClass,
  ) => {
    const baseTypes = itemClass.types.map((type) => type.baseType);
    const selectedCount = baseTypes.filter((baseType) =>
      selectedItems.some(
        (item) => item.type === 'basetype' && item.value === baseType,
      ),
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === baseTypes.length) return 'all';
    return 'partial';
  };

  const getDefenseTypeSelectionState = (
    category: ItemCategory,
    itemClass: ItemClass,
    defenseType: string,
  ) => {
    const baseTypes = itemClass.types
      .filter((type) => type.defenceType === defenseType)
      .map((type) => type.baseType);
    const selectedCount = baseTypes.filter((baseType) =>
      selectedItems.some(
        (item) => item.type === 'basetype' && item.value === baseType,
      ),
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === baseTypes.length) return 'all';
    return 'partial';
  };

  const toggleCategorySelection = (category: ItemCategory) => {
    const allItems = category.classes.flatMap((itemClass) =>
      itemClass.types.map((type) => type.baseType),
    );
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

  const toggleClassSelection = (
    category: ItemCategory,
    itemClass: ItemClass,
  ) => {
    const baseTypes = itemClass.types.map((type) => type.baseType);
    const currentState = getClassSelectionState(category, itemClass);

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

  const handleDefenseTypeSelect = (category: ItemCategory, itemClass: ItemClass, defenseType: string) => {
    const baseTypes = itemClass.types
      .filter(type => type.defenceType === defenseType)
      .map(type => type.baseType);
    const currentState = getDefenseTypeSelectionState(category, itemClass, defenseType);

    let newSelectedItems = [...selectedItems];

    if (currentState === 'all') {
      // Remove all items from this defense type
      newSelectedItems = newSelectedItems.filter(
        item => !baseTypes.includes(item.value)
      );
    } else {
      // Add all items from this defense type
      const itemsToAdd = baseTypes
        .filter(
          baseType =>
            !newSelectedItems.some(
              item => item.type === 'basetype' && item.value === baseType,
            ),
        )
        .map(baseType => ({
          type: 'basetype' as const,
          value: baseType,
        }));
      newSelectedItems = [...newSelectedItems, ...itemsToAdd];
    }

    setSelectedItems(newSelectedItems);
  };

  const toggleItemType = (baseType: string) => {
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

  const displayItemType = (type: ItemType) => {
    return (
      <div
        key={type.baseType}
        className="flex flex-col gap-1 cursor-pointer hover:bg-onyx-500 p-2 pl-6"
        onClick={() => toggleItemType(type.baseType)}
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedItems.some(
              (item) =>
                item.type === 'basetype' && item.value === type.baseType,
            )}
            readOnly
            className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500 mr-4 ml-3"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{type.baseType}</span>
              {type.requirements && (
                <span className="text-sm text-onyx-600">
                  {type.requirements}
                </span>
              )}
            </div>
            {type.stats && type.stats.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {type.stats.map((stat, index) => (
                  <small className='block text-onyx-600' key={index}>{stat}</small>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Function to get unique defense types for a class
  const getDefenseTypesForClass = (category: ItemCategory, itemClass: ItemClass) => {
    const defenseTypes = new Set<string>();
    itemClass.types.forEach(type => {
      if (type.defenceType) {
        defenseTypes.add(type.defenceType);
      }
    });
    return Array.from(defenseTypes);
  };

  return (
    <div className="fixed inset-0 bg-onyx-transparent flex items-center justify-center z-50">
      <div className="bg-onyx-500 p-4 w-[800px] min-h-[70vh] flex flex-col">
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

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories, classes, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 bg-onyx-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-1 transition-colors"
              >
                <IoClose size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 pr-2 max-h-[70vh] overflow-y-auto">
            {allItemTypes
              .filter(category => categoryHasMatches(category))
              .map((category) => {
                const categoryState = getCategorySelectionState(category);
                return (
                  <div
                    key={category.category}
                    className="bg-onyx-400 rounded p-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        ref={(el) => {
                          categoryCheckboxRefs.current[category.category] = el;
                        }}
                        checked={getCheckboxState(categoryState)}
                        onChange={() => toggleCategorySelection(category)}
                        className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                      />
                      <div
                        className="flex items-center justify-between cursor-pointer flex-1"
                        onClick={() => toggleCategory(category.category)}
                      >
                        <span className="font-medium">{category.category}</span>
                        <span>
                          {expandedCategories.has(category.category) ? (
                            <IoChevronDown />
                          ) : (
                            <IoChevronForward />
                          )}
                        </span>
                      </div>
                    </div>

                    {expandedCategories.has(category.category) && (
                      <div className="mt-2 space-y-2 pl-4">
                        {category.classes
                          .filter(itemClass => classHasMatches(category, itemClass))
                          .map((itemClass) => {
                            const classState = getClassSelectionState(
                              category,
                              itemClass,
                            );
                            const classKey = `${category.category}-${itemClass.class}`;
                            return (
                              <div
                                key={itemClass.class}
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
                                      toggleClassSelection(category, itemClass)
                                    }
                                    className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                                  />
                                  <div
                                    className="flex items-center justify-between cursor-pointer flex-1"
                                    onClick={() =>
                                      toggleClass(
                                        category.category,
                                        itemClass.class,
                                      )
                                    }
                                  >
                                    <span>
                                      {itemClass.classNameOverride ||
                                        itemClass.class}
                                    </span>
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
                                  <div className={`mt-2 space-y-2 ${category.category !== 'Armours' ? 'bg-onyx-400' : ''}`}>
                                    {category.category === 'Armours' ? (
                                      <div className="space-y-2">
                                        {getDefenseTypesForClass(category, itemClass)
                                          .filter(defType => defenseTypeHasMatches(category, itemClass, defType))
                                          .map((defType) => {
                                            const defenseTypeState = getDefenseTypeSelectionState(category, itemClass, defType);
                                            return (
                                              <div key={defType} className="bg-onyx-400 rounded p-2">
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="checkbox"
                                                    ref={(el) => {
                                                      if (el) {
                                                        el.indeterminate = defenseTypeState === 'partial';
                                                      }
                                                    }}
                                                    checked={defenseTypeState === 'all'}
                                                    onChange={() => handleDefenseTypeSelect(category, itemClass, defType)}
                                                    className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                                                  />
                                                  <div
                                                    className="flex items-center justify-between cursor-pointer flex-1"
                                                    onClick={() => toggleDefenseType(defType)}
                                                  >
                                                    <span className="font-medium">{defType}</span>
                                                    <span>
                                                      {expandedDefenseTypes.has(defType) ? (
                                                        <IoChevronDown />
                                                      ) : (
                                                        <IoChevronForward />
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                                {expandedDefenseTypes.has(defType) && (
                                                  <div className="mt-2 space-y-2 pl-4">
                                                    {itemClass.types
                                                      .filter(type => 
                                                        type.defenceType === defType && 
                                                        matchesSearch(category, itemClass, type)
                                                      )
                                                      .map((type) => displayItemType(type))}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    ) : (
                                      itemClass.types
                                        .filter(type => matchesSearch(category, itemClass, type))
                                        .map((type) => displayItemType(type))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-onyx-400">
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
