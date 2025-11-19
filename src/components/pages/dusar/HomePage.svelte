<!-- PDFManager.svelte -->
<script>
  import { onMount } from 'svelte';
  import UploadModal from '../../modals/UploadModal.svelte';
  import GenerateDocModal from '../../modals/GenerateDocModal.svelte';
  import PDFList from '../../widgets/PDFList.svelte';

  // Variables reactivas
  let pdfs = [];
  let showUploadModal = false;
  let showGenerateModal = false;

  // Función para abrir el modal de subida
  function openUploadModal() {
    showUploadModal = true;
  }

  // Función para cerrar el modal de subida
  function closeUploadModal() {
    showUploadModal = false;
  }

  // Función para abrir el modal de generación
  function openGenerateModal() {
    if (pdfs.length === 0) {
      alert('No hay PDFs para generar el documento.');
      return;
    }
    showGenerateModal = true;
  }

  // Función para cerrar el modal de generación
  function closeGenerateModal() {
    showGenerateModal = false;
  }

  // Función para agregar nuevos PDFs
  function addPDFs(newPDFs) {
    pdfs = [...pdfs, ...newPDFs.detail];
    closeUploadModal();
  }

  // Función para eliminar un PDF
  function deletePDF(event) {
    if (confirm('¿Estás seguro de que deseas eliminar este PDF?')) {
      const id = event.detail;
      pdfs = pdfs.filter(pdf => pdf.id !== id);
    }
  }

  // Función para actualizar el orden de los PDFs (después de arrastrar y soltar)
  function updatePDFOrder(event) {
    const newOrder = event.detail;
    console.log(event.detail);
    pdfs = newOrder;
  }

  // Función para generar el documento (enviar al servidor)
  function generateDocument(data) {
    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Generando documento con:', data);
    // Luego de generar, cerramos el modal
    closeGenerateModal();
  }
</script>

<style>
  /* Estilos específicos de PDFManager */
  .pdf-container {
    width: 100%;
    margin-bottom: 50px;
    padding-top: 10px;
  }

  .pdf-flex-container {
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .pdf-flex-container {
      gap: 1rem;
    }
  }

  .pdf-card-add:hover{
    cursor: pointer;
    transition: all 0.3s ease;
  }
</style>

<div class="container-fluid py-4">
  <div class="pdf-container">
    <div class="d-flex justify-content-between align-items-center mb-4 px-3">
      <h2 class="h4 fw-bold text-dark mb-0">Silabos UL</h2>
      <button class="btn btn-primary d-flex align-items-center" on:click={openGenerateModal}>
        <i class="fa fa-gear me-2"></i> Generar Documento
      </button>
    </div>

    <hr class="my-4 mx-3" />

    <!-- Alert container para mensajes -->
    <div class="alert-container" id="alertContainer"></div>

    <div class="pdf-flex-container w-100 d-flex flex-wrap gap-3 px-3">      
      <!-- Card para agregar nuevo PDF -->
      <div class="pdf-card-add pdf-card flex-fill" style="min-width: 300px; max-width: 400px;">
        <div class="card h-100 border-2 border-dashed bg-light" on:click={openUploadModal}>
          <div class="card-body d-flex flex-column align-items-center justify-content-center text-center text-muted">
            <i class="fa fa-plus fa-2x mb-2"></i>
            <span class="fw-bold">Agregar PDF</span>
          </div>
        </div>
      </div>
      <!-- Componente de lista de PDFs -->
      <PDFList {pdfs} on:delete={deletePDF} on:reorder={updatePDFOrder} />
    </div>
  </div>
</div>

<!-- Modales -->
{#if showUploadModal}
  <UploadModal on:close={closeUploadModal} on:save={addPDFs} />
{/if}

{#if showGenerateModal}
  <GenerateDocModal {pdfs} on:close={closeGenerateModal} on:generate={generateDocument} />
{/if}