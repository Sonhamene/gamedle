import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jogo, setJogo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modo, setModo] = useState("diario");
  const [dicasVisiveis, setDicasVisiveis] = useState([0]);
  const [resposta, setResposta] = useState("");
  const [tentativas, setTentativas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState(0);
  const [acertou, setAcertou] = useState(false);

  useEffect(() => {
    async function carregarJogoDiario() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/games/daily"
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar o jogo.");
        }

        const data = await response.json();
        setJogo(data.jogo);
      } catch (error) {
        setErro("Não foi possível conectar com o servidor.");
      } finally {
        setCarregando(false);
      }
    }

    carregarJogoDiario();
  }, []);

  function revelarDica(index) {
    if (!dicasVisiveis.includes(index)) {
      setDicasVisiveis([...dicasVisiveis, index]);
    }
  }

function enviarResposta(event) {
  event.preventDefault();

  const respostaLimpa = resposta.trim();

  if (!respostaLimpa) {
    setMensagem("Digite uma resposta antes de tentar.");
    return;
  }

  if (tentativas.includes(respostaLimpa)) {
    setMensagem("Você já tentou essa resposta.");
    return;
  }

  const novasTentativas = [...tentativas, respostaLimpa];

  setTentativas(novasTentativas);
  setResposta("");

  const respostasAceitas = [
    jogo.titulo,
    ...(jogo.aliases || [])
  ].map((item) => item.toLowerCase());

  const respostaEstaCorreta = respostasAceitas.includes(
    respostaLimpa.toLowerCase()
  );

  if (respostaEstaCorreta) {
    setAcertou(true);
    setMensagem(`🎉 Você acertou! O jogo era ${jogo.titulo}.`);
  } else {
    setErros((valorAtual) => valorAtual + 1);

    if (novasTentativas.length >= 6) {
      setMensagem(`Fim de jogo. A resposta era ${jogo.titulo}.`);
    } else {
      setMensagem("Ainda não. Tente novamente.");
    }
  }
}

  function iniciarNovaRodada() {
    setDicasVisiveis([0]);
    setResposta("");
    setTentativas([]);
    setMensagem("");
    setErros(0);
    setAcertou(false);
  }

  if (carregando) {
    return (
      <div className="loading-screen">
        <h1>🎮 Gamedle</h1>
        <p>Carregando desafio...</p>
      </div>
    );
  }

  if (erro || !jogo) {
    return (
      <div className="loading-screen">
        <h1>😕 Ops!</h1>
        <p>{erro || "Jogo não encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="site-header">
        <a href="/" className="brand">
          <span className="brand-icon">🎮</span>
          <span className="brand-name">Gamedle</span>
        </a>

        <div className="header-actions">
          <button type="button" className="small-button">
            ?
          </button>

          <button type="button" className="small-button">
            ◐
          </button>
        </div>
      </header>

      <main className="game-container">
        <section className="game-heading">
          <p className="eyebrow">Desafio de videogames</p>

          <h1>Qual jogo é esse?</h1>

          <p className="game-description">
            Use as dicas para descobrir o videogame antes que suas tentativas acabem.
          </p>
        </section>

        <section className="game-cover">
  <img
    className={acertou ? "game-cover-image revealed" : "game-cover-image"}
    src={jogo.coverUrl}
    alt="Capa do jogo do desafio"
    style={{
      filter: `blur(${Math.max(0, 18 - erros * 3)}px)`
    }}
  />
</section>

        <section className="mode-switcher">
          <button
            type="button"
            className={modo === "diario" ? "mode-button active" : "mode-button"}
            onClick={() => setModo("diario")}
          >
            📅 Modo diário
          </button>

          <button
            type="button"
            className={modo === "livre" ? "mode-button active" : "mode-button"}
            onClick={() => setModo("livre")}
          >
            ♾️ Modo livre
          </button>
        </section>

        <section className="status-grid">
          <div className="status-card">
            <span>Modo atual</span>
            <strong>
              {modo === "diario" ? "Desafio diário" : "Modo livre"}
            </strong>
          </div>

          <div className="status-card">
            <span>Tentativas</span>
            <strong>{tentativas.length}/6</strong>
          </div>

          <div className="status-card">
            <span>Pontuação</span>
            <strong>{100 - Math.max(0, dicasVisiveis.length - 1) * 10}</strong>
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <div>
              <p className="eyebrow">Informações desbloqueáveis</p>
              <h2>Dicas</h2>
            </div>

            <span>{dicasVisiveis.length}/6 reveladas</span>
          </div>

          <div className="hints-list">
            {jogo.dicas.map((dica, index) => {
              const visivel = dicasVisiveis.includes(index);

              return (
                <article
                  className={visivel ? "hint-card revealed" : "hint-card"}
                  key={dica.ordem}
                >
                  <div className="hint-number">{index + 1}</div>

                  <div className="hint-content">
                    <h3>{dica.categoria}</h3>
                    <p>{visivel ? dica.texto : "Dica bloqueada"}</p>
                  </div>

                  <button
                    type="button"
                    className="hint-button"
                    onClick={() => revelarDica(index)}
                    disabled={visivel}
                  >
                    {visivel ? "Revelada" : "Revelar"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">Sua resposta</p>

          <h2>Digite um videogame</h2>

          <form className="guess-form" onSubmit={enviarResposta}>
            <input
              className="guess-input"
              type="text"
              placeholder="Ex.: Minecraft"
              value={resposta}
              onChange={(event) => setResposta(event.target.value)}
              disabled={tentativas.length >= 6}
            />

            <button
              className="primary-button"
              type="submit"
              disabled={tentativas.length >= 6}
            >
              Adivinhar
            </button>
          </form>

          {mensagem && <p className="feedback">{mensagem}</p>}
        </section>

        <section className="section">
          <div className="section-title">
            <div>
              <p className="eyebrow">Histórico da rodada</p>
              <h2>Suas tentativas</h2>
            </div>
          </div>

          <ol className="attempts-list">
            {Array.from({ length: 6 }).map((_, index) => (
              <li key={index} className="attempt-row">
                <span>{index + 1}</span>
                <strong>
                  {tentativas[index] || "Aguardando tentativa"}
                </strong>
              </li>
            ))}
          </ol>
        </section>

        <button
          type="button"
          className="secondary-button full-width"
          onClick={iniciarNovaRodada}
        >
          Nova rodada
        </button>
      </main>

      <footer className="site-footer">
        <p>Gamedle — adivinhe videogames famosos.</p>
      </footer>
    </div>
  );
}

export default App;