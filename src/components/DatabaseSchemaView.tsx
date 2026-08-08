import React, { useState } from 'react';
import { DATABASE_TABLES, DatabaseTable } from '../data/architectureData';
import { Database, Key, Table, Copy, Check, Search, Server } from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<DatabaseTable>(DATABASE_TABLES[1]); // tickets default
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const generateDDL = (table: DatabaseTable) => {
    let ddl = `-- PostgreSQL Schema for Table: ${table.name}\n`;
    ddl += `CREATE TABLE ${table.name} (\n`;
    table.columns.forEach((col, idx) => {
      const isLast = idx === table.columns.length - 1;
      ddl += `  ${col.name.padEnd(20)} ${col.type.padEnd(15)} ${col.constraints}${isLast ? '' : ','}\n`;
    });
    ddl += `);\n`;
    return ddl;
  };

  const handleCopyDDL = () => {
    const ddl = generateDDL(selectedTable);
    navigator.clipboard.writeText(ddl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredColumns = selectedTable.columns.filter(col =>
    col.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    col.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
    col.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Database Architecture & Relational ERD Matrix
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            PostgreSQL + pgvector schema supporting ITIL ticket lifecycle, user RBAC roles, RAG embeddings, and AI triage audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded border border-slate-700">
          <Server className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-mono">Engine: PostgreSQL 16 + pgvector extension</span>
        </div>
      </div>

      {/* Tables Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table Selector List */}
        <div className="lg:col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Database Tables ({DATABASE_TABLES.length})
          </h3>

          <div className="space-y-2">
            {DATABASE_TABLES.map((tbl) => {
              const isSelected = selectedTable.name === tbl.name;
              return (
                <button
                  key={tbl.name}
                  onClick={() => setSelectedTable(tbl)}
                  className={`w-full text-left p-3 rounded-md border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md text-white'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-300 flex items-center gap-2">
                      <Table className="w-3.5 h-3.5 text-indigo-400" />
                      {tbl.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {tbl.columns.length} cols
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{tbl.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns & DDL Inspector */}
        <div className="lg:col-span-8 bg-slate-800 rounded-lg border border-slate-700 p-5 flex flex-col justify-between">
          <div>
            {/* Table Header & Copy SQL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700 gap-3">
              <div>
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">Selected Table Schema</span>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span>Table: {selectedTable.name}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{selectedTable.description}</p>
              </div>

              <button
                onClick={handleCopyDDL}
                className="self-start sm:self-auto bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span className="font-mono text-[11px]">{copied ? 'Copied DDL' : 'Copy PostgreSQL DDL'}</span>
              </button>
            </div>

            {/* Column Search Filter */}
            <div className="mt-4 mb-3 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search table columns, datatypes, or constraints..."
                className="w-full bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Column Schema Table */}
            <div className="overflow-x-auto rounded border border-slate-700/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-3">Column Name</th>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Constraints</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-mono">
                  {filteredColumns.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-300 flex items-center gap-1.5">
                        {col.constraints.includes('PRIMARY KEY') && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                        <span>{col.name}</span>
                      </td>
                      <td className="p-3 text-emerald-400 font-semibold">{col.type}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{col.constraints}</td>
                      <td className="p-3 text-slate-300 font-sans text-xs">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DDL Preview Box */}
          <div className="mt-5 pt-4 border-t border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-2">SQL DDL Execution Preview</span>
            <pre className="bg-slate-950 p-3 rounded border border-slate-900 text-[11px] font-mono text-slate-300 overflow-x-auto">
              {generateDDL(selectedTable)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
