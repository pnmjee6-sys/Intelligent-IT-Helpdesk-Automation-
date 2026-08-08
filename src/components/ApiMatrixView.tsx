import React, { useState } from 'react';
import { API_MATRIX, ApiEndpoint } from '../data/architectureData';
import { Terminal, Send, Lock, ShieldCheck, Check, Play } from 'lucide-react';

export const ApiMatrixView: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint>(API_MATRIX[0]);
  const [requestBody, setRequestBody] = useState(selectedApi.requestBody || '');
  const [responsePayload, setResponsePayload] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSelectApi = (api: ApiEndpoint) => {
    setSelectedApi(api);
    setRequestBody(api.requestBody || '');
    setResponsePayload(null);
  };

  const handleTestEndpoint = async () => {
    setIsExecuting(true);
    setResponsePayload(null);

    await new Promise(r => setTimeout(r, 380));

    try {
      if (selectedApi.path === '/v1/ai/triage') {
        const parsed = JSON.parse(requestBody);
        setResponsePayload(JSON.stringify({
          status: "200 OK",
          timestamp: new Date().toISOString(),
          triage_result: {
            ticket_id: "TCK-" + Math.floor(1000 + Math.random() * 9000),
            category: parsed.subject?.toLowerCase().includes("vpn") ? "Network & Security / VPN" : "Application Support",
            priority: "high",
            urgency_score: 84,
            sentiment: "frustrated",
            matched_kb_count: 2,
            suggested_routing: "Tier 2 Network Operations",
            execution_time_ms: 184
          }
        }, null, 2));
      } else if (selectedApi.path === '/v1/kb/search') {
        setResponsePayload(JSON.stringify({
          status: "200 OK",
          results: [
            { id: "kb-091", title: "SAP Password Self-Service Manual", similarity: 0.92, snippet: "Navigate to sso.company.com/sap-reset and authenticate via MFA" },
            { id: "kb-104", title: "ERP Account Lockout Resolution Policy", similarity: 0.85, snippet: "Automatic lock release expires after 15 minutes of inactivity" }
          ]
        }, null, 2));
      } else {
        setResponsePayload(selectedApi.responseBody || JSON.stringify({ status: "200 OK", message: "Simulated endpoint response" }, null, 2));
      }
    } catch {
      setResponsePayload(selectedApi.responseBody || "{}");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Internal RESTful API & Realtime WebSockets Matrix
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          High-performance microservice endpoints for AI Triage, pgvector RAG query execution, ticket lifecycle routing, and agent copilot streams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint Navigation List */}
        <div className="lg:col-span-5 bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            API Endpoints ({API_MATRIX.length})
          </h3>

          <div className="space-y-2">
            {API_MATRIX.map((api, idx) => {
              const isSelected = selectedApi.path === api.path;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectApi(api)}
                  className={`w-full text-left p-3 rounded-md border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md text-white'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        api.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        api.method === 'PATCH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'
                      }`}>
                        {api.method}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-200">{api.path}</span>
                    </div>

                    <span className="text-[10px] font-mono bg-slate-900 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                      {api.access}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{api.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Endpoint Sandbox & Tester */}
        <div className="lg:col-span-7 bg-slate-800 rounded-lg border border-slate-700 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                    selectedApi.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    selectedApi.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    selectedApi.method === 'PATCH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'
                  }`}>
                    {selectedApi.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">{selectedApi.path}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{selectedApi.summary}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>RBAC: {selectedApi.access}</span>
              </div>
            </div>

            {/* Request Body Payload Editor */}
            {selectedApi.requestBody && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                  JSON Request Body Payload
                </label>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <button
              onClick={handleTestEndpoint}
              disabled={isExecuting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isExecuting ? "Executing Endpoint..." : "Send Test Endpoint Request"}</span>
            </button>

            {/* Response Payload Inspector */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Response Output JSON
              </span>
              <pre className="bg-slate-950 p-3.5 rounded border border-slate-900 text-[11px] font-mono text-indigo-300 overflow-x-auto min-h-[140px]">
                {responsePayload || selectedApi.responseBody || "// Click 'Send Test Endpoint Request' to view real API response payload"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
