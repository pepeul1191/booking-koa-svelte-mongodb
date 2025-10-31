<script>
  let activeTab = 'inicio';
	import Reservations from './Reservations.svelte';
  import Rooms from './Rooms.svelte';
  import Wellcome from './Wellcome.svelte';
  import Calendar from './Calendar.svelte';
  
  const tabs = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'rooms', label: 'Ambientes' },
    { id: 'reservations', label: 'Reservaciones' },
    { id: 'calendar', label: 'Calendario' },
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
        <Wellcome />
      </div>
    {:else if activeTab === 'rooms'}
      <div class="tab-pane active">
        <Rooms />
      </div>
    {:else if activeTab === 'reservations'}
      <div class="tab-pane active">
        <Reservations />
      </div>
    {:else if activeTab === 'calendar'}
      <div class="tab-pane active">
        <Calendar />
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