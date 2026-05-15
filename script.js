const pokemonData = [
  {
    id: '0143',
    name: 'Snorlax',
    types: ['Normal']
  },
  {
    id: '1500',
    name: 'GMax-Snorlax',
    types: ['Normal']
  },
  {
    id: '0144',
    name: 'Articuno',
    types: ['Ice', 'Flying']
  },
  {
    id: '0982',
    name: 'Galar-Articuno',
    types: ['Psychic', 'Flying']
  },
  {
    id: '0145',
    name: 'Zapdos',
    types: ['Electric', 'Flying']
  },
  {
    id: '0983',
    name: 'Galar-Zapdos',
    types: ['Fighting', 'Flying']
  },
  {
    id: '0146',
    name: 'Moltres',
    types: ['Fire', 'Flying']
  },
  {
    id: '0984',
    name: 'Galar-Moltres',
    types: ['Dark', 'Flying']
  }
];

const grid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('searchInput');

function renderPokemon(list){

  grid.innerHTML = '';

  list.forEach((pokemon) => {

    const card = document.createElement('div');

    card.className = 'card';

    card.innerHTML = `
      <div class="id">#${pokemon.id}</div>

      <div class="name">${pokemon.name}</div>

      <div class="types">
        ${pokemon.types.map(type => `
          <span class="type ${type.toLowerCase()}">
            ${type}
          </span>
        `).join('')}
      </div>
    `;

    grid.appendChild(card);
  });
}

searchInput.addEventListener('input', () => {

  const value = searchInput.value.toLowerCase();

  const filtered = pokemonData.filter((pokemon) => {

    return (
      pokemon.name.toLowerCase().includes(value)
      || pokemon.id.includes(value)
    );
  });

  renderPokemon(filtered);
});

renderPokemon(pokemonData);
