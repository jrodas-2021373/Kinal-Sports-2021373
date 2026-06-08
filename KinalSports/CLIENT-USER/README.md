# Proyecto KinalSports - Cliente Móvil (React Native)

Aplicación móvil para reserva de canchas, equipos y torneos usando Expo y React Native.

## Stack Tecnológico

- **Expo SDK 55**
- **React Native 0.83**
- **React 19**
- **JavaScript (ESM)**
- **Zustand + persist** para gestión de estado
- **Axios** para peticiones HTTP
- **React Hook Form** para formularios
- **@react-navigation** para navegación
- **Expo Secure Store** para almacenamiento seguro
- **AsyncStorage** para datos no sensibles
- **MaterialIcons** de @expo/vector-icons

## Estructura del Proyecto

```
CLIENT-USER/
├── App.jsx                           # Componente raíz (actualizado)
├── index.js                          # Punto de entrada
├── app.json                          # Configuración de Expo
├── package.json                      # Dependencias
├── metro.config.cjs                  # Configuración de Metro Bundler
├── eslint.config.js                  # Configuración de ESLint
├── .env.example                      # Variables de entorno ejemplo
├── ASSETS_CONFIG.md                  # Guía de configuración de assets
├── assets/                           # Imágenes
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── hooks/
│   │       │   ├── useAuth.js        # Hook para login/register
│   │       │   └── index.js
│   │       ├── screens/
│   │       │   ├── LoginScreen.jsx   # Pantalla de login
│   │       │   ├── RegisterScreen.jsx # Pantalla de registro
│   │       │   └── index.js
│   │       └── index.js
│   ├── navigation/
│   │   ├── AuthStack.jsx             # Stack de autenticación
│   │   ├── AppNavigator.jsx          # Navegador principal
│   │   └── index.js
│   └── shared/                       # (No modificado)
│       ├── constants/
│       │   ├── theme.js              # Temas
│       │   └── endpoints.js          # URLs de API
│       ├── components/
│       │   └── common/
│       │       ├── Button.jsx
│       │       ├── Input.jsx
│       │       ├── Common.jsx
│       │       └── index.js
│       ├── store/
│       │   └── authStore.js          # Zustand store
│       └── api/
│           ├── authClient.js         # Cliente HTTP auth
│           └── userClient.js         # Cliente HTTP user
```

## Configuración Inicial

### 1. Instalar dependencias

```bash
cd CLIENT-USER
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con los puertos correctos de tu backend.

### 3. Ejecutar en desarrollo

```bash
npm start          # Menú de opciones
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm run web        # Ejecutar en web
```

## Características Implementadas

✅ Autenticación con JWT y refresh tokens  
✅ Almacenamiento seguro de tokens (SecureStore)  
✅ Interceptores HTTP con auto-refresh  
✅ Gestión centralizada de estado (Zustand)  
✅ Componentes reutilizables (Button, Input)  
✅ Sistema de temas consistente  
✅ Formularios con react-hook-form  
✅ Manejo de errores y carga  

## Próximos Pasos

- [ ] Pantalla de Reset de Contraseña
- [ ] Navegación con TabNavigator (Inicio, Mis Reservas, Equipos, Torneos, Perfil)
- [ ] Pantalla de Listado de Canchas
- [ ] Pantalla de Detalle de Cancha
- [ ] Pantalla de Crear Reserva
- [ ] Pantalla de Mis Reservas
- [ ] Pantalla de Mis Equipos
- [ ] Pantalla de Detalle de Equipo
- [ ] Pantalla de Torneos
- [ ] Pantalla de Perfil
- [ ] Pantalla de Editar Perfil

## Fase 2: Autenticación

✅ Pantalla de Login con email/username y password  
✅ Pantalla de Registro (nombre, apellido, usuario, email, teléfono, contraseña)  
✅ Hook useAuth con handleLogin, handleRegister, logout  
✅ Navegación con AuthStack y AppNavigator  
✅ Interceptores HTTP con refresh automático  
✅ Almacenamiento seguro de tokens  
✅ Validación de formularios con react-hook-form

## Temas (Colors)

| Token | Valor |
|-------|-------|
| primary | #08316D |
| secondary | #64748b |
| background | #f8fafc |
| surface | #ffffff |
| text | #0f172a |
| textLight | #64748b |
| error | #dc2626 |
| success | #16a34a |
| warning | #ea580c |
| border | #e2e8f0 |
