<script>
  let activeTab = 'inicio';
  
  const tabs = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'contacto', label: 'Contacto' }
  ];

  function setActiveTab(tabId) {
    activeTab = tabId;
  }
</script>

<div class="tabs-container">
  <!-- Navegación de pestañas -->
  <nav class="tabs-navigation">
    {#each tabs as tab}
      <button
        class="tab-button {activeTab === tab.id ? 'active' : ''}"
        on:click={() => setActiveTab(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </nav>

  <!-- Contenido de las pestañas -->
  <div class="tab-content">
    {#if activeTab === 'inicio'}
      <div class="tab-pane active">
        <h2>Bienvenido a la página de Inicio</h2>
        <p>Este es el contenido de la pestaña de inicio.</p>
      </div>
    {:else if activeTab === 'servicios'}
      <div class="tab-pane active">
        <h2>Nuestros Servicios</h2>
        <ul>
          <li>Desarrollo Web</li>
          <li>Consultoría</li>
          <li>Diseño UI/UX</li>
        </ul>
      </div>
    {:else if activeTab === 'contacto'}
      <div class="tab-pane active">
        <h2>Contacto</h2>
        <p>Email: info@ejemplo.com</p>
        <p>Teléfono: +123456789</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .tabs-container {
    
  }

  .tabs-navigation {
    display: flex;
    border-bottom: 2px solid #e0e0e0;
    margin-bottom: 20px;
  }

  .tab-button {
    padding: 12px 24px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #666;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
  }

  .tab-button:hover {
    color: var(--bs-primary);
    background-color: #f8f9fa;
  }

  .tab-button.active {
    color: var(--bs-primary);
    border-bottom-color: var(--bs-primary);
    font-weight: bold;
  }

  .tab-pane {
    padding: 20px;
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>