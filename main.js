const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_wTEyJ7mn5SNwm4myVXR2lO8cj0507aBZUI3JUBOmGbQGGfakfsszXIrRevriNqeR';
const API_URL_RANDOM = `${BASE_URL}/images/search?limit=2`;

const api = axios.create({
  baseURL: BASE_URL,
});
api.defaults.headers.common['x-api-key'] = API_KEY;

const API_URL_FAVOURITES = `${BASE_URL}/favourites`;
const API_URL_FAVOURITES_DELETE = (id) => `${BASE_URL}/favourites/${id}`;
const API_URL_UPLOAD = `${BASE_URL}/images/upload`;

const spanError = document.getElementById('error');
const buttonLoadRandom = document.getElementById('button-load-random');
buttonLoadRandom.addEventListener('click', loadRandomCats);
const btn1 = document.getElementById('btn-1');
const btn2 = document.getElementById('btn-2');

async function loadRandomCats() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random', data);

  if (res.status !== 200) {
    spanError.innerHTML = `Hubo un error: ${res.status} `;
  } else {
    const img1 = document.getElementById('img-1');
    const img2 = document.getElementById('img-2');
    btn1.onclick = () => saveFavouriteCat(data[0].id);
    btn2.onclick = () => saveFavouriteCat(data[1].id);
    // btn1.addEventListener('click', saveFavouriteCat);
    // btn2.addEventListener('click', () => saveFavouriteCat[1].id);

    img1.src = data[0].url;
    img2.src = data[1].url;
  }
}

async function loadFavouritesCats() {
  const res = await fetch(API_URL_FAVOURITES, {
    method: 'get',
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  const data = await res.json();
  console.log('Favourites', data);
  if (res.status !== 200) {
    spanError.innerHTML = `Hubo un error: ${res.status} - ${data.message} `;
  } else {
    const sectionFavouritesCats = document.getElementById('favourites-cats');
    sectionFavouritesCats.innerHTML = '';
    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode('Gatitos favoritos');
    h2.appendChild(h2Text);
    sectionFavouritesCats.appendChild(h2);
    data.forEach((cat) => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Eliminar favorito');

      btn.appendChild(btnText);
      btn.onclick = () => deleteFauvoriteCat(cat.id);
      img.src = cat.image.url;
      sectionFavouritesCats.classList.add('ramdomCats');
      article.appendChild(img);
      article.appendChild(btn);
      sectionFavouritesCats.appendChild(article);
    });
  }
}

async function saveFavouriteCat(id) {
  // const res = await fetch(API_URL_FAVOURITES, {
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-API-KEY': API_KEY,
  //   },
  //   body: JSON.stringify({
  //     image_id: id,
  //   }),
  // });
  // const data = await res.json();

  const { data, status } = await api.post('/favourites', {
    image_id: id,
  });

  if (status !== 200) {
    spanError.innerHTML = `Hubo un error: ${status}  - ${data.message} `;
  } else {
    console.log('Gatito guardado en favoritos');
    loadFavouritesCats();
  }
}

async function deleteFauvoriteCat(id) {
  const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
    method: 'delete',
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  const data = await res.json();
  if (res.status !== 200) {
    spanError.innerHTML = `Hubo un error: ${res.status}  - ${data.message} `;
  } else {
    console.log('Gatito guardado en favoritos');
    loadFavouritesCats();
  }
}

async function uploadCat() {
  const form = document.getElementById('uploading-form');
  const formData = new FormData(form);
  console.log(formData.get('file'));

  const res = await fetch(API_URL_UPLOAD, {
    method: 'post',
    headers: {
      'X-API-KEY': API_KEY,
      // 'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
}

loadRandomCats();
loadFavouritesCats();
