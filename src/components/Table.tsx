interface Column {
  key: string
  header: string
  render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
  data: any[]
  columns: Column[]
  keyField: string
  emptyMessage?: string
}

export default function Table({
  data,
  columns,
  keyField,
  emptyMessage = 'Aucune donnée',
}: TableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">{emptyMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((column) => (
                <td
                  key={`${row[keyField]}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
