const grid = document.getElementById('pokemonGrid');
const modal = document.getElementById('pokemonModal');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');

let allPokemon = [];
let statsChart;

async function fetchPokemon() {

  for (let i = 1; i <= 151; i++) {

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();

    const pokemon = {
      id: data.id,
      customId: 1000 + data.id,
      name: data.name,
      sprite:
        data.sprites.versions['generation-v']['black-white'].animated.front_default
        || data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      abilities: data.abilities.map(a => a.ability.name),
      stats: data.stats.map(s => s.base_stat),

      regionalForms: 'None',
      alternativeForms: 'None',

      megaForms:
        ['venusaur','charizard','blastoise','alakazam','gengar',
        'kangaskhan','pinsir','gyarados','aerodactyl','mewtwo']
        .includes(data.name)
        ? 'Available'
        : 'None',

      gmaxForms:
        ['venusaur','charizard','blastoise',
        'pikachu','eevee','snorlax','gengar']
        .includes(data.name)
        ? 'Available'
        : 'None',

      battleForms:
        data.name === 'mewtwo'
        ? 'Mega X / Mega Y'
        : 'None'
    };

    allPokemon.push(pokemon);

    createCard(pokemon);
  }
}

function createCard(pokemon) {

  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${pokemon.sprite}" alt="${pokemon.name}">

    <p class="dex-number">#${pokemon.id}</p>

    <h3>${capitalize(pokemon.name)}</h3>

    <div class="types">
      ${pokemon.types
        .map(type => `
          <span class="type ${type}">
            ${capitalize(type)}
          </span>
        `)
        .join('')}
    </div>
  `;

  card.addEventListener('click', () => openModal(pokemon));

  grid.appendChild(card);
}

function openModal(pokemon) {

  modal.classList.remove('hidden');

  document.getElementById('modalSprite').src = pokemon.sprite;
  document.getElementById('modalName').textContent = capitalize(pokemon.name);
  document.getElementById('modalDex').textContent = `Pokédex #${pokemon.id}`;
  document.getElementById('modalCustomId').textContent = `Custom ID: ${pokemon.customId}`;

  document.getElementById('modalTypes').innerHTML = pokemon.types
    .map(type => `
      <span class="type ${type}">
        ${capitalize(type)}
      </span>
    `)
    .join('');

  document.getElementById('regionalForms').textContent = pokemon.regionalForms;
  document.getElementById('alternativeForms').textContent = pokemon.alternativeForms;
  document.getElementById('megaForms').textContent = pokemon.megaForms;
  document.getElementById('gmaxForms').textContent = pokemon.gmaxForms;
  document.getElementById('battleForms').textContent = pokemon.battleForms;

  document.getElementById('modalAbilities').innerHTML = pokemon.abilities
    .map(ability => `<li>${capitalize(ability)}</li>`)
    .join('');

  renderChart(pokemon.stats);
}

function renderChart(stats) {

  const ctx = document.getElementById('statsChart');

  if (statsChart) {
    statsChart.destroy();
  }

  statsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'],
      datasets: [{
        label: 'Base Stats',
        data: stats,

        backgroundColor: stats.map(stat => {

          if (stat < 50) return '#ef4444';
          if (stat < 80) return '#f59e0b';
          if (stat < 110) return '#84cc16';

          return '#22c55e';
        }),

        borderRadius: 8
      }]
    },

    options: {
      responsive: true,

      scales: {

        y: {
          beginAtZero: true,
          max: 180,

          ticks: {
            color: 'white'
          },

          grid: {
            color: '#444'
          }
        },

        x: {
          ticks: {
            color: 'white'
          },

          grid: {
            color: '#222'
          }
        }
      },

      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        }
      }
    }
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

searchInput.addEventListener('input', () => {

  const value = searchInput.value.toLowerCase();

  grid.innerHTML = '';

  allPokemon
    .filter(pokemon =>
      pokemon.name.includes(value)
      || pokemon.id.toString().includes(value)
    )
    .forEach(createCard);
});

fetchPokemon();
