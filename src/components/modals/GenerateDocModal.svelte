<!-- GenerateDocModal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { getDocument } from 'pdfjs-dist/legacy/build/pdf'; // Importar pdfjs-dist

  const dispatch = createEventDispatcher();

  let studentName = '';
  let studentCode = '';
  let stakeholder = '';
  let selectedDate = '';
  let totalPages = 0;
  let isLoading = false;

  export let pdfs = [];

  // Establecer fecha actual por defecto al cargar el componente
  $: if (!selectedDate) {
    selectedDate = new Date().toISOString().split('T')[0];
  }

  async function generate() {
    if (!studentName || !studentCode || !stakeholder || !selectedDate) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Verificar que tenemos los archivos binarios
    const hasFiles = pdfs.every(pdf => pdf.file instanceof File);
    if (!hasFiles) {
      alert('Error: No se encontraron los archivos PDF originales. Por favor, vuelve a subir los archivos.');
      return;
    }

    isLoading = true;
    totalPages = 0; // Resetear contador

    try {
      // Contar páginas de cada PDF
      const filesData = [];
      
      for (const pdf of pdfs) {
        try {
          const pageCount = await countPDFPages(pdf.file);
          totalPages += pageCount;

          filesData.push({
            name: pdf.fileName,
            size: pdf.file.size,
            sizeFormatted: pdf.fileSize,
            lastModified: new Date(pdf.file.lastModified).toISOString(),
            pageCount: pageCount,
            type: 'application/pdf'
          });
        } catch (error) {
          console.error('Error procesando archivo:', pdf.fileName, error);
          // Si hay error, contar como 0 páginas pero seguir con el proceso
          filesData.push({
            name: pdf.fileName,
            size: pdf.file.size,
            sizeFormatted: pdf.fileSize,
            lastModified: new Date(pdf.file.lastModified).toISOString(),
            pageCount: 0,
            type: 'application/pdf'
          });
        }
      }

      await sendReportData(filesData, totalPages);
      
    } catch (error) {
      console.error('Error en el proceso:', error);
      alert('Error al procesar los archivos PDF.');
    } finally {
      isLoading = false;
    }
  }

  async function sendReportData(filesData, totalPages) {
    const formData = new FormData();

    formData.append('student', studentName);
    formData.append('code', studentCode);
    formData.append('pages', totalPages);
    formData.append('stakeholder', stakeholder);
    formData.append('date', selectedDate);
    formData.append('filesData', JSON.stringify(filesData));

    // Adjuntar los archivos PDF
    for (let i = 0; i < pdfs.length; i++) {
      formData.append('pdfFiles', pdfs[i].file);
    }

    try {
      const response = await fetch('/api/v1/reports', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = `reporte_${studentName}_${Date.now()}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(pdfUrl);

        alert(`¡Éxito! Reporte generado y descargado correctamente. Total de hojas: ${totalPages}`);
        
        dispatch('success', {
          studentName,
          studentCode,
          stakeholder,
          date: selectedDate,
          totalPages
        });
      } else {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        alert('Error al generar el reporte: ' + errorText);
      }
    } catch (error) {
      console.error('Error enviando el reporte:', error);
      alert('Error al enviar el reporte.');
    }
  }

  async function countPDFPages(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Usar pdfjs-dist que ya está importado
      const pdf = await getDocument({ data: uint8Array }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error('Error contando páginas del PDF:', error);
      return 0; // Si hay error, retornar 0 páginas
    }
  }
</script>

<div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Generar Documento</h5>
        <button type="button" class="btn-close" on:click={() => dispatch('close')}>×</button>
      </div>
      <div class="modal-body">
        <form id="generateDocForm">
          <!-- Interesado primero -->
          <div class="mb-3">
            <label for="stakeholder" class="form-label">Interesado</label>
            <input type="text" class="form-control" id="stakeholder" bind:value={stakeholder} required>
          </div>
          
          <!-- Alumno -->
          <div class="mb-3">
            <label for="studentName" class="form-label">Nombre del Alumno</label>
            <input type="text" class="form-control" id="studentName" bind:value={studentName} required>
          </div>
          
          <!-- Fila con Código del Alumno y Fecha -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="studentCode" class="form-label">Código del Alumno</label>
              <input type="text" class="form-control" id="studentCode" bind:value={studentCode} required>
            </div>
            <div class="col-md-6">
              <label for="date" class="form-label">Fecha</label>
              <input type="date" class="form-control" id="date" bind:value={selectedDate} required>
            </div>
          </div>

          <!-- Mostrar total de páginas calculado -->
          <div class="mb-3">
            <label class="form-label">Total de Hojas Calculadas</label>
            <input type="text" class="form-control" value={isLoading ? 'Calculando...' : totalPages} disabled>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={() => dispatch('close')} disabled={isLoading}>
          {isLoading ? 'Cancelar (Procesando...)' : 'Cancelar'}
        </button>
        <button type="button" class="btn btn-primary" on:click={generate} disabled={isLoading}>
          {isLoading ? 'Procesando PDFs...' : 'Generar'}
        </button>
      </div>
    </div>
  </div>
</div>