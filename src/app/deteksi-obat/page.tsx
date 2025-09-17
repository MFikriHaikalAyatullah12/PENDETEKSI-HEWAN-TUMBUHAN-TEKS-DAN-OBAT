"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeImageWithAI, convertImageToBase64 } from "@/lib/google-ai";

export default function DeteksiObat() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
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
    if (!selectedImage) {
      alert("Silakan upload gambar tumbuhan terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert image to base64
      const imageBase64 = await convertImageToBase64(selectedImage);
      
      // Create concise prompt for medicinal plant identification
      const prompt = `Analisis gambar tumbuhan ini untuk deteksi obat herbal:

🌿 STATUS: [TUMBUHAN OBAT / BUKAN TUMBUHAN OBAT / TIDAK PASTI]

IDENTIFIKASI:
• Nama: [nama Indonesia] (nama Latin)
• Bagian obat: [daun/akar/batang/bunga/buah]

💊 KHASIAT UTAMA:
• Untuk mengobati: [1-2 penyakit utama]
• Cara pakai: [direbus/ditumbuk/dimakan/dioleskan]

⚠️ KEAMANAN:
• Status: [AMAN/HATI-HATI/BERBAHAYA]
• Catatan: [peringatan singkat jika ada]

� INFO SINGKAT:
• Nama lokal: [jika ada]
• Habitat: [dimana tumbuh]

Kepercayaan: [XX]%

PERINGATAN: Konsultasi dokter sebelum digunakan untuk pengobatan.

Jawab singkat dan jelas tanpa format markdown atau simbol bintang.`;

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
    setResult("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Deteksi Tumbuhan Obat
            </h1>
            <p className="text-gray-600">
              Upload foto tumbuhan untuk mengetahui apakah termasuk tanaman obat dan khasiatnya
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Foto Tumbuhan
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors duration-200">
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
                onClick={handleDetection}
                disabled={isLoading || !selectedImage}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
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
                  "🔍 Deteksi Tumbuhan Obat"
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
                Hasil Analisis Obat
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                {result ? (
                  <div className="space-y-4">
                    <div className="bg-emerald-100 border-l-4 border-emerald-500 p-4 rounded">
                      <h4 className="font-semibold text-emerald-800 mb-2">Hasil Analisis AI:</h4>
                      <div className="text-emerald-700 whitespace-pre-wrap text-sm">{result}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      * Hasil analisis menggunakan Google AI Studio (Gemini) untuk identifikasi tumbuhan obat
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                    </svg>
                    <p>Hasil deteksi akan muncul di sini</p>
                    <p className="text-sm mt-2">Upload foto tumbuhan untuk memulai analisis</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Warning & Info Section */}
          <div className="mt-8 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Peringatan Penting</h4>
                  <p className="text-sm text-yellow-700">
                    Informasi ini hanya untuk referensi. Selalu konsultasikan dengan ahli herbal, dokter, atau apoteker sebelum menggunakan tumbuhan untuk pengobatan. Penggunaan yang salah dapat berbahaya bagi kesehatan.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6">
              <h4 className="font-semibold text-emerald-800 mb-3">💡 Tips untuk Hasil Terbaik:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>✓ Foto seluruh tanaman jika memungkinkan</li>
                  <li>✓ Sertakan daun, batang, dan bunga</li>
                  <li>✓ Gunakan pencahayaan yang baik</li>
                </ul>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>✓ Hindari foto yang blur atau gelap</li>
                  <li>✓ Foto dari jarak yang cukup dekat</li>
                  <li>✓ Pastikan tanaman terlihat jelas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}