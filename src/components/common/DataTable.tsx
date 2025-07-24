import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    width?: string;
  }[];
  onRowClick?: (item: T) => void;
  actions?: {
    icon: React.ReactNode;
    label: string;
    onClick: (item: T) => void;
  }[];
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  actions,
  emptyMessage = 'Nenhum registro encontrado'
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key} style={column.width ? { width: column.width } : undefined}>
              {column.header}
            </TableHead>
          ))}
          {actions && <TableHead>Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-gray-500">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => (
            <TableRow 
              key={index} 
              className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : "hover:bg-gray-50"}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((column) => (
                <TableCell key={`${index}-${column.key}`}>
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </TableCell>
              ))}
              {actions && (
                <TableCell>
                  <div className="flex space-x-2">
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(item);
                        }}
                        title={action.label}
                      >
                        {action.icon}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
