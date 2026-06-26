import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import api from '../../config/api';

const DataIngestion = () => {
  const [file, setFile] = useState(null);
  const [academicYear, setAcademicYear] = useState('2023');
  const [capRound, setCapRound] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('pdfFile', file);
    formData.append('academicYear', academicYear);
    formData.append('capRound', capRound);

    try {
      // Assuming admin uses the same api instance with token
      const response = await api.post('/advanced-predictor/admin/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload and parse PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Shield className="text-purple-500 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold font-serif">Admin Data Ingestion</h1>
          </div>
          <p className="text-gray-400">Upload official MHT CET CAP Round Cutoff PDFs to populate the Advanced Predictor Database.</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="2021">2021-2022</option>
                  <option value="2022">2022-2023</option>
                  <option value="2023">2023-2024</option>
                  <option value="2024">2024-2025</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">CAP Round</label>
                <select
                  value={capRound}
                  onChange={(e) => setCapRound(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="1">Round 1</option>
                  <option value="2">Round 2</option>
                  <option value="3">Round 3</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Upload PDF Document</label>
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors bg-white/[0.02]">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  <FileText size={48} className="text-gray-500 mb-4" />
                  <span className="text-purple-400 font-bold mb-1">Browse Files</span>
                  <span className="text-gray-500 text-xs">Supports official CET Cell cutoff PDFs (.pdf)</span>
                </label>
              </div>
              {file && (
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-purple-500" size={20} />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={20} />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="text-green-500" size={24} />
                  <h4 className="text-green-500 font-bold text-lg">Ingestion Successful!</h4>
                </div>
                <div className="space-y-2 text-sm text-green-400/80">
                  <p><strong>Total Extracted Candidates:</strong> {result.data.totalExtracted}</p>
                  <p><strong>Database Records Upserted:</strong> {result.data.processedRecords}</p>
                  <p className="text-xs mt-2 italic text-gray-400">The advanced predictor database has been updated with these historical heuristics.</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin">⚙️</span> Processing OCR & Ingesting...</>
              ) : (
                <><Upload size={20} /> Run Data Ingestion Pipeline</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataIngestion;
