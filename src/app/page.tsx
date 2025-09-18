import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Aplikasi Deteksi AI
        </h1>
        <p className="text-lg text-center text-gray-600 mb-6">
          Platform deteksi berbasis AI untuk hewan, tumbuhan, sejarah, dan analisis teks
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          <Link href="/deteksi-hewan" className="group">
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Deteksi Hewan
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Upload foto hewan dan masukkan makanannya untuk identifikasi jenis hewan yang akurat
              </p>
            </div>
          </Link>

          <Link href="/deteksi-tumbuhan" className="group">
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Deteksi Tumbuhan
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Upload foto tumbuhan untuk mendapatkan identifikasi spesies yang tepat dan akurat
              </p>
            </div>
          </Link>

          <Link href="/deteksi-obat" className="group">
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Deteksi Obat Herbal
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Identifikasi tumbuhan obat dan pelajari khasiat serta cara penggunaannya
              </p>
            </div>
          </Link>

          <Link href="/deteksi-sejarah" className="group">
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Deteksi Sejarah
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Identifikasi tokoh sejarah dan dapatkan biografi serta informasi bersejarah
              </p>
            </div>
          </Link>

          <Link href="/deteksi-teks" className="group">
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Analisis Teks
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Masukkan kalimat untuk menganalisis apakah berupa argumen atau fakta
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Powered by AI • Analisis akurat dan real-time
          </p>
        </div>
      </div>
    </div>
  );
}
