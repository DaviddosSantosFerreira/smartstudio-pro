import React from 'react';

export default function Table({ columns, data, onRowClick }) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            {safeColumns.map((column, index) => (
              <th
                key={index}
                className={`py-3 px-4 text-left font-semibold text-gray-700 ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {safeColumns.map((column, colIndex) => (
                <td key={colIndex} className={`py-3 px-4 ${column.className || ''}`}>
                  {column.render ? column.render(row) : row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {safeData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhum registro encontrado</p>
        </div>
      )}
    </div>
  );
}

