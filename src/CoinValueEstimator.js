import React, { useState, useRef } from 'react';
import { Camera, Upload, Coins, Banknote, DollarSign, Calendar, MapPin, TrendingUp, AlertCircle, Sparkles, Info } from 'lucide-react';

const CurrencyValueEstimator = () => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currencyType, setCurrencyType] = useState('auto'); // 'coin', 'bill', or 'auto'
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        analyzeCoinWithAI(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeCoinWithAI = async (imageData) => {
    setAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      // Use relative URL in production, absolute URL in development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/analyze-currency' 
        : 'http://localhost:3041/api/analyze-currency';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData,
          currencyType: currencyType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error('Failed to analyze coin');
      }

    } catch (err) {
      console.error('Analysis error:', err);
      if (err.message.includes('fetch')) {
        setError('No se puede conectar al servidor de análisis. Por favor asegúrate de que el backend esté funcionando.');
      } else {
        setError(err.message || 'Error al analizar la moneda o billete. Por favor inténtalo de nuevo.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Very Common': 'bg-gray-600',
      'Common': 'bg-green-600',
      'Uncommon': 'bg-blue-600',
      'Scarce': 'bg-yellow-600',
      'Rare': 'bg-orange-600',
      'Very Rare': 'bg-red-600',
      'Extremely Rare': 'bg-purple-600'
    };
    return colors[rarity] || 'bg-gray-600';
  };

  const getDemandColor = (demand) => {
    const colors = {
      'Low': 'text-gray-400',
      'Moderate': 'text-blue-400',
      'High': 'text-green-400',
      'Very High': 'text-orange-400'
    };
    return colors[demand] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900 p-2 sm:p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-8 overflow-hidden">
          {/* Railway-style background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:20px_20px]"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                <Banknote className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  Estimador de Valor de Monedas
                </h1>
                <p className="text-blue-100 text-sm sm:text-lg font-medium drop-shadow">
                  Análisis de Monedas y Billetes - Creado por Luis Acosta
                </p>
              </div>
            </div>
            
            {/* Railway-style badge */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border border-white/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs sm:text-sm font-medium">Powered by Railway</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border border-white/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                  <span className="text-white text-xs sm:text-sm font-medium">AI Enhanced</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {!image && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Sube tu Moneda o Billete</h2>
                <p className="text-sm sm:text-base text-gray-600">Toma una foto clara de tu moneda o billete para el análisis</p>
              </div>

              {/* Currency Type Selection */}
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tipo de Moneda</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setCurrencyType('auto')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currencyType === 'auto' 
                        ? 'border-amber-500 bg-amber-50 text-amber-800' 
                        : 'border-gray-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex flex-row sm:flex-col items-center gap-2">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-sm font-semibold">Detectar Automáticamente</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrencyType('coin')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currencyType === 'coin' 
                        ? 'border-amber-500 bg-amber-50 text-amber-800' 
                        : 'border-gray-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex flex-row sm:flex-col items-center gap-2">
                      <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-sm font-semibold">Moneda</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrencyType('bill')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currencyType === 'bill' 
                        ? 'border-amber-500 bg-amber-50 text-amber-800' 
                        : 'border-gray-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex flex-row sm:flex-col items-center gap-2">
                      <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-sm font-semibold">Billete</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-6 sm:p-8 rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all shadow-lg flex flex-col items-center gap-3"
                >
                  <Camera className="w-8 h-8 sm:w-12 sm:h-12" />
                  <span className="text-base sm:text-lg font-semibold">Tomar Foto</span>
                  <span className="text-xs sm:text-sm opacity-90">Usar cámara</span>
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sm:p-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex flex-col items-center gap-3"
                >
                  <Upload className="w-8 h-8 sm:w-12 sm:h-12" />
                  <span className="text-base sm:text-lg font-semibold">Subir Imagen</span>
                  <span className="text-xs sm:text-sm opacity-90">Desde galería</span>
                </button>
              </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">Consejos para Mejores Resultados:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Usa buena iluminación (la luz natural funciona mejor)</li>
                    <li>• Toma fotos sobre un fondo liso y contrastante</li>
                    <li>• Centra la moneda o billete en el encuadre</li>
                    <li>• Evita sombras y reflejos</li>
                    <li>• Para monedas: Captura tanto el anverso (frente) como el reverso (atrás) si es posible</li>
                    <li>• Para billetes: Incluye números de serie y marcas de agua claramente</li>
                    <li>• Asegúrate de que el texto y números se vean nítidos y legibles</li>
                  </ul>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Section */}
        {image && (
          <div className="space-y-4 sm:space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-semibold text-sm sm:text-base">Error de Análisis</p>
                    <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Image Preview */}
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Tu Moneda o Billete</h3>
                <button
                  onClick={() => { setImage(null); setResult(null); }}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-50"
                >
                  Subir Otra
                </button>
              </div>
              <div className="max-w-sm sm:max-w-md mx-auto">
                <img src={image} alt="Moneda o billete subido" className="w-full rounded-lg shadow-md" />
              </div>
            </div>

            {/* Analyzing State */}
            {analyzing && (
              <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 text-center">
                <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Analizando tu Moneda o Billete...</h3>
                <p className="text-sm sm:text-base text-gray-600">La IA está examinando detalles, fechas, números de serie y condición</p>
              </div>
            )}

            {/* Results */}
            {result && !analyzing && (
              <div className="space-y-4 sm:space-y-6">
                {/* Main Info Card */}
                  <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-2xl p-4 sm:p-6 border-2 border-amber-200">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{result.currencyName}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {result.country}
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        {result.year}
                        {result.series && (
                          <>
                            <span>•</span>
                            <span>Serie: {result.series}</span>
                          </>
                        )}
                        {result.mint && (
                          <>
                            <span>•</span>
                            <span>Casa de Moneda: {result.mint}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`${getRarityColor(result.rarity)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                      {result.rarity}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{result.description}</p>

                  {/* Value Estimate */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-6 h-6" />
                      <h3 className="text-xl font-bold">Valor Estimado</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-green-100 text-sm">Mínimo</p>
                        <p className="text-2xl font-bold">${result.estimatedValue.low.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-green-100 text-sm">Promedio</p>
                        <p className="text-3xl font-bold">${result.estimatedValue.average.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-green-100 text-sm">Máximo</p>
                        <p className="text-2xl font-bold">${result.estimatedValue.high.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className={`font-semibold ${getDemandColor(result.marketDemand)}`}>
                        Demanda del Mercado: {result.marketDemand}
                      </span>
                    </div>
                  </div>

                  {/* Composition & Condition */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {result.composition && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Composición</h4>
                        <p className="text-gray-700">{result.composition}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Condición</h4>
                      <p className="text-gray-700">{result.condition}</p>
                    </div>
                    {result.serialNumber && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Número de Serie</h4>
                        <p className="text-gray-700">{result.serialNumber}</p>
                      </div>
                    )}
                    {result.printingErrors && result.printingErrors.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-4">
                        <h4 className="font-semibold text-red-900 mb-2">Errores de Impresión</h4>
                        <ul className="text-red-800 text-sm">
                          {result.printingErrors.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Features */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Características Principales</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {result.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-amber-600 mt-1">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Grading Details */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evaluación de Grado</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-900 mb-2">{result.grading.grade}</p>
                    <p className="text-blue-800 text-sm">{result.grading.details}</p>
                  </div>
                </div>

                {/* Rarity Factors */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Factores de Rareza</h3>
                  <ul className="space-y-2">
                    {result.rarityFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Historical Context */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-xl p-6 border border-amber-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Contexto Histórico</h3>
                  <p className="text-gray-700">{result.historicalContext}</p>
                </div>

                {/* Collection Tips */}
                {result.collectionTips && result.collectionTips.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">Consejos de Colección</h3>
                    <ul className="space-y-2">
                      {result.collectionTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-purple-800">
                          <span className="text-purple-600 text-xl">🎯</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Market Trends */}
                {result.marketTrends && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-indigo-900 mb-3">Tendencias del Mercado</h3>
                    <p className="text-indigo-800">{result.marketTrends}</p>
                  </div>
                )}

                {/* Investment Potential */}
                {result.investmentPotential && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-orange-900 mb-3">Potencial de Inversión</h3>
                    <p className="text-orange-800">{result.investmentPotential}</p>
                  </div>
                )}

                {/* Security Features (for bills) */}
                {result.securityFeatures && result.securityFeatures.length > 0 && (
                  <div className="bg-cyan-50 border border-cyan-200 rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-cyan-900 mb-4">Características de Seguridad</h3>
                    <ul className="space-y-2">
                      {result.securityFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-cyan-800">
                          <span className="text-cyan-600 text-xl">🔒</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Signatures (for bills) */}
                {result.signatures && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Firmas</h3>
                    <p className="text-slate-800">{result.signatures}</p>
                  </div>
                )}

                {/* Where to Sell */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Dónde Vender</h3>
                  <ul className="space-y-2">
                    {result.whereToSell.map((place, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 font-bold">•</span>
                        {place}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div className="bg-green-50 border border-green-200 rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-green-900 mb-4">Consejos para Maximizar el Valor</h3>
                  <ul className="space-y-2">
                    {result.tipsToMaximizeValue.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-green-800">
                        <span className="text-green-600 text-xl">💡</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-900">
                      <p className="font-semibold mb-1">Descargo de Responsabilidad Importante</p>
                      <p>Esta es una estimación basada en análisis de IA. Para una tasación precisa, consulta a un numismático profesional (para monedas) o comerciante de moneda (para billetes) o haz que tu moneda sea calificada por PCGS, NGC o PMG. Los valores de mercado fluctúan según la condición, demanda y precios de metales preciosos.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyValueEstimator;