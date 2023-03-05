const form = document.querySelector('form');
const mensajeExito = document.querySelector('.mensaje-exito');

form.addEventListener('submit', enviarFormulario);

function enviarFormulario(event) {
  event.preventDefault();
  
  mensajeExito.textContent = 'Gracias por contactarnos. Responderemos a la brevedad.';
  mensajeExito.style.display = 'block';
  
  form.reset();
}
