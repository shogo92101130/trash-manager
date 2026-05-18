'use client';

import { Search, X } from 'lucide-react';
import { Tag } from '@/types/trash';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tags: Tag[];
  selectedTagIds: string[];
  onTagToggle: (tagId: string) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  tags,
  selectedTagIds,
  onTagToggle,
}: SearchBarProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="ゴミを検索..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => {
            const active = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={
                  active
                    ? { backgroundColor: tag.color, color: '#fff' }
                    : { backgroundColor: '#f3f4f6', color: '#4b5563' }
                }
              >
                {tag.name}
              </button>
            );
          })}
          {selectedTagIds.length > 0 && (
            <button
              onClick={() => selectedTagIds.forEach(id => onTagToggle(id))}
              className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              クリア
            </button>
          )}
        </div>
      )}
    </div>
  );
}
