import { useState, useMemo, useEffect } from 'react';

type SortDirection = 'ascending' | 'descending';

interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

const searchInItem = (item: any, term: string): boolean => {
    const lowerCaseTerm = term.toLowerCase();
    for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
            const value = item[key];
            if (value === null || value === undefined) {
                continue;
            }
            if (typeof value === 'object') {
                if (searchInItem(value, term)) {
                    return true;
                }
            } else if (String(value).toLowerCase().includes(lowerCaseTerm)) {
                return true;
            }
        }
    }
    return false;
};


export function useDataTable<T>(data: T[], initialItemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => searchInItem(item, searchTerm));
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = String(sortConfig.key).split('.').reduce((o, i) => o?.[i], a);
        const bValue = String(sortConfig.key).split('.').reduce((o, i) => o?.[i], b);

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);


  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page
  };

  return {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    requestSort,
    sortConfig,
    totalItems: sortedData.length,
    currentData: sortedData,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
  };
}
