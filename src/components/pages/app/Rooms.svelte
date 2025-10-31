<script>
  // Ajusta la ruta de importación según la ubicación real de tu componente
  import DataTable from '../../widgets/DataTable.svelte'; 
  // Asume que tienes un componente o función para mostrar alertas
  import Alert from '../../widgets/Alert.svelte'; 

  import { navigate } from 'svelte-routing'; // Asumiendo que usas svelte-routing

  // --- CONFIGURACIÓN DEL ENDPOINT Y AUTENTICACIÓN ---
  
  // ⚠️ Importante: Reemplaza con tu URL base y lógica de token real
  const API_BASE_URL = 'http://localhost:3000'; 
  const fetchURL = `${API_BASE_URL}/api/v1/rooms`;
  const jwtToken = 'YOUR_ACTUAL_JWT_TOKEN_HERE'; 
  
  // --- ESTADO Y REFERENCIAS ---
  
  let dataTableRef; // Referencia al componente DataTable para llamar a sus métodos
  
  let alertMessage = {
    text: '',
    status: ''
  };

  // --- CONFIGURACIÓN DE LA TABLA ---
  
  // 1. Keys del JSON que se mostrarán en la tabla
  const columnKeys = ['name', 'capacity', 'description'];
  
  // 2. Nombres de las columnas visibles
  // Nota: Dejé 'Acciones' aquí, aunque se añade como una columna adicional por actionButtons
  const columnNames = ['Nombre', 'Capacidad', 'Descripción']; 

  // 3. Estilos de columnas (debe coincidir con columnKeys)
  const columnStyles = ['', '', ''];

  // 4. Tipos de columnas
  const columnTypes = ['td', 'td', 'td']; 
  
  // 5. Configuración inicial de paginación
  let paginationConfig = {
    display: true,      // Habilitar paginación
    step: 10,           // Filas por página
    actualPage: 1,      // Página inicial
    totalPages: 0,
    listKey: 'rooms', // Clave que contiene el array de datos dentro del objeto 'data'
    // total, offset, limit se actualizarán automáticamente por el DataTable
  };

  // 6. Botones de acción para cada fila
  const actionButtons = [
      {
        label: 'Reservaciones', 
        icon: 'fa-book', 
        class: 'btn-outline-secondary btn-sm', 
        action: (record) => {
          console.log(`Reservaciones de: ${record.name} (${record._id})`);
          // navigate(`/rooms/${record._id}/reservations`);
        }
      },
      {
        label: 'Editar', 
        icon: 'fa-pencil', 
        class: 'btn-outline-secondary btn-sm', 
        action: (record) => {
          console.log(`Editando: ${record.name} (${record._id})`);
          // navigate(`/rooms/${record._id}/edit`);
        }
      },
      {
        label: 'Eliminar', 
        icon: 'fa-times', 
        class: 'btn-outline-danger btn-sm', 
        action: (record) => {
          // Llama al método expuesto en DataTable para confirmar la eliminación
          dataTableRef.askToDeleteRow(record, '_id'); 
        }
      },
  ];
  
  // 7. Configuración del botón de agregar (usará la acción por defecto si no se define)
  const addButtonConfig = {
    display: true,
    disabled: false,
    action: () => {
        console.log('Navegar a creación de sala...');
        // navigate('/rooms/new');
    },
  };

  // --- FUNCIONES DE EVENTO ---

  // Función para manejar mensajes de alerta del DataTable
  const handleAlert = (event) => {
    alertMessage = event.detail;
    // Opcional: Limpiar el mensaje después de X segundos
    setTimeout(() => {
        alertMessage = { text: '', status: '' };
    }, 5000); 
  };
  
  // --- CICLO DE VIDA ---
  
  import { onMount } from 'svelte';
  onMount(() => {
    setTimeout(() => {
      if (dataTableRef) {
        // Cargar los datos al inicio
        dataTableRef.list(); 
      }
    }, 0);
  });
</script>

<div class="container">
    <div class="card">
        <div class="card-header bg-white">
            <h6 class="mb-0">🏢 Listado de Salas Disponibles</h6>
        </div>
        <div class="card-body">
            
            {#if alertMessage.text}
                <Alert status={alertMessage.status} text={alertMessage.text} />
            {/if}

            <DataTable
                bind:this={dataTableRef}
                
                {fetchURL}
                {jwtToken}
                
                {columnKeys}
                {columnNames}
                {columnTypes}
                
                bind:pagination={paginationConfig}
                
                {actionButtons}

                {columnStyles}
                
                addButton={addButtonConfig}

                on:alert={handleAlert}
                
                saveButton={{ display: false }} 
                
                recordId="_id"
            />
        </div>
    </div>
</div>