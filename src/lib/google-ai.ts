import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeImageWithAI(
  imageBase64: string,
  prompt: string
): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Gagal menganalisis gambar. Silakan coba lagi.');
  }
}

export async function analyzeTextWithAI(
  text: string,
  analysisType: 'sentiment' | 'language' | 'keywords' | 'factargument'
): Promise<string> {
  try {
    let prompt = '';
    
    switch (analysisType) {
      case 'sentiment':
        prompt = `Analisis sentimen teks ini dengan format bersih:

😊 SENTIMEN: [POSITIF/NEGATIF/NETRAL]

ANALISIS:
• Skor: [1-10] ([penjelasan singkat])
• Emosi: [emosi dominan yang terdeteksi]
• Indikator: [kata/frasa kunci yang menunjukkan sentimen]

KESIMPULAN:
[1 kalimat ringkasan tentang sentimen teks]

Kepercayaan: [XX]%

Teks: "${text}"

Jawab tanpa menggunakan format markdown atau simbol bintang.`;
        break;
        
      case 'language':
        prompt = `Deteksi bahasa teks ini dengan format bersih:

🌍 BAHASA: [Nama Bahasa]

ANALISIS:
• Kode: [ISO code]
• Kepercayaan: [XX]%
• Indikator: [kata/frasa yang menunjukkan bahasa ini]

CIRI KHAS:
[1-2 ciri unik bahasa yang terdeteksi]

Teks: "${text}"

Jawab tanpa menggunakan format markdown atau simbol bintang.`;
        break;
        
      case 'keywords':
        prompt = `Ekstrak kata kunci dari teks ini dengan format bersih:

🔑 KATA KUNCI UTAMA:
1. [kata 1] - [relevansi]
2. [kata 2] - [relevansi]  
3. [kata 3] - [relevansi]
4. [kata 4] - [relevansi]
5. [kata 5] - [relevansi]

TEMA: [tema utama teks]
KATEGORI: [kategori/bidang teks]

Teks: "${text}"

Jawab tanpa menggunakan format markdown atau simbol bintang.`;
        break;
        
      case 'factargument':
        prompt = `Analisis teks ini untuk menentukan apakah berupa fakta atau argumen:

📊 JENIS: [FAKTA / ARGUMEN / CAMPURAN]

ANALISIS:
• Klasifikasi: [pernyataan objektif/subjektif]
• Bukti: [ada data pendukung/berdasarkan opini]
• Sifat: [dapat diverifikasi/bersifat persuasif]

PENJELASAN:
[1-2 kalimat mengapa dikategorikan sebagai fakta atau argumen]

INDIKATOR:
• [kata/frasa yang menunjukkan fakta atau argumen]

KEPERCAYAAN: [XX]%

Teks: "${text}"

Jawab tanpa menggunakan format markdown atau simbol bintang.`;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error('Gagal menganalisis teks. Silakan coba lagi.');
  }
}

export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}