"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeImageWithAI, convertImageToBase64 } from "@/lib/google-ai";

export default function DeteksiHewan() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [food, setFood] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDetection = async () => {
    if (!selectedImage || !food.trim()) {
      alert("Silakan upload gambar dan masukkan jenis makanan!");
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert image to base64
      const imageBase64 = await convertImageToBase64(selectedImage);
      
      // Create simple and clean prompt for animal identification
      const prompt = `Analisis gambar hewan ini dan berikan informasi dalam format bersih berikut:

🐾 MAKANAN: ${food}

IDENTIFIKASI:
• Nama: [nama Indonesia] (nama Latin)
• Jenis: [herbivora/karnivora/omnivora]
• Habitat: [dimana hidup]

ANALISIS MAKANAN:
✅ Cocok / ❌ Tidak Cocok / ⚠️ Hati-hati
Alasan: [penjelasan singkat]

FAKTA MENARIK:
• [1 fakta unik tentang hewan ini]
• [tips singkat jika dipelihara]

Tingkat Kepercayaan: [XX]%

Jawab dengan singkat dan informatif tanpa menggunakan format markdown atau simbol bintang.`;

      const result = await analyzeImageWithAI(imageBase64, prompt);
      setResult(result);
    } catch (error) {
      console.error('Error:', error);
      setResult("Maaf, terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setFood("");
    setResult("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Deteksi Hewan
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Upload foto hewan dan masukkan jenis makanannya untuk identifikasi
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Foto Hewan
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
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

              <div>
                <label htmlFor="food-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Makanan Hewan
                </label>
                <input
                  id="food-input"
                  type="text"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="Contoh: rumput, daging, biji-bijian, ikan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleDetection}
                disabled={isLoading || !selectedImage || !food.trim()}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  "Deteksi Hewan"
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
                Hasil Deteksi
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                {result ? (
                  <div className="space-y-4">
                    <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
                      <h4 className="font-semibold text-green-800 mb-2">Hasil Analisis AI:</h4>
                      <div className="text-green-700 whitespace-pre-wrap text-sm">{result}</div>
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
                    <p>Hasil deteksi akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}