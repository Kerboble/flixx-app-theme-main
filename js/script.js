const global = { 
    currentPage: window.location.pathname
}

//takes the end point that points to popular movies and displays them on the home page
async function displayPopularMovies(){
    const { results } = await fetchAPIData('movie/popular')

    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?${movie.id}">
          ${
            movie.poster_path ? 
            `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="Movie Title"
          />` 
          : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt=${movie.title}
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>`
        ;

        document.querySelector('#popular-movies').appendChild(div)
    })
}

async function displayPopularShows(){
    const { results } = await fetchAPIData('tv/popular')

    results.forEach((show) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="tv-details.html?${show.id}">
          ${
            show.poster_path ? 
            `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt=${show.name}
          />` 
          : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt=${show.name}
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${show.first_air_date}</small>
          </p>
        </div>`
        ;

        document.querySelector('#popular-shows').appendChild(div)
    })

 }

 //display movie details when they are clicked on

 async function displayMovieDetails() {
    const movieId = window.location.search.split('?')[1];

    const movie = await fetchAPIData(`movie/${movieId}`)
    
    //overlay for background image

    displayBackgroundImage('movie', movie.backdrop_path)
    

    const div = document.createElement('div');
    div.innerHTML=`<div class="details-top">
    <div>
    ${
        movie.poster_path ? 
        `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt=${movie.title}
      />` 
      : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt=${movie.title}
    />`
      }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
       ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href=${movie.homepage} target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommas(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> ${addCommas(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('' )}</div>
  </div>`;

  document.querySelector('#movie-details').appendChild(div)
 }

 //display TV show details

 async function displayShowDetails() {
    const showId = window.location.search.split('?')[1];

    const show = await fetchAPIData(`tv/${showId}`)

    console.log(show)

    displayBackgroundImage('show', show.backdrop_path)

    const div = document.createElement('div');
    div.innerHTML = `  <div class="details-top">
    <div>
    ${
        show.poster_path ? 
        `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt=${show.name}
      />` 
      : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt=${show.name}
    />`
      }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${show.first_air_date}</p>
      <p>
      ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
       ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href=${show.homepage} target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${show.last_air_date}
      </li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
  </div>`

  document.querySelector('#show-details').append(div)
 }


//fetch data from TMDB API
async function fetchAPIData(endpoint){
    const API_KEY = 'b8e630dae88f945aea3ca78718f60f06'
    const API_URL = 'https://api.themoviedb.org/3/'

    showSpinner()

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();
    
    hideSpinner();

    return data;
}

//show spinner when loading

function showSpinner(){
    document.querySelector('.spinner').classList.add('show')
}

function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show')
}

//function will highlight active link
function highlightActiveLink(){
    const links = document.querySelectorAll('.nav-link');

    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage){
            link.classList.add('active')
        }
    });
}

//convert numbers into numbers with commas
function addCommas(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}


//display backdrop on details pages
function displayBackgroundImage(type, backgroundPath){
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1'

    if(type === 'movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv)
        console.log(overlayDiv)
    } else {
        document.querySelector(`#show-details`).appendChild(overlayDiv)
        console.log(overlayDiv)
    }
}

//init app

//this is a very simple router
function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case "/shows.html":
            displayPopularShows();
            break;
        case "/movie-details.html":
            displayMovieDetails();
            console.log('Movie Details');
            break;
        case "/tv-details.html":
            displayShowDetails()
            console.log('TV Details')
            break;
        case "/search.html":
            console.log('Search')
            break;
    } 
    
    highlightActiveLink();
}


document.addEventListener('DOMContentLoaded', init);
