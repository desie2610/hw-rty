import debounce from 'lodash.debounce';
import { error, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const inputRef = document.querySelector('.country-input');
const infoRef = document.querySelector('.country-info');
const listRef = document.querySelector('.country-list');

const BASE_URL = 'https://restcountries.com/v3.1/name/';

inputRef.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  const query = e.target.value.trim();

  clearMarkup();
  if (!query) return;

  fetchCountries(query)
    .then(handleCountries)
    .catch(() => {
      error({
        text: 'Країна не знайдена!!!',
      });
    });
}

function fetchCountries(query) {
  return fetch(`${BASE_URL}${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
}

function handleCountries(countries) {
  if (countries.length > 10) {
    notice({
      text: 'Дуже багато варіантів введіть більше літер!',
    });
    return;
  }

  if (countries.length > 1) {
    renderCountryList(countries);
    return;
  }

  renderCountryInfo(countries[0]);
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => `<li>${country.name.common}</li>`)
    .join('');

  listRef.innerHTML = markup;
}

function renderCountryInfo(country) {
  const name = country.name.common;
  const capital = country.capital?.[0] || '—';
  const population = country.population;
  const languages = Object.values(country.languages || {});
  const flag = country.flags.svg;

  const markup = `
    <h2>${name}</h2>
    <p><b>Capital:</b> ${capital}</p>
    <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b></p>
    <ul>
      ${languages.map(lang => `<li>${lang}</li>`).join('')}
    </ul>
    <img src="${flag}" alt="Flag of ${name}" width="150" />
  `;

  infoRef.innerHTML = markup;
}

function clearMarkup() {
  infoRef.innerHTML = '';
  listRef.innerHTML = '';
}