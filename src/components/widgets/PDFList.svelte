<!-- PDFList.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let pdfs = [];

  let draggedItem = null;

  function handleDragStart(e, pdf) {
    draggedItem = pdf;
    e.currentTarget.classList.add('dragging');
  }

  function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, targetPdf) {
    e.preventDefault();
    
    if (draggedItem === targetPdf) return;

    const fromIndex = pdfs.indexOf(draggedItem);
    const toIndex = pdfs.indexOf(targetPdf);

    // Reordenar el array
    const newPDFs = [...pdfs];
    newPDFs.splice(fromIndex, 1);
    newPDFs.splice(toIndex, 0, draggedItem);

    // Emitir el nuevo orden
    dispatch('reorder', newPDFs);
  }

  function deletePDF(pdfId) {
    dispatch('delete', pdfId);
  }
</script>

<style>
  .pdf-card {
    transition: all 0.3s ease;
    border-radius: 12px;
    cursor: move;
  }

  .pdf-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
  }

  .pdf-card.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .pdf-card .card-title {
    font-size: 1rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pdf-icon-container {
    width: 50px;
    height: 50px;
  }

  .pdf-icon {
    width: 100%;
    height: 100%;
    background-color: rgba(220, 53, 69, 0.1);
    transition: all 0.3s ease;
  }

  .pdf-card:hover .pdf-icon {
    transform: scale(1.1);
    background-color: rgba(220, 53, 69, 0.15) !important;
  }
</style>

{#each pdfs as pdf (pdf.id)}
  <div class="pdf-card flex-fill" style="min-width: 300px; max-width: 400px;"
       draggable="true"
       on:dragstart={(e) => handleDragStart(e, pdf)}
       on:dragend={handleDragEnd}
       on:dragover={handleDragOver}
       on:drop={(e) => handleDrop(e, pdf)}>
    <div class="card h-100">
      <div class="card-body">
        <div class="d-flex align-items-start">
          <!-- Icono con ancho fijo -->
          <div class="pdf-icon-container flex-shrink-0 me-3">
            <div class="pdf-icon rounded-circle d-flex align-items-center justify-content-center">
              <i class="fa fa-file-pdf-o text-danger"></i>
            </div>
          </div>
          <!-- Contenido principal que ocupa el espacio restante -->
          <div class="flex-grow-1 me-2">
            <h5 class="card-title">{pdf.title}</h5>
            <p class="card-text text-muted small mb-1">
              <i class="fa fa-file me-1"></i> {pdf.fileName}
            </p>
            <p class="card-text text-muted small mb-0">
              <i class="fa fa-hdd-o me-1"></i> {pdf.fileSize}
            </p>
            <p class="card-text text-muted small">
              <i class="fa fa-calendar me-1"></i> {pdf.uploadDate}
            </p>
          </div>
          <!-- Botón de eliminar alineado a la derecha -->
          <div class="flex-shrink-0">
            <a class="text-danger delete-pdf" href="#" title="Eliminar" on:click|preventDefault={() => deletePDF(pdf.id)}>
              <i class="fa fa-trash"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{/each}