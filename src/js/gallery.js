import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

import UnsplashAPI from './UnspleshAPI';
import { createGalleryCard } from './create-card';

const services = new UnsplashAPI();
console.log(services.getPopularImg(1));

const galleryEl = document.querySelector('.js-gallery');
const formEl = document.querySelector('.js-search-form');

// ------PAGINATION--------

const options = {
  totalItems: 0,
  itemsPerPage: 12,
  visiblePages: 3,
  page: 1,
  centerAlign: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};

const container = document.getElementById('tui-pagination-container');
const pagination = new Pagination(container, options);

// 3) функція-прослуховувач подій пагінації. Сюди скопіювали все з функції loadData()
async function getPopular(event) {
  const currentPage = event.page;
  try {
    const { results } = await services.getPopularImg(currentPage);
    const markup = createGalleryCard(results);
    galleryEl.innerHTML = '';
    galleryEl.insertAdjacentHTML('afterbegin', markup);
  } catch (error) {
    console.log(error.message);
  }
}

// 4)
pagination.on('afterMove', getPopular);

// 2)
const page = pagination.getCurrentPage();

async function loadData() {
  try {
    // services-екземпляр класу UnsplashAPI, а getPopularImg -метод цього класу
    const { total, results } = await services.getPopularImg(page);

    // 1) pagination.reset - беремо з документації, а (total) передаємо з  const { total, results } = await services.getPopularImg(1);
    pagination.reset(total);

    const markup = createGalleryCard(results);

    galleryEl.insertAdjacentHTML('afterbegin', markup);
  } catch (error) {
    console.log(error.message);
  }
}

loadData();

formEl.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  const searchQuery = event.target.elements.query.value.trim();
  services.query = searchQuery;

  // 8)
  pagination.off('afterMove', getByQuery);
  pagination.off('afterMove', getPopular);

  async function getImages() {
    try {
      const { total, results } = await services.getImagesByQuery(page);
      const markup = createGalleryCard(results);
      galleryEl.innerHTML = '';
      // 6)
      pagination.reset(total);

      galleryEl.insertAdjacentHTML('afterbegin', markup);
    } catch (error) {
      console.log(error.message);
    }
  }

  getImages();

  //7)
  pagination.on('afterMove', getByQuery);
}

// 5}
async function getByQuery(event) {
  const currentPage = event.page;
  try {
    const { results } = await services.getImagesByQuery(currentPage);
    const markup = createGalleryCard(results);
    galleryEl.innerHTML = '';
    galleryEl.insertAdjacentHTML('afterbegin', markup);
  } catch (error) {
    console.log(error.message);
  }
}
