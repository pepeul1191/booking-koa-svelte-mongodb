<!-- RoomFormModal.svelte -->
<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { createRoom } from '../../../services/room_service.js'; // Ajusta la ruta
  import Alert from '../../widgets/Alert.svelte'; 
  
  // Props del componente
  export let size = 'lg';
  
  // Disparadores de eventos
  const dispatch = createEventDispatcher();
  
  // Datos del formulario
  export let formData = {
    name: '',
    description: '',
    capacity: '',
    availabilities: [],
    exceptions: []
  };

  // Estados para availabilities
  let newAvailability = {
    day: 0,
    open: 480, // 08:00
    close: 1080 // 18:00
  };

  let editingAvailability = null;

  // Estados para exceptions
  let newException = {
    date: '',
    open: 480,
    close: 1080
  };

  let editingException = null;

  // Opciones para días de la semana
  const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
  ];

  // Convertir minutos a formato HH:MM
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convertir tiempo HH:MM a minutos
  const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Manejar cambios en los inputs de tiempo
  const handleTimeChange = (event, field, object) => {
    const minutes = timeToMinutes(event.target.value);
    object[field] = minutes;
  };

  // --- FUNCIONES PARA AVAILABILITIES ---
  
  const addAvailability = () => {
    if (newAvailability.open >= newAvailability.close) {
      alertMessage.text = 'La hora de apertura debe ser anterior a la de cierre';
      alertMessage.status = 'danger';
      closeAlert();
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
      alertMessage.text = 'La hora de apertura debe ser anterior a la de cierre';
      alertMessage.status = 'danger';
      closeAlert();
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
      day: 0,
      open: 480,
      close: 1080
    };
    editingAvailability = null;
  };

  // --- FUNCIONES PARA EXCEPTIONS ---
  
  const addException = () => {
    if (!newException.date) {
      alertMessage.text = 'La fecha es requerida';
      alertMessage.status = 'danger';
      closeAlert();
      return;
    }
    
    if (newException.open >= newException.close) {
      alertMessage.text = 'La hora de apertura debe ser anterior a la de cierre';
      alertMessage.status = 'danger';
      closeAlert();
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
      alertMessage.text = 'La fecha es requerida';
      alertMessage.status = 'danger';
      closeAlert();
      return;
    }
    
    if (newException.open >= newException.close) {
      alertMessage.text = 'La hora de apertura debe ser anterior a la de cierre';
      alertMessage.status = 'danger';
      closeAlert();
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
      close: 1080
    };
    editingException = null;
  };

  // --- FUNCIONES UTILITARIAS ---
  
  const generateId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const random = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return timestamp + random;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const closeModal = () => {
    dispatch('close');
  };

  const closeAlert = () => {
    setTimeout(() => {
      alertMessage = { text: '', status: '' };
    }, 5000); 
  };

  const submitForm = async () => {
    // Validaciones básicas
    if (!formData.name.trim()) {
      alertMessage.text = 'El nombre de la sala es requerido';
      alertMessage.status = 'danger';
      closeAlert();
      return;
    }
    
    if (!formData.capacity || formData.capacity < 1) {
      alertMessage.text = 'La capacidad debe ser mayor a 0';
      alertMessage.status = 'danger';
      closeAlert();
      return;
    }
    
    // Aquí iría la llamada a la API para guardar los datos
    console.log('Datos a guardar:', formData);

    // Preparar los datos para enviar
    const roomData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      capacity: parseInt(formData.capacity),
      availabilities: formData.availabilities,
      exceptions: formData.exceptions,
      reservations: [] // Inicialmente vacío
    };

    try {
      // Llamar a la función que hace la petición POST
      const response = await createRoom(roomData); // Considera cambiar el nombre de esta función
      
      // Si todo sale bien, emitir el evento de éxito
      dispatch('success', { data: response.data });
      
    } catch (error) {
      // Manejar el error (ya se imprime en la consola en la función createRoom)
      alertMessage.text = 'Error al crear la sala. Por favor, intente nuevamente.';
      alertMessage.status = 'danger';
    }
  };

  // Cerrar modal con tecla Escape
  onMount(() => {
    console.log(formData);
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeModal();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  });

  let alertMessage = {
    text: '',
    status: ''
  };
