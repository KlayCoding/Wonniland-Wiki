const grid = document.getElementById('pokemonGrid');
const modal = document.getElementById('pokemonModal');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');

let allPokemon = [];

async function fetchPokemon(){

  for(let i=1;i<=151;i++){

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();

    const pokemon = {

      id:data.id,
      customId:1000 + data.id,
      name:data.name,

      sprite:
        data.sprites.versions['generation-v']['black-white'].animated.front_default
        || data.sprites.front_default,

      types:data.types.map(t=>t.type.name),

      abilities:data.abilities.map(a=>a.ability.name),

      stats:{
        hp:data.stats[0].base_stat,
        atk:data.stats[1].base_stat,
        def:data.stats[2].base_stat,
        spa:data.stats[3].base_stat,
        spd:data.stats[4].base_stat,
        spe:data.stats[5].base_stat
      },

      regionalForms:'None',
      megaForms:['venusaur','charizard','blastoise','alakazam','gengar','mewtwo'].includes(data.name)
      ? 'Available'
      : 'None',

      gmaxForms:['venusaur','charizard','blastoise','pikachu','gengar'].includes(data.name)
      ? 'Available'
      : 'None',

      battleForms:data.name === 'mewtwo'
      ? 'Mega X / Mega Y'
      : 'None'
    };

    allPokemon.push(pokemon);

    createCard(pokemon);
  }
}

function createCard(pokemon){

  const card = document.createElement('div');

  card.className = 'card';

  card.innerHTML = `
    <img src="${pokemon.sprite}">

    <p class="dex-number">#${pokemon.id}</p>

    <h3>${capitalize(pokemon.name)}</h3>

    <div class="types">
      ${pokemon.types.map(type=>`
        <span class="type ${type}">
          ${capitalize(type)}
        </span>
      `).join('')}
    </div>
  `;

  card.addEventListener('click',()=>openModal(pokemon));

  grid.appendChild(card);
}

function openModal(pokemon){

  modal.classList.remove('hidden');

  document.getElementById('modalSprite').src = pokemon.sprite;

  document.getElementById('modalName').textContent =
    capitalize(pokemon.name);

  document.getElementById('modalDex').textContent =
    `Pokédex #${pokemon.id}`;

  document.getElementById('modalCustomId').textContent =
    `Wiki ID #${pokemon.customId}`;

  document.getElementById('modalTypes').innerHTML =
    pokemon.types.map(type=>`
      <span class="type ${type}">
        ${capitalize(type)}
      </span>
    `).join('');

  document.getElementById('modalAbilities').innerHTML =
    pokemon.abilities.map(ability=>`
      <li>${capitalize(ability)}</li>
    `).join('');

  document.getElementById('regionalForms').textContent =
    pokemon.regionalForms;

  document.getElementById('megaForms').textContent =
    pokemon.megaForms;

  document.getElementById('gmaxForms').textContent =
    pokemon.gmaxForms;

  document.getElementById('battleForms').textContent =
    pokemon.battleForms;

  renderStats(pokemon.stats);
}

function renderStats(stats){

  const statsContainer =
    document.getElementById('statsContainer');

  statsContainer.innerHTML = '';

  const labels = {
    hp:'HP',
    atk:'Attack',
    def:'Defense',
    spa:'Sp. Atk',
    spd:'Sp. Def',
    spe:'Speed'
  };

  for(const key in stats){

    const value = stats[key];

    const row = document.createElement('div');

    row.className = 'stat-row';

    row.innerHTML = `
      <div class="stat-label">${labels[key]}</div>

      <div class="stat-value">${value}</div>

      <div class="stat-bar-bg">
        <div
          class="stat-bar"
          style="
            width:${Math.min(value / 180 * 100,100)}%;
            background:${getStatColor(value)};
          "
        ></div>
      </div>
    `;

    statsContainer.appendChild(row);
  }
}

function getStatColor(value){

  if(value < 50) return '#ef4444';

  if(value < 80) return '#f59e0b';

  if(value < 110) return '#84cc16';

  return '#22c55e';
}

function capitalize(text){

  return text.charAt(0).toUpperCase()
    + text.slice(1);
}

closeModal.addEventListener('click',()=>{
  modal.classList.add('hidden');
});

modal.addEventListener('click',(e)=>{

  if(e.target === modal){

    modal.classList.add('hidden');
  }
});

searchInput.addEventListener('input',()=>{

  const value =
    searchInput.value.toLowerCase();

  grid.innerHTML = '';

  allPokemon
    .filter(pokemon=>
      pokemon.name.includes(value)
      || pokemon.id.toString().includes(value)
    )
    .forEach(createCard);
});

fetchPokemon();
