<!-- ReservationsModal.svelte -->
<svelte:options accessors={true} />
<script>
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
  import { Modal } from 'bootstrap';
  import Alert from '../widgets/Alert.svelte';
  
  // Props del componente
  export let size = 'lg';
  export let roomData = {
    _id: null,
    name: '',
    capacity: 0,
    availabilities: []
  };

  // Datos de ejemplo para reservaciones (reemplazar con API real)
  export let reservations = [
    {
      _id: '1',
      subject: 'Reunión de equipo',
      date: '2024-01-20T10:00:00',
      open: 540,  // 9:00 AM
      close: 600, // 10:00 AM
      organizer: {
        _id: '101',
        internal: true,
        code: 12345,
        role: 'Manager',
        enterprise: 'Empresa XYZ',
        name: 'Juan Pérez',
        email: 'juan@empresa.com',
        phone: '999-888-777'
      },
      participants: [
        {
          _id: '102',
          internal: true,
          code: 12346,
          role: 'Developer',
          enterprise: 'Empresa XYZ',
          name: 'María García',
          email: 'maria@empresa.com',
          phone: '999-888-666'
        }
      ]
    }
  ];

  // Formulario de reservación
  export let formData = {
    _id: null,
    subject: '',
    date: '',
    open: 540,
    close: 600,
    organizer: {
      internal: true,
      code: '',
      role: '',
      enterprise: '',
      name: '',
      email: '',
      phone: ''
    },
    participants: []
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

  // Estados
  let loading = false;
  let selectedReservation = null;
  
  // Estados para participantes
  let newParticipant = {
    internal: true,
    code: '',
    role: '',
    enterprise: '',
    name: '',
    email: '',
    phone: ''
  };

  let editingParticipant = null;
  let alertMessage = { text: '', status: '' };

  // Horarios disponibles (en minutos desde medianoche)
  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => i * 15); // Cada 15 minutos

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

  // Formatear fecha para display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const formatTimeRange = (open, close) => {
    return `${minutesToTime(open)} - ${minutesToTime(close)}`;
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

  // --- FUNCIONES PARA RESERVACIONES ---
  
  const selectReservation = (reservation) => {
    selectedReservation = reservation;
    formData = JSON.parse(JSON.stringify(reservation)); // Copia profunda
    
    // Formatear fechas para input
    if (formData.date) {
      const date = new Date(formData.date);
      formData.date = date.toISOString().split('T')[0];
    }
    
    formData.open = formData.open || 540;
    formData.close = formData.close || 600;
  };

  const newReservation = () => {
    selectedReservation = null;
    formData = {
      _id: null,
      subject: '',
      date: new Date().toISOString().split('T')[0],
      open: 540,
      close: 600,
      organizer: {
        internal: true,
        code: '',
        role: '',
        enterprise: '',
        name: '',
        email: '',
        phone: ''
      },
      participants: []
    };
  };

  const deleteReservation = (reservation) => {
    if (confirm('¿Está seguro de eliminar esta reservación?')) {
      const index = reservations.findIndex(r => r._id === reservation._id);
      if (index !== -1) {
        reservations.splice(index, 1);
        dispatch('reservationDeleted', reservation);
        showAlert('Reservación eliminada correctamente', 'success');
        
        if (selectedReservation && selectedReservation._id === reservation._id) {
          newReservation();
        }
      }
    }
  };

  // --- FUNCIONES PARA PARTICIPANTES ---
  
  const addParticipant = () => {
    if (!newParticipant.name.trim()) {
      showAlert('El nombre del participante es requerido');
      return;
    }
    
    const participant = {
      ...newParticipant,
      _id: Date.now().toString() // ID temporal
    };
    
    formData.participants.push(participant);
    resetParticipantForm();
  };

  const editParticipant = (participant) => {
    editingParticipant = participant;
    newParticipant = JSON.parse(JSON.stringify(participant));
  };

  const updateParticipant = () => {
    if (!newParticipant.name.trim()) {
      showAlert('El nombre del participante es requerido');
      return;
    }
    
    const index = formData.participants.findIndex(p => p._id === editingParticipant._id);
    if (index !== -1) {
      formData.participants[index] = {
        ...newParticipant,
        _id: editingParticipant._id
      };
    }
    
    resetParticipantForm();
    editingParticipant = null;
  };

  const removeParticipant = (participant) => {
    const index = formData.participants.findIndex(p => p._id === participant._id);
    if (index !== -1) {
      formData.participants.splice(index, 1);
    }
  };

  const resetParticipantForm = () => {
    newParticipant = {
      internal: true,
      code: '',
      role: '',
      enterprise: '',
      name: '',
      email: '',
      phone: ''
    };
  };

  // --- SUBMIT DEL FORMULARIO ---
  
  const submitForm = async () => {
    if (loading) return;
    
    // Validaciones
    if (!formData.subject.trim()) {
      showAlert('El asunto de la reservación es requerido');
      return;
    }
    
    if (!formData.date) {
      showAlert('La fecha es requerida');
      return;
    }
    
    if (formData.open >= formData.close) {
      showAlert('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }
    
    if (!formData.organizer.name.trim()) {
      showAlert('El nombre del organizador es requerido');
      return;
    }

    loading = true;
    
    try {
      // Preparar datos
      const reservationData = {
        ...formData,
        date: new Date(formData.date + 'T00:00:00').toISOString(),
        _id: formData._id || Date.now().toString() // ID temporal
      };

      let response;
      
      if (formData._id) {
        // Actualizar reservación existente
        const index = reservations.findIndex(r => r._id === formData._id);
        if (index !== -1) {
          reservations[index] = reservationData;
          response = { data: reservationData };
          showAlert('Reservación actualizada correctamente', 'success');
        }
      } else {
        // Crear nueva reservación
        reservations.push(reservationData);
        response = { data: reservationData };
        showAlert('Reservación creada correctamente', 'success');
      }
      
      // Disparar evento y actualizar lista
      setTimeout(() => {
        dispatch('success', { data: response.data });
        // Si es nueva, seleccionarla
        if (!formData._id) {
          selectReservation(reservationData);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error al guardar reservación:', error);
      showAlert(error.message || 'Error al guardar la reservación');
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
    // Inicializar modal
    modalInstance = new Modal(modal, {
      backdrop: 'static',
      keyboard: false
    });
  
    // Escuchar eventos del modal
    modal.addEventListener('hidden.bs.modal', handleHidden);
    
    // Inicializar con nueva reservación
    newReservation();
    
    return () => {
      if (modal) {
        modal.removeEventListener('hidden.bs.modal', handleHidden);
      }
    };
  });
</script>

<div class="modal fade" tabindex="-1" role="dialog" bind:this={modal}>
  <div class="modal-dialog modal-{size} modal-dialog-scrollable" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fa fa-calendar" style="margin-right: 10px;"></i>
          Reservaciones - {roomData.name}
        </h5>
        <button type="button" class="btn-close" on:click={hide} aria-label="Close"></button>
      </div>
      
      <div class="modal-body p-0">
        {#if alertMessage.text}
          <div class="p-3">
            <Alert status={alertMessage.status} text={alertMessage.text} />
          </div>
        {/if}
        
        <div class="container-fluid p-0">
          <div class="row g-0" style="min-height: 500px;">
            <!-- Columna izquierda: Lista de reservaciones -->
            <div class="col-md-4 border-end">
              <div class="p-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="mb-0">Reservaciones ({reservations.length})</h6>
                  <button type="button" class="btn btn-sm btn-primary" on:click={newReservation}>
                    <i class="fa fa-plus"></i> Nueva
                  </button>
                </div>
                
                <div class="list-group" style="max-height: 450px; overflow-y: auto;">
                  {#each reservations as reservation (reservation._id)}
                    <a href="#" 
                       class="list-group-item list-group-item-action {selectedReservation?._id === reservation._id ? 'active' : ''}"
                       on:click|preventDefault={() => selectReservation(reservation)}>
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">{reservation.subject}</h6>
                        <small>{formatDate(reservation.date)}</small>
                      </div>
                      <p class="mb-1 small">
                        <i class="fa fa-clock-o"></i> {formatTimeRange(reservation.open, reservation.close)}
                      </p>
                      <small>
                        <i class="fa fa-user"></i> {reservation.organizer.name}
                        <span class="badge bg-secondary ms-2">
                          {reservation.participants.length + 1} participantes
                        </span>
                      </small>
                      
                      <div class="mt-2">
                        <button type="button" 
                                class="btn btn-sm btn-outline-secondary {selectedReservation?._id === reservation._id ? 'btn-light' : ''}"
                                on:click|stopPropagation={() => selectReservation(reservation)}>
                          <i class="fa fa-edit"></i>
                        </button>
                        <button type="button" 
                                class="btn btn-sm btn-outline-danger ms-1 {selectedReservation?._id === reservation._id ? 'btn-light' : ''}"
                                on:click|stopPropagation={() => deleteReservation(reservation)}>
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </a>
                  {:else}
                    <div class="text-center py-4 text-muted">
                      <i class="fa fa-calendar-times fa-2x mb-2"></i>
                      <p>No hay reservaciones</p>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
            
            <!-- Columna derecha: Formulario de mantenimiento -->
            <div class="col-md-8">
              <div class="p-3">
                <h5 class="mb-4">
                  {#if formData._id}
                    <i class="fa fa-edit text-primary"></i> Editar Reservación
                  {:else}
                    <i class="fa fa-plus-circle text-success"></i> Nueva Reservación
                  {/if}
                </h5>
                
                <form on:submit|preventDefault={submitForm}>
                  <!-- Información básica -->
                  <div class="row mb-4">
                    <div class="col-md-8">
                      <label for="subject" class="form-label">Asunto *</label>
                      <input type="text" 
                             class="form-control" 
                             id="subject" 
                             bind:value={formData.subject}
                             required>
                    </div>
                    <div class="col-md-4">
                      <label for="date" class="form-label">Fecha *</label>
                      <input type="date" 
                             class="form-control" 
                             id="date" 
                             bind:value={formData.date}
                             required>
                    </div>
                  </div>
                  
                  <!-- Horario -->
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <label for="open" class="form-label">Hora de inicio</label>
                      <select class="form-control" id="open" bind:value={formData.open}>
                        {#each timeSlots as minutes}
                          {#if minutes < 24 * 60}
                            <option value={minutes}>{minutesToTime(minutes)}</option>
                          {/if}
                        {/each}
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label for="close" class="form-label">Hora de fin</label>
                      <select class="form-control" id="close" bind:value={formData.close}>
                        {#each timeSlots as minutes}
                          {#if minutes > formData.open && minutes < 24 * 60}
                            <option value={minutes}>{minutesToTime(minutes)}</option>
                          {/if}
                        {/each}
                      </select>
                    </div>
                  </div>
                  
                  <!-- Organizador -->
                  <div class="card mb-4">
                    <div class="card-header">
                      <h6 class="mb-0">Organizador *</h6>
                    </div>
                    <div class="card-body">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Nombre *</label>
                          <input type="text" 
                                 class="form-control" 
                                 bind:value={formData.organizer.name}
                                 required>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Email</label>
                          <input type="email" 
                                 class="form-control" 
                                 bind:value={formData.organizer.email}>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Teléfono</label>
                          <input type="tel" 
                                 class="form-control" 
                                 bind:value={formData.organizer.phone}>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Empresa</label>
                          <input type="text" 
                                 class="form-control" 
                                 bind:value={formData.organizer.enterprise}>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Participantes -->
                  <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <h6 class="mb-0">Participantes ({formData.participants.length})</h6>
                      <button type="button" 
                              class="btn btn-sm btn-outline-primary"
                              on:click={resetParticipantForm}>
                        <i class="fa fa-plus"></i> Agregar
                      </button>
                    </div>
                    
                    <div class="card-body">
                      <!-- Formulario de participante -->
                      {#if editingParticipant === null}
                        <div class="row g-3 mb-3">
                          <div class="col-md-12">
                            <label class="form-label">Nombre *</label>
                            <input type="text" 
                                   class="form-control" 
                                   bind:value={newParticipant.name}
                                   placeholder="Nombre completo">
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" 
                                   class="form-control" 
                                   bind:value={newParticipant.email}>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Teléfono</label>
                            <input type="tel" 
                                   class="form-control" 
                                   bind:value={newParticipant.phone}>
                          </div>
                          <div class="col-md-12">
                            <button type="button" 
                                    class="btn btn-primary"
                                    on:click={addParticipant}>
                              <i class="fa fa-user-plus"></i> Agregar Participante
                            </button>
                          </div>
                        </div>
                      {:else}
                        <div class="row g-3 mb-3">
                          <div class="col-md-12">
                            <label class="form-label">Nombre *</label>
                            <input type="text" 
                                   class="form-control" 
                                   bind:value={newParticipant.name}>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" 
                                   class="form-control" 
                                   bind:value={newParticipant.email}>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Teléfono</label>
                            <input type="tel" 
                                   class="form-control" 
                                   bind:value={newParticipant.phone}>
                          </div>
                          <div class="col-md-12">
                            <button type="button" 
                                    class="btn btn-primary me-2"
                                    on:click={updateParticipant}>
                              <i class="fa fa-save"></i> Actualizar
                            </button>
                            <button type="button" 
                                    class="btn btn-secondary"
                                    on:click={() => { editingParticipant = null; resetParticipantForm(); }}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      {/if}
                      
                      <!-- Lista de participantes -->
                      {#if formData.participants.length > 0}
                        <div class="list-group">
                          {#each formData.participants as participant (participant._id)}
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{participant.name}</strong>
                                {#if participant.email}
                                  <div class="small text-muted">
                                    <i class="fa fa-envelope"></i> {participant.email}
                                  </div>
                                {/if}
                              </div>
                              <div>
                                <button type="button" 
                                        class="btn btn-sm btn-outline-secondary me-1"
                                        on:click={() => editParticipant(participant)}>
                                  <i class="fa fa-edit"></i>
                                </button>
                                <button type="button" 
                                        class="btn btn-sm btn-outline-danger"
                                        on:click={() => removeParticipant(participant)}>
                                  <i class="fa fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          {/each}
                        </div>
                      {:else}
                        <p class="text-muted text-center py-3">
                          No hay participantes agregados
                        </p>
                      {/if}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={hide} disabled={loading}>
          <i class="fa fa-times"></i> Cerrar
        </button>
        <button type="button" class="btn btn-primary" on:click={handleSubmit} disabled={loading}>
          {#if loading}
            <i class="fa fa-spinner fa-spin"></i> Guardando...
          {:else if formData._id}
            <i class="fa fa-save"></i> Actualizar Reservación
          {:else}
            <i class="fa fa-check"></i> Crear Reservación
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
    overflow-y: hidden;
  }
  
  .list-group-item.active {
    background-color: #0d6efd;
    border-color: #0d6efd;
  }
  
  .list-group-item.active .btn-outline-secondary,
  .list-group-item.active .btn-outline-danger {
    border-color: white;
    color: white;
  }
  
  .list-group-item.active .btn-outline-secondary:hover,
  .list-group-item.active .btn-outline-danger:hover {
    background-color: rgba(255,255,255,0.2);
  }
  
  .card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .border-end {
    border-right: 1px solid #dee2e6;
  }
</style>