</script>

<div class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0, 0, 0, 0.5)">
  <div class="modal-dialog modal-{size}" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fa {formData._id == null ? 'fa-plus-circle' : 'fa-pencil-square'}" style="margin-right: 10px;"></i>{formData._id == null ? 'Nueva Sala' : 'Editar Sala'} </h5>
        <button type="button" class="btn-close" on:click={closeModal} aria-label="Close"></button>
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
            placeholder="Descripción de la sala"
          ></textarea>
        </div>

        <!-- Disponibilidades (Availabilities) -->
        <div class="card mb-4">
          <div class="card-header">
            <h6 class="mb-0"><i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
 Disponibilidad Semanal</h6>
          </div>
          <div class="card-body">
            <!-- Formulario para agregar/editar disponibilidad -->
            <div class="row g-3 mb-3">
              <div class="col-md-3">
                <label class="form-label">Día</label>
                <select class="form-select" bind:value={newAvailability.day}>
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
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Hora Cierre</label>
                <input 
                  type="time" 
                  class="form-control"
                  value={minutesToTime(newAvailability.close)}
                  on:change={(e) => handleTimeChange(e, 'close', newAvailability)}
                >
              </div>
              <div class="col-md-3 d-flex align-items-end">
                {#if editingAvailability}
                  <button type="button" class="btn btn-warning btn-sm me-2" on:click={updateAvailability}>
                    Actualizar
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" on:click={cancelEditAvailability}>
                    Cancelar
                  </button>
                {:else}
                  <button type="button" class="btn btn-primary btn-sm" on:click={addAvailability}>
                    Agregar
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
                          >
                            Editar
                          </button>
                          <button 
                            type="button" 
                            class="btn btn-outline-danger btn-sm"
                            on:click={() => deleteAvailability(availability._id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <p class="text-muted">No hay disponibilidades configuradas</p>
            {/if}
          </div>
        </div>

        <!-- Excepciones -->
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
 Excepciones</h6>
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
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Hora Apertura</label>
                <input 
                  type="time" 
                  class="form-control"
                  value={minutesToTime(newException.open)}
                  on:change={(e) => handleTimeChange(e, 'open', newException)}
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Hora Cierre</label>
                <input 
                  type="time" 
                  class="form-control"
                  value={minutesToTime(newException.close)}
                  on:change={(e) => handleTimeChange(e, 'close', newException)}
                >
              </div>
              <div class="col-md-3 d-flex align-items-end">
                {#if editingException}
                  <button type="button" class="btn btn-warning btn-sm me-2" on:click={updateException}>
                    Actualizar
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" on:click={cancelEditException}>
                    Cancelar
                  </button>
                {:else}
                  <button type="button" class="btn btn-primary btn-sm" on:click={addException}>
                    Agregar
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
                          >
                            Editar
                          </button>
                          <button 
                            type="button" 
                            class="btn btn-outline-danger btn-sm"
                            on:click={() => deleteException(exception._id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <p class="text-muted">No hay excepciones configuradas</p>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={closeModal}>
          <i class="fa fa-times" aria-hidden="true"></i> Cancelar
        </button>
        <button type="button" class="btn btn-primary" on:click={submitForm}> 
          <i class="fa fa-check" aria-hidden="true"></i>Guardar Sala
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal {
    backdrop-filter: blur(2px);
    z-index: 1055;
  }
  
  .modal-dialog {
    margin: 1.75rem auto;
    max-width: 90%;
  }
  
  .card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }
  
  .table th {
    background-color: #f8f9fa;
  }
</style>