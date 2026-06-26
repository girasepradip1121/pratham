import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import API_BASE_URL from '../config/api';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  User, 
  Zap, 
  HelpCircle, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  ChevronRight
} from 'lucide-react';

const CollegePredictor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Inputs state
  const [examType, setExamType] = useState(searchParams.get('examType') || 'MHT-CET');
  const [scoreType, setScoreType] = useState(searchParams.get('scoreType') || 'percentile');
  const [scoreValue, setScoreValue] = useState(searchParams.get('scoreValue') || '95.0');
  const [category, setCategory] = useState(searchParams.get('category') || 'Open');
  const [gender, setGender] = useState(searchParams.get('gender') || 'Co-Ed');
  const [branch, setBranch] = useState(searchParams.get('branch') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'Anywhere');

  // Filter options state
  const [branchesList, setBranchesList] = useState(['CS/IT', 'Electrical', 'Mechanical', 'Civil', 'Pharmacy']);
  const [locationsList, setLocationsList] = useState(['Pune', 'Mumbai', 'Nashik', 'Aurangabad', 'Nagpur', 'Sangli', 'Karad']);

  // Results state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPredicted, setHasPredicted] = useState(false);

  // Fetch filter list from API if available
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/filter-options`)
      .then(res => res.json())
      .then(data => {
        if (data.branches) setBranchesList(data.branches);
        if (data.locations) setLocationsList(data.locations);
      })
      .catch(err => console.error('Error loading filter lists, using defaults:', err));
  }, []);

  // Run initial prediction if params are in URL
  useEffect(() => {
    if (searchParams.get('scoreValue')) {
      handlePredict();
    }
  }, [searchParams]);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setHasPredicted(true);

    try {
      const url = `${API_BASE_URL}/api/public/predict-colleges?examType=${examType}&scoreType=${scoreType}&scoreValue=${scoreValue}&category=${category}&gender=${gender}&branch=${branch}&location=${location}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        setResults(data);
      } else {
        setError(data.message || 'Failed to predict colleges');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getChanceStyle = (chance) => {
    switch (chance) {
      case 'High':
        return {
          bg: 'bg-green-500/10 border-green-500/20 text-green-400',
          indicator: 'bg-green-500',
          text: 'High Chance'
        };
      case 'Medium':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
          indicator: 'bg-yellow-500',
          text: 'Medium Chance'
        };
      case 'Low':
      default:
        return {
          bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
          indicator: 'bg-purple-500',
          text: 'Dream / Low Chance'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Background blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 mb-4 border border-primary-500/20">
            <Zap size={12} className="fill-current" /> CAP Cutoff Matcher
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            College Predictor
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Discover Maharashtra's engineering and pharmacy colleges matching your exam score and category.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Predictor Form Panel */}
          <div className="lg:col-span-1 glass p-6 rounded-3xl border border-white/10 h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Filter className="text-primary-500" size={18} />
              <h2 className="text-lg font-bold text-white">Find Colleges</h2>
            </div>

            <form onSubmit={handlePredict} className="space-y-4 text-sm">
              {/* Exam */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Entrance Exam</label>
                <select 
                  value={examType} 
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                >
                  <option value="MHT-CET">MHT-CET</option>
                  <option value="JEE Main">JEE Main</option>
                </select>
              </div>

              {/* Score Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Score Type</label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setScoreType('percentile')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      scoreType === 'percentile' ? 'bg-primary-500 text-black font-semibold' : 'text-gray-400'
                    }`}
                  >
                    Percentile
                  </button>
                  <button
                    type="button"
                    onClick={() => setScoreType('rank')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      scoreType === 'rank' ? 'bg-primary-500 text-black font-semibold' : 'text-gray-400'
                    }`}
                  >
                    Rank
                  </button>
                </div>
              </div>

              {/* Score Value */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  {scoreType === 'percentile' ? 'Enter Percentile' : 'Enter Rank'}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  required
                  value={scoreValue}
                  onChange={(e) => setScoreValue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-primary-500 outline-none"
                  placeholder={scoreType === 'percentile' ? 'e.g. 96.5' : 'e.g. 15000'}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                >
                  <option value="Open">Open / General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="VJ/NT">VJ / NT</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gender</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                >
                  <option value="Co-Ed">Male / Co-Ed</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preferred Branch</label>
                <select 
                  value={branch} 
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                >
                  <option value="All">All Branches</option>
                  {branchesList.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preferred Location</label>
                <select 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                >
                  <option value="Anywhere">Anywhere in Maharashtra</option>
                  {locationsList.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full py-3.5 font-bold mt-2">
                Predict Colleges
              </Button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6">
            
            {loading ? (
              <div className="glass p-12 rounded-3xl border border-white/10 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400">Comparing your score against millions of cutoff points...</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-3xl text-center">
                {error}
              </div>
            ) : !hasPredicted ? (
              <div className="glass p-16 rounded-3xl border border-white/10 text-center space-y-6">
                <div className="w-20 h-20 bg-primary-500/10 text-primary-400 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Start Predictor</h3>
                  <p className="text-gray-400 max-w-md mx-auto">Fill out your percentile or rank filters on the left and click "Predict Colleges" to see your matching options.</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="glass p-16 rounded-3xl border border-white/10 text-center space-y-6">
                <div className="w-16 h-16 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <HelpCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">No colleges match your score</h3>
                  <p className="text-gray-400 max-w-sm mx-auto">Try widening your filters by selecting "Anywhere" for location or "All Branches" for preferred branch.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Result header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-white font-serif">
                    We found {results.length} matching college options
                  </h3>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-500" /> High Chance
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full font-semibold">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium Chance
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-semibold">
                      <span className="w-2 h-2 rounded-full bg-purple-500" /> Low Chance
                    </span>
                  </div>
                </div>

                {/* College Cards Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {results.map((item) => {
                    const style = getChanceStyle(item.chance);
                    return (
                      <div 
                        key={item.id} 
                        className="glass border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-primary-500/30 hover:bg-white/[0.01] transition-all flex flex-col justify-between"
                      >
                        {/* Top indicators */}
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">
                            Code: {item.collegeCode}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}`}>
                            {style.text}
                          </span>
                        </div>

                        {/* Title & branch */}
                        <div>
                          <h4 className="text-white font-bold leading-snug group-hover:text-primary-400 transition-colors mb-2">
                            {item.collegeName}
                          </h4>
                          
                          <div className="space-y-1.5 mb-4 text-xs text-gray-400">
                            <p className="flex items-center gap-1.5">
                              <BookOpen size={14} className="text-primary-500" /> {item.branch}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-primary-500" /> {item.location}
                            </p>
                          </div>
                        </div>

                        {/* Cutoffs footer */}
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">Cutoff Percentile</span>
                            <span className="text-white font-bold font-mono text-sm">{item.cutoffPercentile}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">Cutoff Rank</span>
                            <span className="text-white font-bold font-mono text-sm">~ {item.cutoffRank.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">Margin</span>
                            <span className={`font-bold font-mono text-sm ${item.difference >= 0 ? 'text-green-400' : 'text-purple-400'}`}>
                              {item.difference >= 0 ? `+${item.difference}` : item.difference}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Call to action for counseling */}
                <div className="glass border border-primary-500/20 bg-primary-500/[0.02] p-8 rounded-3xl mt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-2xl rounded-full" />
                  
                  <div className="space-y-2 relative z-10 max-w-xl">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Star size={18} className="fill-primary-500 text-primary-500" /> Unlock Premium Personalized College List
                    </h4>
                    <p className="text-sm text-gray-400">
                      Predictions are advisory. To secure admission in the absolute best college for your score, let Career Counsellor Pradip Girase design your CAP round option list 1-on-1.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const pricingSec = document.getElementById('pricing');
                      if (pricingSec) {
                        pricingSec.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/#pricing');
                      }
                    }}
                    className="flex-shrink-0 bg-primary-500 hover:bg-primary-600 text-black font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition-all relative z-10"
                  >
                    View Counselling Plans <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegePredictor;
