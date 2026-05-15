const grid=document.getElementById('pokemonGrid');
const searchInput=document.getElementById('searchInput');

function render(list){
grid.innerHTML='';
list.forEach(pokemon=>{
const card=document.createElement('div');
card.className='card';
card.innerHTML=`
<div class="id">#${pokemon.id}</div>
<h2>${pokemon.name}</h2>
<div class="types">
${pokemon.types.map(type=>`<span class="type ${type.toLowerCase()}">${type}</span>`).join('')}
</div>`;
grid.appendChild(card);
});
}

searchInput.addEventListener('input',()=>{
const value=searchInput.value.toLowerCase();
render(pokemonData.filter(p=>p.name.toLowerCase().includes(value)||p.id.includes(value)));
});

render(pokemonData);
