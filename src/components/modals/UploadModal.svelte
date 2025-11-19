<!-- UploadModal.svelte -->
<script>
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let selectedFiles = [];
  let dropZone;
  let fileInput;

  onMount(() => {
    setupDropZone();
  });

  function setupDropZone() {
    if (!dropZone) return;
    
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = () => {
      dropZone.classList.add('dragover');
    };

    const unhighlight = () => {
      dropZone.classList.remove('dragover');
    };

    const handleDrop = (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    };

    // Prevenir comportamientos por defecto
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    // Resaltar área de drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Manejar drop
    dropZone.addEventListener('drop', handleDrop, false);
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
      // Resetear el input para permitir seleccionar el mismo archivo otra vez
      e.target.value = '';
    }
  }

  function handleFiles(files) {
    if (!files.length) return;
    
    const newFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Verificar que sea un PDF
      if (file.type !== 'application/pdf') {
        alert(`"${file.name}" no es un archivo PDF válido.`);
        continue;
      }
      
      // Verificar si ya fue seleccionado (comparar por nombre y tamaño)
      if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        alert(`"${file.name}" ya está en la lista.`);
        continue;
      }
      
      newFiles.push(file);
    }
    
    if (newFiles.length > 0) {
      selectedFiles = [...selectedFiles, ...newFiles];
    }
  }

  function removeFile(index) {
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
  }

  function savePDFs() {
    if (selectedFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo PDF.');
      return;
    }
    
    // Crear objetos PDF para cada archivo
    const newPDFs = selectedFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      title: file.name.replace('.pdf', '').replace(/_/g, ' '),
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      uploadDate: new Date().toLocaleDateString('es-ES'),
      file: file,
    }));
    
    // Emitir evento para guardar
    dispatch('save', newPDFs);
    
    // Limpiar
    selectedFiles = [];
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function browseFiles() {
    fileInput.click();
  }

  // Prevenir el comportamiento por defecto de drag and drop en toda la página
  function handleGlobalDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleGlobalDrop(e) {
    e.preventDefault();
    e.stopPropagation();
  }
</script>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
  }

  .modal-dialog {
    max-width: 500px;
    width: 90%;
    margin: 1.75rem auto;
  }

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 0.3rem;
    outline: 0;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
  }

  .modal-title {
    margin-bottom: 0;
    line-height: 1.5;
  }

  .btn-close {
    padding: 0.5rem 0.5rem;
    margin: -0.5rem -0.5rem -0.5rem auto;
    background-color: transparent;
    border: 0;
    border-radius: 0.375rem;
    opacity: .5;
    cursor: pointer;
  }

  .modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
  }

  .modal-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    padding: 0.75rem;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(0.3rem - 1px);
    border-bottom-left-radius: calc(0.3rem - 1px);
  }

  .drop-zone {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
    cursor: pointer;
  }

  .drop-zone:hover, .drop-zone.dragover {
    border-color: #0d6efd;
    background-color: #e7f1ff;
  }

  .file-list {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 0.5rem;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #dee2e6;
  }

  .file-item:last-child {
    border-bottom: none;
  }

  .file-remove {
    color: #dc3545;
    cursor: pointer;
    padding: 0.25rem;
  }

  .file-remove:hover {
    color: #bd2130;
  }

  .text-muted {
    color: #6c757d !important;
  }

  .text-center {
    text-align: center !important;
  }

  .mt-2 {
    margin-top: 0.5rem !important;
  }

  .me-2 {
    margin-right: 0.5rem !important;
  }

  .mb-3 {
    margin-bottom: 1rem !important;
  }
</style>

<svelte:window on:dragover={handleGlobalDragOver} on:drop={handleGlobalDrop} />

<div class="modal-backdrop">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Subir Documentos PDF</h5>
        <button type="button" class="btn-close" on:click={() => dispatch('close')}>×</button>
      </div>
      <div class="modal-body">
        <div class="drop-zone" bind:this={dropZone} on:click={browseFiles}>
          <div style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;">
            <i class="fa fa-cloud-upload fa-3x text-muted mb-3"></i>
          </div>
          <h5>Arrastra tus archivos PDF aquí</h5>
          <p class="text-muted">o haz clic para seleccionar archivos</p>
          <input 
            type="file" 
            bind:this={fileInput} 
            multiple 
            accept=".pdf" 
            style="display: none;" 
            on:change={handleFileSelect}
          >
          <button type="button" class="btn btn-outline-secondary mt-2" on:click|stopPropagation={browseFiles}>
            <i class="fa fa-folder-open me-2"></i> Explorar archivos
          </button>
        </div>
        
        <div class="file-list">
          {#if selectedFiles.length === 0}
            <p class="text-muted text-center">No hay archivos seleccionados</p>
          {:else}
            {#each selectedFiles as file, index (file.name + file.size)}
              <div class="file-item">
                <div>
                  <span style="color: #dc3545; margin-right: 0.5rem;">📄</span>
                  <span>{file.name}</span>
                  <small class="text-muted">({formatFileSize(file.size)})</small>
                </div>
                <div>
                  <span 
                    class="file-remove" 
                    on:click|stopPropagation={() => removeFile(index)}
                    title="Eliminar archivo"
                  >
                    ✕
                  </span>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={() => dispatch('close')}>Cancelar</button>
        <button type="button" style="margin-left: 10px;" class="btn btn-primary" on:click={savePDFs}>
          {selectedFiles.length > 0 ? `Guardar (${selectedFiles.length})` : 'Guardar'}
        </button>
      </div>
    </div>
  </div>
</div>