import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
} from "lucide-react";

// ------- Types -------

interface KiteStatus {
  liveMode: boolean;
  credentialsConfigured: boolean;
  mode: "LIVE" | "SIMULATION";
  message: string;
}

interface KiteQuote {
  ticker: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  exchange?: string;
  mode: string;
  live: boolean;
}

interface TradeResult {
  status: string;
  ticker: string;
  action: string;
  quantity: number;
  mode: string;
  executionReport: string;
  entryPrice?: number;
  stopLossPrice?: number;
}

// ------- Popular NSE Tickers -------

const POPULAR_TICKERS = [
  "RELIANCE", "TCS", "INFY", "HDFC", "WIPRO",
  "BAJFINANCE", "ICICIBANK", "SBIN", "AAPL", "TATAMOTORS",
];

// ------- Component -------

export const AutoTradePage = () => {
  const [kiteStatus, setKiteStatus] = useState<KiteStatus | null>(null);
  const [ticker, setTicker] = useState("RELIANCE");
  const [customTicker, setCustomTicker] = useState("");
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState(5);
  const [stopLossPct, setStopLossPct] = useState(2.0);

  const [quote, setQuote] = useState<KiteQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [tradeError, setTradeError] = useState<string | null>(null);

  const activeTicker = customTicker.trim().toUpperCase() || ticker;

  // Fetch Kite connection status on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/kite/status")
      .then((r) => r.json())
      .then(setKiteStatus)
      .catch(() => {});
  }, []);

  // Auto-fetch quote when ticker changes
  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTicker]);

  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/kite/quote?ticker=${activeTicker}`);
      if (!res.ok) throw new Error("Quote fetch failed");
      const data = await res.json();
      setQuote(data);
    } catch (e: any) {
      setQuoteError("Failed to fetch quote. Ensure backend is running.");
    } finally {
      setQuoteLoading(false);
    }
  };

  const runAutoTrade = async () => {
    setTradeLoading(true);
    setTradeResult(null);
    setTradeError(null);
    try {
      const res = await fetch("http://localhost:8000/api/auto-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: activeTicker,
          action,
          quantity,
          stop_loss_pct: stopLossPct,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Auto-trade failed");
      }
      const result = await res.json();
      setTradeResult(result);
    } catch (e: any) {
      setTradeError(e.message);
    } finally {
      setTradeLoading(false);
    }
  };

  // Computed stop-loss preview
  const stopLossPreview =
    quote
      ? action === "BUY"
        ? (quote.ltp * (1 - stopLossPct / 100)).toFixed(2)
        : (quote.ltp * (1 + stopLossPct / 100)).toFixed(2)
      : null;

  const riskInRupees =
    quote && stopLossPreview
      ? (Math.abs(quote.ltp - parseFloat(stopLossPreview)) * quantity).toFixed(2)
      : null;

  return (
    <div className="max-w-[1200px] w-full mx-auto space-y-8">

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-950 to-cyan-900 border border-emerald-500/20 text-white rounded-3xl p-8 shadow-xl shadow-emerald-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/25 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-300 tracking-wider uppercase font-outfit">
            <Zap className="w-3.5 h-3.5" />
            Kite Connect Auto Trade Agent
          </span>
          <h2 className="text-3xl font-extrabold font-outfit tracking-tight">
            Automated Trade Execution
          </h2>
          <p className="text-sm text-emerald-200/90 leading-relaxed font-outfit">
            Select a stock, configure your risk parameters, and let the AI agent fetch live prices,
            calculate stop-losses, and execute a protected order via Zerodha Kite Connect.
            All trades run in <span className="font-bold text-white">simulation mode</span> until
            you plug in your Kite credentials.
          </p>
        </div>
      </div>

      {/* Kite Status Badge */}
      {kiteStatus && (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-outfit ${
          kiteStatus.mode === "LIVE"
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
            : "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300"
        }`}>
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">{kiteStatus.mode} MODE — </span>
            {kiteStatus.message}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

        {/* Left Panel: Order Configuration */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-gray-200 dark:border-white/5">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-base font-extrabold font-outfit text-gray-950 dark:text-white mb-4">
                  Order Configuration
                </h3>

                {/* Ticker Selection */}
                <div className="space-y-3 mb-5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                    Stock Ticker
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {POPULAR_TICKERS.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setTicker(t); setCustomTicker(""); }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border ${
                          activeTicker === t && !customTicker
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      placeholder="Or type custom ticker…"
                      value={customTicker}
                      onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all uppercase"
                    />
                  </div>
                </div>

                {/* BUY / SELL Toggle */}
                <div className="space-y-2 mb-5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                    Action
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAction("BUY")}
                      className={`py-3 rounded-2xl text-sm font-extrabold font-outfit flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                        action === "BUY"
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : "border-gray-200 dark:border-white/10 text-gray-500 hover:border-emerald-500/30"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" /> BUY
                    </button>
                    <button
                      onClick={() => setAction("SELL")}
                      className={`py-3 rounded-2xl text-sm font-extrabold font-outfit flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                        action === "SELL"
                          ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20"
                          : "border-gray-200 dark:border-white/10 text-gray-500 hover:border-red-500/30"
                      }`}
                    >
                      <TrendingDown className="w-4 h-4" /> SELL
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2 mb-5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                    Quantity (Shares)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all font-outfit"
                  />
                </div>

                {/* Stop Loss % */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                    <span>Stop-Loss Protection</span>
                    <span className="text-emerald-500">{stopLossPct}%</span>
                  </label>
                  <input
                    type="range"
                    min={0.5} max={10} step={0.5}
                    value={stopLossPct}
                    onChange={(e) => setStopLossPct(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>0.5% (Tight)</span>
                    <span>5%</span>
                    <span>10% (Wide)</span>
                  </div>
                </div>
              </div>

              {/* Risk Preview */}
              {quote && stopLossPreview && (
                <div className="bg-gray-50 dark:bg-[#0c0f18]/40 border border-gray-100 dark:border-white/5 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Risk Preview</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Entry (LTP)</span>
                      <span className="font-bold font-mono text-gray-900 dark:text-white">₹{quote.ltp}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Stop-Loss</span>
                      <span className={`font-bold font-mono ${action === "BUY" ? "text-red-500" : "text-amber-500"}`}>
                        ₹{stopLossPreview}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Qty × Risk/Share</span>
                      <span className="font-bold font-mono text-gray-900 dark:text-white">
                        {quantity} × ₹{Math.abs(quote.ltp - parseFloat(stopLossPreview)).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Max ₹ at Risk</span>
                      <span className="font-bold font-mono text-red-500">₹{riskInRupees}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Run Agent Button */}
              <button
                onClick={runAutoTrade}
                disabled={tradeLoading}
                className={`w-full py-4 rounded-2xl text-sm font-extrabold font-outfit flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                  action === "BUY"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/20 active:scale-[0.99]"
                    : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-red-500/20 active:scale-[0.99]"
                }`}
              >
                {tradeLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Agent Executing Trade…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Run Agent — {action} {quantity}× {activeTicker}
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>

        {/* Right Panel: Live Quote + Trade Result */}
        <div className="xl:col-span-3 space-y-6">

          {/* Live Quote Card */}
          <Card className="border border-gray-200 dark:border-white/5">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-extrabold font-outfit text-gray-950 dark:text-white">
                    Market Quote — {activeTicker}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-outfit">
                    {quote?.live ? "Live via Kite Connect" : "Simulated price feed"}
                  </p>
                </div>
                <button
                  onClick={fetchQuote}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${quoteLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {quoteError && (
                <div className="p-3 bg-red-500/5 border border-red-500/15 text-red-500 rounded-xl text-xs text-center">{quoteError}</div>
              )}

              {!quoteError && quote && (
                <>
                  {/* LTP Hero */}
                  <div className="text-center py-6 border border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-[#0c0f18]/30 mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Last Traded Price</span>
                    <span className="text-4xl font-black font-mono text-gray-950 dark:text-white">
                      ₹{quote.ltp.toFixed(2)}
                    </span>
                    <span className={`mt-1 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      quote.live
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {quote.live ? "● LIVE" : "◌ SIMULATED"}
                    </span>
                  </div>

                  {/* OHLC Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Open", value: quote.open },
                      { label: "High", value: quote.high, color: "text-emerald-500" },
                      { label: "Low", value: quote.low, color: "text-red-500" },
                      { label: "Close", value: quote.close },
                    ].map((item) => (
                      <div key={item.label} className="bg-white dark:bg-[#0a0d16]/40 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-center">
                        <span className="text-[10px] text-gray-400 block uppercase tracking-wide mb-1">{item.label}</span>
                        <span className={`text-sm font-bold font-mono ${item.color || "text-gray-900 dark:text-white"}`}>
                          ₹{item.value.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-center text-[11px] text-gray-400 font-outfit">
                    Volume: {quote.volume.toLocaleString("en-IN")} shares · Exchange: {quote.exchange}
                  </div>
                </>
              )}

              {quoteLoading && !quote && (
                <div className="py-10 flex flex-col items-center text-gray-400">
                  <Activity className="w-7 h-7 animate-spin text-emerald-500 mb-2" />
                  <span className="text-xs">Fetching market quote…</span>
                </div>
              )}
            </div>
          </Card>

          {/* Trade Execution Result */}
          {(tradeLoading || tradeResult || tradeError) && (
            <Card className="border border-gray-200 dark:border-white/5">
              <div className="p-6">
                <h3 className="text-base font-extrabold font-outfit text-gray-950 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Agent Execution Report
                </h3>

                {tradeLoading && (
                  <div className="py-10 flex flex-col items-center text-gray-400">
                    <Activity className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
                    <span className="text-sm font-outfit">Auto Trade Agent is running…</span>
                    <span className="text-xs text-gray-400 mt-1">Fetching quote → computing stop-loss → placing order</span>
                  </div>
                )}

                {tradeError && (
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-500 font-outfit">{tradeError}</div>
                  </div>
                )}

                {tradeResult && !tradeLoading && (
                  <div className="space-y-4">
                    {/* Summary Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Ticker", value: tradeResult.ticker },
                        { label: "Action", value: tradeResult.action, color: tradeResult.action === "BUY" ? "text-emerald-500" : "text-red-500" },
                        { label: "Quantity", value: `${tradeResult.quantity} shares` },
                        { label: "Entry Price", value: tradeResult.entryPrice ? `₹${tradeResult.entryPrice}` : "—" },
                        { label: "Stop-Loss", value: tradeResult.stopLossPrice ? `₹${tradeResult.stopLossPrice}` : "—", color: "text-amber-500" },
                        { label: "Mode", value: tradeResult.mode, color: tradeResult.mode === "LIVE" ? "text-emerald-500" : "text-amber-500" },
                      ].map((item) => (
                        <div key={item.label} className="bg-gray-50 dark:bg-[#0c0f18]/40 border border-gray-100 dark:border-white/5 rounded-xl p-3">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">{item.label}</span>
                          <span className={`text-sm font-bold font-mono ${item.color || "text-gray-900 dark:text-white"}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Full Agent Report */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Full Agent Report</span>
                      <div className="bg-gray-950 dark:bg-black/60 text-emerald-400 font-mono text-xs leading-relaxed p-5 rounded-2xl whitespace-pre-wrap border border-white/5 max-h-80 overflow-y-auto">
                        {tradeResult.executionReport}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-outfit font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Trade pipeline completed successfully.
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Setup Guide Card */}
          {!tradeResult && !tradeLoading && (
            <Card className="border border-dashed border-gray-200 dark:border-white/5">
              <div className="p-6 space-y-4">
                <h3 className="text-sm font-bold font-outfit text-gray-500 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  How to Enable Live Trading
                </h3>
                <ol className="space-y-3 text-xs text-gray-500 dark:text-gray-400 font-outfit">
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
                    Create a developer app at <a href="https://developers.kite.trade" target="_blank" rel="noreferrer" className="text-violet-500 underline">developers.kite.trade</a> to get your <strong className="text-gray-700 dark:text-gray-300">API Key</strong> and <strong className="text-gray-700 dark:text-gray-300">API Secret</strong>.
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center font-bold text-[10px]">2</span>
                    Set <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-800 dark:text-gray-200">KITE_API_KEY</code> and <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-800 dark:text-gray-200">KITE_API_SECRET</code> in the backend <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-800 dark:text-gray-200">.env</code> file.
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center font-bold text-[10px]">3</span>
                    Each day, authenticate via the Kite OAuth login URL and set the returned <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-800 dark:text-gray-200">KITE_ACCESS_TOKEN</code> in <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">.env</code>.
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center font-bold text-[10px]">4</span>
                    Set <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-800 dark:text-gray-200">KITE_LIVE_MODE=true</code> in <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">.env</code> and restart the backend.
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold text-[10px]">5</span>
                    Install the SDK: <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-800 dark:text-gray-200">pip install kiteconnect</code>
                  </li>
                </ol>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
