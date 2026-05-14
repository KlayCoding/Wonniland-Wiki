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
      stats: data.stats.map(s => s.base_stat)
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
    type: 'radar',
    data: {
      labels: ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'],
      datasets: [{
        label: 'Base Stats',
        data: stats,
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 180,
          ticks: {
            backdropColor: 'transparent',
            color: 'white'
          },
          pointLabels: {
            color: 'white'
          },
          grid: {
            color: '#555'
          },
          angleLines: {
            color: '#555'
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
