// DEVELOPMENT_GUIDE.md

# Guía de Desarrollo - KinalSports Client User

## Fase 2: Autenticación (Completada)

### Archivos Generados

#### 1. **src/features/auth/hooks/useAuth.js**
Hook personalizado que expone:
- `handleLogin(credentials)` - POST a `/login`
- `handleRegister(data)` - POST a `/register`
- `logout()` - Cierra sesión
- `loading` - Estado de carga
- `error` - Mensaje de error

Retorna `{ success: true/false, data/error }`

#### 2. **src/features/auth/screens/LoginScreen.jsx**
Pantalla de login con:
- Campo de email/usuario
- Campo de contraseña
- Validación con react-hook-form
- Enlace a pantalla de registro
- Manejo de errores

#### 3. **src/features/auth/screens/RegisterScreen.jsx**
Pantalla de registro con:
- Campos: nombre, apellido, usuario, email, teléfono, contraseña
- Validación de coincidencia de contraseñas
- Alert de éxito + navegación a Login
- Soporte para FormData (para subida de foto futura)

#### 4. **src/navigation/AuthStack.jsx**
Stack de navegación para autenticación:
- Pantalla Login
- Pantalla Register
- Sin header (headerShown: false)

#### 5. **src/navigation/AppNavigator.jsx**
Navegador principal que:
- Muestra LoadingSpinner mientras se rehidrata
- Renderiza AuthStack si NO está autenticado
- Renderiza placeholder si está autenticado (para futuras pantallas)

#### 6. **App.jsx (Actualizado)**
Ahora simplemente renderiza AppNavigator

## Flujo de Autenticación

```
App.jsx
  ↓
AppNavigator (verifica _hasHydrated)
  ├─ Si !_hasHydrated → LoadingSpinner
  ├─ Si !isAuthenticated → AuthStack (Login/Register)
  └─ Si isAuthenticated → App Stack (Placeholder por ahora)
```

## Uso de authStore

```javascript
import { useAuthStore } from "../shared/store/authStore";

const token = useAuthStore((state) => state.token);
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Login
await useAuthStore.getState().login(accessToken, user, refreshToken);

// Logout
await useAuthStore.getState().logout();
```

## Interceptores HTTP

### authClient (auth-service)
- Adjunta Bearer token en headers
- NO refr⁣esca en: /login, /register, /forgot-password, /reset-password, /verify-email
- Maneja 401 con refresh automático
- Cola de peticiones durante refresh

### userClient (server-user)
- Adjunta Bearer token en headers
- Refr⁣esca en 401 llamando a authClient
- Mismo patrón que authClient

## Variables de Entorno

```env
EXPO_PUBLIC_AUTH_URL=http://localhost:3007/api/v1/auth
EXPO_PUBLIC_USER_URL=http://localhost:3008/kinalSportsUser/v1
```

## Próximas Fases

### Fase 3: Navegación Principal (AppStack)
- BottomTabNavigator
- Pantallas: Inicio, Reservas, Equipos, Torneos, Perfil
- Configuración de iconos MaterialIcons

### Fase 4: Pantalla de Canchas
- ListadoScreen con FlatList
- DetailScreen con formulario de reserva
- Filtros y búsqueda

### Fase 5: Pantalla de Reservas
- Listado de mis reservas
- Detalle de reserva
- Cancelación de reserva

## Validación de Datos

Todos los campos usan react-hook-form con reglas:
- `required` - Campo obligatorio
- `minLength` - Longitud mínima
- `pattern` - Expresión regular (email, etc)
- `validate` - Validación personalizada

## Manejo de Errores

1. **Errores de validación** - Mostrados bajo cada input
2. **Errores del servidor** - Mostrados en rojo debajo del formulario
3. **Errores de red** - Capturados en catch de axios
4. **Logout automático** - Si refresh token expira

## Testing Local

1. **Crear usuario de prueba:**
```bash
# Ir a POST http://localhost:3007/api/v1/auth/register
# Body:
{
  "name": "Test",
  "surname": "User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPassword123!",
  "phone": "1234567890"
}
```

2. **Login:**
```bash
# POST http://localhost:3007/api/v1/auth/login
# Body:
{
  "emailOrUsername": "testuser",
  "password": "TestPassword123!"
}
```

## Troubleshooting

### Error: "Cannot find module '@react-navigation/native-stack'"
```bash
npm install @react-navigation/native-stack
```

### Error: "require is not defined" (ESM)
Verificar que package.json tiene `"type": "module"`

### Login siempre falla
- Verificar que auth-service está corriendo en puerto 3007
- Verificar credenciales (admin/Kinal2026!)
- Revisar logs en console.error de authClient.js

### Token no se guarda
- Verificar que SecureStore está disponible
- En simulador iOS: puede que no funcione; usar Android
- Revisar AsyncStorage en DevTools

## Comandos Útiles

```bash
# Desarrollo
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web

# Linting
npm run lint

# Linting con fix
npm run lint:fix

# Resetear caché
npm start -- --reset-cache
```

## Puntos de Atención

⚠️ **No harcodear URLs** - Usar ENDPOINTS de constants
⚠️ **No guardar tokens en AsyncStorage** - Usar SecureStore
⚠️ **No mostrar errores sensibles** - Usar mensajes genéricos
⚠️ **No olvidar cleanup en useEffect** - Unsubscribir de stores
⚠️ **Los assets deben estar en /assets** - Revisar ASSETS_CONFIG.md
