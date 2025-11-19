<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Home from '../pages/dusar/HomePage.svelte';
  import About from '../pages/dusar/AboutPage.svelte';
  // Importa otros componentes de vista según necesites

  const location = window.location.pathname;
</script>

<style>
  /* Opcional: Puedes agregar estilos adicionales aquí si lo necesitas */
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
          <a class="nav-link" href="/about" on:click|preventDefault={() => {navigate('/about')}}>About</a>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/sign-out">Sign Out</a>
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
<footer class="bg-light text-center text-lg-start mt-5">
  <div class="text-center p-3">
    © 2023 Copyright: Mi App
  </div>
</footer>
