import React, { useState, useEffect } from 'react';
import FilterEditor from '../filter-editor/filter-editor';
import { FilterModel, RuleModel } from '../../models/models';
import { RuleColor, Filter, Rule } from '../../types/types';

// Create some initial filters for the demo
const createInitialFilters = () => {
  // Filter 1: Casual Loot Filter
  const defaultFilter = new FilterModel(
    "Default Filter",
    'This is a default filter.',
  );

  return [defaultFilter];
};

export default function App() {
  const [filters, setFilters] = useState(createInitialFilters());
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);

  useEffect(() => {
    // Request filters from main process
    window.electron.ipcRenderer.once('ipc-import-filters', (arg: any) => {
      if (arg.success) {
        if (arg.filters && arg.filters.length > 0) {
          // Convert imported filter files into FilterModel instances
          const importedFilters = arg.filters.map((filterFile: any) => {
            return FilterModel.fromString(`Imported from ${filterFile.name}`, filterFile.contents);
          });
          setFilters(importedFilters);
          setSelectedFilterIndex(0);
        }
      } else {
        console.error('Failed to import filters:', arg.error);
      }
    });
    window.electron.ipcRenderer.sendMessage('ipc-import-filters');
  }, []);

  const handleSelectFilter = (index: number) => {
    setSelectedFilterIndex(index);
  };

  const handleAddFilter = () => {
    const newFilter = new FilterModel(`New Filter ${filters.length + 1}`);
    setFilters([...filters, newFilter]);
    setSelectedFilterIndex(filters.length);
  };

  const handleAddRule = () => {
    const newFilters = [...filters];
    const rule = new RuleModel('Show', 'NEW RULE');
    newFilters[selectedFilterIndex].addRule(rule);
    setFilters(newFilters);
  };

  const handleDeleteFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    if (selectedFilterIndex >= newFilters.length) {
      setSelectedFilterIndex(Math.max(0, newFilters.length - 1));
    }
  };

  const handleExportFilter = (index: number) => {
    console.log('Exporting filter:', filters[index]);
    
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.once('ipc-export-filter', (response: any) => {
      // eslint-disable-next-line no-console
      console.log(response);
    });
    window.electron.ipcRenderer.sendMessage('ipc-export-filter', {name: filters[index].name, filter: filters[index].toString()});
  };

  const handleDragRule = (fromIndex: number, toIndex: number) => {
    const newFilters = [...filters];
    newFilters[selectedFilterIndex].moveRule(fromIndex, toIndex);
    setFilters(newFilters);
  };

  const handleUpdateFilter = (index: number, filter: Filter) => {
    const newFilters = [...filters];
    const existingFilter = newFilters[index];
    existingFilter.setName(filter.name);
    existingFilter.setDescription(filter.description || '');
    setFilters(newFilters);
  };

  const handleDuplicateFilter = () => {
    if (selectedFilterIndex >= 0 && selectedFilterIndex < filters.length) {
      const filterToDuplicate = filters[selectedFilterIndex];
      const newFilter = filterToDuplicate.clone();
      newFilter.setName(`${newFilter.name}-copy`);
      setFilters([...filters, newFilter]);
      setSelectedFilterIndex(filters.length);
    }
  };

  const handleDeleteRule = (ruleIndex: number) => {
    const newFilters = [...filters];
    newFilters[selectedFilterIndex].removeRule(ruleIndex);
    setFilters(newFilters);
  };

  const handleUpdateRule = (ruleIndex: number, rule: Rule) => {
    const newFilters = [...filters];
    newFilters[selectedFilterIndex].updateRule(ruleIndex, rule);
    setFilters(newFilters);
  };

  return (
    <FilterEditor
      filters={filters}
      selectedFilterIndex={selectedFilterIndex}
      onSelectFilter={handleSelectFilter}
      onAddFilter={handleAddFilter}
      onAddRule={handleAddRule}
      onDeleteFilter={handleDeleteFilter}
      onExportFilter={handleExportFilter}
      onDragRule={handleDragRule}
      onUpdateFilter={handleUpdateFilter}
      onDuplicateFilter={handleDuplicateFilter}
      onDeleteRule={handleDeleteRule}
      onUpdateRule={handleUpdateRule}
    />
  );
}
