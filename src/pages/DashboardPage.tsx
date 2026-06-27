import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Newspaper,
  Search,
  LineChart,
  Lock,
  History,
  AlertTriangle,
} from "lucide-react";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sentiment' | 'charting' | 'execution' | 'event-risk'>('charting');

  const [sentimentTicker, setSentimentTicker] = useState("RELIANCE");
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [sentimentError, setSentimentError] = useState<string | null>(null);

  // Event Risk Desk States
  const [eventRiskData, setEventRiskData] = useState<any>(null);
  const [eventRiskLoading, setEventRiskLoading] = useState(false);
  const [eventRiskError, setEventRiskError] = useState<string | null>(null);

  // Quantitative Charting Analyst States
  const [chartTicker, setChartTicker] = useState("RELIANCE");
  const [chartData, setChartData] = useState<any>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Trade Execution Manager States
  const [tradeTicker, setTradeTicker] = useState("RELIANCE");
  const [tradeAction, setTradeAction] = useState<"BUY" | "SELL">("BUY");
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);
  const [tradePrice, setTradePrice] = useState<number>(2450);
  const [tradeStopLoss, setTradeStopLoss] = useState<number>(2400);
  const [tradeExecuting, setTradeExecuting] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [tradeList, setTradeList] = useState<any[]>([]);

  const fetchEventRisk = async (targetTicker: string) => {
    setEventRiskLoading(true);
    setEventRiskError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/api/event-risk?ticker=${targetTicker}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch event risk");
      }
      setEventRiskData(data);
    } catch (err: any) {
      setEventRiskError(
        err.message || "Failed to connect to event risk backend.",
      );
    } finally {
      setEventRiskLoading(false);
    }
  };

  const fetchSentiment = async (targetTicker: string) => {
    setSentimentLoading(true);
    setSentimentError(null);
    fetchEventRisk(targetTicker);
    try {
      const response = await fetch(
        `http://localhost:8000/api/news-sentiment?ticker=${targetTicker}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch sentiment");
      }
      setSentimentData(data);
    } catch (err: any) {
      setSentimentError(
        err.message || "Failed to connect to sentiment backend.",
      );
    } finally {
      setSentimentLoading(false);
    }
  };

  const fetchChartData = async (targetTicker: string) => {
    setChartLoading(true);
    setChartError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/api/charting-analysis?ticker=${targetTicker}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch charting analysis");
      }
      setChartData(data);
    } catch (err: any) {
      setChartError(
        err.message || "Failed to connect to charting analysis backend.",
      );
    } finally {
      setChartLoading(false);
    }
  };

  const fetchTrades = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/trades");
      const data = await response.json();
      if (response.ok) {
        setTradeList(data);
      }
    } catch (err) {
      console.error("Failed to fetch trades:", err);
    }
  };

  const executeTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setTradeExecuting(true);
    setTradeError(null);
    try {
      const response = await fetch("http://localhost:8000/api/execute-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: tradeTicker,
          action: tradeAction,
          quantity: tradeQuantity,
          price: tradePrice,
          stopLoss: tradeStopLoss,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to execute trade");
      }
      fetchTrades();
    } catch (err: any) {
      setTradeError(err.message || "Failed to connect to execution API.");
    } finally {
      setTradeExecuting(false);
    }
  };

  useEffect(() => {
    fetchSentiment("RELIANCE");
    fetchChartData("RELIANCE");
    fetchEventRisk("RELIANCE");
    fetchTrades();
  }, []);

  return (
    <div className="max-w-[1600px] w-full mx-auto space-y-8">
      {/* Welcome Alert */}
              <div className="relative overflow-hidden bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-100 dark:border-violet-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div>
                  <h2 className="text-xl font-bold font-outfit text-gray-900 dark:text-white">
                    Welcome to StopLoss AI, {user?.full_name}! 👋
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
                    Your autonomous trading terminal is active. The FastAPI
                    microservices and MongoDB risk stores are operational.
                    Authenticated via secure JWT (HS256).
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-ping"></span>
                    Risk Core Active
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                    Data Sync Online
                  </span>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Card 1: Active Stop-Losses */}
                <Card className="hover:-translate-y-1 hover:border-gray-300 dark:hover:border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Active Stop-Losses
                      </p>
                      <h3 className="text-3xl font-extrabold font-outfit text-gray-950 dark:text-white">
                        1,248
                      </h3>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+18.2% from yesterday</span>
                      </div>
                    </div>
                    <div className="p-3 bg-violet-600/10 rounded-xl border border-violet-500/20 text-violet-600 dark:text-violet-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                </Card>

                {/* Card 2: Protected Capital */}
                <Card className="hover:-translate-y-1 hover:border-gray-300 dark:hover:border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Capital Protected
                      </p>
                      <h3 className="text-3xl font-extrabold font-outfit text-gray-950 dark:text-white">
                        $248,350
                      </h3>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Live exposure coverage</span>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-600/10 rounded-xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </Card>

                {/* Card 3: Risk Engine Load */}
                <Card className="hover:-translate-y-1 hover:border-gray-300 dark:hover:border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Risk Engine Load
                      </p>
                      <h3 className="text-3xl font-extrabold font-outfit text-gray-950 dark:text-white">
                        18.4%
                      </h3>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1.5 rounded-full"
                          style={{ width: "18.4%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-3 bg-indigo-600/10 rounded-xl border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                  </div>
                </Card>

                {/* Card 4: Broker Connection */}
                <Card className="hover:-translate-y-1 hover:border-gray-300 dark:hover:border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Broker Link
                      </p>
                      <h3 className="text-2xl font-bold font-outfit text-gray-950 dark:text-white">
                        Kite API Linked
                      </h3>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></span>
                        <span>API Sync Online</span>
                      </div>
                    </div>
                    <div className="p-3 bg-teal-600/10 rounded-xl border border-teal-500/20 text-teal-600 dark:text-teal-400">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </div>

                {/* Dynamic Tab Bar */}
                <div className="flex border-b border-gray-200 dark:border-white/5 gap-2 sm:gap-6 pb-px overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab('sentiment')}
                    className={`pb-3 text-sm font-bold font-outfit relative transition-all cursor-pointer whitespace-nowrap px-1 ${
                      activeTab === 'sentiment'
                        ? 'text-violet-600 dark:text-violet-400 font-extrabold'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    <span>Market Sentiment Desk</span>
                    {activeTab === 'sentiment' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-500 rounded-full animate-fade-in" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('charting')}
                    className={`pb-3 text-sm font-bold font-outfit relative transition-all cursor-pointer whitespace-nowrap px-1 ${
                      activeTab === 'charting'
                        ? 'text-violet-600 dark:text-violet-400 font-extrabold'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    <span>Quantitative Charting Desk</span>
                    {activeTab === 'charting' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-500 rounded-full animate-fade-in" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('execution')}
                    className={`pb-3 text-sm font-bold font-outfit relative transition-all cursor-pointer whitespace-nowrap px-1 ${
                      activeTab === 'execution'
                        ? 'text-violet-600 dark:text-violet-400 font-extrabold'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    <span>Trade Execution & Compliance Desk</span>
                    {activeTab === 'execution' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-500 rounded-full animate-fade-in" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('event-risk')}
                    className={`pb-3 text-sm font-bold font-outfit relative transition-all cursor-pointer whitespace-nowrap px-1 ${
                      activeTab === 'event-risk'
                        ? 'text-violet-600 dark:text-violet-400 font-extrabold'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    <span>Event Risk Desk</span>
                    {activeTab === 'event-risk' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-500 rounded-full animate-fade-in" />
                    )}
                  </button>
                </div>

                {activeTab === 'sentiment' && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
                <Card className="xl:col-span-2 border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                  <div className="p-6">
                    <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold font-outfit text-gray-900 dark:text-white flex items-center gap-2">
                          <Newspaper className="w-5 h-5 text-violet-500 animate-pulse" />
                          News Sentiment Analyst Desk
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Live market bias scanned from global financial feeds
                        </p>
                      </div>

                      {/* Ticker Input Selector */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sentimentTicker}
                          onChange={(e) =>
                            setSentimentTicker(e.target.value.toUpperCase())
                          }
                          placeholder="RELIANCE"
                          className="w-24 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-violet-500 uppercase font-outfit"
                        />
                        <button
                          onClick={() => fetchSentiment(sentimentTicker)}
                          disabled={sentimentLoading}
                          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl active:scale-95 transition-all text-xs font-semibold flex items-center justify-center cursor-pointer font-outfit gap-1"
                        >
                          {sentimentLoading ? (
                            <Activity className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <TrendingUp className="w-3.5 h-3.5" />
                          )}
                          <span>Scan</span>
                        </button>
                      </div>
                    </div>

                    {sentimentLoading && (
                      <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <Activity className="w-8 h-8 text-violet-500 animate-spin mb-2" />
                        <span className="text-xs font-mono">
                          Querying Yahoo Finance News APIs...
                        </span>
                      </div>
                    )}

                    {sentimentError && (
                      <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-500 rounded-xl text-xs text-center font-outfit">
                        {sentimentError}
                      </div>
                    )}

                    {!sentimentLoading && !sentimentError && sentimentData && (
                      <div className="space-y-6">
                        {/* Sentiment Gauge & Score Panel */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-[#0c0f18]/30 border border-gray-100 dark:border-white/5 p-4 rounded-2xl">
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-bold">
                              Consensus Bias
                            </span>
                            <span
                              className={`text-base font-extrabold font-outfit uppercase tracking-wider ${
                                sentimentData.sentiment === "Bullish"
                                  ? "text-emerald-500"
                                  : sentimentData.sentiment === "Bearish"
                                    ? "text-red-500"
                                    : "text-amber-500"
                              }`}
                            >
                              {sentimentData.sentiment}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-bold">
                              Sentiment Score
                            </span>
                            <span className="text-base font-bold font-mono text-gray-800 dark:text-gray-200">
                              {sentimentData.score}{" "}
                              <span className="text-[10px] text-gray-400 font-normal">
                                (0.0 to 1.0)
                              </span>
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-bold">
                              Word Triggers Scanned
                            </span>
                            <span className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                              +{sentimentData.posCount} Pos / -
                              {sentimentData.negCount} Neg
                            </span>
                          </div>
                        </div>

                        {/* Top Headlines Feed */}
                        <div className="space-y-3">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-bold">
                            Headlines Analysed
                          </span>
                          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                            {sentimentData.headlines.map(
                              (item: any, i: number) => (
                                <div
                                  key={i}
                                  className="flex items-start justify-between gap-3 p-3 bg-white dark:bg-[#0a0d16]/30 border border-gray-100 dark:border-white/5 rounded-xl hover:border-gray-205 dark:hover:border-white/10 transition-colors"
                                >
                                  <div className="space-y-1 flex-1">
                                    <a
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-semibold text-gray-900 dark:text-gray-200 hover:text-violet-500 hover:underline block leading-relaxed pr-2"
                                    >
                                      {item.title}
                                    </a>
                                    <span className="text-[10px] text-gray-400">
                                      {item.publisher}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                                      item.sentiment === "Bullish"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : item.sentiment === "Bearish"
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-gray-500/10 text-gray-400"
                                    }`}
                                  >
                                    {item.sentiment}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-4">
                      <h3 className="text-lg font-bold font-outfit text-gray-950 dark:text-white">
                        Your Account Profile
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 block">
                          Unique User ID
                        </span>
                        <span className="text-sm font-mono text-gray-800 dark:text-gray-300 break-all">
                          {user?.id || "60d5ec49f1b2c51f38e6e589"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 block">
                          Registered Email
                        </span>
                        <span className="text-sm text-gray-850 dark:text-gray-300 font-medium">
                          {user?.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 block">
                          Registration Timestamp
                        </span>
                        <span className="text-sm text-gray-850 dark:text-gray-300">
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/5">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      Security Type: Bearer JWT in LocalStorage
                    </span>
                  </div>
                  </Card>
                </div>
              )}

              {activeTab === 'event-risk' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
                  {/* Main Event Risk Widget */}
                  <Card className="xl:col-span-2 border border-gray-200 dark:border-white/5 flex flex-col">
                    <div className="p-6">
                      <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold font-outfit text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                            Event Risk Desk
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Corporate catalyst scanner — pre-earnings, dividends, and policy events
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={sentimentTicker}
                            onChange={(e) => setSentimentTicker(e.target.value.toUpperCase())}
                            placeholder="RELIANCE"
                            className="w-24 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-violet-500 uppercase font-outfit"
                          />
                          <button
                            onClick={() => fetchEventRisk(sentimentTicker)}
                            disabled={eventRiskLoading}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl active:scale-95 transition-all text-xs font-semibold flex items-center justify-center cursor-pointer font-outfit gap-1"
                          >
                            {eventRiskLoading ? (
                              <Activity className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Search className="w-3.5 h-3.5" />
                            )}
                            <span>Scan</span>
                          </button>
                        </div>
                      </div>

                      {eventRiskLoading && (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                          <Activity className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                          <span className="text-xs font-mono">Scanning corporate event calendars...</span>
                        </div>
                      )}

                      {eventRiskError && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-500 rounded-xl text-xs text-center font-outfit">
                          {eventRiskError}
                        </div>
                      )}

                      {!eventRiskLoading && !eventRiskError && eventRiskData && (
                        <div className="space-y-6">
                          {/* Risk Score Gauge */}
                          <div className="bg-gray-50 dark:bg-[#0c0f18]/40 border border-gray-100 dark:border-white/5 p-5 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Catalyst Risk Score</span>
                              <span className={`text-sm font-extrabold font-mono ${
                                eventRiskData.riskScore >= 0.7 ? 'text-red-500' :
                                eventRiskData.riskScore >= 0.4 ? 'text-amber-500' : 'text-emerald-500'
                              }`}>
                                {(eventRiskData.riskScore * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-700 ${
                                  eventRiskData.riskScore >= 0.7
                                    ? 'bg-gradient-to-r from-red-500 to-red-400'
                                    : eventRiskData.riskScore >= 0.4
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                }`}
                                style={{ width: `${eventRiskData.riskScore * 100}%` }}
                              />
                            </div>
                            <p className={`text-xs font-outfit leading-relaxed ${
                              eventRiskData.riskScore >= 0.7 ? 'text-red-400' :
                              eventRiskData.riskScore >= 0.4 ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {eventRiskData.recommendation}
                            </p>
                          </div>

                          {/* Upcoming Events Calendar */}
                          <div className="space-y-3">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-bold">Upcoming Corporate Events</span>
                            <div className="space-y-2.5">
                              {eventRiskData.events.map((evt: any, i: number) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-white dark:bg-[#0a0d16]/40 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                                  <div className={`shrink-0 px-2.5 py-1.5 rounded-xl text-center min-w-[52px] ${
                                    evt.impact === 'High' ? 'bg-red-500/10 border border-red-500/20' :
                                    evt.impact === 'Medium' ? 'bg-amber-500/10 border border-amber-500/20' :
                                    'bg-emerald-500/10 border border-emerald-500/20'
                                  }`}>
                                    <span className={`text-[9px] font-bold uppercase block ${
                                      evt.impact === 'High' ? 'text-red-500' :
                                      evt.impact === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                                    }`}>{evt.impact}</span>
                                    <span className="text-[10px] font-mono font-bold text-gray-700 dark:text-gray-300">
                                      {new Date(evt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </span>
                                  </div>
                                  <div className="flex-1 space-y-0.5">
                                    <p className="text-xs font-bold font-outfit text-gray-900 dark:text-white">{evt.name}</p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{evt.details}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 pt-0 mt-auto border-t border-gray-200 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 font-outfit">
                      <span>Data: Simulated Corporate Calendar</span>
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        E.R.D. Active
                      </span>
                    </div>
                  </Card>

                  {/* Right Column: Risk Legend */}
                  <Card className="border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-4">
                        <h3 className="text-lg font-bold font-outfit text-gray-950 dark:text-white">Risk Level Guide</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15 space-y-1">
                          <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider block">High Risk</span>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">Active earnings window or binary catalyst imminent. Tighten stops by 2x or stand aside.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                          <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider block">Medium Risk</span>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">Corporate governance event scheduled. Adjust position size by 25% as a precaution.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-1">
                          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider block">Low Risk</span>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">Routine event — dividend payout or AGM. Standard stop-loss parameters apply.</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/5">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        Agent: Event Risk Desk (Corporate Catalyst Advisor)
                      </span>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'charting' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
                <Card className="xl:col-span-2 border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                  <div className="p-6">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold font-outfit text-gray-900 dark:text-white flex items-center gap-2">
                          <LineChart className="w-5 h-5 text-indigo-500 animate-pulse" />
                          Quantitative Charting Analyst Desk
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          candlestick/line indicators and real-time support/resistance mappings
                        </p>
                      </div>

                      {/* Ticker Input Selector */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chartTicker}
                          onChange={(e) =>
                            setChartTicker(e.target.value.toUpperCase())
                          }
                          placeholder="RELIANCE"
                          className="w-24 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-violet-500 uppercase font-outfit"
                        />
                        <button
                          onClick={() => fetchChartData(chartTicker)}
                          disabled={chartLoading}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl active:scale-95 transition-all text-xs font-semibold flex items-center justify-center cursor-pointer font-outfit gap-1"
                        >
                          {chartLoading ? (
                            <Activity className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Search className="w-3.5 h-3.5" />
                          )}
                          <span>Analyze</span>
                        </button>
                      </div>
                    </div>

                    {chartLoading && (
                      <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                        <Activity className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                        <span className="text-xs font-mono">
                          Querying Market Price Feeds...
                        </span>
                      </div>
                    )}

                    {chartError && (
                      <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-500 rounded-xl text-xs text-center font-outfit">
                        {chartError}
                      </div>
                    )}

                    {!chartLoading && !chartError && chartData && chartData.history && (
                      <div className="space-y-4">
                        {/* Live/Hover Metrics Bar */}
                        {(() => {
                          const activePoint = hoveredPoint || chartData.history[chartData.history.length - 1];
                          const isGreen = activePoint.close >= activePoint.open;
                          return (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 bg-gray-50 dark:bg-[#0c0f18]/30 border border-gray-100 dark:border-white/5 p-3 rounded-xl text-center text-[10px] font-mono">
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">Date</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-300">{activePoint.date}</span>
                              </div>
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">Open</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-300">{activePoint.open}</span>
                              </div>
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">High</span>
                                <span className="font-semibold text-emerald-500">{activePoint.high}</span>
                              </div>
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">Low</span>
                                <span className="font-semibold text-red-500">{activePoint.low}</span>
                              </div>
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">Close</span>
                                <span className={`font-extrabold ${isGreen ? "text-emerald-500" : "text-red-500"}`}>{activePoint.close}</span>
                              </div>
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">Volume</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-300">{activePoint.volume.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">SMA-20</span>
                                <span className="font-semibold text-amber-500">{activePoint.sma20}</span>
                              </div>
                              <div>
                                <span className="text-gray-450 dark:text-gray-500 block uppercase text-[8px] font-bold">RSI-14</span>
                                <span className="font-semibold text-violet-500">{activePoint.rsi}</span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Interactive SVG Chart */}
                        {(() => {
                          const points = chartData.history;
                          const prices = points.flatMap((p: any) => [p.close, p.sma20, p.high, p.low]);
                          const support = chartData.support;
                          const resistance = chartData.resistance;
                          const maxVal = Math.max(...prices, resistance) * 1.005;
                          const minVal = Math.min(...prices, support) * 0.995;
                          const valRange = maxVal - minVal;

                          const w = 600;
                          const h = 220;
                          const pL = 45;
                          const pR = 55;
                          const pT = 15;
                          const pB = 25;
                          const dW = w - pL - pR;
                          const dH = h - pT - pB;

                          const getX = (idx: number) => pL + (idx / (points.length - 1 || 1)) * dW;
                          const getY = (val: number) => pT + dH - ((val - minVal) / (valRange || 1)) * dH;

                          const closePath = points.map((p: any, idx: number) => `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(p.close)}`).join(" ");
                          const areaPath = `${closePath} L ${getX(points.length - 1)} ${pT + dH} L ${getX(0)} ${pT + dH} Z`;
                          const smaPath = points.map((p: any, idx: number) => `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(p.sma20)}`).join(" ");

                          // Calculate gridlines
                          const gridTicks = 4;
                          const gridlines = Array.from({ length: gridTicks }).map((_, i) => {
                            const val = minVal + (i / (gridTicks - 1)) * valRange;
                            return { val: val.toFixed(1), y: getY(val) };
                          });

                          const maxVolume = Math.max(...points.map((p: any) => p.volume)) || 1;
                          const barWidth = (dW / points.length) * 0.6;

                          const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const mouseX = e.clientX - rect.left - (pL / w) * rect.width;
                            const pct = mouseX / ((dW / w) * rect.width);
                            const index = Math.round(pct * (points.length - 1));
                            if (index >= 0 && index < points.length) {
                              setHoveredIndex(index);
                              setHoveredPoint(points[index]);
                            }
                          };

                          const handleMouseLeave = () => {
                            setHoveredIndex(null);
                            setHoveredPoint(null);
                          };

                          return (
                            <div className="relative w-full h-[220px] bg-white dark:bg-[#070911]/50 border border-gray-150 dark:border-white/5 rounded-2xl overflow-hidden p-1">
                              <svg
                                viewBox={`0 0 ${w} ${h}`}
                                width="100%"
                                height="100%"
                                className="overflow-visible select-none cursor-crosshair"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                              >
                                <defs>
                                  <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
                                  </linearGradient>
                                </defs>

                                {/* Gridlines */}
                                {gridlines.map((g, i) => (
                                  <g key={i}>
                                    <line
                                      x1={pL}
                                      y1={g.y}
                                      x2={pL + dW}
                                      y2={g.y}
                                      stroke="currentColor"
                                      className="text-gray-200 dark:text-gray-800/60"
                                      strokeWidth="1"
                                      strokeDasharray="2,4"
                                    />
                                    <text
                                      x={pL - 8}
                                      y={g.y + 3}
                                      textAnchor="end"
                                      fill="currentColor"
                                      className="text-gray-400 dark:text-gray-500 font-mono text-[8px] font-bold"
                                    >
                                      {g.val}
                                    </text>
                                  </g>
                                ))}

                                {/* Support Line */}
                                <line
                                  x1={pL}
                                  y1={getY(support)}
                                  x2={pL + dW}
                                  y2={getY(support)}
                                  stroke="#10b981"
                                  strokeWidth="1.2"
                                  strokeDasharray="3,3"
                                />
                                <text
                                  x={pL + dW + 4}
                                  y={getY(support) + 3}
                                  fill="#10b981"
                                  className="font-mono text-[8px] font-bold"
                                >
                                  SUP: {support.toFixed(1)}
                                </text>

                                {/* Resistance Line */}
                                <line
                                  x1={pL}
                                  y1={getY(resistance)}
                                  x2={pL + dW}
                                  y2={getY(resistance)}
                                  stroke="#ef4444"
                                  strokeWidth="1.2"
                                  strokeDasharray="3,3"
                                />
                                <text
                                  x={pL + dW + 4}
                                  y={getY(resistance) + 3}
                                  fill="#ef4444"
                                  className="font-mono text-[8px] font-bold"
                                >
                                  RES: {resistance.toFixed(1)}
                                </text>

                                {/* Volume Bars (drawn at bottom, low opacity) */}
                                {points.map((p: any, idx: number) => {
                                  const isUp = p.close >= p.open;
                                  const barH = (p.volume / maxVolume) * 35;
                                  const bx = getX(idx) - barWidth / 2;
                                  const by = pT + dH - barH;
                                  return (
                                    <rect
                                      key={idx}
                                      x={bx}
                                      y={by}
                                      width={barWidth}
                                      height={barH}
                                      fill={isUp ? "#10b981" : "#ef4444"}
                                      opacity="0.15"
                                    />
                                  );
                                })}

                                {/* Price Fill Area */}
                                <path d={areaPath} fill="url(#priceAreaGrad)" />

                                {/* Price Close Line */}
                                <path
                                  d={closePath}
                                  fill="none"
                                  stroke="#8b5cf6"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* SMA20 Line */}
                                <path
                                  d={smaPath}
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeDasharray="4,2"
                                />

                                {/* Interactive Hover vertical guide & marker */}
                                {hoveredIndex !== null && (
                                  <g>
                                    <line
                                      x1={getX(hoveredIndex)}
                                      y1={pT}
                                      x2={getX(hoveredIndex)}
                                      y2={pT + dH}
                                      stroke="currentColor"
                                      className="text-gray-300 dark:text-gray-700"
                                      strokeWidth="1"
                                      strokeDasharray="3,3"
                                    />
                                    {/* Close marker */}
                                    <circle
                                      cx={getX(hoveredIndex)}
                                      cy={getY(points[hoveredIndex].close)}
                                      r="5"
                                      fill="#8b5cf6"
                                      stroke="#ffffff"
                                      strokeWidth="1.5"
                                    />
                                    <circle
                                      cx={getX(hoveredIndex)}
                                      cy={getY(points[hoveredIndex].close)}
                                      r="9"
                                      fill="#8b5cf6"
                                      opacity="0.25"
                                    />
                                    {/* SMA marker */}
                                    <circle
                                      cx={getX(hoveredIndex)}
                                      cy={getY(points[hoveredIndex].sma20)}
                                      r="3.5"
                                      fill="#f59e0b"
                                      stroke="#ffffff"
                                      strokeWidth="1"
                                    />
                                  </g>
                                )}

                                {/* Date Labels (Bottom) */}
                                {points.length >= 3 && (
                                  <g fill="currentColor" className="text-gray-400 dark:text-gray-500 font-mono text-[8px] font-bold">
                                    <text x={getX(0)} y={pT + dH + 15} textAnchor="start">
                                      {points[0].date}
                                    </text>
                                    <text x={getX(Math.floor(points.length / 2))} y={pT + dH + 15} textAnchor="middle">
                                      {points[Math.floor(points.length / 2)].date}
                                    </text>
                                    <text x={getX(points.length - 1)} y={pT + dH + 15} textAnchor="end">
                                      {points[points.length - 1].date}
                                    </text>
                                  </g>
                                )}
                              </svg>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Technical Signals & Summary Widget */}
                <Card className="border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                  <div className="p-6">
                    <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-4">
                      <h3 className="text-lg font-bold font-outfit text-gray-950 dark:text-white">
                        Technical Indicators
                      </h3>
                    </div>

                    {!chartLoading && !chartError && chartData && (
                      <div className="space-y-6">
                        {/* Recommendation Badge */}
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#0c0f18]/30 border border-gray-150 dark:border-white/5 rounded-2xl">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Analyst Recommendation</span>
                          <span className={`text-2xl font-black font-outfit mt-1 tracking-wider ${
                            chartData.signal.includes("BUY") 
                              ? "text-emerald-500" 
                              : chartData.signal.includes("SELL") 
                                ? "text-red-500" 
                                : "text-amber-500"
                          }`}>
                            {chartData.signal}
                          </span>
                          <span className="text-xs text-gray-500 mt-1 font-outfit">
                            Trend: <span className="font-semibold">{chartData.trend}</span>
                          </span>
                        </div>

                        {/* RSI Gauge */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">RSI-14 (Strength)</span>
                            <span className="font-bold font-mono">{chartData.rsi}</span>
                          </div>
                          <div className="relative w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            {/* Oversold boundary (30) */}
                            <div className="absolute left-[30%] top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600 opacity-50"></div>
                            {/* Overbought boundary (70) */}
                            <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600 opacity-50"></div>
                            {/* RSI value bar */}
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                chartData.rsi > 70 
                                  ? "bg-red-500" 
                                  : chartData.rsi < 30 
                                    ? "bg-amber-400" 
                                    : "bg-indigo-500"
                              }`}
                              style={{ width: `${chartData.rsi}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                            <span>0 (Oversold)</span>
                            <span>30</span>
                            <span>70</span>
                            <span>100 (Overbought)</span>
                          </div>
                        </div>

                        {/* Price Range Positioning */}
                        {(() => {
                          const pct = ((chartData.latestPrice - chartData.support) / (chartData.resistance - chartData.support)) * 100;
                          return (
                            <div className="space-y-2 pt-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">Support / Resistance Range</span>
                                <span className="font-bold text-gray-850 dark:text-gray-200">
                                  {pct.toFixed(0)}% of channel
                                </span>
                              </div>
                              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                                <div 
                                  className="absolute h-4 w-1.5 bg-violet-600 dark:bg-violet-400 rounded-full -top-1 transition-all duration-500"
                                  style={{ left: `${Math.min(Math.max(pct, 0), 100)}%`, transform: "translateX(-50%)" }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-[9px] text-gray-400 font-mono font-bold">
                                <span className="text-emerald-500">SUP: {chartData.support}</span>
                                <span className="text-red-500">RES: {chartData.resistance}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-0 mt-auto border-t border-gray-200 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 font-outfit">
                    <span>Data source: yfinance</span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-500">
                      <Cpu className="w-3.5 h-3.5 animate-pulse" />
                      Q.C.A. Active
                    </span>
                  </div>
                  </Card>
                </div>
              )}

              {activeTab === 'execution' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
                <Card className="xl:col-span-2 border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                  <div className="p-6">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-4">
                      <h3 className="text-lg font-bold font-outfit text-gray-900 dark:text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-500" />
                        Trade Execution Desk
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Transmit orders directly to the Trade Execution & Risk Manager core
                      </p>
                    </div>

                    <form onSubmit={executeTrade} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Ticker input */}
                        <div>
                          <label className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase font-bold mb-1">
                            Ticker Symbol
                          </label>
                          <input
                            type="text"
                            required
                            value={tradeTicker}
                            onChange={(e) => setTradeTicker(e.target.value.toUpperCase())}
                            className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-center focus:outline-none focus:ring-1 focus:ring-violet-500 uppercase font-outfit"
                          />
                        </div>

                        {/* Action toggle BUY / SELL */}
                        <div>
                          <label className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase font-bold mb-1">
                            Transaction
                          </label>
                          <div className="grid grid-cols-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-0.5">
                            <button
                              type="button"
                              onClick={() => setTradeAction("BUY")}
                              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                tradeAction === "BUY"
                                  ? "bg-emerald-500 text-white shadow-sm"
                                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                              }`}
                            >
                              BUY
                            </button>
                            <button
                              type="button"
                              onClick={() => setTradeAction("SELL")}
                              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                tradeAction === "SELL"
                                  ? "bg-red-500 text-white shadow-sm"
                                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                              }`}
                            >
                              SELL
                            </button>
                          </div>
                        </div>

                        {/* Quantity input */}
                        <div>
                          <label className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase font-bold mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={tradeQuantity}
                            onChange={(e) => setTradeQuantity(parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-center focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                          />
                        </div>

                        {/* Limit Price input */}
                        <div>
                          <label className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase font-bold mb-1">
                            Limit Price (INR)
                          </label>
                          <input
                            type="number"
                            required
                            min="0.1"
                            step="0.05"
                            value={tradePrice}
                            onChange={(e) => setTradePrice(parseFloat(e.target.value) || 0)}
                            className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-center focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                          />
                        </div>

                        {/* Stop-Loss input */}
                        <div>
                          <label className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase font-bold mb-1">
                            Stop-Loss (INR)
                          </label>
                          <input
                            type="number"
                            required
                            min="0.1"
                            step="0.05"
                            value={tradeStopLoss}
                            onChange={(e) => setTradeStopLoss(parseFloat(e.target.value) || 0)}
                            className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-center focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Real-time Risk Estimator Card */}
                      {(() => {
                        const totalVal = tradeQuantity * tradePrice;
                        const riskPerShare = Math.abs(tradePrice - tradeStopLoss);
                        const riskPercent = tradePrice > 0 ? (riskPerShare / tradePrice) * 100 : 0;
                        const totalRisk = riskPerShare * tradeQuantity;

                        let errorMsg = "";
                        if (tradeStopLoss <= 0 || tradePrice <= 0) {
                          errorMsg = "Price inputs must be positive numbers.";
                        } else if (tradeAction === "BUY" && tradeStopLoss >= tradePrice) {
                          errorMsg = "Rule Violation: Stop-loss must be strictly below entry price for BUY trades.";
                        } else if (tradeAction === "SELL" && tradeStopLoss <= tradePrice) {
                          errorMsg = "Rule Violation: Stop-loss must be strictly above entry price for SELL trades.";
                        } else if (riskPercent > 8.0) {
                          errorMsg = `Rule Violation: Trade risk (${riskPercent.toFixed(2)}%) exceeds the maximum 8.0% safety boundary.`;
                        }

                        const isCompliant = !errorMsg;

                        return (
                          <div className="bg-gray-50 dark:bg-[#0c0f18]/30 border border-gray-150 dark:border-white/5 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-gray-450 dark:text-gray-500 uppercase tracking-widest font-bold block">Risk Core Compliance Status</span>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold ${
                                  isCompliant 
                                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                                    : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${isCompliant ? "bg-emerald-500" : "bg-red-500"} animate-pulse`}></span>
                                  {isCompliant ? "COMPLIANT ORDER" : "RISK VIOLATION"}
                                </span>
                                {errorMsg && (
                                  <span className="text-xs text-red-500 font-medium font-outfit">{errorMsg}</span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 font-mono text-xs text-right shrink-0">
                              <div>
                                <span className="text-gray-455 dark:text-gray-500 text-[9px] uppercase font-bold block">Total Value</span>
                                <span className="font-extrabold text-gray-900 dark:text-gray-200">INR {totalVal.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-455 dark:text-gray-500 text-[9px] uppercase font-bold block">Max Risk Value</span>
                                <span className={`font-extrabold ${isCompliant ? "text-emerald-500" : "text-red-500"}`}>
                                  INR {totalRisk.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-455 dark:text-gray-500 text-[9px] uppercase font-bold block">Risk Ratio</span>
                                <span className={`font-extrabold ${isCompliant ? "text-emerald-500" : "text-red-500"}`}>
                                  {riskPercent.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {tradeError && (
                        <div className="p-3 bg-red-500/5 border border-red-500/20 text-red-500 rounded-xl text-xs text-center font-outfit">
                          {tradeError}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <Button
                          type="submit"
                          disabled={tradeExecuting}
                          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl active:scale-95 transition-all text-xs font-semibold flex items-center justify-center cursor-pointer font-outfit gap-2"
                        >
                          {tradeExecuting ? (
                            <Activity className="w-4 h-4 animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          <span>Transmit Secure Order to Broker</span>
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>

                {/* Recent Executions Log Widget */}
                <Card className="border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                  <div className="p-6">
                    <div className="border-b border-gray-200 dark:border-white/5 pb-4 mb-4 flex items-center gap-2">
                      <History className="w-5 h-5 text-violet-500" />
                      <h3 className="text-lg font-bold font-outfit text-gray-955 dark:text-white">
                        Execution History
                      </h3>
                    </div>

                    <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                      {tradeList.length === 0 ? (
                        <div className="py-16 text-center text-xs text-gray-400">
                          No recent executions logged. Make a trade to populate.
                        </div>
                      ) : (
                        tradeList.map((t: any) => {
                          const isSuccess = t.status === "SUCCESS";
                          return (
                            <div
                              key={t.id}
                              className="p-3 bg-white dark:bg-[#0a0d16]/30 border border-gray-100 dark:border-white/5 rounded-xl space-y-2 hover:border-gray-205 dark:hover:border-white/10 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    t.action === "BUY" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                  }`}>
                                    {t.action}
                                  </span>
                                  <span className="text-xs font-bold text-gray-900 dark:text-gray-200 font-outfit">
                                    {t.ticker}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono font-bold">
                                    x{t.quantity}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                                  isSuccess
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25"
                                    : "bg-red-500/10 text-red-500 border border-red-500/25"
                                }`}>
                                  {t.status}
                                </span>
                              </div>

                              <p className="text-[10px] text-gray-500 dark:text-gray-405 leading-relaxed font-outfit">
                                {t.reason}
                              </p>

                              <div className="flex justify-between items-center text-[9px] text-gray-400 font-mono pt-1 border-t border-gray-100 dark:border-white/5">
                                <span>Risk: {t.riskPercentage}%</span>
                                <span>{new Date(t.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto border-t border-gray-200 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-450 dark:text-gray-500 font-outfit">
                    <span>Broker Logs (Mocked / Kite)</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-500">
                      <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
                      Risk Core Online
                    </span>
                  </div>
                </Card>
              </div>
            )}
    </div>
  );
};
export default DashboardPage;
