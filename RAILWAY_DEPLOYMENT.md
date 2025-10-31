# Guía de Despliegue en Railway

## Preparación para el Despliegue

### 1. Configurar las Variables de Entorno en Railway

Cuando despliegues en Railway, necesitas configurar las siguientes variables de entorno:

```
OPENAI_API_KEY=tu_clave_openai_aqui
NODE_ENV=production
```

### 2. Pasos para Desplegar

1. **Inicializar Git Repository (si no existe)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Currency Value Estimator App"
   ```

2. **Crear cuenta en Railway**:
   - Ve a https://railway.app
   - Registrarte con GitHub

3. **Conectar tu repositorio**:
   - En Railway, haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

4. **Configurar Variables de Entorno**:
   - En el dashboard del proyecto, ve a "Variables"
   - Añade `OPENAI_API_KEY` con tu clave de OpenAI
   - Añade `NODE_ENV` con valor `production`

5. **Configurar el Build**:
   Railway detectará automáticamente el Dockerfile y construirá la aplicación.

### 3. URL de la Aplicación

Una vez desplegada, Railway te proporcionará una URL como:
`https://tu-app-name.up.railway.app`

### 4. Características de la Aplicación

- ✅ Interfaz completamente en español
- ✅ Análisis de monedas y billetes
- ✅ Respuestas de IA en español
- ✅ Estimaciones detalladas de valor
- ✅ Información histórica y numismática
- ✅ Consejos de colección e inversión

### 5. Uso de la Aplicación

1. Selecciona el tipo de moneda (moneda, billete, o detección automática)
2. Sube una imagen clara de tu moneda o billete
3. Haz clic en "Analizar Valor"
4. Recibe un análisis detallado en español con:
   - Valor estimado
   - Rareza y demanda del mercado
   - Contexto histórico
   - Consejos de colección
   - Potencial de inversión

### 6. Solución de Problemas

Si tienes problemas:
- Verifica que la variable `OPENAI_API_KEY` esté configurada correctamente
- Revisa los logs en el dashboard de Railway
- Asegúrate de que la imagen sea clara y de buena calidad

¡Disfruta explorando el valor de tus monedas y billetes con tu familia!