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
 * Se encarga de llamar a las funciones necesarias para realizar la peticion al servidor para crear una pelicula.
 * Esta funcion se debe llamar cuando ya se ha rellenado y validado el formulario para agregar una pelicula.
 */
function createMovie() {
    let body = createMovieFormToJson(document.CreateMovie);
    makeRequest('POST', 'http://localhost:3000/api/movies', (request) => responseCreateMovie(request, 'Se ha creado con exito la pelicula'), body);
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
 * Lambda que controla la respuesta de la peticion para crear pelicula del servidor.
 * @param {XMLHttpRequest} request Objeto de la peticion que se esta realizando.
 */
const responseCreateMovie = (request, msg) => {
    let message;
    if (request.readyState == 4) {
        let response = JSON.parse(request.responseText);
        if (request.status >= 200 || request.status < 300) {
            message = msg;
        } else {
            message = 'Error - Algo ha ocurrido mal'

        }
        document.getElementById('response').innerHTML = message;
    }
}

/**
 * Se encarga de llamar a las funciones necesarias para realizar la peticion al servidor para obtener todos los registros de pelicula.
 * y listarlos en la tabla con el id #tableMovies.
 */
function loadMovieData() {
    makeRequest('GET', 'http://localhost:3000/api/movies', responseGetAllMovies);
}

/**
 * Lambda que controla la respuesta de la peticion para cargar todas las peliculas del servidor.
 * @param {XMLHttpRequest} request Objeto de la peticion que se esta realizando.
 */
const responseGetAllMovies = (request) => {
    if (request.readyState === 4) {
        let response = JSON.parse(request.responseText);
        if (request.status == 200) {
            let table = document.getElementById('tableMovies');
            response.forEach((movie) => {
                let tr = createTrMovie(movie);
                table.appendChild(tr);
            })
        } else {
            alert('Algo ha ocurrido mal')
        }
    }
}

/**
 * Crea el elemento TR con los datos del objeto pelicula.
 * @param {object} movie Registro de una pelicula.
 * @returns Html element TR con los datos de un registro de una pelicula y un boton para borrarlo.
 */
function createTrMovie(movie) {
    let tr = document.createElement('tr');
    for (let propertie in movie) {
        if (propertie !== 'synopsis' && propertie !== 'slug' && propertie !== 'id') {
            let td = document.createElement('td');
            td.innerHTML = movie[propertie];
            tr.appendChild(td);
        }
    }
    let td = document.createElement('td');
    let button = document.createElement('button');
    button.innerHTML = 'Borrar';
    button.addEventListener('click', (event) => {
        deleteMovie(movie['id']);
    });
    td.appendChild(button);
    tr.appendChild(td);
    button = document.createElement('button');
    button.innerHTML = 'Actualizar'
    button.addEventListener('click', (event) => {
        loadUpdateForm(movie);
    })
    td = document.createElement('td');
    td.appendChild(button);
    tr.appendChild(td);
    return tr;
}

const loadUpdateForm = (movie) => {
    let updateForm = document.getElementById('updateMovieForm');
    updateForm.style.display = "block";
    document.UpdateMovie.name.value = movie['name'];
    document.UpdateMovie.synopsis.value = movie['synopsis'];
    document.UpdateMovie.releaseDate.value = movie['releaseDate'];
    document.UpdateMovie.rating.value = movie['rating'];
    document.UpdateMovie.director.value = movie['director'];
    document.UpdateMovie.mainActor.value = movie['mainActor'];
    document.UpdateMovie.duration.value = movie['duration'];
    document.getElementById('buttonUpdate').addEventListener('click', (event) => {
        updateMovie(movie['id'])
    })
}

function updateMovie(id) {
    let body = createMovieFormToJson(document.UpdateMovie);
    makeRequest('PATCH', 'http://localhost:3000/api/movies/' + id, (request) => responseCreateMovie(request, 'Se ha actualizado la pelicula con exito'), body);
}

/**
 * Realiza la peticion al servidor para eliminar un registro utilizando su UUID.
 * @param {string} id UUID de un registro de pelicula.
 */
const deleteMovie = (id) => {
    makeRequest('DELETE', 'http://localhost:3000/api/movies/' + id, responseDeleteMovie);
}

/**
 * Lambda que controla la respuesta de la peticion para eliminar un registro de pelicula.
 * @param {XMLHttpRequest} request request Objeto de la peticion que se esta realizando.
 */
const responseDeleteMovie = (request) => {
    if (request.readyState == 4) {
        if (request.status >= 200 || request.status < 300) {
            window.location.reload();
        } else {
            alert('Ha ocurrido un error');
        }
    }
}





