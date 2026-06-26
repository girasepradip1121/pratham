import { useState } from 'react';
import { Shield, Sparkles, Building2, TrendingUp, Search, Filter, FileText } from 'lucide-react';

import VisualAnalytics from '../../components/Predictor/VisualAnalytics';
import API_BASE_URL from '../../config/api';

const AdvancedPredictor = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState({
    score: '',
    admissionType: 'Engineering',
    category: 'OPEN',
    district: ''
  });

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calling our newly isolated backend endpoint
      const response = await API_BASE_URL.post('/advanced-predictor/predict', filters);
      setResults(response.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch predictions. Please ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <Sparkles className="text-primary-500 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold font-serif">Advanced AI Predictor</h1>
          </div>
          <p className="text-gray-400">Enterprise-grade predictions using 5-year historical CAP data.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-gray-400" />
                <h3 className="font-bold text-lg">Smart Filters</h3>
              </div>

              <form onSubmit={handlePredict} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">MHT CET Score / Percentile</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={filters.score}
                    onChange={(e) => setFilters({ ...filters, score: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="e.g. 92.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Admission Type</label>
                  <select
                    value={filters.admissionType}
                    onChange={(e) => setFilters({ ...filters, admissionType: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="Engineering">First Year Engineering</option>
                    <option value="Pharmacy">First Year Pharmacy</option>
                    <option value="DSY">Direct Second Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <span className="animate-spin text-xl">⏳</span> : <><Search size={18} /> Run AI Prediction</>}
                </button>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            {!results ? (
              <div className="glass h-64 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="text-gray-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Analyze</h3>
                <p className="text-gray-400 max-w-md text-sm">Enter your scores and parameters on the left to generate your personalized AI prediction report across 300+ colleges.</p>
              </div>
            ) : results.results.length === 0 ? (
              <div className="glass p-8 rounded-2xl border border-white/10 text-center">
                <p className="text-gray-400">No data ingested yet. The database schema is ready, but historical CAP data needs to be uploaded via the Admin Panel.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold font-serif print:text-black">Your Customized AI Preference List</h2>
                  <button
                    onClick={() => window.print()}
                    className="bg-primary-500 hover:bg-primary-600 text-black font-bold py-2 px-4 rounded-xl text-sm transition-all print:hidden flex items-center gap-2"
                  >
                    <FileText size={16} /> Download Full Report
                  </button>
                </div>

                {results.results.map((item, idx) => (
                  <div key={idx} className="glass p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all print:border-black/10 print:break-inside-avoid print:shadow-none print:bg-white print:text-black mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary-500 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">#{idx + 1}</span>
                          <h3 className="text-xl font-bold text-white print:text-black flex items-center gap-2">
                            <Building2 size={20} className="text-primary-500 print:text-black" />
                            {item.institute.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-400 print:text-gray-600 pl-8">{item.institute.city}, {item.institute.district}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${item.prediction.classification === 'Safe' || item.prediction.classification === 'Very Safe' ? 'bg-green-500/10 text-green-500 border-green-500/20 print:bg-green-100 print:text-green-800' :
                          item.prediction.classification === 'Dream' ? 'bg-red-500/10 text-red-500 border-red-500/20 print:bg-red-100 print:text-red-800' :
                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 print:bg-yellow-100 print:text-yellow-800'
                          }`}>
                          {item.prediction.classification}
                        </div>
                        <p className="text-xs text-gray-500 print:text-gray-600 mt-2">AI Confidence: {item.prediction.confidenceScore}%</p>
                      </div>
                    </div>

                    <div className="pl-8">
                      <VisualAnalytics
                        cutoffs={item.cutoffs}
                        expectedPercentile={item.prediction.expectedPercentile || parseFloat(filters.score)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPredictor;
