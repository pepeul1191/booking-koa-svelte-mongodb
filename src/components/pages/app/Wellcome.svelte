<script>
  // Import Font Awesome CSS in your app.html or layout file
  // Add this to your app.html head section:
  // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<style>
  :root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --light-color: #ecf0f1;
  }
  
  .hero-section {
    background: linear-gradient(135deg, var(--primary-color) 0%, #34495e 100%);
    color: white;
    padding: 100px 0;
    margin-bottom: 50px;
  }
  
  .environment-card {
    border: none;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    margin-bottom: 30px;
    height: 100%;
    position: relative;
  }
  
  .environment-card:hover {
    transform: translateY(-5px);
  }
  
  .card-img-top {
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }
  
  .feature-icon {
    font-size: 3rem;
    color: var(--secondary-color);
    margin-bottom: 20px;
  }
  
  .availability-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
  }
  
  .btn-primary {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
  }
  
  .btn-primary:hover {
    background-color: #2980b9;
    border-color: #2980b9;
  }
  
  .stats-section {
    background-color: var(--light-color);
    padding: 60px 0;
  }
  
  .stat-number {
    font-size: 3rem;
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .quick-reservation {
    background-color: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  /* Font Awesome icon styling */
  .fa-icon {
    margin-right: 8px;
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6">
        <h1 class="display-4 fw-bold">Reserva Ambientes para Innovar</h1>
        <p class="lead">Espacios diseñados para el emprendimiento, la creatividad y la colaboración en nuestra universidad.</p>
        <a href="#reservar" class="btn btn-light btn-lg mt-3">Reservar Ahora</a>
      </div>
      <div class="col-lg-6 text-center">
        <!-- Font Awesome 4.7 users icon -->
        <i class="fa fa-users fa-5x opacity-75"></i>
      </div>
    </div>
  </div>
</section>

<!-- Quick Reservation -->
<section id="reservar" class="container mb-5">
  <div class="quick-reservation">
    <h3 class="text-center mb-4">Reserva Rápida</h3>
    <div class="row">
      <div class="col-md-3 mb-3">
        <label class="form-label">Ambiente</label>
        <select class="form-select">
          <option selected>Seleccionar ambiente...</option>
          <option>Sala de Coworking</option>
          <option>Laboratorio de Innovación</option>
          <option>Sala de Reuniones A</option>
          <option>Sala de Reuniones B</option>
          <option>Aula Maker</option>
        </select>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Fecha</label>
        <input type="date" class="form-control">
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Hora Inicio</label>
        <input type="time" class="form-control">
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Hora Fin</label>
        <input type="time" class="form-control">
      </div>
    </div>
    <div class="text-center">
      <button class="btn btn-primary btn-lg">Ver Disponibilidad</button>
    </div>
  </div>
</section>

<!-- Available Environments -->
<section class="container mb-5">
  <h2 class="text-center mb-5">Nuestros Ambientes Disponibles</h2>
  <div class="row">
    <!-- Environment 1 -->
    <div class="col-md-4">
      <div class="card environment-card">
        <span class="availability-badge badge bg-success">Disponible</span>
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" class="card-img-top" alt="Sala de Coworking">
        <div class="card-body">
          <h5 class="card-title">Sala de Coworking</h5>
          <p class="card-text">Espacio colaborativo ideal para equipos de emprendedores. Capacidad: 20 personas.</p>
          <p><i class="fa fa-wifi fa-icon"></i> WiFi de alta velocidad</p>
          <p><i class="fa fa-desktop fa-icon"></i> Pantalla compartida</p>
          <p><i class="fa fa-coffee fa-icon"></i> Área de café</p>
          <a href="#" class="btn btn-primary">Reservar Ahora</a>
        </div>
      </div>
    </div>
    
    <!-- Environment 2 -->
    <div class="col-md-4">
      <div class="card environment-card">
        <span class="availability-badge badge bg-warning">Pocos Horarios</span>
        <img src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" class="card-img-top" alt="Laboratorio de Innovación">
        <div class="card-body">
          <h5 class="card-title">Laboratorio de Innovación</h5>
          <p class="card-text">Equipado con tecnología de vanguardia para prototipado. Capacidad: 15 personas.</p>
          <p><i class="fa fa-print fa-icon"></i> Impresoras 3D</p>
          <p><i class="fa fa-cube fa-icon"></i> Equipo de Realidad Virtual</p>
          <p><i class="fa fa-wrench fa-icon"></i> Herramientas de prototipado</p>
          <a href="#" class="btn btn-primary">Reservar Ahora</a>
        </div>
      </div>
    </div>
    
    <!-- Environment 3 -->
    <div class="col-md-4">
      <div class="card environment-card">
        <span class="availability-badge badge bg-success">Disponible</span>
        <img src="https://images.unsplash.com/photo-1560415751-5f32d932c09c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" class="card-img-top" alt="Sala de Reuniones">
        <div class="card-body">
          <h5 class="card-title">Sala de Reuniones A</h5>
          <p class="card-text">Ideal para presentaciones y reuniones formales. Capacidad: 10 personas.</p>
          <p><i class="fa fa-video-camera fa-icon"></i> Sistema de videoconferencia</p>
          <p><i class="fa fa-film fa-icon"></i> Proyector HD</p>
          <p><i class="fa fa-print fa-icon"></i> Impresora disponible</p>
          <a href="#" class="btn btn-primary">Reservar Ahora</a>
        </div>
      </div>
    </div>
  </div>
  
  <div class="text-center mt-4">
    <a href="#" class="btn btn-outline-primary">Ver Todos los Ambientes</a>
  </div>
</section>

<!-- Stats Section -->
<section class="stats-section">
  <div class="container">
    <div class="row text-center">
      <div class="col-md-3 mb-4">
        <div class="feature-icon">
          <i class="fa fa-building"></i>
        </div>
        <div class="stat-number">12</div>
        <p>Ambientes Disponibles</p>
      </div>
      <div class="col-md-3 mb-4">
        <div class="feature-icon">
          <i class="fa fa-calendar-check-o"></i>
        </div>
        <div class="stat-number">1,250</div>
        <p>Reservas Mensuales</p>
      </div>
      <div class="col-md-3 mb-4">
        <div class="feature-icon">
          <i class="fa fa-graduation-cap"></i>
        </div>
        <div class="stat-number">850</div>
        <p>Emprendedores Activos</p>
      </div>
      <div class="col-md-3 mb-4">
        <div class="feature-icon">
          <i class="fa fa-rocket"></i>
        </div>
        <div class="stat-number">45</div>
        <p>Startups Creadas</p>
      </div>
    </div>
  </div>
</section>