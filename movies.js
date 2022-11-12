/**
 * Se encarga de llamar a las funciones necesarias para realizar la peticion al servidor.
 * Esta funcion se debe llamar cuando ya se ha rellenado y validado el formulario para agregar una pelicula.
 */
function createMovie() {
    let body = createMovieFormToJson(document.CreateMovie);
    makeRequest('POST', 'http://localhost:3000/api/movies', responseCreateMovie, body);
}


/**
 * Realiza una peticion al servidor utilizando XMLHttpRequest.
 * @param {string} method Metodo de peticion http.
 * @param {string} url End-point al cual se realizara la peticion.
 * @param {lambda} callback Callback que se ejecutara cuando se invoque el evento onreadystatechange.
 * @param {object} body Body de la peticion.
 */
function makeRequest(method, url, callback, body = {}) {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {
        callback(ajax);
    };
    ajax.open(method, url);
    ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
    ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    ajax.send(JSON.stringify(body));

}

/**
 * Crea un objeto json con los campos del formulario de creacion de pelicula.
 * @param {HTMLElement} form Formulario de creacion de pelicula.
 * @returns Formulario de creacion de pelicula en formato JSON.
 */
function createMovieFormToJson(form = new HTMLElement('form')) {
    const formData = new FormData(form);
    let body = Object.fromEntries(formData.entries());
    let genre = [];
    const checkboxes = form.getElementsByClassName('checkbox');
    Array.from(checkboxes).forEach(checkbox => {
        if (checkbox.checked) {
            genre.push(checkbox.value);
        }
    });

    body['rating'] = Number.parseInt(body['rating']);
    body['duration'] = Number.parseInt(body['duration']);
    body = {
        genre,
        ...body
    }
    return body;
}

/**
 * Lambda que controla la respuesta de la peticion para crear pelicula del servidor
 * @param {XMLHttpRequest} request Objeto de la peticion que se esta realizando
 */
const responseCreateMovie = (request) => {
    let message;
    if (request.readyState == 4) {
        let response = JSON.parse(request.responseText);
        if (request.status == 200) {
            message = 'Se ha creado con exito la pelicula';
        } else {
            if (response.errorCode && response.errorCode === '23505') {
                message = 'Error - Ya existe una pelicula con ese nombre';
            } else {
                message = 'Error - Algo ha ocurrido mal'
            }
        }
        document.getElementById('response').innerHTML = message;
    }
}


