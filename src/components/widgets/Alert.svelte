<script>
  /** @type {string} Status de la alerta (success, danger, warning, etc.) */
  export let status; 
  
  /** @type {string} Texto del mensaje */
  export let text;
  
  // Opcional: Para controlar la visibilidad si el texto está vacío
  $: visible = !!text;

  // Función para cerrar manualmente la alerta (opcional)
  function closeAlert() {
    text = '';
  }
</script>

{#if visible}
  <div class="alert alert-{status} alert-dismissible fade show" role="alert">
    <strong>{text}</strong>
    <button type="button" class="btn-close" aria-label="Close" on:click={closeAlert}></button>
  </div>
{/if}