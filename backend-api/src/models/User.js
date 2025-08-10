const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Información personal
  phoneNumber: {
    type: String,
    required: [true, 'El número de teléfono es requerido'],
    unique: true,
    match: [/^\+591[0-9]{8}$/, 'Formato de teléfono boliviano inválido (+591XXXXXXXX)']
  },
  
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  
  // Información de la billetera
  walletAddress: {
    type: String,
    required: [true, 'La dirección de billetera es requerida'],
    unique: true,
    lowercase: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Dirección de Ethereum inválida']
  },
  
  // PIN de seguridad (hasheado)
  pin: {
    type: String,
    required: [true, 'El PIN es requerido'],
    select: false // No incluir en queries por defecto
  },
  
  // Configuraciones
  preferences: {
    language: {
      type: String,
      enum: ['es', 'qu', 'ay'], // Español, Quechua, Aymara
      default: 'es'
    },
    currency: {
      type: String,
      enum: ['BOB', 'USD'],
      default: 'BOB'
    },
    notifications: {
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: false }
    },
    biometricEnabled: { type: Boolean, default: false }
  },
  
  // Información de verificación
  verification: {
    phoneVerified: { type: Boolean, default: false },
    kycLevel: {
      type: Number,
      enum: [0, 1, 2, 3], // 0: no verificado, 1: teléfono, 2: identidad, 3: completo
      default: 0
    },
    documents: [{
      type: {
        type: String,
        enum: ['ci', 'passport', 'license', 'selfie', 'address_proof']
      },
      url: String,
      verified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  
  // Estadísticas del usuario
  stats: {
    totalTransactions: { type: Number, default: 0 },
    totalSent: { type: Number, default: 0 }, // en MATIC
    totalReceived: { type: Number, default: 0 }, // en MATIC
    firstTransactionDate: Date
  },
  
  // Información de ubicación (opcional)
  location: {
    city: String,
    department: {
      type: String,
      enum: ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Tarija', 'Sucre', 'Beni', 'Pando']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Control de acceso
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Índices
userSchema.index({ phoneNumber: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ 'location.city': 1 });
userSchema.index({ createdAt: -1 });

// Middleware pre-save para hashear PIN
userSchema.pre('save', async function(next) {
  // Solo hashear el PIN si ha sido modificado
  if (!this.isModified('pin')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar PIN
userSchema.methods.comparePin = async function(candidatePin) {
  return bcrypt.compare(candidatePin, this.pin);
};

// Método para obtener nombre completo
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Método para verificar si puede realizar transacciones
userSchema.methods.canTransact = function() {
  return this.isActive && this.verification.phoneVerified;
};

// Método para actualizar estadísticas
userSchema.methods.updateStats = function(amount, type) {
  this.stats.totalTransactions += 1;
  
  if (type === 'sent') {
    this.stats.totalSent += amount;
  } else if (type === 'received') {
    this.stats.totalReceived += amount;
  }
  
  if (!this.stats.firstTransactionDate) {
    this.stats.firstTransactionDate = new Date();
  }
  
  return this.save();
};

// Método para obtener balance de la billetera (esto se implementaría consultando la blockchain)
userSchema.methods.getBalance = async function() {
  // Esta función se implementará en el servicio blockchain
  return 0; // placeholder
};

// Transformar JSON output
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.pin;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
