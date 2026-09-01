import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [jogo, setJogo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modo, setModo] = useState("diario");
  const [resposta, setResposta] = useState("");
  const [tentativas, setTentativas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState(0);
  const [acertou, setAcertou] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [estatisticas, setEstatisticas] = useState(() => {
    const dadosSalvos = localStorage.getItem("gamedle-estatisticas");

    if (dadosSalvos) {
      return JSON.parse(dadosSalvos);
    }

    return {
      jogos: 0,
      vitorias: 0,
      sequencia: 0,
      melhorSequencia: 0
    };
  });
  const [dataDesafio, setDataDesafio] = useState("");
  const [mostrarAjuda, setMostrarAjuda] = useState(false);


  async function carregarJogo(url) {
    setCarregando(true);
    setErro("");
    setMensagem("");
    setResposta("");
    setTentativas([]);
    setErros(0);
    setAcertou(false);
    setFinalizado(false);
    setDataDesafio("");

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Não foi possível carregar o jogo.");
      }

      const data = await response.json();
      
      setJogo(data.jogo);
      setDataDesafio(data.data);
    } catch (error) {
      setErro("Não foi possível carregar o novo jogo.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    async function carregarJogoDiario() {
      try {
        const response = await fetch(
          `${API_URL}/api/games/daily`
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

  useEffect(() => {
    if (!dataDesafio) {
      return;
    }

    const chave = `gamedle-diario-${dataDesafio}`;
    const resultadoSalvo = localStorage.getItem(chave);

    if (!resultadoSalvo) {
      return;
    }

    const resultado = JSON.parse(resultadoSalvo);

    setTentativas(resultado.tentativas);
    setErros(resultado.erros);
    setAcertou(resultado.acertou);
    setFinalizado(true);
    setMensagem(resultado.mensagem);
  }, [dataDesafio]);

  function registrarResultado(vitoria) {
    setEstatisticas((atual) => {
      const novaSequencia = vitoria ? atual.sequencia + 1 : 0;

      const novasEstatisticas = {
        jogos: atual.jogos + 1,
        vitorias: vitoria ? atual.vitorias + 1 : atual.vitorias,
        sequencia: novaSequencia,
        melhorSequencia: Math.max(
          atual.melhorSequencia,
          novaSequencia
        )
      };

      localStorage.setItem(
        "gamedle-estatisticas",
        JSON.stringify(novasEstatisticas)
      );

      return novasEstatisticas;
    });
  }

  function salvarResultadoDiario(dados) {
    if (modo !== "diario" || !dataDesafio) {
      return;
    }

    const chave = `gamedle-diario-${dataDesafio}`;

    localStorage.setItem(
      chave,
      JSON.stringify(dados)
    );
  }

  function enviarResposta(event) {
    event.preventDefault();

    if (finalizado) {
      return;
    }

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
      const mensagemFinal = `🎉 Você acertou! O jogo era ${jogo.titulo}.`;

      setAcertou(true);
      setFinalizado(true);
      registrarResultado(true);
      setMensagem(mensagemFinal);

      salvarResultadoDiario({
        tentativas: novasTentativas,
        erros,
        acertou: true,
        mensagem: mensagemFinal
      });
    } else {
      setErros((valorAtual) => valorAtual + 1);

      if (novasTentativas.length >= 6) {
        const mensagemFinal = `Fim de jogo. A resposta era ${jogo.titulo}.`;
        const errosFinais = erros + 1;

        setErros(errosFinais);
        setFinalizado(true);
        registrarResultado(false);
        setMensagem(mensagemFinal);

        salvarResultadoDiario({
          tentativas: novasTentativas,
          erros: errosFinais,
          acertou: false,
          mensagem: mensagemFinal
        });
      } else {
        setMensagem("Ainda não. Tente novamente.");
      }
    }
  }

  function iniciarNovaRodada() {
    setResposta("");
    setTentativas([]);
    setMensagem("");
    setErros(0);
    setAcertou(false);
    setFinalizado(false);
  }

  async function compartilharResultado() {
    const pontuacao = Math.max(0, 100 - erros * 20);

    const resultado = [
      "🎮 Gamedle",
      modo === "diario" ? "Desafio diário" : "Modo livre",
      `${acertou ? "✅" : "❌"} ${tentativas.length}/6`,
      `🏆 Pontuação: ${pontuacao}`
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Meu resultado no Gamedle",
          text: resultado
        });

        return;
      }

      await navigator.clipboard.writeText(resultado);
      setMensagem("Resultado copiado para a área de transferência!");
    } catch (error) {
      setMensagem("Não foi possível compartilhar o resultado.");
    }
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
          <button
            type="button"
            className="small-button"
            onClick={() => setMostrarAjuda(true)}
            aria-label="Como jogar"
          >
            ?
          </button>
          <button type="button" className="small-button">
            ◐
          </button>
        </div>
      </header>

      {mostrarAjuda && (
        <div
          className="modal-backdrop"
          onClick={() => setMostrarAjuda(false)}
        >
          <section
            className="help-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setMostrarAjuda(false)}
              aria-label="Fechar instruções"
            >
              ×
            </button>

            <p className="eyebrow">Como jogar</p>

            <h2 id="help-title">Descubra o videogame</h2>

            <ol className="instructions-list">
              <li>A imagem começa borrada.</li>
              <li>Digite o nome de um videogame.</li>
              <li>Você tem seis tentativas.</li>
              <li>A cada erro, a imagem fica mais nítida.</li>
              <li>Cada erro reduz sua pontuação.</li>
              <li>Acerte com menos erros para conseguir mais pontos.</li>
            </ol>

            <button
              type="button"
              className="primary-button full-width"
              onClick={() => setMostrarAjuda(false)}
            >
              Entendi
            </button>
          </section>
        </div>
      )}

      <main className="game-container">
        <section className="game-heading">
          <p className="eyebrow">Desafio de videogames</p>

          <h1>Qual jogo é esse?</h1>

          <p className="game-description">
            A imagem começa borrada. A cada erro, ela fica mais nítida, mas sua pontuação diminui.
          </p>
        </section>

        <section className="game-cover">
          <img
            className={acertou ? "game-cover-image revealed" : "game-cover-image"}
            src={jogo.coverUrl}
            alt="Capa borrada do jogo do desafio"
            style={{
              filter: `blur(${Math.max(0, 18 - erros * 3)}px)`
            }}
          />
        </section>

        <section className="mode-switcher">
          <button
            type="button"
            className={modo === "diario" ? "mode-button active" : "mode-button"}
            onClick={() => {
              setModo("diario");
              carregarJogo(`${API_URL}/api/games/daily`);
            }}
          >
            📅 Modo diário
          </button>

          <button
            type="button"
            className={modo === "livre" ? "mode-button active" : "mode-button"}
            onClick={() => {
              setModo("livre");
              carregarJogo(`${API_URL}/api/games/free`);
            }}
          >
            ♾️ Modo livre
          </button>
        </section>

        {finalizado && (
          <section className="result-panel">
            <div className="result-icon">
              {acertou ? "🏆" : "😅"}
            </div>

            <p className="eyebrow">
              {acertou ? "Parabéns!" : "Rodada encerrada"}
            </p>

            <h2>
              {acertou ? "Você acertou!" : "Não foi dessa vez"}
            </h2>

            <p className="result-message">
              O jogo era:
            </p>

            <strong className="result-title">
              {jogo.titulo}
            </strong>

            <div className="result-grid">
              <div>
                <strong>{tentativas.length}/6</strong>
                <span>Tentativas</span>
              </div>

              <div>
                <strong>
                  {Math.max(0, 100 - erros * 20)}
                </strong>
                <span>Pontuação</span>
              </div>
            </div>

            <button
              type="button"
              className="secondary-button full-width"
              onClick={compartilharResultado}
            >
              Compartilhar resultado
            </button>
          </section>
        )}

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
            <strong>{Math.max(0, 100 - erros * 20)}</strong>
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
              disabled={finalizado}
            />

            <button
              className="primary-button"
              type="submit"
              disabled={finalizado}
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

        <section className="section statistics-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">Seu desempenho</p>
              <h2>Estatísticas</h2>
            </div>
          </div>

          <div className="statistics-grid">
            <div className="statistic-card">
              <strong>{estatisticas.jogos}</strong>
              <span>Jogos</span>
            </div>

            <div className="statistic-card">
              <strong>{estatisticas.vitorias}</strong>
              <span>Vitórias</span>
            </div>

            <div className="statistic-card">
              <strong>{estatisticas.sequencia}</strong>
              <span>Sequência atual</span>
            </div>

            <div className="statistic-card">
              <strong>{estatisticas.melhorSequencia}</strong>
              <span>Melhor sequência</span>
            </div>
          </div>
        </section>

        <button
          type="button"
          className="secondary-button full-width"
          onClick={() =>
            modo === "livre"
              ? carregarJogo(`${API_URL}/api/games/free`)
              : iniciarNovaRodada()
          }
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