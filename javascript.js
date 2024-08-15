// Variable global para almacenar las tareas
let tareasAlmacenadas = [];

document.addEventListener('DOMContentLoaded', () => {
    const agregarTareaInput = document.getElementById('agregarTarea');
    const botonTarea = document.querySelector('.botonTarea');
    const ul = document.querySelector('ul');

    // Función para cargar tareas desde localStorage
    function cargarTareas() {
        tareasAlmacenadas = JSON.parse(localStorage.getItem('tareas')) || [];
        tareasAlmacenadas.forEach(tarea => {
            agregarTareaDOM(tarea.texto, tarea.completada);
        });
    }

    // Función para agregar una tarea al DOM
    function agregarTareaDOM(texto, completada = false) {
        const li = document.createElement('li');
        li.textContent = texto;
        if (completada) {
            li.classList.add('completed');
        }

        // Crear el botón de eliminar
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el clic en el botón elimine la tarea
            ul.removeChild(li);
            eliminarTareaLocalStorage(texto);
        });

        li.appendChild(botonEliminar);

        // Añadir funcionalidad para marcar como completada
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            actualizarTareaLocalStorage(texto, li.classList.contains('completed'));
        });

        ul.appendChild(li);
    }

    // Función para agregar una tarea a localStorage
    function agregarTareaLocalStorage(texto) {
        tareasAlmacenadas.push({ texto, completada: false });
        localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
    }

    // Función para actualizar el estado de una tarea en localStorage
    function actualizarTareaLocalStorage(texto, completada) {
        const tareaIndex = tareasAlmacenadas.findIndex(t => t.texto === texto);
        if (tareaIndex !== -1) {
            tareasAlmacenadas[tareaIndex].completada = completada;
            localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
        }
    }

    // Función para eliminar una tarea de localStorage
    function eliminarTareaLocalStorage(texto) {
        tareasAlmacenadas = tareasAlmacenadas.filter(t => t.texto !== texto);
        localStorage.setItem('tareas', JSON.stringify(tareasAlmacenadas));
    }

    // Función para agregar una tarea
    function agregarTarea() {
        const tareaTexto = agregarTareaInput.value.trim();
        if (tareaTexto === '') {
            alert('Por favor, introduce una tarea.');
            return;
        }

        agregarTareaDOM(tareaTexto);

        // Guardar la nueva tarea en localStorage
        agregarTareaLocalStorage(tareaTexto);

        // Limpiar el campo de entrada
        agregarTareaInput.value = '';
    }

    // Cargar tareas desde localStorage al cargar la página
    cargarTareas();

    // Agregar la tarea cuando se hace clic en el botón
    botonTarea.addEventListener('click', agregarTarea);

    // Opcional: Agregar la tarea con la tecla Enter
    agregarTareaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarTarea();
        }
    });
});

// Exponer la variable global en la consola para depuración
window.tareasAlmacenadas = tareasAlmacenadas;
