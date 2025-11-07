<!-- MonthlyCalendar.svelte -->
<script>
  export let roomData = {
    capacity: 0,
    availabilities: [],
    exceptions: [],
    reservationIds: []
  };

  export let reservations = [];

  let currentDate = new Date();
  let selectedDate = null;
  let selectedReservation = null;

  $: selectedDateAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : null;

  // Días de la semana
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Función para convertir minutos a formato de tiempo
  const minutesToTime = (minutes) => {
    if (minutes === 0) return '00:00';
    if (minutes === 1440) return '24:00';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Función para obtener el día de la semana (0-6)
  const getDayOfWeek = (date) => {
    return date.getDay();
  };

  // Función para obtener disponibilidad para un día específico
  const getAvailabilityForDate = (date) => {
    const dayOfWeek = getDayOfWeek(date);
    
    // Primero verificar si hay una excepción para esta fecha
    const dateString = date.toISOString().split('T')[0];
    const exception = roomData.exceptions.find(exc => {
      const excDate = new Date(exc.date).toISOString().split('T')[0];
      return excDate === dateString;
    });

    if (exception) {
      return {
        type: 'exception',
        open: exception.open,
        close: exception.close,
        reason: exception.reason || 'Excepción'
      };
    }

    // Si no hay excepción, buscar disponibilidad regular
    const availability = roomData.availabilities.find(avail => avail.day === dayOfWeek);
    
    if (availability) {
      return {
        type: 'available',
        open: availability.open,
        close: availability.close
      };
    }

    return {
      type: 'unavailable',
      open: 0,
      close: 0
    };
  };

  // Función para obtener reservaciones para una fecha específica
  const getReservationsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
      return reservationDate === dateString;
    });
  };

  // Función para generar los días del mes
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Agregar días del mes anterior para completar la primera semana
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        availability: getAvailabilityForDate(date),
        reservations: getReservationsForDate(date)
      });
    }
    
    // Agregar días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        availability: getAvailabilityForDate(date),
        reservations: getReservationsForDate(date)
      });
    }
    
    // Agregar días del próximo mes para completar la última semana
    const totalCells = 42; // 6 semanas * 7 días
    const nextMonthDays = totalCells - days.length;
    
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        availability: getAvailabilityForDate(date),
        reservations: getReservationsForDate(date)
      });
    }
    
    return days;
  };

  // Navegación del calendario
  const previousMonth = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    getDaysInMonth();
  };

  const nextMonth = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    getDaysInMonth();
  };

  const goToToday = () => {
    currentDate = new Date();
  };

  // Seleccionar fecha
  const selectDate = (day) => {
    if (day.isCurrentMonth) {
      selectedDate = day.date;
      selectedReservation = null;
    }
  };

  // Seleccionar reservación
  const selectReservation = (reservation, event) => {
    event.stopPropagation();
    selectedReservation = reservation;
  };

  // Obtener clase CSS para el estado de disponibilidad
  const getAvailabilityClass = (availability) => {
    switch (availability.type) {
      case 'available':
        return 'available';
      case 'exception':
        return availability.open === 0 && availability.close === 0 ? 'closed' : 'exception';
      case 'unavailable':
        return 'unavailable';
      default:
        return '';
    }
  };

  // Obtener texto para el tooltip de disponibilidad
  const getAvailabilityTooltip = (availability) => {
    switch (availability.type) {
      case 'available':
        return `Disponible: ${minutesToTime(availability.open)} - ${minutesToTime(availability.close)}`;
      case 'exception':
        if (availability.open === 0 && availability.close === 0) {
          return `Cerrado: ${availability.reason}`;
        }
        return `Horario especial: ${minutesToTime(availability.open)} - ${minutesToTime(availability.close)}`;
      case 'unavailable':
        return 'No disponible';
      default:
        return '';
    }
  };

  $: days = getDaysInMonth();
  $: currentMonthText = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  $: today = new Date().toDateString();
</script>

