import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    console.error("Faltam IGDB_CLIENT_ID ou IGDB_CLIENT_SECRET no .env");
    process.exit(1);
}

async function getAccessToken() {
    const res = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: IGDB_CLIENT_ID,
            client_secret: IGDB_CLIENT_SECRET,
            grant_type: "client_credentials",
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao obter token: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data.access_token;
}

async function queryIgdb(token, query) {
    const res = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
            "Client-ID": IGDB_CLIENT_ID,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: query,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro na query IGDB: ${res.status} ${text}`);
    }

    return res.json();
}

function normalizeGame(g) {
    return {
        title: g.name?.trim() || "Sem título",
        externalId: String(g.id),
        externalSource: "igdb",
        coverUrl: g.cover?.url
            ? `https:${g.cover.url.replace("t_thumb", "t_cover_big")}`
            : null,
        releaseYear: g.release_dates?.[0]?.year || null,
        developer:
            g.involved_companies
                ?.filter((c) => c.developer)
                .map((c) => c.company?.name)
                .join(", ") || null,
        platforms:
            g.platforms?.map((p) => p.name).join(", ") || "",
        genres:
            g.genres?.map((g) => g.name).join(", ") || "",
        isActive: true,
        isDailyEligible: true,
    };
}

async function main() {
    console.log("Gerando access token...");
    const token = await getAccessToken();

    // Busca jogos principais em algumas plataformas
    const query = `
    fields name,cover.url,release_dates.year,involved_companies.developer,company.name,platforms.name,genres.name;
    where category = 0 & platforms = (4,6,7,130);
    limit 100;
  `;

    console.log("Buscando jogos no IGDB...");
    const games = await queryIgdb(token, query);

    console.log(`Encontrados ${games.length} jogos.`);

    let criados = 0;
    let atualizados = 0;

    for (const g of games) {
        const data = normalizeGame(g);

        const existing = await prisma.game.findFirst({
            where: { externalId: data.externalId, externalSource: "igdb" },
        });

        if (existing) {
            await prisma.game.update({
                where: { id: existing.id },
                data,
            });
            atualizados++;
        } else {
            await prisma.game.create({ data });
            criados++;
        }
    }

    console.log(`Criados: ${criados}, Atualizados: ${atualizados}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });