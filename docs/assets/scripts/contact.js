const formulario = document.getElementById('formulario');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const asunto = document.getElementById('asunto');
const mensaje = document.getElementById('mensaje');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarCampos()) {
        enviarFormulario();
    }
});

function validarCampos() {
    let valido = true;
    if (nombre.value === '') {
        valido = false;
        alert('El campo nombre es obligatorio.');
    }
    if (correo.value === '') {
        valido = false;
        alert('El campo correo electrónico es obligatorio.');
    } else if (!validarCorreo(correo.value)) {
        valido = false;
        alert('El correo electrónico no es válido.');
    }
    if (asunto.value === '') {
        valido = false;
        alert('El campo asunto es obligatorio.');
    }
    if (mensaje.value === '') {
        valido = false;
        alert('El campo mensaje es obligatorio.');
    }
    return valido;
}

function validarCorreo(correo) {
    const expresion = /\S+@\S+\.\S+/;
    return expresion.test(correo);
}

function enviarFormulario() {
    const xhr = new XMLHttpRequest();
    const url = 'ruta/al/archivo.php'; // especifica la ruta de tu archivo PHP que procesa el formulario
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            nombre.value = '';
            correo.value = '';
            asunto.value = '';
            mensaje.value = '';
            alert('El formulario se ha enviado correctamente.');
        }
    };
    xhr.send(`nombre=${nombre.value}&correo=${correo.value}&asunto=${asunto.value}&mensaje=${mensaje.value}`);
}