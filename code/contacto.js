// contacto.js
(function () {
    var form = document.getElementById('ct-form');
    if (!form) return;

    var error = document.getElementById('ct-error');
    var ok = document.getElementById('ct-ok');
    var btn = document.getElementById('ct-send');
    var label = btn.querySelector('.ct-send-txt');
    var ENDPOINT = 'https://formsubmit.co/ajax/7f69d3b1923b6fe17c86a48f19314bc0';

    function fail(msg) {
        error.textContent = msg;
        error.hidden = false;
        ok.hidden = true;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (window.location.protocol === 'file:') {
            return fail('Abre la página con un servidor local (ej. Live Server) o en tu dominio; FormSubmit no funciona abriendo el archivo HTML directo.');
        }

        var nombre = form.elements['name'].value.trim();
        var correo = form.elements['email'].value.trim();
        var asunto = form.elements['asunto'].value.trim();
        var mensaje = form.elements['message'].value.trim();
        var honey = form.elements['_honey'] ? form.elements['_honey'].value : '';

        if (!nombre || !correo || !asunto || !mensaje) {
            return fail('Completa todos los campos.');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return fail('Revisa tu correo.');
        }

        error.hidden = true;
        ok.hidden = true;
        btn.disabled = true;
        label.textContent = 'Enviando...';

        fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: nombre,
                email: correo,
                asunto: asunto,
                message: mensaje,
                _subject: asunto + ' | SENTARIA',
                _replyto: correo,
                _template: 'table',
                _captcha: 'false',
                _honey: honey
            })
        })
            .then(function (r) {
                return r.text().then(function (txt) {
                    try {
                        return JSON.parse(txt);
                    } catch (err) {
                        throw new Error('Respuesta no válida del servidor (' + r.status + ')');
                    }
                });
            })
            .then(function (d) {
                if (d && (d.success === 'true' || d.success === true)) {
                    form.reset();
                    ok.hidden = false;
                } else {
                    var msg = (d && d.message) ? String(d.message) : '';
                    console.warn('Respuesta de FormSubmit:', d);

                    if (/activation/i.test(msg)) {
                        fail('Falta activar el formulario: revisa yennykaterine08@gmail.com (también en Spam) y haz clic en "Activate Form".');
                    } else if (/web server/i.test(msg)) {
                        fail('FormSubmit requiere abrir la página desde un servidor web (Live Server o dominio publicado).');
                    } else {
                        fail('No se pudo enviar. Intenta de nuevo.');
                    }
                }
            })
            .catch(function (err) {
                console.error('Error al enviar formulario:', err);
                fail('No se pudo conectar para enviar el mensaje. Intenta de nuevo.');
            })
            .then(function () {
                btn.disabled = false;
                label.textContent = 'Enviar';
            });
    });
})();