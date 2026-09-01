import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function obterDataDoBrasil() {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const ano = partes.find((parte) => parte.type === "year").value;
  const mes = partes.find((parte) => parte.type === "month").value;
  const dia = partes.find((parte) => parte.type === "day").value;

  return `${ano}-${mes}-${dia}`;
}

function formatarJogo(jogo) {
  return {
    id: jogo.id,
    titulo: jogo.title,
    coverUrl: jogo.coverUrl,
    aliases: jogo.aliases
      ? jogo.aliases.split(",").map((alias) => alias.trim())
      : [],
    anoLancamento: jogo.releaseYear,
    desenvolvedora: jogo.developer,
    publicadora: jogo.publisher,
    plataformas: jogo.platforms
      ? jogo.platforms.split(",").map((item) => item.trim())
      : [],
    genero: jogo.genres,
    descricao: jogo.description,
    dicas: jogo.hints.map((hint) => ({
      ordem: hint.position,
      categoria: hint.category,
      texto: hint.content
    }))
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API do Gamedle funcionando"
  });
});

app.get("/api/games/daily", async (req, res) => {
  try {
    const jogos = await prisma.game.findMany({
      where: {
        isActive: true,
        isDailyEligible: true
      },
      orderBy: {
        id: "asc"
      },
      include: {
        hints: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });

    if (jogos.length === 0) {
      return res.status(404).json({
        error: "Nenhum jogo disponível para o desafio diário."
      });
    }

    const dataAtual = obterDataDoBrasil();

    const inicioDoGamedle = Date.parse("2026-01-01T00:00:00Z");
    const dataDoDesafio = Date.parse(`${dataAtual}T00:00:00Z`);

    const quantidadeDeDias = Math.floor(
      (dataDoDesafio - inicioDoGamedle) / 86400000
    );

    const indiceDoJogo =
      ((quantidadeDeDias % jogos.length) + jogos.length) % jogos.length;

    const jogoDoDia = jogos[indiceDoJogo];

    res.json({
      modo: "diario",
      data: dataAtual,
      jogo: formatarJogo(jogoDoDia)
    });
  } catch (error) {
    console.error("Erro ao buscar jogo diário:", error);

    res.status(500).json({
      error: "Erro interno ao buscar o jogo diário."
    });
  }
});

app.get("/api/games/free", async (req, res) => {
  try {
    const jogos = await prisma.game.findMany({
      where: {
        isActive: true
      },
      include: {
        hints: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });

    if (jogos.length === 0) {
      return res.status(404).json({
        error: "Nenhum jogo disponível."
      });
    }

    const indiceAleatorio = Math.floor(Math.random() * jogos.length);
    const jogoAleatorio = jogos[indiceAleatorio];

    res.json({
      modo: "livre",
      jogo: formatarJogo(jogoAleatorio)
    });
  } catch (error) {
    console.error("Erro ao buscar jogo livre:", error);

    res.status(500).json({
      error: "Erro interno ao buscar jogo livre."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});