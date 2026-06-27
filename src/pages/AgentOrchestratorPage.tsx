import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import {
  Cpu,
  Brain,
  Trash2,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Newspaper,
  TrendingUp,
  ShieldAlert,
  Terminal,
  Sparkles,
  Check,
  X,
  Factory,
} from "lucide-react";

export const AgentOrchestratorPage = () => {

  // Multi-Agent states
  const [ticker, setTicker] = useState("RELIANCE");
  const [customAgents, setCustomAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orchestratorResponse, setOrchestratorResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [factoryModalOpen, setFactoryModalOpen] = useState(false);

  // New Custom Agent Form State
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");
  const [newAgentGoal, setNewAgentGoal] = useState("");
  const [newAgentBackstory, setNewAgentBackstory] = useState("");
  const [allowedTools, setAllowedTools] = useState<string[]>([]);

  const fetchCustomAgents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/agents");
      if (response.ok) {
        const data = await response.json();
        setCustomAgents(data);
      }
    } catch (err) {
      console.error("Failed to fetch custom agents from database:", err);
    }
  };

  useEffect(() => {
    fetchCustomAgents();
  }, []);

  const handleAddAgent = async () => {
    if (!newAgentName || !newAgentRole || !newAgentGoal || !newAgentBackstory) {
      setValidationError("Please fill in all agent configuration fields.");
      return;
    }
    setValidationError(null);
    const newAgent = {
      name: newAgentName,
      role: newAgentRole,
      goal: newAgentGoal,
      backstory: newAgentBackstory,
      allowedToolIds: allowedTools,
    };

    try {
      const response = await fetch("http://localhost:8000/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAgent),
      });

      if (!response.ok) {
        throw new Error("Failed to save custom agent to database.");
      }

      const savedAgent = await response.json();
      setCustomAgents([...customAgents, savedAgent]);

      setNewAgentName("");
      setNewAgentRole("");
      setNewAgentGoal("");
      setNewAgentBackstory("");
      setAllowedTools([]);
    } catch (err: any) {
      setValidationError(err.message || "Failed to save custom agent.");
    }
  };

  const handleRemoveAgent = async (agentId: string) => {
    if (!agentId) return;
    try {
      const response = await fetch(`http://localhost:8000/api/agents/${agentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete custom agent from database.");
      }

      setCustomAgents(customAgents.filter((a) => a.id !== agentId));
    } catch (err: any) {
      setValidationError(err.message || "Failed to delete custom agent.");
    }
  };

  const handleRunOrchestration = async () => {
    setLoading(true);
    setApiError(null);
    setOrchestratorResponse(null);
    try {
      const response = await fetch("http://localhost:8000/api/orchestrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          customAgents: customAgents,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to run MAS orchestration.");
      }
      setOrchestratorResponse(data);
    } catch (err: any) {
      setApiError(err.message || "Something went wrong during orchestration.");
    } finally {
      setLoading(false);
    }
  };

  const availableTools = [
    {
      id: "news_fetcher",
      name: "Financial News Fetcher",
      desc: "Scan headlines and market sentiment",
    },
    {
      id: "technical_analysis",
      name: "Kite OHLC Analyzer",
      desc: "Map candlestick patterns and support entry zones",
    },
    {
      id: "order_execution",
      name: "Broker Order Executer",
      desc: "Route transaction orders and calculate stop-losses",
    },
  ];

  return (
    <div className="max-w-[1600px] w-full mx-auto space-y-8">
          {/* Top Banner Hero */}
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-900 via-indigo-950 to-indigo-900 border border-violet-500/20 text-white rounded-3xl p-8 shadow-xl shadow-indigo-500/5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="relative z-10 space-y-2 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/25 border border-violet-400/30 rounded-full text-xs font-semibold text-violet-300 tracking-wider uppercase font-outfit">
                <Sparkles className="w-3.5 h-3.5" />
                Autonomous Trading Pipeline
              </span>
              <h2 className="text-3xl font-extrabold font-outfit tracking-tight">
                Deploy Multi-Agent Quantitative Networks
              </h2>
              <p className="text-sm text-violet-200/90 leading-relaxed font-outfit">
                Deploy structured, sequential reasoning chains directly to live
                broker nodes. Run our predefined compliance, sentiment, and
                chart parsing team, and dynamically configure custom analysts
                using the factory to specialize your pipeline.
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Setup & Config */}
            <div className="xl:col-span-2 space-y-8">
              {/* Predefined Core Team Cards */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h3 className="text-sm font-bold font-outfit text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-500" />
                      Core Pipeline Team (Predefined)
                    </h3>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-1 border border-green-500/20 rounded-full font-bold uppercase tracking-wider">
                    Always On
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* News Agent */}
                  <Card className="hover:scale-[1.01] hover:border-violet-500/20 transition-all duration-300 border border-gray-200 dark:border-white/5 flex flex-col justify-between h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-violet-500/10 rounded-2xl border border-violet-500/20 text-violet-600 dark:text-violet-400">
                          <Newspaper className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">
                          Sentiment
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-gray-950 dark:text-white font-outfit">
                          News Sentiment Analyst
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                          Scans global tickers and media
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-outfit">
                        Parses earnings, financial reports, and global
                        headlines. Extracts market consensus, detecting bias and
                        catalysts.
                      </p>
                    </CardContent>
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-[#0c0e16]/30">
                      <span className="text-[10px] text-gray-400 font-mono">
                        Allowed Tools:
                      </span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-mono">
                        news_fetcher
                      </span>
                    </div>
                  </Card>

                  {/* Chart Agent */}
                  <Card className="hover:scale-[1.01] hover:border-violet-500/20 transition-all duration-300 border border-gray-200 dark:border-white/5 flex flex-col justify-between h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-600 dark:text-blue-400">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">
                          Technical
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-gray-950 dark:text-white font-outfit">
                          Quantitative Charting Analyst
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                          OHLC Trend & Momentum
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-outfit">
                        Parses daily OHLC stock price candlesticks. Calculates
                        RSI/MA signals and establishes support zones.
                      </p>
                    </CardContent>
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-[#0c0e16]/30">
                      <span className="text-[10px] text-gray-400 font-mono">
                        Allowed Tools:
                      </span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-mono">
                        technical_analysis
                      </span>
                    </div>
                  </Card>

                  {/* Risk & Execution Agent */}
                  <Card className="hover:scale-[1.01] hover:border-violet-500/20 transition-all duration-300 border border-gray-200 dark:border-white/5 flex flex-col justify-between h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">
                          Broker Execution
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-gray-950 dark:text-white font-outfit">
                          Trade Execution Manager
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                          Compliance & Risk Guard
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-outfit">
                        Evaluates all analyst reports. Computes mathematically
                        guarded stop-losses and places trades.
                      </p>
                    </CardContent>
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-[#0c0e16]/30">
                      <span className="text-[10px] text-gray-400 font-mono">
                        Allowed Tools:
                      </span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-mono">
                        order_execution
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Agent Factory Trigger Button */}
              <button
                onClick={() => setFactoryModalOpen(true)}
                className="group w-full flex items-center justify-between gap-4 p-5 rounded-2xl border-2 border-dashed border-violet-500/25 hover:border-violet-500/50 bg-violet-500/3 hover:bg-violet-500/5 dark:bg-violet-500/[0.03] dark:hover:bg-violet-500/[0.07] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 group-hover:bg-indigo-600/15 transition-colors">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold font-outfit text-gray-900 dark:text-white text-sm">Agent Factory: Deploy Dynamic Nodes</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Configure custom roles, goals, backstory & tools</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {customAgents.length > 0 && (
                    <span className="text-[10px] bg-violet-500/10 text-violet-500 border border-violet-500/20 px-2.5 py-1 rounded-full font-bold">
                      {customAgents.length} active
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-500 group-hover:bg-violet-600/20 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Agent Factory Modal */}
              {factoryModalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  onClick={(e) => { if (e.target === e.currentTarget) setFactoryModalOpen(false); }}
                >
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                  {/* Modal Panel */}
                  <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0d16] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-violet-500/10 flex flex-col">
                    {/* Modal Header */}
                    <div className="sticky top-0 z-10 bg-white dark:bg-[#0a0d16] px-8 pt-8 pb-5 border-b border-gray-100 dark:border-white/5 flex items-start justify-between gap-4 rounded-t-3xl">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                          <Cpu className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold font-outfit text-gray-950 dark:text-white">Agent Factory</h2>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Deploy dynamic nodes into the trading crew pipeline</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFactoryModalOpen(false)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer shrink-0"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Modal Form Body */}
                    <div className="px-8 py-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold tracking-wider uppercase block">
                            Agent Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Macroeconomist"
                            value={newAgentName}
                            onChange={(e) => setNewAgentName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0c0f18] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all font-outfit"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold tracking-wider uppercase block">
                            Agent Role
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Macroeconomic Advisor"
                            value={newAgentRole}
                            onChange={(e) => setNewAgentRole(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0c0f18] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all font-outfit"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold tracking-wider uppercase block">
                          Agent Goal
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Analyze inflation and interest rate trends affecting the company."
                          value={newAgentGoal}
                          onChange={(e) => setNewAgentGoal(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#0c0f18] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all font-outfit"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold tracking-wider uppercase block">
                          Agent Backstory
                        </label>
                        <textarea
                          placeholder="e.g. Former central banker specializing in corporate finance. You evaluate macroeconomic factors and interest rate impacts."
                          value={newAgentBackstory}
                          onChange={(e) => setNewAgentBackstory(e.target.value)}
                          rows={3}
                          className="w-full bg-gray-50 dark:bg-[#0c0f18] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all font-outfit resize-none"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs text-gray-400 font-bold tracking-wider uppercase block">
                          Allowed Tools (Capabilities)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {availableTools.map((t) => {
                            const isChecked = allowedTools.includes(t.id);
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  if (isChecked) {
                                    setAllowedTools(allowedTools.filter((x) => x !== t.id));
                                  } else {
                                    setAllowedTools([...allowedTools, t.id]);
                                  }
                                }}
                                className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                  isChecked
                                    ? 'border-violet-500 bg-violet-500/5 dark:bg-violet-500/10 shadow-lg shadow-violet-500/5 scale-[1.02]'
                                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0f18] hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/15'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xs font-extrabold text-gray-950 dark:text-white font-outfit">{t.name}</span>
                                  {isChecked && (
                                    <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                                      <Check className="w-2.5 h-2.5" />
                                    </div>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{t.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {validationError && (
                        <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/5 border border-red-500/15 p-3.5 rounded-2xl font-outfit">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{validationError}</span>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white dark:bg-[#0a0d16] px-8 pb-8 pt-4 border-t border-gray-100 dark:border-white/5 flex gap-3 rounded-b-3xl">
                      <button
                        onClick={() => setFactoryModalOpen(false)}
                        className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-outfit cursor-pointer"
                      >
                        Cancel
                      </button>
                      <Button
                        onClick={async () => { await handleAddAgent(); if (!validationError) setFactoryModalOpen(false); }}
                        variant="primary"
                        className="flex-1 flex items-center justify-center gap-2 py-3"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Assemble into Crew</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Agent Team Grid */}
              {customAgents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold font-outfit text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Injected Custom Analysts ({customAgents.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customAgents.map((agent, idx) => (
                      <div
                        key={idx}
                        className="glass-panel border border-violet-500/10 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-violet-500/30 dark:hover:border-white/15 hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-white dark:bg-[#0a0d16]"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold font-outfit text-gray-950 dark:text-white">
                                {agent.name}
                              </h4>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/10 text-violet-500 mt-0.5 uppercase tracking-wider">
                                {agent.role}
                              </span>
                            </div>
                            <button
                               onClick={() => handleRemoveAgent(agent.id)}
                              className="text-red-500 hover:text-red-600 dark:hover:text-red-400 p-2 hover:bg-red-500/5 dark:hover:bg-red-500/10 rounded-xl cursor-pointer transition-all active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-outfit">
                            <strong>Goal:</strong> {agent.goal}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-outfit italic">
                            &ldquo;{agent.backstory}&rdquo;
                          </p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap pt-2 border-t border-gray-100 dark:border-white/5">
                          {agent.allowedToolIds.length === 0 ? (
                            <span className="text-[9px] bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded font-mono">
                              no_tools
                            </span>
                          ) : (
                            agent.allowedToolIds.map((tid: string) => (
                              <span
                                key={tid}
                                className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-mono"
                              >
                                {tid}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: Execution Desk */}
            <div className="space-y-8">
              <Card className="border border-gray-200 dark:border-white/5 shadow-md">
                <CardHeader className="border-b border-gray-100 dark:border-white/5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Play className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Trading Execution Desk
                      </CardTitle>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Initiate automated multi-agent trading scan.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold tracking-wider uppercase block">
                      Target Stock Symbol
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-sm font-bold text-gray-400 select-none tracking-widest font-mono">
                        NSE:
                      </span>
                      <input
                        type="text"
                        value={ticker}
                        onChange={(e) =>
                          setTicker(e.target.value.toUpperCase())
                        }
                        placeholder="e.g. RELIANCE"
                        className="w-full bg-white dark:bg-[#0c0f18] border border-gray-200 dark:border-white/10 rounded-2xl pl-14 pr-4 py-3.5 text-sm font-extrabold tracking-widest text-left focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all font-outfit uppercase"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleRunOrchestration}
                    isLoading={loading}
                    className="w-full py-4 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                  >
                    {!loading && <Play className="w-4 h-4 fill-current" />}
                    <span>Deploy Crew Orchestrator</span>
                  </Button>

                  {apiError && (
                    <div className="flex gap-3 p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/25 rounded-2xl text-xs text-red-650 dark:text-red-400 font-outfit leading-relaxed shadow-sm">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5 animate-bounce" />
                      <div>
                        <strong className="block font-bold">
                          Execution Interrupted
                        </strong>
                        <span className="opacity-90">{apiError}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Loading details display */}
              {loading && (
                <div className="glass-panel border border-violet-500/10 dark:border-white/5 rounded-3xl p-6 space-y-5 animate-pulse bg-white dark:bg-[#0a0d16] shadow-xl">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white font-outfit uppercase tracking-wider">
                      Compiling Agent Output...
                    </span>
                  </div>
                  <div className="space-y-4 pl-8 text-xs text-gray-500 dark:text-gray-400 font-outfit leading-relaxed">
                    <p className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping"></span>
                      <span>News Sentiment Analyst scanning feeds...</span>
                    </p>
                    <p className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span>Quantitative Charting loading daily OHLC...</span>
                    </p>
                    {customAgents.map((ca, idx) => (
                      <p
                        key={idx}
                        className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500"
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                        <span>{ca.name} executing goals...</span>
                      </p>
                    ))}
                    <p className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span>Execution Desk validating compliance stops...</span>
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 pl-8 leading-relaxed italic border-t border-gray-100 dark:border-white/5 pt-3">
                    Initializing CrewAI sequential process. This boots OpenAI
                    API and requires parsing stock instruments. It typically
                    completes in 20-40 seconds.
                  </p>
                </div>
              )}

              {/* Response summary */}
              {orchestratorResponse && (
                <div className="space-y-6">
                  {/* Order Receipt Style Card */}
                  <div
                    className={`p-6 rounded-3xl border-2 shadow-xl overflow-hidden relative ${
                      orchestratorResponse.executionSummary &&
                      (orchestratorResponse.executionSummary.includes(
                        "REJECTED",
                      ) ||
                        orchestratorResponse.executionSummary.includes(
                          "FAILED",
                        ))
                        ? "bg-red-500/5 border-red-500/20 text-red-900 dark:text-red-200"
                        : "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-200"
                    }`}
                  >
                    {/* Background accent lines */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none bg-current"></div>

                    <div className="flex items-start gap-4">
                      {orchestratorResponse.executionSummary &&
                      (orchestratorResponse.executionSummary.includes(
                        "REJECTED",
                      ) ||
                        orchestratorResponse.executionSummary.includes(
                          "FAILED",
                        )) ? (
                        <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                          <CheckCircle2 className="w-5 h-5 animate-bounce" />
                        </div>
                      )}

                      <div className="space-y-2 flex-1">
                        <h4 className="font-extrabold text-sm font-outfit uppercase tracking-wider">
                          {orchestratorResponse.executionSummary &&
                          (orchestratorResponse.executionSummary.includes(
                            "REJECTED",
                          ) ||
                            orchestratorResponse.executionSummary.includes(
                              "FAILED",
                            ))
                            ? "Transaction Rejected"
                            : "Transaction Executed"}
                        </h4>

                        <div className="text-xs leading-relaxed font-outfit whitespace-pre-line border-t border-dashed border-current/20 pt-3 mt-1 text-gray-700 dark:text-gray-300">
                          {orchestratorResponse.executionSummary}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Transcriptions Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold font-outfit text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                      <Terminal className="w-4 h-4 text-violet-500" />
                      Agent Execution Transcripts
                    </h3>

                    <div className="space-y-6">
                      {orchestratorResponse.agentLogs &&
                        orchestratorResponse.agentLogs.map(
                          (log: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                              {/* Emulated Carbon Window */}
                              <div className="rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-md bg-white dark:bg-[#0c0f18]">
                                {/* Terminal Title Bar */}
                                <div className="bg-gray-100 dark:bg-[#060810] px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-white/5 select-none">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-[#ff5f56]"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-[#ffbd2e]"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-[#27c93f]"></span>
                                  </div>
                                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 tracking-wider">
                                    {log.agentName} &bull; {log.role}
                                  </span>
                                  <span className="text-[9px] bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                    NODE_0{idx + 1}
                                  </span>
                                </div>

                                {/* Task Description Panel */}
                                <div className="bg-gray-50/50 dark:bg-[#0a0d16]/30 px-5 py-3 border-b border-gray-150 dark:border-white/5">
                                  <span className="text-[10px] text-gray-400 block font-extrabold uppercase tracking-widest">
                                    Target Objective
                                  </span>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-outfit leading-relaxed">
                                    {log.taskDescription}
                                  </p>
                                </div>

                                {/* Output Stream Terminal Panel */}
                                <div className="bg-[#030509] p-5 font-mono text-[11px] text-[#abb2bf] overflow-x-auto select-text relative">
                                  {/* Left margin index layout (line numbers) */}
                                  <div className="flex gap-4">
                                    <div className="text-gray-600 dark:text-gray-700 text-right select-none pr-1.5 font-mono border-r border-gray-800 space-y-1">
                                      {log.output &&
                                        log.output
                                          .split("\n")
                                          .map((_: any, i: number) => (
                                            <div key={i}>{i + 1}</div>
                                          ))}
                                    </div>
                                    <div className="flex-1 whitespace-pre space-y-1 leading-relaxed text-[#21d09e] dark:text-[#a6e22e]">
                                      {log.output &&
                                        log.output
                                          .split("\n")
                                          .map((line: string, i: number) => {
                                            // Basic terminal highlighting matching keywords
                                            let textColor = "text-[#abb2bf]";
                                            if (
                                              line.includes("SUCCESS") ||
                                              line.includes("Routed") ||
                                              line.includes("BUY") ||
                                              line.includes("Bullish")
                                            ) {
                                              textColor = "text-emerald-400";
                                            } else if (
                                              line.includes("REJECTED") ||
                                              line.includes("FAILED") ||
                                              line.includes("Bearish") ||
                                              line.includes("Error")
                                            ) {
                                              textColor = "text-red-400";
                                            } else if (
                                              line.includes("Stop-Loss") ||
                                              line.includes("stop_loss") ||
                                              line.includes("Neutral")
                                            ) {
                                              textColor = "text-amber-400";
                                            } else if (line.startsWith("#")) {
                                              textColor =
                                                "text-[#61afef] font-bold";
                                            } else if (
                                              line.startsWith("-") ||
                                              line.startsWith("*")
                                            ) {
                                              textColor = "text-[#e5c07b]";
                                            }

                                            return (
                                              <div
                                                key={i}
                                                className={textColor}
                                              >
                                                {line || " "}
                                              </div>
                                            );
                                          })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};
export default AgentOrchestratorPage;
