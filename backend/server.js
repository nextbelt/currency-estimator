const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3041;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.railway.app', 'https://*.up.railway.app'] 
    : 'http://localhost:3040',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Configure multer for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Coin Value Estimator Backend is running' });
});

// Coin analysis endpoint
app.post('/api/analyze-currency', async (req, res) => {
  try {
    const { imageData, currencyType = 'auto' } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Validate base64 image data format
    if (!imageData.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format. Please provide a base64 encoded image.' });
    }

    console.log('Analyzing currency image...');

    // Create dynamic prompt based on currency type
    let analysisPrompt = '';
    
    if (currencyType === 'coin') {
      analysisPrompt = `IMPORTANTE: Responde ÚNICAMENTE en español. Analiza esta imagen de moneda y proporciona información detallada en formato JSON COMPLETAMENTE EN ESPAÑOL:

{
  "currencyName": "Nombre completo de la moneda en español",
  "currencyType": "coin",
  "country": "País de origen",
  "year": año (número),
  "mint": "Casa de moneda y marca",
  "composition": "Composición del metal",
  "rarity": "Muy Común/Común/Poco Común/Escasa/Rara/Muy Rara/Extremadamente Rara",
  "condition": "Grado estimado (ej: VF-20, EF-40, MS-60)",
  "estimatedValue": {
    "low": número,
    "average": número,
    "high": número,
    "currency": "USD"
  },
  "marketDemand": "Baja/Moderada/Alta/Muy Alta",
  "description": "Descripción breve de la moneda en español",
  "keyFeatures": ["característica1 en español", "característica2 en español", "característica3 en español"],
  "grading": {
    "grade": "Abreviación del grado",
    "details": "Explicación de la condición en español"
  },
  "rarityFactors": ["factor1 en español", "factor2 en español"],
  "historicalContext": "Contexto histórico detallado en español",
  "collectionTips": ["consejo1 en español", "consejo2 en español"],
  "marketTrends": "Tendencias actuales del mercado en español",
  "investmentPotential": "Potencial de inversión a largo plazo en español",
  "whereToSell": ["lugar1 en español", "lugar2 en español"],
  "tipsToMaximizeValue": ["consejo1 en español", "consejo2 en español"]
}

CRUCIAL: Todo el contenido debe estar en español. No uses inglés en ninguna parte de la respuesta. Sé específico sobre el año, marcas de casa de moneda y detalles visibles. Proporciona estimaciones de valor precisas basadas en datos actuales del mercado numismático.`;
    } else if (currencyType === 'bill') {
      analysisPrompt = `IMPORTANTE: Responde ÚNICAMENTE en español. Analiza esta imagen de billete/papel moneda y proporciona información detallada en formato JSON COMPLETAMENTE EN ESPAÑOL:

{
  "currencyName": "Nombre completo del billete en español (ej: Billete de $2 Estados Unidos 1976)",
  "currencyType": "bill",
  "country": "País de origen",
  "year": año (número),
  "series": "Año de la serie si aplica",
  "denomination": "Valor nominal (ej: $1, $5, $20)",
  "serialNumber": "Número de serie si es visible",
  "rarity": "Muy Común/Común/Poco Común/Escaso/Raro/Muy Raro/Extremadamente Raro",
  "condition": "Grado estimado (ej: Bueno, Muy Fino, Extremadamente Fino, Sin Circular)",
  "printingErrors": ["error1 en español", "error2 en español"] o [],
  "estimatedValue": {
    "low": número,
    "average": número,
    "high": número,
    "currency": "USD"
  },
  "marketDemand": "Baja/Moderada/Alta/Muy Alta",
  "description": "Descripción breve del billete en español",
  "keyFeatures": ["característica1 en español", "característica2 en español", "característica3 en español"],
  "grading": {
    "grade": "Abreviación del grado",
    "details": "Explicación de la condición en español"
  },
  "rarityFactors": ["factor1 en español", "factor2 en español"],
  "historicalContext": "Contexto histórico detallado y significado en español",
  "collectionTips": ["consejo1 en español", "consejo2 en español"],
  "marketTrends": "Tendencias actuales del mercado de billetes en español",
  "investmentPotential": "Potencial de inversión a largo plazo en español",
  "signatures": "Funcionarios que firmaron el billete en español",
  "securityFeatures": ["característica1 en español", "característica2 en español"],
  "whereToSell": ["lugar1 en español", "lugar2 en español"],
  "tipsToMaximizeValue": ["consejo1 en español", "consejo2 en español"]
}

CRUCIAL: Todo el contenido debe estar en español. No uses inglés en ninguna parte de la respuesta. Sé específico sobre la serie, números de serie, firmas y errores de impresión. Busca billetes estrella, billetes de reemplazo u otras características especiales.`;
    } else {
      // Auto-detect mode
      analysisPrompt = `IMPORTANTE: Responde ÚNICAMENTE en español. Analiza esta imagen de moneda (podría ser una moneda o billete) y proporciona información detallada en formato JSON COMPLETAMENTE EN ESPAÑOL. Primero determina si es una moneda o billete, luego proporciona el análisis apropiado:

{
  "currencyName": "Nombre completo de la moneda en español",
  "currencyType": "coin" o "bill",
  "country": "País de origen",
  "year": año (número),
  "series": "Año de la serie si aplica (solo billetes)",
  "mint": "Casa de moneda y marca (solo monedas)",
  "denomination": "Valor nominal (billetes) o denominación (monedas)",
  "serialNumber": "Número de serie si es visible (solo billetes)",
  "composition": "Composición del metal (solo monedas)",
  "rarity": "Muy Común/Común/Poco Común/Escaso/Raro/Muy Raro/Extremadamente Raro",
  "condition": "Grado estimado",
  "printingErrors": ["error1 en español", "error2 en español"] o [] (solo billetes),
  "estimatedValue": {
    "low": número,
    "average": número,
    "high": número,
    "currency": "USD"
  },
  "marketDemand": "Baja/Moderada/Alta/Muy Alta",
  "description": "Descripción breve en español",
  "keyFeatures": ["característica1 en español", "característica2 en español", "característica3 en español"],
  "grading": {
    "grade": "Abreviación del grado",
    "details": "Explicación de la condición en español"
  },
  "rarityFactors": ["factor1 en español", "factor2 en español"],
  "historicalContext": "Contexto histórico detallado en español",
  "collectionTips": ["consejo1 en español", "consejo2 en español"],
  "marketTrends": "Tendencias actuales del mercado en español",
  "investmentPotential": "Potencial de inversión a largo plazo en español",
  "signatures": "Funcionarios que firmaron (solo billetes) en español",
  "securityFeatures": ["característica1 en español", "característica2 en español"] (solo billetes),
  "whereToSell": ["lugar1 en español", "lugar2 en español"],
  "tipsToMaximizeValue": ["consejo1 en español", "consejo2 en español"]
}

CRUCIAL: Todo el contenido debe estar en español. No uses inglés en ninguna parte de la respuesta. Proporciona análisis preciso y estimaciones de valor basadas en datos actuales del mercado de colección.`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: analysisPrompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    
    // Extract JSON from response (it might be wrapped in markdown code blocks)
    let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      jsonMatch = content.match(/\{[\s\S]*\}/);
    }
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const analysisResult = JSON.parse(jsonStr);
      
      console.log('Analysis completed successfully');
      res.json({
        success: true,
        data: analysisResult
      });
    } else {
      throw new Error('Could not parse AI response');
    }

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key' 
      });
    } else if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    } else if (error.status >= 400 && error.status < 500) {
      return res.status(400).json({ 
        error: `API Error: ${error.message}` 
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Failed to analyze coin. Please try again.' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// 404 handler for development
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Currency Value Estimator Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`💰 Currency analysis endpoint: http://localhost:${PORT}/api/analyze-currency`);
});