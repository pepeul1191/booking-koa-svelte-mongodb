<script>
  import MonthlyCalendar from '../../widgets/MonthlyCalendar.svelte';

  // Datos de ejemplo
  const roomData = {
    capacity: 12,
    availabilities: [
      { _id: "690e25ab21de0010581282a9", day: 1, open: 540, close: 1080 },
      { _id: "690e25ab21de0010581282aa", day: 2, open: 540, close: 1080 },
      { _id: "690e25ab21de0010581282ab", day: 3, open: 540, close: 1080 },
      { _id: "690e25ab21de0010581282ac", day: 4, open: 540, close: 1080 },
      { _id: "690e25ab21de0010581282ad", day: 5, open: 540, close: 1080 }
    ],
    exceptions: [
      { 
        _id: "690e25ab21de0010581282ae", 
        date: "2024-12-25T00:00:00.000Z", 
        open: 0, 
        close: 0, 
        reason: "Navidad - Cerrado" 
      }
    ],
    reservationIds: []
  };

  const reservations = [
    {
      _id: "1",
      subject: "Reunión de equipo",
      date: new Date(2024, 10, 15), // 15 de Noviembre 2024
      startTime: 540, // 9:00 AM
      endTime: 660,   // 11:00 AM
      roomId: "room1",
      participants: [{ name: "Juan", email: "juan@email.com" }],
      status: "confirmed",
      createdBy: "admin"
    },
    {
      _id: "2",
      subject: "Presentación cliente",
      date: new Date(2024, 10, 15),
      startTime: 780,  // 13:00 PM
      endTime: 900,    // 15:00 PM
      roomId: "room1",
      participants: [{ name: "Maria", email: "maria@email.com" }],
      status: "pending",
      createdBy: "user1"
    }
  ];
</script>

<div class="container-fluid">
  <div class="card">
    <div class="card-header bg-white">
      <h6 class="mb-0"><i class="fa fa-calendar"></i>  Listado de Salas Disponibles</h6>
    </div>
    <div class="card-body">
      <MonthlyCalendar {roomData} {reservations} />
    </div>
  </div>
</div>