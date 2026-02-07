import debounce from 'lodash.debounce';
import { error, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const inputRef = document.querySelector('.country-input');
const infoRef = document.querySelector('.country-info');
const listRef = document.querySelector('.country-list');

const BASE_URL = 'https://restcountries.com/v2/name/';

inputRef.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  const searchQuery = e.target.value.trim();

  clearMarkup();
  if (!searchQuery) return;

  fetchCountries(searchQuery)
    .then(handleCountries)
    .catch(() => {
      error({
        text: 'Country not found',
      });
    });
}

function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}${searchQuery}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function handleCountries(countries) {
  if (countries.length > 10) {
    notice({
      text: 'Too many matches found. Please enter a more specific query!',
    });
    return;
  }

  if (countries.length >= 2) {
    renderCountryList(countries);
    return;
  }

  renderCountryInfo(countries[0]);
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => `<li>${country.name}</li>`)
    .join('');

  listRef.innerHTML = markup;
}

function renderCountryInfo(country) {
  const { name, capital, population, languages, flag } = country;

  const markup = `
    <h2>${name}</h2>
    <p><b>Capital:</b> ${capital}</p>
    <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b></p>
    <ul>
      ${languages.map(lang => `<li>${lang.name}</li>`).join('')}
    </ul>
    <img src="${flag}" alt="Flag of ${name}" width="150"/>
  `;

  infoRef.innerHTML = markup;
}

function clearMarkup() {
  infoRef.innerHTML = '';
  listRef.innerHTML = '';
}