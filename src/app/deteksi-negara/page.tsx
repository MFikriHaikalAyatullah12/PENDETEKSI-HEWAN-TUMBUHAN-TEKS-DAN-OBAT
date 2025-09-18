'use client';

import { useState } from 'react';

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: { [key: string]: { common: string; official: string } };
  };
  latlng: number[];
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  region: string;
  subregion: string;
  capital?: string[];
  area: number;
  timezones: string[];
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  independent?: boolean;
  unMember?: boolean;
  status?: string;
  landlocked?: boolean;
  borders?: string[];
  fifa?: string;
  continents?: string[];
  startOfWeek?: string;
  capitalInfo?: {
    latlng?: number[];
  };
  postalCode?: {
    format?: string;
    regex?: string;
  };
  gini?: { [key: string]: number };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
}

export default function DeteksiNegara() {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fungsi untuk mengkonversi koordinat desimal ke format derajat, menit, detik
  const convertToDMS = (decimal: number, isLatitude: boolean) => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = Math.round(((absolute - degrees) * 60 - minutes) * 60);
    
    let direction;
    if (isLatitude) {
      direction = decimal >= 0 ? 'LU' : 'LS'; // Lintang Utara / Lintang Selatan
    } else {
      direction = decimal >= 0 ? 'BT' : 'BB'; // Bujur Timur / Bujur Barat
    }
    
    return `${degrees}° ${minutes}′ ${seconds}″ ${direction}`;
  };

  // Fungsi untuk format koordinat lengkap
  const formatCoordinates = (latlng: number[]) => {
    if (!latlng || latlng.length < 2) return 'Koordinat tidak tersedia';
    
    const latitude = convertToDMS(latlng[0], true);
    const longitude = convertToDMS(latlng[1], false);
    
    return `${latitude}, ${longitude}`;
  };

  const searchCountries = async (query: string) => {
    if (!query.trim()) {
      setCountries([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Menggunakan REST Countries API v3.1 dengan fields lengkap untuk data yang akurat
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${query}?fields=name,official,capital,region,subregion,population,area,borders,languages,currencies,timezones,latlng,landlocked,independent,unMember,status,flags,coatOfArms,capitalInfo,postalCode,startOfWeek,continents,gini,fifa`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Negara tidak ditemukan. Coba gunakan nama negara dalam bahasa Inggris (contoh: Indonesia, Singapore, Malaysia)');
          setCountries([]);
          return;
        }
        throw new Error('Gagal mengambil data negara dari server');
      }

      const data = await response.json();
      
      // Validasi dan filter data yang diterima
      const validCountries = data.filter((country: Country) => {
        return country.name && country.name.common && country.flags && country.latlng;
      });

      if (validCountries.length === 0) {
        setError('Data negara tidak valid atau tidak lengkap');
        setCountries([]);
        return;
      }

      setCountries(validCountries);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data negara. Periksa koneksi internet Anda.');
      setCountries([]);
      console.error('Error fetching country data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCountries(searchTerm);
  };

  const getCountryHistory = (countryName: string) => {
    // Data sejarah dan sektor unggulan yang lebih lengkap dan akurat (2024-2025)
    const histories: { [key: string]: { history: string; sectors: string[] } } = {
      'Indonesia': {
        history: 'Republik Indonesia adalah negara kepulauan terbesar di dunia yang merdeka pada 17 Agustus 1945. Memiliki sejarah panjang sebagai jalur perdagangan rempah-rempah dunia dan kini berkembang pesat dengan ekonomi digital dan pariwisata.',
        sectors: ['Pertanian & Kelapa Sawit', 'Pertambangan Batubara', 'Manufaktur Tekstil', 'Pariwisata', 'Teknologi Digital', 'Perikanan', 'Kehutanan']
      },
      'Malaysia': {
        history: 'Malaysia adalah negara federal yang terdiri dari 13 negeri dan 3 wilayah federal. Negara ini dikenal sebagai pusat keuangan Islam dan penghasil minyak kelapa sawit terbesar dunia.',
        sectors: ['Minyak Kelapa Sawit', 'Teknologi & Elektronik', 'Keuangan Islam', 'Pariwisata Halal', 'Otomotif', 'Petrokimia']
      },
      'Singapore': {
        history: 'Singapura adalah negara kota yang berkembang dari pelabuhan perdagangan menjadi pusat keuangan global dan hub teknologi terdepan di Asia Tenggara.',
        sectors: ['Keuangan & Perbankan', 'Teknologi Fintech', 'Logistik Maritim', 'Biomedis', 'Pariwisata Bisnis', 'Perdagangan Internasional']
      },
      'United States': {
        history: 'Amerika Serikat didirikan pada 1776 dan berkembang menjadi kekuatan ekonomi dan teknologi terbesar dunia dengan Silicon Valley sebagai pusat inovasi global.',
        sectors: ['Teknologi & Software', 'Keuangan Wall Street', 'Hiburan Hollywood', 'Aerospace & Pertahanan', 'Farmasi & Biotek', 'Energi Terbarukan']
      },
      'Japan': {
        history: 'Jepang mengalami transformasi dari era samurai menjadi negara industri maju dengan teknologi robotika dan otomotif yang memimpin dunia.',
        sectors: ['Otomotif Toyota-Honda', 'Robotika & AI', 'Elektronik & Gaming', 'Anime & Manga', 'Teknologi Ramah Lingkungan', 'Presisi Manufaktur']
      },
      'China': {
        history: 'Tiongkok dengan peradaban 5000 tahun kini menjadi pabrik dunia dan pemimpin dalam teknologi 5G, e-commerce, dan energi terbarukan.',
        sectors: ['Manufaktur & Ekspor', 'Teknologi 5G', 'E-commerce Alibaba', 'Energi Solar & Angin', 'High-Speed Rail', 'Artificial Intelligence']
      },
      'Germany': {
        history: 'Jerman adalah mesin ekonomi Eropa yang dikenal dengan presisi engineering, teknologi hijau, dan industri 4.0 yang mengintegrasikan IoT dalam manufaktur.',
        sectors: ['Otomotif Premium', 'Energi Terbarukan', 'Mesin Presisi', 'Industri 4.0', 'Teknologi Hijau', 'Farmasi & Kimia']
      },
      'South Korea': {
        history: 'Korea Selatan bangkit dari perang untuk menjadi negara maju dengan gelombang Hallyu (Korean Wave) dan teknologi semikonduktor terdepan.',
        sectors: ['Semikonduktor Samsung', 'K-Pop & Entertainment', 'Otomotif Hyundai-Kia', 'Teknologi 5G', 'Gaming & Esports', 'Kosmetik K-Beauty']
      },
      'India': {
        history: 'India adalah demokrasi terbesar dunia dengan ekonomi yang berkembang pesat, terutama dalam teknologi informasi dan farmasi generik.',
        sectors: ['IT & Software Services', 'Farmasi Generik', 'Teknologi Startup', 'Film Bollywood', 'Tekstil & Garmen', 'Space Technology']
      },
      'Australia': {
        history: 'Australia adalah negara benua dengan ekonomi yang didominasi oleh pertambangan dan agrikultur, serta menjadi gateway Asia-Pasifik.',
        sectors: ['Pertambangan Bijih Besi', 'Agrikultur & Daging Sapi', 'Pendidikan Internasional', 'Pariwisata', 'Energi LNG', 'Wine Export']
      },
      'Brazil': {
        history: 'Brazil adalah raksasa Amerika Latin dengan sumber daya alam melimpah dan industri agrikultur yang memimpin dunia dalam produksi kedelai dan kopi.',
        sectors: ['Agrikultur Kedelai', 'Produksi Kopi', 'Pertambangan', 'Minyak Bumi', 'Otomotif', 'Teknologi Fintech']
      },
      'Canada': {
        history: 'Kanada adalah negara yang kaya akan sumber daya alam dengan ekonomi yang stabil dan menjadi leader dalam teknologi AI dan clean energy.',
        sectors: ['Energi & Minyak', 'Pertambangan Emas', 'Teknologi AI', 'Kehutanan', 'Agrikultur Gandum', 'Clean Technology']
      },
      'United Kingdom': {
        history: 'Inggris adalah negara dengan sejarah maritim yang kuat dan kini menjadi pusat keuangan global London serta leader dalam fintech dan creative industries.',
        sectors: ['Keuangan London', 'Fintech & Banking', 'Creative Industries', 'Farmasi', 'Aerospace', 'Pendidikan Tinggi']
      },
      'France': {
        history: 'Prancis adalah negara dengan warisan budaya yang kaya dan ekonomi yang didominasi oleh luxury goods, aerospace, dan nuclear energy.',
        sectors: ['Luxury Fashion', 'Aerospace Airbus', 'Nuclear Energy', 'Pariwisata Budaya', 'Wine & Champagne', 'Automotive']
      },
      'Netherlands': {
        history: 'Belanda adalah negara maritim dengan ekonomi yang fokus pada logistik, agrikultur modern, dan teknologi berkelanjutan.',
        sectors: ['Logistik Pelabuhan', 'Agrikultur High-Tech', 'Energi Angin', 'Teknologi Air', 'Bunga & Hortikultura', 'Teknologi Pangan']
      },
      'Switzerland': {
        history: 'Swiss adalah negara alpine yang dikenal dengan stabilitas politik, presisi manufaktur, dan sebagai pusat keuangan private banking dunia.',
        sectors: ['Private Banking', 'Farmasi & Biotech', 'Luxury Watches', 'Precision Manufacturing', 'Cokelat Premium', 'Insurance']
      },
      'Sweden': {
        history: 'Swedia adalah negara Nordik yang memimpin dalam inovasi teknologi, keberlanjutan lingkungan, dan model welfare state.',
        sectors: ['Teknologi Startup', 'Clean Energy', 'Gaming (Spotify, IKEA)', 'Kehutanan Berkelanjutan', 'Otomotif Volvo', 'Fashion Sustainable']
      },
      'Norway': {
        history: 'Norwegia adalah negara yang kaya minyak dengan sovereign wealth fund terbesar dunia dan leader dalam teknologi maritim.',
        sectors: ['Minyak & Gas Bumi', 'Teknologi Maritim', 'Seafood & Salmon', 'Clean Energy', 'Shipping', 'Teknologi Hijau']
      },
      'Denmark': {
        history: 'Denmark adalah pioneer dalam energi angin dan dikenal dengan design, teknologi hijau, dan quality of life yang tinggi.',
        sectors: ['Energi Angin', 'Design & Architecture', 'Agrikultur Organik', 'Farmasi Novo Nordisk', 'Shipping Maersk', 'CleanTech']
      },
      'Finland': {
        history: 'Finlandia adalah negara yang unggul dalam teknologi telekomunikasi, pendidikan, dan teknologi game dengan Nokia dan Supercell.',
        sectors: ['Teknologi Telekom', 'Gaming & Mobile', 'Kehutanan Berkelanjutan', 'CleanTech', 'Pendidikan Digital', 'Bioeconomy']
      },
      'Thailand': {
        history: 'Thailand adalah satu-satunya negara Asia Tenggara yang tidak pernah dijajah dan kini menjadi hub manufaktur otomotif di kawasan.',
        sectors: ['Manufaktur Otomotif', 'Pariwisata', 'Agrikultur Beras', 'Seafood Export', 'Elektronik', 'Petrochemicals']
      },
      'Philippines': {
        history: 'Filipina adalah negara kepulauan dengan ekonomi yang berkembang pesat dalam sektor services, terutama BPO dan remittances.',
        sectors: ['Business Process Outsourcing', 'Remittances', 'Pertambangan Nikel', 'Agrikultur', 'Pariwisata', 'Semiconductor Assembly']
      },
      'Vietnam': {
        history: 'Vietnam telah bertransformasi dari ekonomi pertanian menjadi manufaktur hub dengan pertumbuhan ekonomi tercepat di Asia Tenggara.',
        sectors: ['Manufaktur Elektronik', 'Tekstil & Apparel', 'Seafood Export', 'Kopi Robusta', 'Pariwisata', 'Teknologi Startup']
      },
      'South Africa': {
        history: 'Afrika Selatan adalah ekonomi terbesar di Afrika dengan sumber daya mineral yang melimpah dan sektor keuangan yang maju.',
        sectors: ['Pertambangan Emas', 'Platinum & Berlian', 'Wine Export', 'Otomotif', 'Keuangan', 'Teknologi Fintech']
      },
      'Nigeria': {
        history: 'Nigeria adalah raksasa Afrika dengan ekonomi terbesar di benua ini, didominasi oleh minyak bumi dan sektor teknologi yang berkembang pesat.',
        sectors: ['Minyak Bumi', 'Teknologi Fintech', 'Film Nollywood', 'Agrikultur', 'Telekomunikasi', 'Banking']
      },
      'Egypt': {
        history: 'Mesir memiliki peradaban kuno yang terkenal dan kini berkembang dengan ekonomi yang didukung oleh pariwisata, tekstil, dan Terusan Suez.',
        sectors: ['Pariwisata Sejarah', 'Terusan Suez', 'Tekstil & Cotton', 'Minyak & Gas', 'Agrikultur', 'Real Estate']
      },
      'Turkey': {
        history: 'Turki adalah jembatan antara Eropa dan Asia dengan ekonomi yang didukung oleh manufaktur, tekstil, dan pariwisata.',
        sectors: ['Tekstil & Fashion', 'Otomotif', 'Steel & Besi', 'Tourism', 'Construction', 'Agrikultur']
      },
      'Israel': {
        history: 'Israel dikenal sebagai "Startup Nation" dengan ekosistem teknologi yang sangat maju dan inovasi dalam bidang cybersecurity.',
        sectors: ['High-Tech & Startup', 'Cybersecurity', 'Agrikultur Precision', 'Farmasi & Biotech', 'Defense Technology', 'Diamond Cutting']
      },
      'Saudi Arabia': {
        history: 'Arab Saudi adalah produsen minyak terbesar dunia yang sedang melakukan diversifikasi ekonomi melalui Vision 2030.',
        sectors: ['Minyak Bumi', 'Petrokimia', 'Renewable Energy', 'Tourism (NEOM)', 'Construction', 'Financial Services']
      },
      'United Arab Emirates': {
        history: 'UAE telah bertransformasi dari ekonomi berbasis minyak menjadi hub bisnis dan pariwisata global di Timur Tengah.',
        sectors: ['Real Estate Dubai', 'Tourism & Hospitality', 'Financial Services', 'Logistics & Trade', 'Renewable Energy', 'Space Technology']
      },
      'New Zealand': {
        history: 'Selandia Baru dikenal dengan pemandangan alam yang indah, agrikultur berkelanjutan, dan film industri Lord of the Rings.',
        sectors: ['Agrikultur Dairy', 'Tourism Adventure', 'Wine Export', 'Film & Creative', 'Renewable Energy', 'Software']
      }
    };

    return histories[countryName] || {
      history: 'Negara ini memiliki sejarah dan budaya yang unik. Untuk informasi sejarah yang lebih lengkap, silakan konsultasi sumber-sumber sejarah dan ensiklopedia yang terpercaya.',
      sectors: ['Pertanian', 'Industri', 'Jasa', 'Pariwisata', 'Perdagangan']
    };
  };

  const formatPopulation = (population: number) => {
    if (!population || population === 0) {
      return 'Data tidak tersedia';
    }
    return population.toLocaleString('id-ID');
  };

  // Fungsi untuk mendapatkan informasi tambahan berdasarkan data API
  const getAdditionalInfo = (country: Country) => {
    const info = {
      populationCategory: '',
      areaCategory: '',
      developmentStatus: '',
      economicInfo: ''
    };

    // Kategorisasi berdasarkan populasi
    if (country.population > 100000000) {
      info.populationCategory = 'Negara Berpenduduk Sangat Besar (>100 juta)';
    } else if (country.population > 50000000) {
      info.populationCategory = 'Negara Berpenduduk Besar (50-100 juta)';
    } else if (country.population > 10000000) {
      info.populationCategory = 'Negara Berpenduduk Menengah (10-50 juta)';
    } else if (country.population > 1000000) {
      info.populationCategory = 'Negara Berpenduduk Kecil (1-10 juta)';
    } else {
      info.populationCategory = 'Negara Berpenduduk Sangat Kecil (<1 juta)';
    }

    // Kategorisasi berdasarkan luas wilayah
    if (country.area > 1000000) {
      info.areaCategory = 'Negara Sangat Luas (>1 juta km²)';
    } else if (country.area > 100000) {
      info.areaCategory = 'Negara Luas (100rb-1jt km²)';
    } else if (country.area > 10000) {
      info.areaCategory = 'Negara Menengah (10rb-100rb km²)';
    } else {
      info.areaCategory = 'Negara Kecil (<10rb km²)';
    }

    // Status pembangunan berdasarkan indikator
    if (country.unMember) {
      info.developmentStatus = 'Anggota Perserikatan Bangsa-Bangsa';
    }
    if (country.independent === false) {
      info.developmentStatus = 'Wilayah Dependensi/Teritorial';
    }

    return info;
  };

  const getGovernmentType = (country: Country) => {
    // Sistem pemerintahan berdasarkan data akurat negara
    const governments: { [key: string]: string } = {
      // Asia
      'Indonesia': 'Republik Presidensial Demokratis',
      'Malaysia': 'Monarki Konstitusional Federal',
      'Singapore': 'Republik Parlementer',
      'Thailand': 'Monarki Konstitusional',
      'Philippines': 'Republik Presidensial',
      'Vietnam': 'Republik Sosialis Satu Partai',
      'Japan': 'Monarki Konstitusional Parlementer',
      'South Korea': 'Republik Presidensial',
      'China': 'Republik Rakyat Sosialis Satu Partai',
      'India': 'Republik Federal Parlementer Demokratis',
      'Pakistan': 'Republik Islam Federal Parlementer',
      'Bangladesh': 'Republik Parlementer',
      'Myanmar': 'Republik Federal',
      'Cambodia': 'Monarki Konstitusional',
      'Laos': 'Republik Demokratis Rakyat Satu Partai',
      'Nepal': 'Republik Federal Demokratis',
      'Sri Lanka': 'Republik Presidensial',
      'Maldives': 'Republik Presidensial',
      
      // Amerika
      'United States': 'Republik Federal Presidensial Demokratis',
      'Canada': 'Monarki Konstitusional Federal Parlementer',
      'Mexico': 'Republik Federal Presidensial',
      'Brazil': 'Republik Federal Presidensial',
      'Argentina': 'Republik Federal Presidensial',
      'Chile': 'Republik Presidensial',
      'Colombia': 'Republik Presidensial',
      'Peru': 'Republik Presidensial',
      'Venezuela': 'Republik Federal Presidensial',
      'Ecuador': 'Republik Presidensial',
      'Bolivia': 'Republik Presidensial',
      'Paraguay': 'Republik Presidensial',
      'Uruguay': 'Republik Presidensial',
      'Guyana': 'Republik Presidensial',
      'Suriname': 'Republik Presidensial',
      
      // Eropa
      'United Kingdom': 'Monarki Konstitusional Parlementer',
      'France': 'Republik Semi-Presidensial',
      'Germany': 'Republik Federal Parlementer',
      'Italy': 'Republik Parlementer',
      'Spain': 'Monarki Konstitusional Parlementer',
      'Netherlands': 'Monarki Konstitusional Parlementer',
      'Belgium': 'Monarki Konstitusional Federal Parlementer',
      'Switzerland': 'Republik Federal Demokratis',
      'Austria': 'Republik Federal Parlementer',
      'Sweden': 'Monarki Konstitusional Parlementer',
      'Norway': 'Monarki Konstitusional Parlementer',
      'Denmark': 'Monarki Konstitusional Parlementer',
      'Finland': 'Republik Parlementer',
      'Poland': 'Republik Parlementer',
      'Czech Republic': 'Republik Parlementer',
      'Hungary': 'Republik Parlementer',
      'Portugal': 'Republik Semi-Presidensial',
      'Greece': 'Republik Parlementer',
      'Russia': 'Republik Federal Semi-Presidensial',
      'Ukraine': 'Republik Semi-Presidensial',
      'Belarus': 'Republik Presidensial',
      
      // Afrika
      'South Africa': 'Republik Parlementer',
      'Nigeria': 'Republik Federal Presidensial',
      'Egypt': 'Republik Semi-Presidensial',
      'Kenya': 'Republik Presidensial',
      'Ethiopia': 'Republik Federal Parlementer',
      'Ghana': 'Republik Presidensial',
      'Morocco': 'Monarki Konstitusional',
      'Algeria': 'Republik Semi-Presidensial',
      'Tunisia': 'Republik Semi-Presidensial',
      'Libya': 'Pemerintahan Transisi',
      
      // Oseania
      'Australia': 'Monarki Konstitusional Federal Parlementer',
      'New Zealand': 'Monarki Konstitusional Parlementer',
      'Papua New Guinea': 'Monarki Konstitusional Parlementer',
      'Fiji': 'Republik Parlementer',
      
      // Timur Tengah
      'Saudi Arabia': 'Monarki Absolut',
      'United Arab Emirates': 'Monarki Federal Konstitusional',
      'Qatar': 'Monarki Absolut',
      'Kuwait': 'Monarki Konstitusional',
      'Bahrain': 'Monarki Konstitusional',
      'Oman': 'Monarki Absolut',
      'Jordan': 'Monarki Konstitusional',
      'Lebanon': 'Republik Parlementer',
      'Syria': 'Republik Semi-Presidensial',
      'Iraq': 'Republik Federal Parlementer',
      'Iran': 'Republik Islam Teokratis',
      'Turkey': 'Republik Presidensial',
      'Israel': 'Republik Parlementer',
    };

    const govType = governments[country.name.common];
    if (govType) {
      return govType;
    }

    // Fallback berdasarkan karakteristik umum
    if (country.independent === false) {
      return 'Wilayah Dependensi';
    }
    
    return 'Sistem Pemerintahan (Memerlukan penelitian lebih lanjut)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌍 Pencarian Negara Dunia
          </h1>
          <p className="text-gray-600 text-lg">
            Cari informasi lengkap tentang negara-negara di dunia
          </p>
        </div>

        {/* Form Pencarian */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ketikkan nama negara (contoh: Indonesia, Japan, Germany)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-black placeholder-gray-500"
                style={{ color: '#000000' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Mencari...' : 'Cari'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Hasil Pencarian */}
        {countries.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Hasil Pencarian ({countries.length} negara ditemukan)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCountry(country)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={country.flags.png}
                      alt={`Bendera ${country.name.common}`}
                      className="w-12 h-8 object-cover rounded border"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {country.name.common}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {country.name.official}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail Negara */}
        {selectedCountry && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedCountry.flags.svg}
                alt={`Bendera ${selectedCountry.name.common}`}
                className="w-20 h-14 object-cover rounded border shadow-md"
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedCountry.name.common}
                </h2>
                <p className="text-lg text-gray-600">
                  {selectedCountry.name.official}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informasi Dasar */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  📍 Informasi Geografis
                </h3>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-700 mb-3">📍 Koordinat Geografis</h4>
                  <div className="space-y-2">
                    <p className="text-gray-800 font-medium text-lg">
                      {formatCoordinates(selectedCountry.latlng)}
                    </p>
                    <div className="text-sm text-gray-600 bg-white p-2 rounded">
                      <p>• Lintang (Latitude): {selectedCountry.latlng?.[0]?.toFixed(6) || 'Tidak tersedia'}°</p>
                      <p>• Bujur (Longitude): {selectedCountry.latlng?.[1]?.toFixed(6) || 'Tidak tersedia'}°</p>
                    </div>
                    {selectedCountry.capitalInfo?.latlng && (
                      <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                        <p className="font-medium">Koordinat Ibu Kota:</p>
                        <p>{formatCoordinates(selectedCountry.capitalInfo.latlng)}</p>
                        <p>({selectedCountry.capitalInfo.latlng[0]?.toFixed(6)}°, {selectedCountry.capitalInfo.latlng[1]?.toFixed(6)}°)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Lokasi</h4>
                  <p className="text-gray-600">
                    Region: {selectedCountry.region}
                  </p>
                  <p className="text-gray-600">
                    Sub-region: {selectedCountry.subregion}
                  </p>
                  {selectedCountry.continents && (
                    <p className="text-gray-600">
                      Benua: {selectedCountry.continents.join(', ')}
                    </p>
                  )}
                  {selectedCountry.capital && (
                    <p className="text-gray-600">
                      Ibu Kota: {selectedCountry.capital.join(', ')}
                    </p>
                  )}
                  {selectedCountry.landlocked !== undefined && (
                    <p className="text-gray-600">
                      Status: {selectedCountry.landlocked ? 'Negara Daratan (Landlocked)' : 'Memiliki Akses Laut'}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Sistem Pemerintahan</h4>
                  <p className="text-gray-600 font-medium">
                    {getGovernmentType(selectedCountry)}
                  </p>
                  {selectedCountry.independent !== undefined && (
                    <p className="text-gray-600 mt-1">
                      Status Kemerdekaan: {selectedCountry.independent ? 'Negara Merdeka' : 'Wilayah Dependensi'}
                    </p>
                  )}
                  {selectedCountry.unMember !== undefined && (
                    <p className="text-gray-600">
                      Anggota PBB: {selectedCountry.unMember ? 'Ya' : 'Tidak'}
                    </p>
                  )}
                </div>

                {selectedCountry.borders && selectedCountry.borders.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Negara Tetangga</h4>
                    <p className="text-gray-600">
                      Berbatasan dengan {selectedCountry.borders.length} negara: {selectedCountry.borders.join(', ')}
                    </p>
                  </div>
                )}

                {selectedCountry.timezones && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Zona Waktu</h4>
                    <p className="text-gray-600">
                      {selectedCountry.timezones.join(', ')}
                    </p>
                    {selectedCountry.startOfWeek && (
                      <p className="text-gray-600 mt-1">
                        Awal Minggu: {selectedCountry.startOfWeek}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Informasi Demografi dan Ekonomi */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  👥 Informasi Demografi
                </h3>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Populasi Terbaru</h4>
                  <p className="text-gray-600 text-lg font-semibold">
                    {formatPopulation(selectedCountry.population)} jiwa
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    *Sumber: REST Countries API • Data resmi dari database negara dunia
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Kategori: {getAdditionalInfo(selectedCountry).populationCategory}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Luas Wilayah</h4>
                  <p className="text-gray-600">
                    {selectedCountry.area.toLocaleString('id-ID')} km²
                  </p>
                  <p className="text-gray-600">
                    Kepadatan: {Math.round(selectedCountry.population / selectedCountry.area).toLocaleString('id-ID')} jiwa/km²
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Kategori: {getAdditionalInfo(selectedCountry).areaCategory}
                  </p>
                </div>

                {selectedCountry.gini && Object.keys(selectedCountry.gini).length > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Indeks Gini (Ketimpangan Ekonomi)</h4>
                    {Object.entries(selectedCountry.gini).map(([year, value]) => (
                      <p key={year} className="text-gray-600">
                        Tahun {year}: {value} (0 = merata, 100 = sangat timpang)
                      </p>
                    ))}
                  </div>
                )}

                {selectedCountry.fifa && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Kode FIFA</h4>
                    <p className="text-gray-600">
                      {selectedCountry.fifa} (untuk turnamen sepak bola internasional)
                    </p>
                  </div>
                )}

                {selectedCountry.postalCode && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Format Kode Pos</h4>
                    <p className="text-gray-600">
                      Format: {selectedCountry.postalCode.format || 'Tidak tersedia'}
                    </p>
                  </div>
                )}

                {selectedCountry.languages && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Bahasa</h4>
                    <p className="text-gray-600">
                      {Object.values(selectedCountry.languages).join(', ')}
                    </p>
                  </div>
                )}

                {selectedCountry.currencies && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Mata Uang</h4>
                    {Object.entries(selectedCountry.currencies).map(([code, currency]) => (
                      <p key={code} className="text-gray-600">
                        {currency.name} ({currency.symbol})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sejarah dan Sektor Unggulan */}
            <div className="mt-8 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  📚 Sejarah Singkat
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {getCountryHistory(selectedCountry.name.common).history}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  🏭 Sektor Unggulan
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getCountryHistory(selectedCountry.name.common).sectors.map((sector, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Informasi Sumber Data */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📊 Sumber Data & Validitas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Data Geografis & Demografis:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• REST Countries API v3.1 (restcountries.com)</li>
                    <li>• Data resmi dari database negara internasional</li>
                    <li>• Koordinat dari sistem geodesi WGS84</li>
                    <li>• Populasi dan area dari sumber pemerintah</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Data Politik & Ekonomi:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Sistem pemerintahan dari konstitusi negara</li>
                    <li>• Status PBB dari dokumen resmi UN</li>
                    <li>• Indeks Gini dari World Bank data</li>
                    <li>• Mata uang dari bank sentral masing-masing</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="text-xs text-gray-500">
                  <strong>Disclaimer:</strong> Data diperbarui secara berkala melalui API. Untuk informasi terkini dan detail khusus, 
                  silakan merujuk ke sumber resmi pemerintah atau organisasi internasional terkait.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Informasi */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-gray-600 text-sm">
              🌐 Powered by <span className="font-semibold">REST Countries API</span> • 
              Data akurat dan terpercaya dari sumber internasional
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Terakhir diperbarui: September 2025 • Total database: 250+ negara dan teritorial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}