import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jogos = [
  {
    title: "Minecraft",
    normalizedTitle: "minecraft",
    coverUrl: "/covers/minecraft.jpg",
    aliases: "minecraft",
    releaseYear: 2011,
    developer: "Mojang Studios",
    publisher: "Mojang Studios",
    description:
      "Um jogo de construção e sobrevivência em um mundo formado por blocos.",
    platforms: "PC, PlayStation, Xbox, Nintendo Switch, Mobile",
    genres: "Sandbox, Sobrevivência",
    difficulty: "facil",
    isActive: true,
    isDailyEligible: true,
    hints: [
      {
        position: 1,
        category: "Gênero",
        content: "É um jogo de sandbox e sobrevivência."
      },
      {
        position: 2,
        category: "Ano de lançamento",
        content: "Foi lançado em 2011."
      },
      {
        position: 3,
        category: "Desenvolvedora",
        content: "Foi desenvolvido pela Mojang Studios."
      },
      {
        position: 4,
        category: "Plataformas",
        content: "Está disponível para PC, consoles e celulares."
      },
      {
        position: 5,
        category: "Descrição",
        content: "O jogador explora, coleta recursos, constrói e sobrevive."
      },
      {
        position: 6,
        category: "Dica final",
        content: "O mundo do jogo é formado por blocos."
      }
    ]
  },

  {
    title: "God of War",
    normalizedTitle: "god of war",
    coverUrl: "/covers/god-of-war.jpg",
    aliases: "god of war,godofwar",
    releaseYear: 2018,
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    description:
      "Uma aventura de ação acompanhando Kratos e seu filho em uma jornada pelos mundos nórdicos.",
    platforms: "PlayStation, PC",
    genres: "Ação, Aventura",
    difficulty: "normal",
    isActive: true,
    isDailyEligible: true,
    hints: [
      {
        position: 1,
        category: "Gênero",
        content: "É um jogo de ação e aventura."
      },
      {
        position: 2,
        category: "Ano de lançamento",
        content: "Foi lançado originalmente em 2018."
      },
      {
        position: 3,
        category: "Desenvolvedora",
        content: "Foi desenvolvido pela Santa Monica Studio."
      },
      {
        position: 4,
        category: "Plataformas",
        content: "Está disponível para PlayStation e PC."
      },
      {
        position: 5,
        category: "Descrição",
        content: "O protagonista viaja por diferentes mundos acompanhado de seu filho."
      },
      {
        position: 6,
        category: "Dica final",
        content: "O protagonista usa um machado mágico."
      }
    ]
  },

  {
    title: "The Legend of Zelda: Breath of the Wild",
    normalizedTitle: "the legend of zelda breath of the wild",
    coverUrl: "/covers/zelda-breath-of-the-wild.jpg",
    aliases: "zelda breath of the wild,botw",
    releaseYear: 2017,
    developer: "Nintendo",
    publisher: "Nintendo",
    description:
      "Uma aventura de mundo aberto no reino de Hyrule.",
    platforms: "Nintendo Switch, Wii U",
    genres: "Ação, Aventura",
    difficulty: "normal",
    isActive: true,
    isDailyEligible: true,
    hints: [
      {
        position: 1,
        category: "Gênero",
        content: "É um jogo de ação e aventura."
      },
      {
        position: 2,
        category: "Ano de lançamento",
        content: "Foi lançado em 2017."
      },
      {
        position: 3,
        category: "Desenvolvedora",
        content: "Foi desenvolvido pela Nintendo."
      },
      {
        position: 4,
        category: "Plataformas",
        content: "Foi lançado para Nintendo Switch e Wii U."
      },
      {
        position: 5,
        category: "Descrição",
        content: "O jogador explora um grande mundo aberto."
      },
      {
        position: 6,
        category: "Dica final",
        content: "A aventura acontece no reino de Hyrule."
      }
    ]
  },

    {
    title: "Super Mario Odyssey",
    normalizedTitle: "super mario odyssey",
    coverUrl: "/covers/super-mario-odyssey.jpg",
    aliases: "super mario odyssey,mario odyssey",
    releaseYear: 2017,
    developer: "Nintendo",
    publisher: "Nintendo",
    description:
      "Uma aventura de plataforma em 3D na qual Mario viaja por diferentes reinos.",
    platforms: "Nintendo Switch",
    genres: "Plataforma, Aventura",
    difficulty: "facil",
    isActive: true,
    isDailyEligible: true,
    hints: [
      {
        position: 1,
        category: "Gênero",
        content: "É um jogo de plataforma e aventura."
      },
      {
        position: 2,
        category: "Ano de lançamento",
        content: "Foi lançado em 2017."
      },
      {
        position: 3,
        category: "Desenvolvedora",
        content: "Foi desenvolvido pela Nintendo."
      },
      {
        position: 4,
        category: "Plataforma",
        content: "Foi lançado exclusivamente para Nintendo Switch."
      },
      {
        position: 5,
        category: "Descrição",
        content: "O protagonista viaja por vários reinos em uma aventura 3D."
      },
      {
        position: 6,
        category: "Dica final",
        content: "O protagonista usa um chapéu que possui poderes especiais."
      }
    ]
  },

  {
    title: "Grand Theft Auto V",
    normalizedTitle: "grand theft auto v",
    coverUrl: "/covers/grand-theft-auto-v.jpg",
    aliases: "gta v,gta 5,gta five,grand theft auto 5",
    releaseYear: 2013,
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    description:
      "Um jogo de ação em mundo aberto ambientado na cidade fictícia de Los Santos.",
    platforms: "PlayStation, Xbox, PC",
    genres: "Ação, Mundo aberto",
    difficulty: "normal",
    isActive: true,
    isDailyEligible: true,
    hints: [
      {
        position: 1,
        category: "Gênero",
        content: "É um jogo de ação em mundo aberto."
      },
      {
        position: 2,
        category: "Ano de lançamento",
        content: "Foi lançado originalmente em 2013."
      },
      {
        position: 3,
        category: "Desenvolvedora",
        content: "Foi desenvolvido pela Rockstar North."
      },
      {
        position: 4,
        category: "Plataformas",
        content: "Está disponível para PlayStation, Xbox e PC."
      },
      {
        position: 5,
        category: "Descrição",
        content: "A história acompanha três protagonistas em Los Santos."
      },
      {
        position: 6,
        category: "Dica final",
        content: "O jogo possui um modo online muito conhecido."
      }
    ]
  },

  {
    title: "The Witcher 3: Wild Hunt",
    normalizedTitle: "the witcher 3 wild hunt",
    coverUrl: "/covers/the-witcher-3.jpg",
    aliases: "the witcher 3,witcher 3,wild hunt",
    releaseYear: 2015,
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    description:
      "Um RPG de mundo aberto sobre um caçador de monstros em busca de sua filha adotiva.",
    platforms: "PC, PlayStation, Xbox, Nintendo Switch",
    genres: "RPG, Ação, Aventura",
    difficulty: "dificil",
    isActive: true,
    isDailyEligible: true,
    hints: [
      {
        position: 1,
        category: "Gênero",
        content: "É um RPG de ação e aventura."
      },
      {
        position: 2,
        category: "Ano de lançamento",
        content: "Foi lançado em 2015."
      },
      {
        position: 3,
        category: "Desenvolvedora",
        content: "Foi desenvolvido pela CD Projekt Red."
      },
      {
        position: 4,
        category: "Plataformas",
        content: "Está disponível para PC, consoles e Nintendo Switch."
      },
      {
        position: 5,
        category: "Descrição",
        content: "O protagonista percorre um grande mundo aberto caçando monstros."
      },
      {
        position: 6,
        category: "Dica final",
        content: "O protagonista é conhecido como um bruxo."
      }
    ]
  }

];

async function main() {
  for (const jogo of jogos) {
    const { hints, ...dadosDoJogo } = jogo;

    const jogoCriado = await prisma.game.upsert({
      where: {
        normalizedTitle: dadosDoJogo.normalizedTitle
      },
      update: {
        ...dadosDoJogo,
        hints: {
          deleteMany: {},
          create: hints
        }
      },
      create: {
        ...dadosDoJogo,
        hints: {
          create: hints
        }
      }
    });

    console.log(`Jogo criado ou atualizado: ${jogoCriado.title}`);
  }
}

main()
    .catch((error) => {
        console.error("Erro ao inserir jogo:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });