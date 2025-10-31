// 1. Sala de Conferencias Principal
db.rooms.insertOne({
  name: "Sala de Conferencias Principal",
  description: "Sala grande con equipo audiovisual completo",
  capacity: 50,
  availability: [
    { day: 1, open: 480, close: 1020 },   // Lunes 8:00-17:00
    { day: 2, open: 480, close: 1020 },   // Martes 8:00-17:00
    { day: 3, open: 480, close: 1020 },   // Miércoles 8:00-17:00
    { day: 4, open: 480, close: 1020 },   // Jueves 8:00-17:00
    { day: 5, open: 480, close: 1020 }    // Viernes 8:00-17:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 2. Sala de Reuniones Ejecutiva
db.rooms.insertOne({
  name: "Sala Ejecutiva A",
  description: "Sala VIP para reuniones de alta dirección",
  capacity: 12,
  availability: [
    { day: 1, open: 540, close: 1080 },   // Lunes 9:00-18:00
    { day: 2, open: 540, close: 1080 },   // Martes 9:00-18:00
    { day: 3, open: 540, close: 1080 },   // Miércoles 9:00-18:00
    { day: 4, open: 540, close: 1080 },   // Jueves 9:00-18:00
    { day: 5, open: 540, close: 1080 }    // Viernes 9:00-18:00
  ],
  exceptions: [
    {
      date: new Date("2024-12-25"),
      open: 0,
      close: 0,
      reason: "Navidad - Cerrado"
    }
  ],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 3. Sala de Capacitación
db.rooms.insertOne({
  name: "Sala de Capacitación Tecnica",
  description: "Sala con 25 computadoras para entrenamientos",
  capacity: 25,
  availability: [
    { day: 1, open: 420, close: 960 },    // Lunes 7:00-16:00
    { day: 2, open: 420, close: 960 },    // Martes 7:00-16:00
    { day: 3, open: 420, close: 960 },    // Miércoles 7:00-16:00
    { day: 4, open: 420, close: 960 },    // Jueves 7:00-16:00
    { day: 5, open: 420, close: 960 }     // Viernes 7:00-16:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 4. Sala de Brainstorming
db.rooms.insertOne({
  name: "Sala Creativa Brainstorming",
  description: "Sala con pizarras interactivas y paredes para escribir",
  capacity: 15,
  availability: [
    { day: 1, open: 480, close: 1200 },   // Lunes 8:00-20:00
    { day: 2, open: 480, close: 1200 },   // Martes 8:00-20:00
    { day: 3, open: 480, close: 1200 },   // Miércoles 8:00-20:00
    { day: 4, open: 480, close: 1200 },   // Jueves 8:00-20:00
    { day: 5, open: 480, close: 1200 }    // Viernes 8:00-20:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 5. Sala de Videoconferencias
db.rooms.insertOne({
  name: "Sala de Videoconferencias Global",
  description: "Equipada con sistema de VC 4K y traducción simultánea",
  capacity: 20,
  availability: [
    { day: 1, open: 360, close: 1320 },   // Lunes 6:00-22:00
    { day: 2, open: 360, close: 1320 },   // Martes 6:00-22:00
    { day: 3, open: 360, close: 1320 },   // Miércoles 6:00-22:00
    { day: 4, open: 360, close: 1320 },   // Jueves 6:00-22:00
    { day: 5, open: 360, close: 1320 }    // Viernes 6:00-22:00
  ],
  exceptions: [
    {
      date: new Date("2024-01-01"),
      open: 0,
      close: 0,
      reason: "Año Nuevo"
    }
  ],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 6. Sala de Presentaciones
db.rooms.insertOne({
  name: "Sala de Presentaciones Auditorio",
  description: "Auditorio con capacidad para presentaciones formales",
  capacity: 100,
  availability: [
    { day: 1, open: 540, close: 1020 },   // Lunes 9:00-17:00
    { day: 3, open: 540, close: 1020 },   // Miércoles 9:00-17:00
    { day: 5, open: 540, close: 1020 }    // Viernes 9:00-17:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 7. Sala de Trabajo Colaborativo
db.rooms.insertOne({
  name: "Sala Colaborativa Open Space",
  description: "Espacio abierto para trabajo en equipo",
  capacity: 30,
  availability: [
    { day: 1, open: 480, close: 1080 },   // Lunes 8:00-18:00
    { day: 2, open: 480, close: 1080 },   // Martes 8:00-18:00
    { day: 3, open: 480, close: 1080 },   // Miércoles 8:00-18:00
    { day: 4, open: 480, close: 1080 },   // Jueves 8:00-18:00
    { day: 5, open: 480, close: 1080 }    // Viernes 8:00-18:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 8. Sala de Reuniones Rápida
db.rooms.insertOne({
  name: "Sala Express Meeting",
  description: "Para reuniones cortas de 30 minutos máximo",
  capacity: 6,
  availability: [
    { day: 1, open: 480, close: 1020 },   // Lunes 8:00-17:00
    { day: 2, open: 480, close: 1020 },   // Martes 8:00-17:00
    { day: 3, open: 480, close: 1020 },   // Miércoles 8:00-17:00
    { day: 4, open: 480, close: 1020 },   // Jueves 8:00-17:00
    { day: 5, open: 480, close: 1020 }    // Viernes 8:00-17:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 9. Sala de Entrevistas
db.rooms.insertOne({
  name: "Sala de Entrevistas RH",
  description: "Sala privada para procesos de reclutamiento",
  capacity: 8,
  availability: [
    { day: 1, open: 540, close: 960 },    // Lunes 9:00-16:00
    { day: 2, open: 540, close: 960 },    // Martes 9:00-16:00
    { day: 3, open: 540, close: 960 },    // Miércoles 9:00-16:00
    { day: 4, open: 540, close: 960 },    // Jueves 9:00-16:00
    { day: 5, open: 540, close: 960 }     // Viernes 9:00-16:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 10. Sala de Proyecciones
db.rooms.insertOne({
  name: "Sala Cine Corporativo",
  description: "Sala con sistema de proyección profesional y sonido surround",
  capacity: 40,
  availability: [
    { day: 1, open: 600, close: 1320 },   // Lunes 10:00-22:00
    { day: 2, open: 600, close: 1320 },   // Martes 10:00-22:00
    { day: 4, open: 600, close: 1320 },   // Jueves 10:00-22:00
    { day: 5, open: 600, close: 1320 },   // Viernes 10:00-22:00
    { day: 6, open: 600, close: 1320 }    // Sábado 10:00-22:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 11. Sala de Teleconferencia
db.rooms.insertOne({
  name: "Sala Teleconferencia Remota",
  description: "Optimizada para conexiones remotas estables",
  capacity: 10,
  availability: [
    { day: 1, open: 360, close: 1260 },   // Lunes 6:00-21:00
    { day: 2, open: 360, close: 1260 },   // Martes 6:00-21:00
    { day: 3, open: 360, close: 1260 },   // Miércoles 6:00-21:00
    { day: 4, open: 360, close: 1260 },   // Jueves 6:00-21:00
    { day: 5, open: 360, close: 1260 }    // Viernes 6:00-21:00
  ],
  exceptions: [
    {
      date: new Date("2024-12-31"),
      open: 360,
      close: 720,
      reason: "Nochevieja - Medio día"
    }
  ],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 12. Sala de Junta Directiva
db.rooms.insertOne({
  name: "Sala de Junta Directiva",
  description: "Sala exclusiva para juntas de directores",
  capacity: 16,
  availability: [
    { day: 1, open: 480, close: 1080 },   // Lunes 8:00-18:00
    { day: 3, open: 480, close: 1080 },   // Miércoles 8:00-18:00
    { day: 5, open: 480, close: 1080 }    // Viernes 8:00-18:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 13. Sala de Trabajo Individual
db.rooms.insertOne({
  name: "Sala Focus Individual",
  description: "Cabinas individuales para trabajo concentrado",
  capacity: 1,
  availability: [
    { day: 1, open: 480, close: 1020 },   // Lunes 8:00-17:00
    { day: 2, open: 480, close: 1020 },   // Martes 8:00-17:00
    { day: 3, open: 480, close: 1020 },   // Miércoles 8:00-17:00
    { day: 4, open: 480, close: 1020 },   // Jueves 8:00-17:00
    { day: 5, open: 480, close: 1020 }    // Viernes 8:00-17:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 14. Sala de Eventos Sociales
db.rooms.insertOne({
  name: "Sala de Eventos Sociales",
  description: "Para celebraciones y eventos informales",
  capacity: 80,
  availability: [
    { day: 5, open: 600, close: 1380 },   // Viernes 10:00-23:00
    { day: 6, open: 600, close: 1380 },   // Sábado 10:00-23:00
    { day: 0, open: 600, close: 1380 }    // Domingo 10:00-23:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 15. Sala de Talleres
db.rooms.insertOne({
  name: "Sala de Talleres Prácticos",
  description: "Con mesas de trabajo y herramientas básicas",
  capacity: 24,
  availability: [
    { day: 2, open: 540, close: 1080 },   // Martes 9:00-18:00
    { day: 3, open: 540, close: 1080 },   // Miércoles 9:00-18:00
    { day: 4, open: 540, close: 1080 }    // Jueves 9:00-18:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 16. Sala de Conferencias Internacional
db.rooms.insertOne({
  name: "Sala Internacional Multiusos",
  description: "Preparada para conferencias internacionales",
  capacity: 75,
  availability: [
    { day: 1, open: 240, close: 1320 },   // Lunes 4:00-22:00
    { day: 2, open: 240, close: 1320 },   // Martes 4:00-22:00
    { day: 3, open: 240, close: 1320 },   // Miércoles 4:00-22:00
    { day: 4, open: 240, close: 1320 },   // Jueves 4:00-22:00
    { day: 5, open: 240, close: 1320 }    // Viernes 4:00-22:00
  ],
  exceptions: [
    {
      date: new Date("2024-09-16"),
      open: 0,
      close: 0,
      reason: "Día de la Independencia"
    }
  ],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 17. Sala de Innovación
db.rooms.insertOne({
  name: "Sala de Innovación y Design Thinking",
  description: "Espacio flexible con mobiliario modular",
  capacity: 35,
  availability: [
    { day: 1, open: 480, close: 1200 },   // Lunes 8:00-20:00
    { day: 2, open: 480, close: 1200 },   // Martes 8:00-20:00
    { day: 3, open: 480, close: 1200 },   // Miércoles 8:00-20:00
    { day: 4, open: 480, close: 1200 },   // Jueves 8:00-20:00
    { day: 5, open: 480, close: 1200 }    // Viernes 8:00-20:00
  ],
  exceptions: [],
  reservationIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
})