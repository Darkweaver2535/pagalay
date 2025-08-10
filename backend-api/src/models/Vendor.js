const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // Referencia al usuario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuario requerido'],
    unique: true
  },
  
  // Información del negocio
  businessInfo: {
    name: {
      type: String,
      required: [true, 'Nombre del negocio es requerido'],
      trim: true,
      maxlength: [100, 'Nombre del negocio no puede exceder 100 caracteres']
    },
    
    description: {
      type: String,
      maxlength: [500, 'Descripción no puede exceder 500 caracteres'],
      trim: true
    },
    
    category: {
      type: String,
      enum: [
        'food', 'clothing', 'electronics', 'services', 'pharmacy', 
        'grocery', 'transportation', 'education', 'health', 'other'
      ],
      required: [true, 'Categoría del negocio es requerida']
    },
    
    logo: String, // URL de la imagen del logo
    
    // Horarios de atención
    schedule: {
      monday: { open: String, close: String, closed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
      friday: { open: String, close: String, closed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
    }
  },
  
  // Ubicación física
  location: {
    address: {
      type: String,
      required: [true, 'Dirección es requerida'],
      maxlength: [200, 'Dirección no puede exceder 200 caracteres']
    },
    
    city: {
      type: String,
      required: [true, 'Ciudad es requerida']
    },
    
    department: {
      type: String,
      enum: ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Tarija', 'Sucre', 'Beni', 'Pando'],
      required: [true, 'Departamento es requerido']
    },
    
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitud es requerida'],
        min: [-90, 'Latitud inválida'],
        max: [90, 'Latitud inválida']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitud es requerida'], 
        min: [-180, 'Longitud inválida'],
        max: [180, 'Longitud inválida']
      }
    },
    
    // Información adicional de ubicación
    landmark: String, // Punto de referencia
    zone: String // Zona específica
  },
  
  // Configuración de pagos
  paymentSettings: {
    // Auto-conversión de MATIC a BOB
    autoConvert: { type: Boolean, default: true },
    
    // Porcentaje a convertir automáticamente (0-100)
    autoConvertPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    
    // Límites diarios
    dailyLimit: {
      type: Number,
      default: 10000, // en BOB
      min: 0
    },
    
    // Comisiones personalizadas (si aplica)
    customFee: {
      enabled: { type: Boolean, default: false },
      percentage: { type: Number, min: 0, max: 10 } // máximo 10%
    },
    
    // Métodos de pago adicionales aceptados
    acceptedMethods: [{
      type: String,
      enum: ['MATIC', 'USDC', 'USDT'] // Por ahora solo MATIC
    }]
  },
  
  // Estadísticas del vendedor
  stats: {
    totalSales: { type: Number, default: 0 }, // en MATIC
    totalTransactions: { type: Number, default: 0 },
    averageTransaction: { type: Number, default: 0 },
    
    // Stats por mes para análisis
    monthlySales: [{
      month: Number, // 1-12
      year: Number,
      sales: Number, // en MATIC
      transactions: Number
    }],
    
    // Productos/servicios más vendidos
    topProducts: [{
      name: String,
      count: Number,
      revenue: Number
    }],
    
    // Rating promedio
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    }
  },
  
  // Información de contacto
  contact: {
    phone: String,
    whatsapp: String,
    email: String,
    website: String,
    facebook: String,
    instagram: String
  },
  
  // Verificación del negocio
  verification: {
    isVerified: { type: Boolean, default: false },
    verificationDate: Date,
    documents: [{
      type: {
        type: String,
        enum: ['fundempresa', 'license', 'tax_registration', 'other']
      },
      url: String,
      verified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Badges o certificaciones
    badges: [{
      type: String,
      enum: ['verified_business', 'top_seller', 'eco_friendly', 'fast_delivery'],
      awardedAt: Date
    }]
  },
  
  // QR Code personalizado
  qrSettings: {
    customDesign: { type: Boolean, default: false },
    backgroundColor: { type: String, default: '#FFFFFF' },
    foregroundColor: { type: String, default: '#000000' },
    logo: String // URL del logo para el QR
  },
  
  // Control de estado
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false },
  premiumUntil: Date,
  
  // Fechas
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
vendorSchema.index({ 'businessInfo.category': 1 });
vendorSchema.index({ 'location.city': 1 });
vendorSchema.index({ 'location.department': 1 });
vendorSchema.index({ 'location.coordinates': '2dsphere' });
vendorSchema.index({ 'stats.rating.average': -1 });
vendorSchema.index({ createdAt: -1 });
vendorSchema.index({ isActive: 1 });

// Método para actualizar estadísticas de ventas
vendorSchema.methods.updateSalesStats = function(amount, productName = null) {
  this.stats.totalSales += amount;
  this.stats.totalTransactions += 1;
  this.stats.averageTransaction = this.stats.totalSales / this.stats.totalTransactions;
  
  // Actualizar estadísticas mensuales
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  let monthlyStats = this.stats.monthlySales.find(
    m => m.month === currentMonth && m.year === currentYear
  );
  
  if (!monthlyStats) {
    monthlyStats = {
      month: currentMonth,
      year: currentYear,
      sales: 0,
      transactions: 0
    };
    this.stats.monthlySales.push(monthlyStats);
  }
  
  monthlyStats.sales += amount;
  monthlyStats.transactions += 1;
  
  // Actualizar productos top si se proporciona nombre
  if (productName) {
    let topProduct = this.stats.topProducts.find(p => p.name === productName);
    if (!topProduct) {
      topProduct = { name: productName, count: 0, revenue: 0 };
      this.stats.topProducts.push(topProduct);
    }
    topProduct.count += 1;
    topProduct.revenue += amount;
    
    // Ordenar y mantener solo top 10
    this.stats.topProducts.sort((a, b) => b.revenue - a.revenue);
    this.stats.topProducts = this.stats.topProducts.slice(0, 10);
  }
  
  return this.save();
};

// Método para calcular distancia a una ubicación
vendorSchema.methods.getDistanceTo = function(lat, lng) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat - this.location.coordinates.latitude) * Math.PI / 180;
  const dLng = (lng - this.location.coordinates.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.location.coordinates.latitude * Math.PI / 180) * 
            Math.cos(lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distancia en km
};

// Método para verificar si está abierto ahora
vendorSchema.methods.isOpenNow = function() {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = dayNames[now.getDay()];
  
  const schedule = this.businessInfo.schedule[today];
  if (schedule.closed) return false;
  
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(schedule.open.replace(':', ''));
  const closeTime = parseInt(schedule.close.replace(':', ''));
  
  return currentTime >= openTime && currentTime <= closeTime;
};

// Virtual para obtener rating como string
vendorSchema.virtual('ratingDisplay').get(function() {
  return `${this.stats.rating.average.toFixed(1)} (${this.stats.rating.count} reviews)`;
});

// Transformar JSON output
vendorSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
