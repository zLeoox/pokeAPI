let enemigos = [];
let opciones = [];
let seleccionados = [];

// Elementos del DOM 
const enemigoTeamDiv = document.getElementById("enemigoTeam");
const siluetasDiv = document.getElementById("siluetas");
const resultadoDiv = document.getElementById("resultado");
const textoResultado = document.getElementById("textoResultado");
const btnBatallar = document.getElementById("btn_batallar");
const btnReiniciar = document.getElementById("btn_reiniciar");

// Obtener un Pokémon por ID
async function getPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await res.json();
}

// Obtener un número random entre 1 y 151
function getRandomId() {
  return Math.floor(Math.random() * 151) + 1;
}

// Mostrar imagen de Pokémon
function mostrarPokemon(poke, contenedor, silueta = false) {
  const img = document.createElement("img");
  img.src = poke.sprites.front_default;
  img.alt = poke.name;
  img.dataset.id = poke.id;

  if (silueta) {
    img.classList.add("silueta");
    img.addEventListener("click", () => {
      if (img.classList.contains("seleccionada")) {
        img.classList.remove("seleccionada");
        seleccionados = seleccionados.filter(id => id !== poke.id);
      } else if (seleccionados.length < 2) {
        img.classList.add("seleccionada");
        seleccionados.push(poke.id);
      }

      btnBatallar.disabled = seleccionados.length !== 2;
    });
  }

  contenedor.appendChild(img);
}

// Iniciar el juego
async function iniciarJuego() {
  enemigos = [];
  opciones = [];
  seleccionados = [];
  resultadoDiv.classList.add("d-none");
  enemigoTeamDiv.innerHTML = "";
  siluetasDiv.innerHTML = "";
  btnBatallar.disabled =true;

  // Enemigos
  for (let i = 0; i < 2; i++) {
    const poke = await getPokemon(getRandomId());
    enemigos.push(poke);
    mostrarPokemon(poke, enemigoTeamDiv);
  }

  // Opciones
  for (let i = 0; i < 5; i++) {
    const poke = await getPokemon(getRandomId());
    opciones.push(poke);
    mostrarPokemon(poke, siluetasDiv, true);
  }
}

// Calcular fuerza
function calcularFuerza(pokemones) {
  return pokemones.reduce((total, p) => {
    return total + p.stats[0].base_stat + p.stats[1].base_stat + p.stats[2].base_stat;
  }, 0);
}

// Batallar
async function batallar() {
  const misPokemones = [];

  for (let id of seleccionados) {
    const poke = await getPokemon(id);
    misPokemones.push(poke);
  }

  const fuerzaMia = calcularFuerza(misPokemones);
  const fuerzaEnemigo = calcularFuerza(enemigos);

  let resultado = "";

  if (fuerzaMia > fuerzaEnemigo) {
    resultado = "Ganaste la batalla";
  } else if (fuerzaMia < fuerzaEnemigo) {
    resultado = "Perdiste";
  } else {
    resultado = "Empate";
  }

  textoResultado.textContent = resultado;
  resultadoDiv.classList.remove("d-none");
}

btnBatallar.addEventListener("click", batallar);
btnReiniciar.addEventListener("click", iniciarJuego);

// Iniciar jueko
iniciarJuego();
