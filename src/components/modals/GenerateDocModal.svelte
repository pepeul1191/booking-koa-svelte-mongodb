<!-- GenerateDocModal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let studentName = '';
  let studentCode = '';

  export let pdfs = [];

  function generate() {
    if (!studentName || !studentCode) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const data = {
      studentName,
      studentCode,
      pdfs
    };

    dispatch('generate', data);
  }
</script>

<div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Generar Documento</h5>
        <button type="button" class="btn-close" on:click={() => dispatch('close')}></button>
      </div>
      <div class="modal-body">
        <form id="generateDocForm">
          <div class="mb-3">
            <label for="studentName" class="form-label">Nombre del Alumno</label>
            <input type="text" class="form-control" id="studentName" bind:value={studentName} required>
          </div>
          <div class="mb-3">
            <label for="studentCode" class="form-label">Código del Alumno</label>
            <input type="text" class="form-control" id="studentCode" bind:value={studentCode} required>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={() => dispatch('close')}>Cancelar</button>
        <button type="button" class="btn btn-primary" on:click={generate}>Generar</button>
      </div>
    </div>
  </div>
</div>