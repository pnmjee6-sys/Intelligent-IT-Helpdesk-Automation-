import React from 'react';
import { RBAC_ROLES } from '../data/architectureData';
import { ShieldCheck, UserCheck, Lock, CheckCircle2, XCircle, Key, Shield } from 'lucide-react';

export const RbacView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          Authentication & Role-Based Access Control (RBAC) Architecture
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Zero-Trust security model enforcing granular resource permissions across Standard Employees, IT Support Agents, and Administrators using JWT Bearer Tokens & SSO integration.
        </p>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RBAC_ROLES.map((role, idx) => (
          <div key={idx} className="bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded border uppercase ${role.badgeColor}`}>
                {role.role}
              </span>
              <Shield className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{role.description}</p>
          </div>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-400" />
          <span>Granular Resource CRUD Permission Matrix</span>
        </h3>

        <div className="overflow-x-auto rounded border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3">Role</th>
                <th className="p-3">Resource Module</th>
                <th className="p-3 text-center">Create</th>
                <th className="p-3 text-center">Read</th>
                <th className="p-3 text-center">Update</th>
                <th className="p-3 text-center">Delete</th>
                <th className="p-3">Special Constraints / Filter Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 font-mono">
              {RBAC_ROLES.flatMap((r) =>
                r.permissions.map((p, pIdx) => (
                  <tr key={`${r.role}-${pIdx}`} className="hover:bg-slate-900/40">
                    {pIdx === 0 && (
                      <td rowSpan={r.permissions.length} className="p-3 font-bold text-indigo-300 align-top border-r border-slate-700 bg-slate-900/30">
                        {r.role}
                      </td>
                    )}
                    <td className="p-3 text-slate-200 font-semibold">{p.resource}</td>
                    <td className="p-3 text-center">
                      {p.create ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {p.read ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {p.update ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {p.delete ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-slate-400 font-sans text-xs">{p.special || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auth Flow Box */}
      <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-lg flex items-start gap-3">
        <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider font-mono">Authentication Architecture Details</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Requests require an <code className="text-indigo-300 font-mono">Authorization: Bearer &lt;JWT&gt;</code> header issued by corporate OAuth2 / SAML SSO (Okta / Azure AD). Express middleware verifies JWT signatures, extracts user <code className="text-indigo-300 font-mono">user_id</code> and <code className="text-indigo-300 font-mono">role</code>, and attaches Row-Level Security (RLS) SQL predicates automatically to database queries.
          </p>
        </div>
      </div>
    </div>
  );
};
