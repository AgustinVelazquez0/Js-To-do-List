// Variable global para almacenar las tareas
let tareasAlmacenadas = [];

// Aseguramos que el DOM a sido cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // Creamos una variable de referencia al campo de entrada para agregar tareas, etc
    const agregarTareaInput = document.getElementById('agregarTarea');
    // Creamos una variable de referencia al botón que agrega una nueva tarea
    const botonTarea = document.querySelector('.botonTarea');
    // Creamos una variable de referencia al elemento <ul> donde se agregarán las tareas
    const ul = document.querySelector('ul');

 // Función para cargar tareas desde localStorage
 function cargarTareas() {
    // Obtener las tareas almacenadas en localStorage y convertirlas de JSON a un array
    tareasAlmacenadas = JSON.parse(localStorage.getItem('tareas')) || [];   
    // Iterar sobre cada tarea almacenada y agregarla al DOM
    tareasAlmacenadas.forEach(tarea => {
        agregarTareaDOM(tarea.texto, tarea.completada);
    });
}

function agregarTareaDOM(texto, completada = false) {
    const tareaHTML = `
        <li class="${completada ? 'completed' : ''}">
            <span class="tarea-texto">${texto}</span>
            <section class="botones-juntos">
            <button class="boton-completar ${completada ? 'activo' : ''}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </button>
            <button class="boton-eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 120 120">
                    <rect width="42" height="13" x="39" y="11" fill="#0037ff"></rect>
                    <polygon points="89.267,111 30.467,111 20.467,27 99.267,27" opacity=".35"></polygon>
                    <polygon fill="#0075ff" points="90,106 30,106 20,22 100,22"></polygon>
                    <rect width="92" height="12" x="14" y="23" opacity=".35"></rect>
                    <rect width="92" height="12" x="14" y="19" fill="#52afff"></rect>
                    <rect width="8" height="52" x="73" y="46" opacity=".35"></rect>
                    <rect width="8" height="52" x="39" y="46" opacity=".35"></rect>
                    <rect width="8" height="52" x="56" y="46" opacity=".35"></rect>
                    <rect width="8" height="52" x="73" y="42" fill="#0037ff"></rect>
                    <rect width="8" height="52" x="39" y="42" fill="#0037ff"></rect>
                    <rect width="8" height="52" x="56" y="42" fill="#0037ff"></rect>
                </svg>
            </button>
            </section>
        </li>
    `;
    ul.insertAdjacentHTML('beforeend', tareaHTML);

    // Añadir eventos a los botones
    const li = ul.lastElementChild;
    const botonCompletar = li.querySelector('.boton-completar');
    const botonEliminar = li.querySelector('.boton-eliminar');

    botonCompletar.addEventListener('click', (e) => {
        e.stopPropagation();
        botonCompletar.classList.toggle('activo');
        li.classList.toggle('completed');
        actualizarTareaLocalStorage(texto, li.classList.contains('completed'));
    });

    botonEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        ul.removeChild(li);
        eliminarTareaLocalStorage(texto);
    });
}



// Función para agregar una nueva tarea a localStorage
function agregarTareaLocalStorage(texto, completada = false) {
    // Añadir un nuevo objeto tarea al array global de tareas almacenadas
    tareasAlmacenadas.push({ texto, completada });
    
    // Guardar el array actualizado de tareas en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
}

// Función para actualizar el estado de una tarea en localStorage
function actualizarTareaLocalStorage(texto, completada) {
    // Encontrar el índice de la tarea en el array de tareas almacenadas
    const tareaIndex = tareasAlmacenadas.findIndex(t => t.texto === texto);
 
    // Si la tarea se encuentra, actualizar su estado de completada
    if (tareaIndex !== -1) {
        tareasAlmacenadas[tareaIndex].completada = completada;
        // Guardar el array actualizado en localStorage
        localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
    }
}


// Función para eliminar una tarea de localStorage
function eliminarTareaLocalStorage(texto) {
    // Filtrar el array de tareas almacenadas para eliminar la tarea con el texto especificado
    tareasAlmacenadas = tareasAlmacenadas.filter(t => t.texto !== texto);
    
    // Guardar el array actualizado de tareas en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
}

    // Función para agregar una tarea
    function agregarTarea() {
        // Obtener el texto del campo de entrada y eliminar espacios en blanco al principio y al final
        const tareaTexto = agregarTareaInput.value.trim();
        
        // Verificar si el campo de entrada está vacío
        if (tareaTexto === '') {
            // Si está vacío, mostrar una alerta al usuario y salir de la función
            alert('Por favor, introduce una tarea.');
            return;
        }

        // Agregar la tarea al DOM (interfaz de usuario)
        agregarTareaDOM(tareaTexto);

        // Guardar la nueva tarea en localStorage
        agregarTareaLocalStorage(tareaTexto);

        // Limpiar el campo de entrada después de agregar la tarea
        agregarTareaInput.value = '';
    }

    // Cargar tareas desde localStorage al cargar la página
    cargarTareas();

    // Agregar la tarea cuando se hace clic en el botón de agregar tarea
    botonTarea.addEventListener('click', agregarTarea);

    // Opcional: Agregar la tarea cuando se presiona la tecla Enter en el campo de entrada
    agregarTareaInput.addEventListener('keypress', (e) => {
        // Verificar si la tecla presionada es Enter
        if (e.key === 'Enter') {
            // Si es Enter, agregar la tarea
            agregarTarea();
        }
    });
});

// Exponer la variable global 'tareasAlmacenadas' en la consola para depuración
window.tareasAlmacenadas = tareasAlmacenadas;
