<script>
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
  import { createRoom, editRoom } from '../../services/room_service.js';
  import Alert from '../widgets/Alert.svelte'; 
  import { Modal } from 'bootstrap';
  
  // Props del componente
  export let size = 'lg';
  export let formData = {
    _id: null,
    name: '',
    description: '',
    capacity: '',
    availabilities: [],
    exceptions: []
  };

  let modal;
  let modalInstance;
  
  // Disparadores de eventos
  const dispatch = createEventDispatcher();
  
  // Funciones públicas para mostrar/ocultar
  export const show = () => {
    if (modalInstance) {
      modalInstance.show();
    }
  };

  export const hide = () => {
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  // Estados para el formulario
  let loading = false;
  
  // Estados para availabilities
  let newAvailability = {
    day: 1, // Lunes por defecto
    open: 480, // 08:00
    close: 1020 // 17:00
  };

  let editingAvailability = null;

  // Estados para exceptions
  let newException = {
    date: '',
    open: 480,
    close: 1020
  };

  let editingException = null;

  let alertMessage = {
    text: '',
    status: ''
  };

  // Opciones para días de la semana
  const daysOfWeek = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' }
  ];

  // --- FUNCIONES UTILITARIAS ---
  
  // Convertir minutos a formato HH:MM
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convertir tiempo HH:MM a minutos
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Manejar cambios en los inputs de tiempo
  const handleTimeChange = (event, field, object) => {
    const minutes = timeToMinutes(event.target.value);
    object[field] = minutes;
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const closeAlert = () => {
    setTimeout(() => {
      alertMessage = { text: '', status: '' };
    }, 5000); 
  };

  const showAlert = (text, status = 'danger') => {
    alertMessage = { text, status };
    closeAlert();
  };

  // --- FUNCIONES PARA AVAILABILITIES ---
  

  // --- FUNCIONES PARA EXCEPTIONS ---


  // --- SUBMIT DEL FORMULARIO ---
  
  const submitForm = async () => {
    if (loading) return;
    
    // Validaciones básicas
    if (!formData.name.trim()) {
      showAlert('El nombre de la sala es requerido');
      return;
    }
    
    if (!formData.capacity || formData.capacity < 1) {
      showAlert('La capacidad debe ser mayor a 0');
      return;
    }
    
    if (formData.availabilities.length === 0) {
      showAlert('Debe configurar al menos una disponibilidad semanal');
      return;
    }

    loading = true;
    
    try {
      // Preparar los datos para enviar
      const roomData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        capacity: parseInt(formData.capacity),
        availabilities: formData.availabilities,
        exceptions: formData.exceptions
      };

      let response;

      if (formData._id) {
        response = await editRoom(roomData, formData._id);
        showAlert('Sala actualizada correctamente', 'success');
      } else {
        response = await createRoom(roomData);
        showAlert('Sala creada correctamente', 'success');
      }
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        dispatch('success', { data: response.data });
        hide();
      }, 1000);
      
    } catch (error) {
      console.error('Error al guardar sala:', error);
      showAlert(error.message || 'Error al guardar la sala. Por favor, intente nuevamente.');
    } finally {
      loading = false;
    }
  };

  // --- MANEJO DE EVENTOS DEL MODAL ---
  
  const handleHidden = () => {
    dispatch('close');
  };

  const handleSubmit = () => {
    submitForm();
  };

  onMount(() => {
    // Inicializar el modal de Bootstrap
  
    modalInstance = new Modal(modal, {
      backdrop: 'static',
      keyboard: false
    });
  
    // Escuchar eventos del modal
    modal.addEventListener('hidden.bs.modal', handleHidden);
  
    
    return () => {
      if (modal) {
        modal.removeEventListener('hidden.bs.modal', handleHidden);
      }
    };
  });
</script>

<!-- Modal Bootstrap estándar -->
<div class="modal fade" tabindex="-1" role="dialog" bind:this={modal}>
  <div class="modal-dialog modal-{size} modal-dialog-scrollable" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fa {formData._id ? 'fa-pencil-square' : 'fa-plus-circle'}" style="margin-right: 10px;"></i>
          {formData._id ? 'Editar Sala' : 'Nueva Sala'}
        </h5>
        <button type="button" class="btn-close" on:click={hide} aria-label="Close"></button>
      </div>
      
      <div class="modal-body">
        {#if alertMessage.text}
          <Alert status={alertMessage.status} text={alertMessage.text} />
        {/if}
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={hide} disabled={loading}>
          <i class="fa fa-times" aria-hidden="true"></i> Cancelar
        </button>
        <button type="button" class="btn btn-primary" on:click={handleSubmit} disabled={loading}> 
          {#if loading}
            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Guardando...
          {:else}
            <i class="fa fa-check" aria-hidden="true"></i> 
            {formData._id ? 'Actualizar Sala' : 'Guardar Sala'}
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-dialog {
    margin: 1.75rem auto;
    max-width: 90%;
    max-height: 85vh;
  }
  
  .modal-content {
    max-height: 85vh;
  }
  
  .modal-body {
    overflow-y: auto;
    max-height: calc(85vh - 120px);
  }
  
  .card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }
  
  .table th {
    background-color: #f8f9fa;
    font-size: 0.875rem;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
  }
  
  /* Mejoras visuales */
  .form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .card-header h6 {
    color: #495057;
  }
</style>