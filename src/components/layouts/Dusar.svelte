<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Home from '../pages/dusar/HomePage.svelte';
  import About from '../pages/dusar/AboutPage.svelte';
  // Importa otros componentes de vista según necesites

  const location = window.location.pathname;
</script>

<style>
  /* Opcional: Puedes agregar estilos adicionales aquí si lo necesitas */
  footer{
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #AAA ;
  }
</style>

<!-- Navbar de Bootstrap 5 -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">DUSAR</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="/" on:click|preventDefault={() => {navigate('/')}}>Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/about" on:click|preventDefault={() => {navigate('/about')}}>Acerca de</a>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/sign-out">Cerrar Sesión</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<main>
  <Router>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <!-- Otras rutas -->
  </Router>
</main>

<!-- Footer -->
<footer class="footer-contact">
  <div class="container-fluid">
      <div class="row">
          <div class="col-md-6">
              <h4>CONTACTO</h4>
              
              <div class="contact-info">
                  <i class="bi bi-building"></i>
                  <strong>Innova Ulíma</strong>
              </div>
              
              <div class="contact-info">
                  <i class="bi bi-envelope"></i>
                  <a href="mailto:emprendimiento@ulima.edu.pe" class="text-white text-decoration-none">emprendimiento@ulima.edu.pe</a>
              </div>
              
              <div class="contact-info">
                  <i class="bi bi-telephone"></i>
                  Teléfono (511) 4376767 anexo 39201
              </div>
              
              <div class="contact-info">
                  <i class="bi bi-clock"></i>
                  Horario de atención: De 8:00 a 18:00 horas
              </div>
              
              <div class="contact-info">
                  <i class="bi bi-geo-alt"></i>
                  Universidad de Lima. Torre O2, piso 10
              </div>
          </div>
      </div>
  </div>
</footer>
