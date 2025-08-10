# Documentación Técnica - Pagalay

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Smart Contracts](#smart-contracts)
3. [Backend API](#backend-api)
4. [Mobile App](#mobile-app)
5. [Integración con Blockchain](#integración-con-blockchain)
6. [Casos de Uso](#casos-de-uso)
7. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
8. [Deployment](#deployment)

---

## 🏗️ Arquitectura General

### Componentes del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Backend API   │    │  Smart Contract │
│  (React Native) │◄──►│   (Node.js)     │◄──►│    (Solidity)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │    MongoDB      │    │  Polygon Network│
│ (Notifications) │    │   (Database)    │    │   (Blockchain)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Datos Principal

1. **Usuario** interactúa con **Mobile App**
2. **Mobile App** se comunica con **Backend API**
3. **Backend API** interactúa con **Smart Contract** en **Polygon**
4. **Smart Contract** procesa transacciones en **Blockchain**
5. **Backend** actualiza **MongoDB** y envía notificaciones vía **Firebase**

---

## 📱 Smart Contracts

### PagalayPayments.sol

**Funcionalidades principales:**
- Registro de vendedores
- Procesamiento de pagos
- Sistema de comisiones
- Gestión de transacciones
- Estadísticas y reporting

**Eventos importantes:**
```solidity
event PaymentMade(address from, address to, uint256 amount, bytes32 transactionId, uint256 timestamp);
event PaymentConfirmed(bytes32 transactionId, address vendor, uint256 timestamp);
event VendorRegistered(address vendor, string businessName, uint256 timestamp);
```

**Consideraciones de Gas:**
- Fee por transacción: 1.5% (configurable)
- Gas optimizado con OpenZeppelin
- Patrón PullPayment para seguridad

---

## 🔧 Backend API

### Endpoints Principales

#### Autenticación (`/api/auth`)
- `POST /register` - Registro de usuarios
- `POST /login` - Login con PIN
- `POST /verify-phone` - Verificación de teléfono
- `POST /refresh-token` - Renovar JWT

#### Usuarios (`/api/users`)
- `GET /profile` - Obtener perfil
- `PUT /profile` - Actualizar perfil
- `GET /balance` - Consultar balance
- `PUT /preferences` - Actualizar preferencias

#### Transacciones (`/api/transactions`)
- `POST /create` - Crear transacción
- `GET /history` - Historial de transacciones
- `GET /:id` - Detalles de transacción
- `POST /confirm` - Confirmar transacción

#### Vendedores (`/api/vendors`)
- `POST /register` - Registrar como vendedor
- `GET /profile` - Perfil del vendedor
- `GET /nearby` - Vendedores cercanos
- `POST /qr-generate` - Generar QR de pago

#### Exchange (`/api/exchange`)
- `GET /rates` - Obtener tasas de cambio
- `POST /convert` - Solicitar conversión
- `GET /history` - Historial de conversiones

### Modelos de Datos

#### Usuario
```javascript
{
  phoneNumber: String,
  firstName: String,
  lastName: String,
  walletAddress: String,
  pin: String (hashed),
  preferences: {
    language: String,
    currency: String,
    notifications: Object
  },
  verification: {
    phoneVerified: Boolean,
    kycLevel: Number
  },
  stats: {
    totalTransactions: Number,
    totalSent: Number,
    totalReceived: Number
  }
}
```

#### Vendedor
```javascript
{
  user: ObjectId,
  businessInfo: {
    name: String,
    description: String,
    category: String,
    schedule: Object
  },
  location: {
    address: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  paymentSettings: {
    autoConvert: Boolean,
    autoConvertPercentage: Number,
    dailyLimit: Number
  },
  stats: {
    totalSales: Number,
    totalTransactions: Number,
    rating: Object
  }
}
```

---

## 📱 Mobile App (React Native)

### Estructura de Componentes

```
src/
├── components/        # Componentes reutilizables
│   ├── Button/
│   ├── Input/
│   ├── QRScanner/
│   └── TransactionItem/
├── screens/          # Pantallas de la aplicación
│   ├── Auth/
│   ├── Home/
│   ├── Payment/
│   ├── Profile/
│   └── Vendor/
├── services/         # Servicios API y blockchain
│   ├── api.js
│   ├── blockchain.js
│   └── storage.js
├── utils/           # Utilidades
│   ├── constants.js
│   ├── helpers.js
│   └── validation.js
└── navigation/      # Navegación
    └── AppNavigator.js
```

### Pantallas Principales

1. **Onboarding/Auth**
   - Registro con número de teléfono
   - Configuración de PIN
   - Verificación SMS
   - Generación de billetera

2. **Home Dashboard**
   - Balance actual
   - Transacciones recientes
   - Acceso rápido a escanear/generar QR

3. **Payment**
   - Escáner QR
   - Confirmación de pago
   - Historial de transacciones

4. **Vendor Dashboard**
   - Generar QR de cobro
   - Estadísticas de ventas
   - Configuración de negocio

5. **Profile/Settings**
   - Información personal
   - Configuración de seguridad
   - Preferencias de idioma

### Integraciones Principales

- **WalletConnect**: Para interacción con billeteras
- **React Native QR Scanner**: Para códigos QR
- **Expo Notifications**: Para push notifications
- **AsyncStorage**: Para almacenamiento local seguro
- **Expo SecureStore**: Para datos sensibles

---

## ⛓️ Integración con Blockchain

### Polygon Network
- **Red principal**: Polygon Mainnet
- **Red de pruebas**: Mumbai Testnet
- **Token nativo**: MATIC
- **Ventajas**: Bajas comisiones, transacciones rápidas

### Interacción con Contratos

```javascript
// Ejemplo de conexión con ethers.js
const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Realizar pago
const tx = await contract.makePayment(
  vendorAddress,
  transactionId,
  description,
  { value: ethers.utils.parseEther(amount) }
);
```

### Gestión de Billeteras
- Generación de billeteras locales
- Importación de semillas existentes
- Almacenamiento seguro de claves privadas
- Backup y recuperación

---

## 💼 Casos de Uso

### 1. Pago Simple (Cliente → Vendedor)

**Flujo:**
1. Cliente escanea QR del vendedor
2. App muestra monto en BOB y MATIC
3. Cliente confirma pago
4. Transacción se envía a blockchain
5. Vendedor recibe notificación
6. Auto-conversión a BOB (si está habilitada)

**Componentes involucrados:**
- Mobile App (ambos usuarios)
- Backend API (validación y notificaciones)
- Smart Contract (procesamiento)
- Blockchain (confirmación)

### 2. Registro de Vendedor

**Flujo:**
1. Usuario completa perfil de negocio
2. Sube documentos de verificación
3. Sistema valida información
4. Se registra en smart contract
5. Obtiene acceso a funciones de vendedor

### 3. Conversión Automática MATIC → BOB

**Flujo:**
1. Vendedor recibe pago en MATIC
2. Sistema consulta tasa de cambio actual
3. Se ejecuta conversión automática (si habilitada)
4. Fondos se transfieren a cuenta bancaria (futuro)

---

## 🔒 Consideraciones de Seguridad

### Autenticación y Autorización
- JWT con expiración corta
- PIN de 6 dígitos
- Autenticación biométrica opcional
- Verificación de teléfono obligatoria

### Protección de Datos
- Claves privadas nunca salen del dispositivo
- Datos sensibles encriptados
- Comunicación HTTPS obligatoria
- Validación de entrada estricta

### Smart Contract Security
- OpenZeppelin para librerías seguras
- Patrón PullPayment para pagos
- Reentrancy guards
- Pausing functionality

### Mitigación de Riesgos
- Límites diarios de transacción
- Sistema de alertas para actividad sospechosa
- Logs de auditoría completos
- Monitoreo en tiempo real

---

## 🚀 Deployment

### Infraestructura Recomendada

**Backend:**
- AWS EC2 / Google Cloud Compute
- Load Balancer
- MongoDB Atlas
- Redis para cache
- CloudWatch / Stack Driver para logs

**Mobile App:**
- App Store / Google Play
- CodePush para updates OTA
- Firebase para analytics

**Smart Contracts:**
- Polygon Mainnet
- Verificación en PolygonScan
- Multisig wallet para admin functions

### Pipeline CI/CD

```yaml
# Ejemplo GitHub Actions
stages:
  - test
  - build
  - deploy-staging
  - deploy-production

test:
  - Unit tests (Jest)
  - Integration tests
  - Smart contract tests (Hardhat)
  - Security scans

build:
  - Docker images
  - Mobile app builds
  - Contract compilation

deploy:
  - Staging environment
  - Production deployment
  - Database migrations
  - Contract upgrades
```

### Monitoreo y Alertas

- **Uptime**: Ping endpoints críticos
- **Performance**: Response times, throughput
- **Errors**: Error rates, failed transactions
- **Business**: Transaction volume, user activity
- **Security**: Failed login attempts, suspicious activity

---

## 📊 Métricas de Éxito

### KPIs Técnicos
- Uptime > 99.9%
- Response time < 200ms
- Transaction success rate > 98%
- Mobile app crash rate < 1%

### KPIs de Negocio
- Usuarios activos mensuales
- Volumen de transacciones
- Número de vendedores activos
- Tasa de conversión a vendedor
- Retención de usuarios

---

## 🔧 Herramientas de Desarrollo

### Frontend
- React Native CLI / Expo
- VS Code con extensions
- Flipper para debugging
- Detox para E2E testing

### Backend
- Node.js + Express
- MongoDB Compass
- Postman para API testing
- Jest para unit testing

### Blockchain
- Hardhat development environment
- Remix IDE para contratos
- MetaMask para testing
- Tenderly para monitoring

### DevOps
- Docker para containerización
- GitHub Actions para CI/CD
- AWS / GCP para infrastructure
- Terraform para IaC

---

Esta documentación será actualizada conforme evolucione el proyecto. Para más detalles técnicos, consulta el código fuente y los comentarios en cada componente.
