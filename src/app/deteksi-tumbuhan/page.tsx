"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeImageWithAI, convertImageToBase64 } from "@/lib/google-ai";

export default function DeteksiTumbuhan() {
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
      
      // Create simple and clean prompt for plant identification
      const prompt = `Analisis gambar tumbuhan ini dan berikan informasi dalam format bersih berikut:

🌱 IDENTIFIKASI:
• Nama: [nama Indonesia] (nama Latin)
• Familia: [nama familia]
• Jenis: [pohon/semak/herba/tanaman merambat]

🍃 CIRI KHAS:
• Daun: [bentuk singkat]
• Bunga: [warna/bentuk jika ada]
• Habitat: [dimana tumbuh]

💡 KEGUNAAN:
• [kegunaan utama: hias/obat/pangan/industri]
• [manfaat khusus jika ada]

🌿 CARA RAWAT:
• Cahaya: [penuh/teduh/sebagian]
• Air: [sering/jarang/sedang]
• Tanah: [jenis tanah yang cocok]

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
    setResult("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Deteksi Tumbuhan
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Upload foto tumbuhan untuk mendapatkan identifikasi spesies yang tepat dan akurat
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Foto Tumbuhan
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
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
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
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
                  "Deteksi Tumbuhan"
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
                    <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                      <h4 className="font-semibold text-blue-800 mb-2">Hasil Analisis AI:</h4>
                      <div className="text-blue-700 whitespace-pre-wrap text-sm">{result}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      * Hasil analisis menggunakan Google AI Studio (Gemini) untuk akurasi maksimal
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p>Hasil deteksi akan muncul di sini</p>
                    <p className="text-sm mt-2">Upload foto tumbuhan untuk memulai identifikasi</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Tips untuk Hasil Terbaik:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Gunakan pencahayaan yang baik</li>
                <li>✓ Foto dari berbagai sudut</li>
                <li>✓ Fokus pada detail karakteristik</li>
              </ul>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Sertakan ukuran referensi</li>
                <li>✓ Hindari bayangan yang menghalangi</li>
                <li>✓ Foto bagian bunga atau buah jika ada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}