<script>
  import { navigate } from 'svelte-routing';
  import { dataStore } from '../../stores/session_stores';
  import { onMount } from 'svelte';
  
  let session;

  const signOut = (e) => {
    let name = 'authToken';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict`;
    window.location.replace('/sign-out');
  }

  onMount(() => {
    dataStore.subscribe(value => {
      console.log(value);
      if(value != null){
        session = value
      }
    })
  });
</script>

<style>
  .sign-out-btn {
    color: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    padding: 6px 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    margin-left: auto;
  }
  
  .sign-out-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white !important;
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .navbar-nav {
    width: 100%;
    display: flex;
    align-items: center;
  }
</style>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <!-- Marca/Logo -->
    <a class="navbar-brand" href="/">Booking UL</a>

    <!-- Botón para dispositivos móviles -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Contenido colapsable -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="/">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="/user">Simular Usuario</a>
        </li>
        
        <!-- Botón de cerrar sesión pegado a la derecha -->
        <li class="nav-item ms-auto">
          <a class="nav-link sign-out-btn" href="/sign-out" on:click|preventDefault={signOut}>
            Cerrar Sesión
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>