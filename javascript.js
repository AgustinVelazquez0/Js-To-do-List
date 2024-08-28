// Variable global para almacenar las tareas
let tareasAlmacenadas = [];

// Aseguramos que el DOM ha sido cargado completamente
document.addEventListener('DOMContentLoaded', () => {
  // Variables de referencia a elementos clave
  const agregarTareaInput = document.getElementById('agregarTarea');
  const botonTarea = document.querySelector('.botonTarea');
  const ul = document.querySelector('ul');

  // Función para cargar tareas desde LocalStorage
  function cargarTareas() {
    tareasAlmacenadas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareasAlmacenadas.forEach(tarea => {
      agregarTareaDOM(tarea.texto, tarea.completada);
    });
  }

  // Función para agregar una tarea al DOM
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

    // Añadir eventos a los botones de completar y eliminar
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

  // Función para agregar una nueva tarea a LocalStorage
  function agregarTareaLocalStorage(texto, completada = false) {
    tareasAlmacenadas.push({ texto, completada });
    localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
  }

  // Función para actualizar el estado de una tarea en LocalStorage
  function actualizarTareaLocalStorage(texto, completada) {
    const tareaIndex = tareasAlmacenadas.findIndex(t => t.texto === texto);
    if (tareaIndex !== -1) {
      tareasAlmacenadas[tareaIndex].completada = completada;
      localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
    }
  }

  // Función para eliminar una tarea de LocalStorage
  function eliminarTareaLocalStorage(texto) {
    tareasAlmacenadas = tareasAlmacenadas.filter(t => t.texto !== texto);
    localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
  }

  // Función para agregar una nueva tarea
  function agregarTarea() {
    const tareaTexto = agregarTareaInput.value.trim();
    if (tareaTexto === '') {
      alert('Por favor, introduce una tarea.');
      return;
    }

    agregarTareaDOM(tareaTexto);
    agregarTareaLocalStorage(tareaTexto);
    agregarTareaInput.value = '';
  }

  // Cargar tareas desde LocalStorage al cargar la página
  cargarTareas();

  // Eventos para agregar tarea
  botonTarea.addEventListener('click', agregarTarea);
  agregarTareaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      agregarTarea();
    }
  });
});

// Exponer la variable global 'tareasAlmacenadas' en la consola para depuración
window.tareasAlmacenadas = tareasAlmacenadas;
