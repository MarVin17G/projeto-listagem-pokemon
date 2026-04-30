document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // 🌙 TEMA
  // =====================
  const botaoAlterarTema = document.getElementById("botao-alterar-tema");
  const imagemBotaoTrocaDeTema = document.querySelector(".imagem-botao");
  const body = document.querySelector("body");

  botaoAlterarTema.addEventListener("click", () => {
    const modoEscuroAtivo = body.classList.contains("modo-escuro");
    body.classList.toggle("modo-escuro");

    imagemBotaoTrocaDeTema.setAttribute(
      "src",
      modoEscuroAtivo
        ? "./src/imagens/sun.png"
        : "./src/imagens/moon.png"
    );
  });

  // =====================
  // 📦 MODAL
  // =====================
  const modal = document.getElementById("pokemonModal");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");

  function openModal(pokemon) {
  modal.style.display = "flex";

  modalBody.innerHTML = `
    <h2>${pokemon.name}</h2>
    <img src="${pokemon.image}" width="120" alt="${pokemon.name}">
    
    <p><strong>Tipo:</strong> ${pokemon.type}</p>

    <h3>Stats</h3>

    ${criarBarra("HP", pokemon.stats.hp, "grass")}
    ${criarBarra("Attack", pokemon.stats.attack, "fire")}
    ${criarBarra("Defense", pokemon.stats.defense, "water")}

    <p>${pokemon.description}</p>
  `;

  animarBarras();
}

  // fechar modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // =====================
  // 📊 BARRAS
  // =====================
  function criarBarra(nome, valor, tipo) {
    const v = Math.min(valor ?? 0, 100);

    return `
      <div class="stat">
        <span>${nome}: ${valor ?? 0}</span>
        <div class="barra">
          <div class="barra-preenchimento ${tipo || "normal"}"
               data-width="${v}">
          </div>
        </div>
      </div>
    `;
  }

  function animarBarras() {
    const barras = document.querySelectorAll(".barra-preenchimento");

    barras.forEach(barra => {
      const largura = barra.getAttribute("data-width");
      barra.style.width = largura + "%";
    });
  }

  // =====================
  // 🚀 API + CARDS
  // =====================
  const lista = document.querySelector(".listagem-pokemon");

  function criarPokemon(pokemon) {
    try {
      const li = document.createElement("li");
      li.classList.add("card-pokemon");

      const nome = pokemon.name || "Desconhecido";
      const id = pokemon.id || 0;

      const imagem =
        pokemon?.sprites?.other?.showdown?.front_default ||
        pokemon?.sprites?.front_default ||
        "";

      const tipos = (pokemon.types || []).map(t => t.type.name);

      const hp = pokemon?.stats?.[0]?.base_stat || 0;
      const attack = pokemon?.stats?.[1]?.base_stat || 0;
      const defense = pokemon?.stats?.[2]?.base_stat || 0;

      const tipoPrincipal = tipos[0] || "normal";

      li.classList.add(tipoPrincipal);

      li.innerHTML = `
        <div class="informacoes">
          <span>${nome}</span>
          <span>#${id}</span>
        </div>

        <img src="${imagem}" class="gif"/>

        <ul class="tipos">
          ${tipos.map(t => `<li class="tipo ${t}">${t}</li>`).join("")}
        </ul>

        <p class="descricao">Pokémon da PokéAPI</p>
      `;

     li.addEventListener("click", () => {
  openModal({
    name: nome,
    image: imagem,
    type: tipos.join(", "),
    description: `ID: ${id}`,
    stats: {
      hp: hp,
      attack: attack,
      defense: defense
    }
  });
});
      lista.appendChild(li);

    } catch (erro) {
      console.error("Erro ao criar pokemon:", erro);
    }
  }

  // =====================
  // 🔄 CARREGAR POKÉMONS
  // =====================
  for (let i = 1; i <= 150; i++) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
      .then(res => res.json())
      .then(data => criarPokemon(data))
      .catch(err => console.error("Erro na API:", err));
  }

  // =====================
  // 🔎 BUSCA + FILTRO
  // =====================
  const inputBusca = document.getElementById("input-busca");
  const filtro = document.getElementById("filtro-tipo");

  function aplicarFiltros() {
    const valorBusca = inputBusca.value.toLowerCase();
    const valorFiltro = filtro.value;

    const cards = document.querySelectorAll(".card-pokemon");

    cards.forEach(card => {
      const nome = card
        .querySelector(".informacoes span")
        .innerText.toLowerCase();

      const tipos = [...card.querySelectorAll(".tipo")]
        .map(t => t.classList[1]);

      const matchBusca = nome.includes(valorBusca);
      const matchFiltro =
        valorFiltro === "all" || tipos.includes(valorFiltro);

      card.style.display = matchBusca && matchFiltro ? "flex" : "none";
    });
  }

  inputBusca.addEventListener("input", aplicarFiltros);
  filtro.addEventListener("change", aplicarFiltros);

});