<div class="calendar-container">
  <!-- Controles del calendario -->
  <div class="calendar-header">
    <div class="calendar-controls">
      <button class="btn btn-outline-secondary btn-sm" on:click={previousMonth}>
        <i class="fa fa-chevron-left"></i>
      </button>
      <h3 class="calendar-title">{currentMonthText}</h3>
      <button class="btn btn-outline-secondary btn-sm" on:click={nextMonth}>
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>
    <button class="btn btn-primary btn-sm" on:click={goToToday}>
      Hoy
    </button>
  </div>

  <!-- Calendario -->
  <div class="calendar">
    <!-- Días de la semana -->
    <div class="calendar-weekdays">
      {#each weekDays as day}
        <div class="calendar-weekday">{day}</div>
      {/each}
    </div>

    <!-- Días del mes -->
    <div class="calendar-days">
      {#each days as day, index}
        <div 
          class="calendar-day {day.isCurrentMonth ? 'current-month' : 'other-month'} {getAvailabilityClass(day.availability)} {day.date.toDateString() === today ? 'today' : ''} {selectedDate && day.date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}"
          on:click={() => selectDate(day)}
          title={getAvailabilityTooltip(day.availability)}
        >
          <div class="day-number">{day.date.getDate()}</div>
          
          <!-- Indicadores de disponibilidad -->
          {#if day.availability.type === 'exception' && day.availability.open === 0 && day.availability.close === 0}
            <div class="availability-indicator closed">
              <i class="fa fa-ban"></i>
            </div>
          {:else if day.availability.type === 'available' || (day.availability.type === 'exception' && day.availability.open > 0)}
            <div class="availability-indicator available">
              <i class="fa fa-check"></i>
            </div>
          {:else}
            <div class="availability-indicator unavailable">
              <i class="fa fa-times"></i>
            </div>
          {/if}

          <!-- Reservaciones -->
          <div class="reservations">
            {#each day.reservations as reservation, i}
              {#if i < 2} <!-- Mostrar máximo 2 reservaciones por día -->
                <div 
                  class="reservation-badge {reservation.status} {selectedReservation && selectedReservation._id === reservation._id ? 'selected' : ''}"
                  on:click|stopPropagation={(e) => selectReservation(reservation, e)}
                  title="{reservation.subject} - {minutesToTime(reservation.startTime)} a {minutesToTime(reservation.endTime)}"
                >
                  {reservation.subject.substring(0, 10)}{reservation.subject.length > 10 ? '...' : ''}
                </div>
              {/if}
            {/each}
            {#if day.reservations.length > 2}
              <div class="more-reservations">+{day.reservations.length - 2} más</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Panel de detalles -->
  <div class="details-panel">
    {#if selectedReservation}
      <div class="reservation-details">
        <h4>Detalles de Reservación</h4>
        <div class="detail-item">
          <strong>Asunto:</strong> {selectedReservation.subject}
        </div>
        <div class="detail-item">
          <strong>Fecha:</strong> {new Date(selectedReservation.date).toLocaleDateString('es-ES')}
        </div>
        <div class="detail-item">
          <strong>Horario:</strong> {minutesToTime(selectedReservation.startTime)} - {minutesToTime(selectedReservation.endTime)}
        </div>
        <div class="detail-item">
          <strong>Estado:</strong> 
          <span class="status-badge {selectedReservation.status}">
            {selectedReservation.status === 'pending' ? 'Pendiente' : 
             selectedReservation.status === 'confirmed' ? 'Confirmada' : 
             selectedReservation.status === 'cancelled' ? 'Cancelada' : 
             'Completada'}
          </span>
        </div>
        <div class="detail-item">
          <strong>Creada por:</strong> {selectedReservation.createdBy}
        </div>
        <div class="detail-item">
          <strong>Participantes:</strong> {selectedReservation.participants.length}
        </div>
      </div>
    {:else if selectedDate}
      <div class="date-details">
        <h4>Detalles del {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
        
        {#if selectedDateAvailability}
          <div class="availability-info {getAvailabilityClass(selectedDateAvailability)}">
            {#if selectedDateAvailability.type === 'available'}
              <p><i class="fa fa-check"></i> Disponible: {minutesToTime(selectedDateAvailability.open)} - {minutesToTime(selectedDateAvailability.close)}</p>
            {:else if selectedDateAvailability.type === 'exception'}
              {#if selectedDateAvailability.open === 0 && selectedDateAvailability.close === 0}
                <p><i class="fa fa-ban"></i> Cerrado: {selectedDateAvailability.reason}</p>
              {:else}
                <p><i class="fa fa-info-circle"></i> Horario especial: {minutesToTime(selectedDateAvailability.open)} - {minutesToTime(selectedDateAvailability.close)}</p>
                <p><small>{selectedDateAvailability.reason}</small></p>
              {/if}
            {:else}
              <p><i class="fa fa-times"></i> No disponible</p>
            {/if}
          </div>
        {/if}

        <div class="reservations-list">
          <h5>Reservaciones ({getReservationsForDate(selectedDate).length})</h5>
          {#if getReservationsForDate(selectedDate).length > 0}
            {#each getReservationsForDate(selectedDate) as reservation}
              <div 
                class="reservation-item {reservation.status} {selectedReservation && selectedReservation._id === reservation._id ? 'selected' : ''}"
                on:click={() => selectedReservation = reservation}
              >
                <div class="reservation-time">{minutesToTime(reservation.startTime)} - {minutesToTime(reservation.endTime)}</div>
                <div class="reservation-subject">{reservation.subject}</div>
                <div class="reservation-status {reservation.status}">
                  {reservation.status === 'pending' ? 'Pendiente' : 
                   reservation.status === 'confirmed' ? 'Confirmada' : 
                   reservation.status === 'cancelled' ? 'Cancelada' : 
                   'Completada'}
                </div>
              </div>
            {/each}
          {:else}
            <p class="text-muted">No hay reservaciones para esta fecha</p>
          {/if}
        </div>
      </div>
    {:else}
      <div class="no-selection">
        <p>Selecciona una fecha para ver los detalles</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .calendar-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }

  .calendar-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .calendar-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    min-width: 200px;
    text-align: center;
  }

  .calendar {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #e9ecef;
    border-bottom: 1px solid #dee2e6;
  }

  .calendar-weekday {
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
    font-size: 0.875rem;
    color: #495057;
  }

  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 1fr;
    flex: 1;
  }

  .calendar-day {
    border: 1px solid #e9ecef;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    min-height: 120px;
    transition: all 0.2s ease;
    position: relative;
  }

  .calendar-day:hover {
    background-color: #f8f9fa;
  }

  .calendar-day.current-month {
    background: white;
  }

  .calendar-day.other-month {
    background: #f8f9fa;
    color: #6c757d;
  }

  .calendar-day.today {
    background-color: #e7f3ff;
  }

  .calendar-day.selected {
    background-color: #007bff;
    color: white;
  }

  .calendar-day.available {
    border-left: 4px solid #28a745;
  }

  .calendar-day.exception {
    border-left: 4px solid #ffc107;
  }

  .calendar-day.closed {
    border-left: 4px solid #dc3545;
    background-color: #fff5f5;
  }

  .calendar-day.unavailable {
    border-left: 4px solid #6c757d;
    background-color: #f8f9fa;
  }

  .day-number {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .availability-indicator {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }

  .availability-indicator.available {
    background: #28a745;
    color: white;
  }

  .availability-indicator.closed {
    background: #dc3545;
    color: white;
  }

  .availability-indicator.unavailable {
    background: #6c757d;
    color: white;
  }

  .reservations {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 0.25rem;
  }

  .reservation-badge {
    font-size: 0.7rem;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    background: #007bff;
    color: white;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reservation-badge:hover {
    opacity: 0.8;
  }

  .reservation-badge.selected {
    background: #0056b3;
    box-shadow: 0 0 0 2px #003d82;
  }

  .reservation-badge.pending {
    background: #ffc107;
    color: #212529;
  }

  .reservation-badge.confirmed {
    background: #28a745;
  }

  .reservation-badge.cancelled {
    background: #dc3545;
  }

  .reservation-badge.completed {
    background: #6c757d;
  }

  .more-reservations {
    font-size: 0.7rem;
    color: #6c757d;
    text-align: center;
    margin-top: 0.25rem;
  }

  .details-panel {
    width: 300px;
    border-left: 1px solid #dee2e6;
    padding: 1rem;
    background: #f8f9fa;
    overflow-y: auto;
  }

  .reservation-details,
  .date-details {
    animation: fadeIn 0.3s ease;
  }

  .detail-item {
    margin-bottom: 0.75rem;
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-badge.pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-badge.confirmed {
    background: #d1edff;
    color: #004085;
  }

  .status-badge.cancelled {
    background: #f8d7da;
    color: #721c24;
  }

  .status-badge.completed {
    background: #e2e3e5;
    color: #383d41;
  }

  .availability-info {
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .availability-info.available {
    background: #d4edda;
    border: 1px solid #c3e6cb;
  }

  .availability-info.exception {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
  }

  .availability-info.closed {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
  }

  .availability-info.unavailable {
    background: #e2e3e5;
    border: 1px solid #d6d8db;
  }

  .reservations-list {
    margin-top: 1rem;
  }

  .reservation-item {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reservation-item:hover {
    background: white;
    border-color: #007bff;
  }

  .reservation-item.selected {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .reservation-time {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .reservation-subject {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .reservation-status {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    display: inline-block;
  }

  .reservation-item .reservation-status.pending {
    background: #fff3cd;
    color: #856404;
  }

  .reservation-item .reservation-status.confirmed {
    background: #d1edff;
    color: #004085;
  }

  .reservation-item .reservation-status.cancelled {
    background: #f8d7da;
    color: #721c24;
  }

  .reservation-item .reservation-status.completed {
    background: #e2e3e5;
    color: #383d41;
  }

  .reservation-item.selected .reservation-status {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .no-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6c757d;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .calendar-container {
      flex-direction: column;
    }

    .details-panel {
      width: 100%;
      border-left: none;
      border-top: 1px solid #dee2e6;
    }

    .calendar-day {
      min-height: 80px;
    }
  }
</style>