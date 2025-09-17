"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeTextWithAI } from "@/lib/google-ai";

export default function DeteksiTeks() {
  const [inputText, setInputText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<string>("sentiment");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTextAnalysis = async () => {
    if (!inputText.trim()) {
      alert("Silakan masukkan teks untuk dianalisis!");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await analyzeTextWithAI(
        inputText, 
        analysisType as 'sentiment' | 'language' | 'keywords' | 'factargument'
      );
      setResult(result);
    } catch (error) {
      console.error('Error:', error);
      setResult("Maaf, terjadi kesalahan saat menganalisis teks. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setInputText("");
    setResult("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Deteksi Teks
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Analisis teks untuk sentimen, bahasa, dan ekstraksi kata kunci
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Jenis Analisis
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white"
                >
                  <option value="sentiment" className="text-black">Analisis Sentimen</option>
                  <option value="language" className="text-black">Deteksi Bahasa</option>
                  <option value="keywords" className="text-black">Ekstraksi Kata Kunci</option>
                  <option value="factargument" className="text-black">Deteksi Fakta atau Argumen</option>
                </select>
              </div>

              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Masukkan Teks untuk Dianalisis
                </label>
                <textarea
                  id="text-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik atau paste teks yang ingin dianalisis di sini..."
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical text-black placeholder-gray-500"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Karakter: {inputText.length}
                </div>
              </div>

              <button
                onClick={handleTextAnalysis}
                disabled={isLoading || !inputText.trim()}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menganalisis...
                  </div>
                ) : (
                  "Analisis Teks"
                )}
              </button>

              {result && (
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Result Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Hasil Analisis
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                {result ? (
                  <div className="space-y-4">
                    <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Hasil {analysisType === "sentiment" ? "Analisis Sentimen" : 
                               analysisType === "language" ? "Deteksi Bahasa" : 
                               analysisType === "keywords" ? "Ekstraksi Kata Kunci" :
                               "Deteksi Fakta atau Argumen"}:
                      </h4>
                      <div className="text-purple-700 whitespace-pre-wrap text-sm">{result}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      * Hasil analisis menggunakan Google AI Studio (Gemini) untuk akurasi maksimal
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Hasil analisis akan muncul di sini</p>
                    <p className="text-sm mt-2">Masukkan teks untuk memulai analisis</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-purple-50 rounded-lg p-6">
            <h4 className="font-semibold text-purple-800 mb-3">Jenis Analisis yang Tersedia:</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-medium text-purple-700 mb-2">Analisis Sentimen</h5>
                <p className="text-sm text-gray-600">Menentukan apakah teks memiliki sentimen positif, negatif, atau netral</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-medium text-purple-700 mb-2">Deteksi Bahasa</h5>
                <p className="text-sm text-gray-600">Mengidentifikasi bahasa yang digunakan dalam teks (Indonesia/Inggris)</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-medium text-purple-700 mb-2">Kata Kunci</h5>
                <p className="text-sm text-gray-600">Mengekstrak kata-kata penting dan frekuensi kemunculannya</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-medium text-purple-700 mb-2">Fakta atau Argumen</h5>
                <p className="text-sm text-gray-600">Menentukan apakah teks berupa pernyataan fakta objektif atau argumen subjektif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}