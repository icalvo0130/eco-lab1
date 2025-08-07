//----------------------cats facts api----------------------//

function clickCatFact() {
  const button = document.getElementById('btn1');
  button.addEventListener('click', async () => {
    // mostrar indicador de carga
    document.getElementById('fact-text').innerHTML = '<span class="loading-text">Cargando dato de gato</span>';
    
    const fact = await getCatFact();
    if (fact) {
      document.getElementById('fact-text').innerText = fact;
      // Crear y mostrar el btn de eliminar
      showDeleteButton('fact-text');
      
    } else {
      document.getElementById('fact-text').innerText = 'No se pudo obtener un dato de gato.';
    }
  });
}

// para mostrar el btn de eliminar
function showDeleteButton(targetElementId) {
  // Verificar si el btn ya existe para evitar duplicados
  let deleteBtn = document.getElementById('delete-btn-' + targetElementId);
  
  if (!deleteBtn) {
    // Crear el btn de eliminar
    deleteBtn = document.createElement('button');
    deleteBtn.id = 'delete-btn-' + targetElementId;
    deleteBtn.innerText = 'Eliminar';
    
    // Agregar evento click para eliminar el contenido
    deleteBtn.addEventListener('click', () => {
      document.getElementById(targetElementId).innerText = '';
      deleteBtn.remove(); // Eliminar el btn despues de usarlo
    });
    
    // Insertar el btn despues del elemento de texto
    const targetElement = document.getElementById(targetElementId);
    targetElement.parentNode.insertBefore(deleteBtn, targetElement.nextSibling);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  clickCatFact();
});

// obtener un dato de gato desde la API
async function getCatFact() {
  try {
    const response = await fetch('https://catfact.ninja/fact');
    if (!response.ok) throw new Error('Error al buscar el dato');
    const data = await response.json();
    return data.fact;
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    return null;
  }
}


//---------------------- BoredApi ------------------------------//

// para obtener una actividad aleatoria desde la API de BoredApi
async function BoredApi() {
  try {
    const response = await fetch('https://bored.api.lewagon.com/api/activity/');
    if (!response.ok) throw new Error('Error al buscar actividad');
    const data = await response.json();
    return data.activity;
  } catch (error) {
    console.error('Error al buscar actividad:', error);
    return null;
  }
}

