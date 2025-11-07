<script>
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
  import { createRoom, editRoom } from '../../../services/room_service.js';
  import Alert from '../../widgets/Alert.svelte'; 
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
    console.log('SHOW');
    if (modalInstance) {
      modalInstance.show();
    }
  };

  export const hide = () => {
    if (modalInstance) {
      console.log('HIDE');
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
  
  const addAvailability = () => {
    // Validar que no exista ya para el mismo día
    const existing = formData.availabilities.find(
      avail => avail.day === newAvailability.day && 
      (!editingAvailability || avail._id !== editingAvailability._id)
    );
    
    if (existing) {
      showAlert('Ya existe una disponibilidad para este día');
      return;
    }
    
    if (newAvailability.open >= newAvailability.close) {
      showAlert('La hora de apertura debe ser anterior a la de cierre');
      return;
    }
    
    const availability = {
      _id: generateId(),
      ...newAvailability
    };
    
    formData.availabilities = [...formData.availabilities, availability];
    resetAvailabilityForm();
  };

  const editAvailability = (availability) => {
    editingAvailability = availability;
    newAvailability = { ...availability };
  };

  const updateAvailability = () => {
    if (newAvailability.open >= newAvailability.close) {
      showAlert('La hora de apertura debe ser anterior a la de cierre');
      return;
    }
    
    formData.availabilities = formData.availabilities.map(avail =>
      avail._id === editingAvailability._id ? { ...newAvailability } : avail
    );
    resetAvailabilityForm();
  };

  const deleteAvailability = (id) => {
    formData.availabilities = formData.availabilities.filter(avail => avail._id !== id);
  };

  const cancelEditAvailability = () => {
    resetAvailabilityForm();
  };

  const resetAvailabilityForm = () => {
    newAvailability = {
      day: 1,
      open: 480,
      close: 1020
    };
    editingAvailability = null;
  };

  // --- FUNCIONES PARA EXCEPTIONS ---
  
  const addException = () => {
    if (!newException.date) {
      showAlert('La fecha es requerida');
      return;
    }
    
    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(newException.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      showAlert('No se pueden agregar excepciones para fechas pasadas');
      return;
    }
    
    // Validar que no exista ya para la misma fecha
    const existing = formData.exceptions.find(
      exc => exc.date === newException.date &&
      (!editingException || exc._id !== editingException._id)
    );
    
    if (existing) {
      showAlert('Ya existe una excepción para esta fecha');
      return;
    }
    
    if (newException.open >= newException.close) {
      showAlert('La hora de apertura debe ser anterior a la de cierre');
      return;
    }
    
    const exception = {
      _id: generateId(),
      ...newException
    };
    
    formData.exceptions = [...formData.exceptions, exception];
    resetExceptionForm();
  };

  const editException = (exception) => {
    editingException = exception;
    newException = { 
      ...exception,
      date: formatDateForInput(exception.date)
    };
  };

  const updateException = () => {
    if (!newException.date) {
      showAlert('La fecha es requerida');
      return;
    }
    
    if (newException.open >= newException.close) {
      showAlert('La hora de apertura debe ser anterior a la de cierre');
      return;
    }
    
    formData.exceptions = formData.exceptions.map(exc =>
      exc._id === editingException._id ? { ...newException } : exc
    );
    resetExceptionForm();
  };

  const deleteException = (id) => {
    formData.exceptions = formData.exceptions.filter(exc => exc._id !== id);
  };

  const cancelEditException = () => {
    resetExceptionForm();
  };

  const resetExceptionForm = () => {
    newException = {
      date: '',
      open: 480,
      close: 1020
    };
    editingException = null;
  };

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

        <!-- Información Básica -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label for="roomName" class="form-label">Nombre de la sala *</label>
            <input 
              type="text" 
              class="form-control" 
              id="roomName" 
              bind:value={formData.name}
              placeholder="Ingrese el nombre de la sala"
              required
              disabled={loading}
            >
          </div>
          <div class="col-md-6">
            <label for="roomCapacity" class="form-label">Capacidad *</label>
            <input 
              type="number" 
              class="form-control" 
              id="roomCapacity" 
              bind:value={formData.capacity}
              placeholder="Número de personas"
              min="1"
              required
              disabled={loading}
            >
          </div>
        </div>
        
        <div class="mb-4">
          <label for="roomDescription" class="form-label">Descripción</label>
          <textarea 
            class="form-control" 
            id="roomDescription" 
            rows="3" 
            bind:value={formData.description}
            placeholder="Descripción de la sala (opcional)"
            disabled={loading}
          ></textarea>
        </div>

        <!-- Disponibilidades (Availabilities) -->
        <div class="card mb-4">
          <div class="card-header bg-light">
            <h6 class="mb-0">
              <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
              Disponibilidad Semanal *
            </h6>
            <small class="text-muted">Define los horarios de disponibilidad para cada día de la semana</small>
          </div>
          <div class="card-body">
            <!-- Formulario para agregar/editar disponibilidad -->
            <div class="row g-3 mb-3">
              <div class="col-md-3">
                <label class="form-label">Día</label>
                <select class="form-select" bind:value={newAvailability.day} disabled={loading}>
                  {#each daysOfWeek as day}
                    <option value={day.value}>{day.label}</option>
                  {/each}
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Hora Apertura</label>
                <input 
                  type="time" 
                  class="form-control"
                  value={minutesToTime(newAvailability.open)}
                  on:change={(e) => handleTimeChange(e, 'open', newAvailability)}
                  disabled={loading}
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Hora Cierre</label>
                <input 
                  type="time" 
                  class="form-control"
                  value={minutesToTime(newAvailability.close)}
                  on:change={(e) => handleTimeChange(e, 'close', newAvailability)}
                  disabled={loading}
                >
              </div>
              <div class="col-md-3 d-flex align-items-end">
                {#if editingAvailability}
                  <button type="button" class="btn btn-warning btn-sm me-2" on:click={updateAvailability} disabled={loading}>
                    <i class="fa fa-check"></i> Actualizar
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" on:click={cancelEditAvailability} disabled={loading}>
                    <i class="fa fa-times"></i> Cancelar
                  </button>
                {:else}
                  <button type="button" class="btn btn-primary btn-sm" on:click={addAvailability} disabled={loading}>
                    <i class="fa fa-plus"></i> Agregar
                  </button>
                {/if}
              </div>
            </div>

            <!-- Tabla de disponibilidades -->
            {#if formData.availabilities.length > 0}
              <div class="table-responsive">
                <table class="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Apertura</th>
                      <th>Cierre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each formData.availabilities as availability}
                      <tr>
                        <td>{daysOfWeek.find(d => d.value === availability.day)?.label}</td>
                        <td>{minutesToTime(availability.open)}</td>
                        <td>{minutesToTime(availability.close)}</td>
                        <td>
                          <button 
                            type="button" 
                            class="btn btn-outline-primary btn-sm me-1"
                            on:click={() => editAvailability(availability)}
                            disabled={loading}
                          >
                            <i class="fa fa-edit"></i>
                          </button>
                          <button 
                            type="button" 
                            class="btn btn-outline-danger btn-sm"
                            on:click={() => deleteAvailability(availability._id)}
                            disabled={loading}
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <div class="alert alert-warning mb-0">
                <i class="fa fa-exclamation-triangle"></i>
                No hay disponibilidades configuradas. Debe agregar al menos una.
              </div>
            {/if}
          </div>
        </div>

        <!-- Excepciones -->
        <div class="card">
          <div class="card-header bg-light">
            <h6 class="mb-0">
              <i class="fa fa-calendar-times-o" aria-hidden="true"></i>
              Excepciones
            </h6>
            <small class="text-muted">Define horarios especiales para fechas específicas</small>
          </div>
          <div class="card-body">
            <!-- Formulario para agregar/editar excepción -->
            <div class="row g-3 mb-3">
              <div class="col-md-3">
                <label class="form-label">Fecha</label>
                <input 
                  type="date" 
                  class="form-control"
                  bind:value={newException.date}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Hora Apertura</label>
                <input 
                  type="time" 
                  class="form-control"
                  value={minutesToTime(newException.open)}
                  on:change={(e) => handleTimeChange(e, 'open', newException)}
                  disabled={loading}
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Hora Cierre</label>
                <input 
                  type="time" 
                  class="form-control"
                  value={minutesToTime(newException.close)}
                  on:change={(e) => handleTimeChange(e, 'close', newException)}
                  disabled={loading}
                >
              </div>
              <div class="col-md-3 d-flex align-items-end">
                {#if editingException}
                  <button type="button" class="btn btn-warning btn-sm me-2" on:click={updateException} disabled={loading}>
                    <i class="fa fa-check"></i> Actualizar
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" on:click={cancelEditException} disabled={loading}>
                    <i class="fa fa-times"></i> Cancelar
                  </button>
                {:else}
                  <button type="button" class="btn btn-primary btn-sm" on:click={addException} disabled={loading}>
                    <i class="fa fa-plus"></i> Agregar
                  </button>
                {/if}
              </div>
            </div>

            <!-- Tabla de excepciones -->
            {#if formData.exceptions.length > 0}
              <div class="table-responsive">
                <table class="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Apertura</th>
                      <th>Cierre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each formData.exceptions as exception}
                      <tr>
                        <td>{formatDateForDisplay(exception.date)}</td>
                        <td>{minutesToTime(exception.open)}</td>
                        <td>{minutesToTime(exception.close)}</td>
                        <td>
                          <button 
                            type="button" 
                            class="btn btn-outline-primary btn-sm me-1"
                            on:click={() => editException(exception)}
                            disabled={loading}
                          >
                            <i class="fa fa-edit"></i>
                          </button>
                          <button 
                            type="button" 
                            class="btn btn-outline-danger btn-sm"
                            on:click={() => deleteException(exception._id)}
                            disabled={loading}
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <p class="text-muted mb-0">No hay excepciones configuradas</p>
            {/if}
          </div>
        </div>
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
    font-size: 0.75rem;
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