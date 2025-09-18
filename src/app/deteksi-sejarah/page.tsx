"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeImageWithAI, convertImageToBase64 } from "@/lib/google-ai";

export default function DeteksiSejarah() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [textQuery, setTextQuery] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<string>("image"); // "image" atau "text"

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageDetection = async () => {
    if (!selectedImage) {
      alert("Silakan upload gambar terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    
    try {
      const imageBase64 = await convertImageToBase64(selectedImage);
      
      const prompt = `Analisis gambar ini untuk identifikasi tokoh sejarah, pahlawan, ilmuwan, atau peristiwa bersejarah:

🏛️ IDENTIFIKASI:
• Nama: [nama lengkap tokoh/peristiwa]
• Kategori: [Pahlawan Nasional/Ilmuwan/Tokoh Dunia/Peristiwa Sejarah]
• Periode: [tahun lahir-wafat atau tahun kejadian]
• Negara/Asal: [tempat asal atau lokasi peristiwa]

📚 BIOGRAFI SINGKAT:
• Latar belakang: [kelahiran, keluarga, pendidikan]
• Pencapaian utama: [kontribusi terpenting]
• Peran sejarah: [mengapa penting dalam sejarah]

⚔️ PERJUANGAN/KONTRIBUSI:
• [3-4 poin penting tentang perjuangan atau kontribusi]

🎯 WARISAN:
• Dampak: [pengaruh terhadap masa kini]
• Penghargaan: [gelar, monument, atau pengakuan]
• Pelajaran: [nilai yang bisa dipetik]

📅 PERISTIWA PENTING:
• [kronologi peristiwa penting dalam hidupnya]

🏆 FAKTA MENARIK:
• [2-3 fakta unik atau inspiratif]

Kepercayaan: [XX]%

Jawab dengan detail namun mudah dipahami, tanpa format markdown atau simbol bintang.`;

      const result = await analyzeImageWithAI(imageBase64, prompt);
      setResult(result);
    } catch (error) {
      console.error('Error:', error);
      setResult("Maaf, terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSearch = async () => {
    if (!textQuery.trim()) {
      alert("Silakan masukkan nama tokoh atau peristiwa sejarah!");
      return;
    }

    setIsLoading(true);
    
    try {
      // Untuk pencarian teks, kita buat prompt khusus tanpa gambar
      const prompt = `Berikan informasi lengkap tentang "${textQuery}" dalam konteks sejarah:

🏛️ IDENTIFIKASI:
• Nama lengkap: [nama resmi dan alias]
• Kategori: [Pahlawan Nasional/Ilmuwan/Tokoh Dunia/Peristiwa Sejarah]
• Periode: [tahun lahir-wafat atau tahun kejadian]
• Negara/Asal: [tempat asal atau lokasi peristiwa]

📚 BIOGRAFI SINGKAT:
• Latar belakang: [kelahiran, keluarga, pendidikan]
• Pencapaian utama: [kontribusi terpenting]
• Peran sejarah: [mengapa penting dalam sejarah]

⚔️ PERJUANGAN/KONTRIBUSI:
• [3-4 poin penting tentang perjuangan atau kontribusi]

🎯 WARISAN:
• Dampak: [pengaruh terhadap masa kini]
• Penghargaan: [gelar, monument, atau pengakuan]
• Pelajaran: [nilai yang bisa dipetik]

📅 PERISTIWA PENTING:
• [kronologi peristiwa penting dalam hidupnya]

🏆 FAKTA MENARIK:
• [2-3 fakta unik atau inspiratif]

Jika "${textQuery}" adalah peristiwa sejarah, fokuskan pada latar belakang, kronologi, tokoh yang terlibat, dan dampaknya.

Jawab dengan detail namun mudah dipahami, tanpa format markdown atau simbol bintang.`;

      // Menggunakan model text-only untuk pencarian teks
      const response = await fetch('/api/text-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: textQuery, prompt }),
      });

      if (!response.ok) {
        throw new Error('Gagal mencari informasi');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      // Fallback menggunakan fungsi text analysis yang sudah ada
      try {
        const { analyzeTextWithAI } = await import("@/lib/google-ai");
        const fallbackPrompt = `Berikan informasi sejarah lengkap tentang "${textQuery}" dengan format yang mudah dipahami. Sertakan biografi, perjuangan, dan warisan sejarahnya.`;
        const result = await analyzeTextWithAI(fallbackPrompt, 'keywords');
        setResult(result);
      } catch (fallbackError) {
        setResult("Maaf, tidak dapat menemukan informasi tentang tokoh atau peristiwa tersebut. Pastikan ejaan sudah benar.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setTextQuery("");
    setResult("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Deteksi Sejarah & Biografi
            </h1>
            <p className="text-gray-600">
              Upload foto tokoh sejarah atau cari informasi dengan mengetik nama
            </p>
          </div>

          {/* Mode Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setSearchMode("image")}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  searchMode === "image" 
                    ? "bg-amber-600 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📷 Upload Gambar
              </button>
              <button
                onClick={() => setSearchMode("text")}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  searchMode === "text" 
                    ? "bg-amber-600 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                🔍 Pencarian Teks
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {searchMode === "image" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Foto Tokoh Sejarah
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full h-48 object-contain mx-auto rounded-lg"
                          />
                        ) : (
                          <div className="space-y-2">
                            <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-gray-500">Klik untuk upload gambar</p>
                            <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleImageDetection}
                    disabled={isLoading || !selectedImage}
                    className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
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
                      "🔍 Deteksi Tokoh Sejarah"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="text-search" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Tokoh atau Peristiwa Sejarah
                    </label>
                    <input
                      id="text-search"
                      type="text"
                      value={textQuery}
                      onChange={(e) => setTextQuery(e.target.value)}
                      placeholder="Contoh: Pangeran Diponegoro, Soekarno, Proklamasi Kemerdekaan..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                    />
                  </div>

                  <button
                    onClick={handleTextSearch}
                    disabled={isLoading || !textQuery.trim()}
                    className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mencari...
                      </div>
                    ) : (
                      "🔍 Cari Informasi Sejarah"
                    )}
                  </button>
                </>
              )}

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
                Hasil Pencarian Sejarah
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                {result ? (
                  <div className="space-y-4">
                    <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded">
                      <h4 className="font-semibold text-amber-800 mb-2">Informasi Sejarah:</h4>
                      <div className="text-amber-700 whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      * Informasi berdasarkan data sejarah yang tersedia dan dianalisis dengan AI
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-16">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="mb-2">Informasi sejarah akan muncul di sini</p>
                    <p className="text-sm">Upload foto atau ketik nama untuk memulai pencarian</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 space-y-4">
            <div className="bg-amber-50 rounded-lg p-6">
              <h4 className="font-semibold text-amber-800 mb-3">💡 Fitur yang Tersedia:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-amber-700 mb-2">📷 Deteksi Gambar</h5>
                  <ul className="text-sm text-amber-600 space-y-1">
                    <li>• Pahlawan nasional Indonesia</li>
                    <li>• Tokoh dunia bersejarah</li>
                    <li>• Ilmuwan dan penemu terkenal</li>
                    <li>• Foto peristiwa bersejarah</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-amber-700 mb-2">🔍 Pencarian Teks</h5>
                  <ul className="text-sm text-amber-600 space-y-1">
                    <li>• Nama lengkap atau sebutan</li>
                    <li>• Peristiwa sejarah penting</li>
                    <li>• Periode atau era tertentu</li>
                    <li>• Organisasi dan pergerakan</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">ℹ️ Informasi</h4>
                  <p className="text-sm text-blue-700">
                    Aplikasi ini menggunakan AI untuk menganalisis gambar dan mencari informasi sejarah. 
                    Hasil dapat bervariasi tergantung kualitas gambar dan ketersediaan data sejarah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}