// para manejar el evento de clic en el btn de actividad
function clickActivity() {
  const button = document.getElementById('btn2');
  button.addEventListener('click', async () => {
    // mostrar indicador de carga
    document.getElementById('activity-text').innerHTML = '<span class="loading-text">Cargando actividad</span>';
    
    const activity = await BoredApi();
    if (activity) {
      document.getElementById('activity-text').innerText = activity;
      showDeleteButton('activity-text');

    } else {
      document.getElementById('activity-text').innerText = 'No se pudo obtener una actividad';
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  clickActivity();
});

// Random user api
// para manejar el evento de clic en el btn de usuario
function clickUser() {
  const button = document.getElementById('btn3');
  button.addEventListener('click', async () => {
    // mostrar indicador de carga
    document.getElementById('user-text').innerHTML = '<span class="loading-text">Cargando usuario</span>';
    
    const user = await RandomUser();
    if (user) {
      document.getElementById('user-text').innerText = user;
      showDeleteButton('user-text');

    } else {
      document.getElementById('user-text').innerText = 'No se pudo obtener un usuario';
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  clickUser();
});

// para obtener un usuario aleatorio desde la API de RandomUser
async function RandomUser(){
    try {
        const response = await fetch ('https://randomuser.me/api/');
        if (!response.ok) throw new Error('Error al generar usuario');
        const data = await response.json();
        return data.results[0].name.first + ' ' + data.results[0].name.last;
    } catch (error) {
        console.error('Error al generar usuario:', error);
        return null;
    }
}

//----------------BUSCADOR OTAKUS------------------//
// Variables globales para filtros
let currentFilter = 'popular';

// para buscar animes usando la API con limite personalizable y filtros
async function searchAnime(query, limit = 10, filter = 'popular') {
    try {
        let url = `https://api.jikan.moe/v4/anime?limit=${limit}`;
        
        // Agregar query si existe
        if (query && query.trim()) {
            url += `&q=${encodeURIComponent(query.trim())}`;
        }
        
        // Aplicar filtros según el tipo seleccionado
        switch(filter) {
            case 'popular':
                url += `&order_by=popularity&sort=asc`;
                break;
            case 'top-rated':
                url += `&order_by=score&sort=desc&min_score=7`;
                break;
            case 'recent':
                url += `&start_date=2020-01-01&order_by=start_date&sort=desc`;
                break;
            case 'classic':
                url += `&start_date=1990-01-01&end_date=2010-12-31&order_by=score&sort=desc`;
                break;
            case 'high-score':
                url += `&min_score=8&order_by=score&sort=desc`;
                break;
            default:
                url += `&order_by=popularity&sort=asc`;
        }
        
        console.log('URL de busqueda:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al buscar anime: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
        
    } catch (error) {
        console.error('Error al buscar anime:', error);
        return [];
    }
}

// para mostrar los resultados 
function displayResults(animes) {
    const resultsContainer = document.getElementById('results');
    // Limpiar resultados anteriores
    resultsContainer.innerHTML = '';
    
    // Si no hay resultados
    if (animes.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron animes con los criterios de busqueda</p>';
        return;
    }
    
    animes.forEach(anime => {
        const animeElement = document.createElement('div');
        
        // fecha de inicio
        const startDate = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'N/A';
        
        
        animeElement.innerHTML = `
            <h3>${anime.title}</h3>
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" width="200">
            <div class="anime-info">
                <p><strong>Puntuación:</strong> <span style="color: #f6ad55; font-weight: bold;">${anime.score || 'N/A'}</span></p>
                <p><strong>Año:</strong> ${startDate}</p>
                <p><strong>Episodios:</strong> ${anime.episodes || 'N/A'}</p>
            </div>
        `;
        resultsContainer.appendChild(animeElement);
    });
}

// para busqueda
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const limitInput = document.getElementById('limitInput');
    const query = searchInput.value.trim();
    const limit = parseInt(limitInput.value) || 10;
    
    // mostrar indicador de carga
    document.getElementById('results').innerHTML = '<p class="loading-text">Buscando animes</p>';
    
    try {
        // busqueda con limite personalizado y filtro
        const animes = await searchAnime(query, limit, currentFilter);
        
        // mostrar resultados
        displayResults(animes);
    } catch (error) {
        document.getElementById('results').innerHTML = '<p>Error al buscar animes. Inténtalo de nuevo.</p>';
    }
}

// para manejar filtros
function handleFilter(filter) {
    currentFilter = filter;
    
    // actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Marcar el btn actual como activo
    const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // busqueda con el nuevo filtro
    performSearch();
}

//cargar animes populares por defecto
async function loadDefaultAnimes() {
    const limitInput = document.getElementById('limitInput');
    const limit = parseInt(limitInput.value) || 10;
    
    document.getElementById('results').innerHTML = '<p class="loading-text">Cargando animes populares</p>';
    
    try {
        const animes = await searchAnime('', limit, 'popular');
        displayResults(animes);
    } catch (error) {
        document.getElementById('results').innerHTML = '<p>Error al cargar animes. Inténtalo de nuevo.</p>';
    }
}

//iniciar el buscador 
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const limitInput = document.getElementById('limitInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // btn de busqueda
    searchBtn.addEventListener('click', performSearch);
    
    // Enter en el campo de busqueda
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Cambio en el limite
    limitInput.addEventListener('change', () => {
        if (document.getElementById('results').innerHTML !== '') {
            performSearch();
        }
    });
    
    // filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            handleFilter(filter);
        });
    });
    
    // cargar animes populares por defecto
    loadDefaultAnimes();
}

// iniciar cuando el DOM este cargado
document.addEventListener('DOMContentLoaded', initializeSearch);