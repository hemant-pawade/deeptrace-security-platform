import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total === 0) return null;

  const { page, limit, total, totalPages } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-[#0E1422] rounded-b-xl text-xs text-slate-400">
      <div>
        Showing <span className="font-medium text-slate-200">{start}</span> to{' '}
        <span className="font-medium text-slate-200">{end}</span> of{' '}
        <span className="font-medium text-slate-200">{total}</span> records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 px-2.5"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        <span className="px-2 font-mono text-slate-300">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 px-2.5"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
