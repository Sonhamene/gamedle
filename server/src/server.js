import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
    const jogo = await prisma.game.findFirst({
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

    if (!jogo) {
      return res.status(404).json({
        error: "Nenhum jogo disponível para o desafio diário."
      });
    }

    res.json({
      modo: "diario",
      data: new Date().toISOString().slice(0, 10),
      jogo: formatarJogo(jogo)
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

    const jogoAleatorio = jogos[
      Math.floor(Math.random() * jogos.length)
    ];

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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});