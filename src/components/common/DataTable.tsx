"use client"

import React, { useState } from "react"
import type { ReactNode } from "react"
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  title: string
  render?: (value: any, record: T) => ReactNode
  width?: string
}

interface ActionItem<T> {
  key: string
  label: string
  icon?: ReactNode
  onClick: (record: T) => void
  danger?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  /** Field key or function to uniquely identify each row */
  rowKey?: keyof T | ((record: T) => string)
  expandable?: {
    expandedRowRender: (record: T) => ReactNode
    rowExpandable?: (record: T) => boolean
  }
  actions?: {
    items: ActionItem<T>[]
  }
}

export function DataTable<T>({
  data,
  columns,
  loading,
  rowKey = "id" as any,
  expandable,
  actions,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Determine unique key for each row
  const getRowKey = (record: T): string => {
    if (typeof rowKey === "function") {
      return rowKey(record)
    }
    const key = rowKey as keyof T
    const val = record[key]
    return val != null ? String(val) : ""
  }

  const toggleExpanded = (key: string) => {
    const newSet = new Set(expandedRows)
    if (newSet.has(key)) newSet.delete(key)
    else newSet.add(key)
    setExpandedRows(newSet)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {expandable && <th className="w-8"></th>}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
              {actions && <th className="w-12"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((record) => {
              const key = getRowKey(record)
              return (
                <React.Fragment key={key}>
                  <tr className="hover:bg-gray-50">
                    {expandable && (
                      <td className="px-6 py-4">
                        {expandable.rowExpandable?.(record) !== false && (
                          <button onClick={() => toggleExpanded(key)} className="text-gray-400 hover:text-gray-600">
                            {expandedRows.has(key) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </td>
                    )}
                    {columns.map((column) => {
                      let rawValue: any
                      if (typeof column.key === "string" && column.key.includes(".")) {
                        rawValue = (column.key as string)
                          .split(".")
                          .reduce((obj: any, k) => (obj != null ? obj[k] : undefined), record)
                      } else {
                        rawValue = (record as any)[column.key as keyof T]
                      }
                      return (
                        <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap">
                          {column.render ? column.render(rawValue, record) : String(rawValue ?? "")}
                        </td>
                      )
                    })}
                    {actions && (
                      <td className="px-6 py-4 relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openDropdown === key && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              {actions.items.map((action) => (
                                <button
                                  key={action.key}
                                  onClick={() => {
                                    action.onClick(record)
                                    setOpenDropdown(null)
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                                    action.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
                                  }`}>
                                  {action.icon}
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                  {expandable && expandedRows.has(key) && (
                    <tr>
                      <td
                        colSpan={columns.length + (expandable ? 1 : 0) + (actions ? 1 : 0)}
                        className="px-6 py-4 bg-gray-50"
                      >
                        {expandable.expandedRowRender(record)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      {data.length === 0 && <div className="p-8 text-center text-gray-500">Veri bulunamadı</div>}
    </div>
  )
}
