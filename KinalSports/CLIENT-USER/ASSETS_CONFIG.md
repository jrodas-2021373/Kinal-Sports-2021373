# Configuración de Assets para KinalSports Client User

## Estructura de Assets

```
assets/
├── icon.png          # 1024x1024 (icono de la app)
├── splash.png        # 1200x1200 (splash screen)
├── adaptive-icon.png # 432x432 (icono adaptativo Android)
└── kinal_sports.png  # 200x200 (logo para pantalla de login)
```

## Crear Assets

### Opción 1: Usar Placeholder Temporal
Si aún no tienes los assets, la app usará el icono por defecto. Reemplaza las referencias cuando tengas las imágenes.

### Opción 2: Crear Manualmente

1. **icon.png** (1024x1024 px, PNG)
   - Logo cuadrado de KinalSports

2. **splash.png** (1200x1200 px, PNG)
   - Fondo azul (#08316D) con logo centrado

3. **adaptive-icon.png** (432x432 px, PNG)
   - Versión del logo para Android

4. **kinal_sports.png** (200x200 px, PNG)
   - Logo para pantalla de login
   - Redondeado con borderRadius: 40

## Ubicación
Todos los archivos deben estar en la carpeta `assets/`

## Importación en Código

```jsx
// Para assets locales
import icon from "../assets/icon.png";

// O usando require
<Image source={require("../assets/kinal_sports.png")} />

// Con fallback
<Image
  source={require("../assets/kinal_sports.png")}
  defaultSource={require("../assets/icon.png")}
/>
```

## Nota para Desarrollo

En LoginScreen.jsx se intenta cargar `../assets/kinal_sports.png` con un fallback a `icon.png`.
Si el archivo no existe, usa el icono por defecto sin errores.
