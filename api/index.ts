import fastify from "fastify";
import cors from "@fastify/cors";
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

type MakeRow = {
  id: number;
  make: string;
};

type CarRow = {
  year: number;
  model: string;
  make: string;
};

(async () => {
  const db = await open({
    filename: "../carsDatabase.db",
    driver: sqlite3.Database,
  });

  const server = fastify();
  await server.register(cors, {
    origin: "*",
  });

  server.get("/make", async (req) => {
    const sortDirection: "ASC" | "DESC" =
      // @ts-ignore
      req.query?.sort && ["ASC", "DESC", "asc", "desc"].includes(req.query.sort)
        ? // @ts-ignore
          req.query.sort.toUpperCase()
        : "ASC";
    return db
      .all<MakeRow[]>(`SELECT * FROM Makes ORDER BY make ${sortDirection};`)
      .then((makes) => makes.map(({ make }) => make));
  });

  server.get<{
    Params: {
      make: string;
    };
  }>("/make/:make", async (request) => {
    return db.all<MakeRow[]>(
      `SELECT Makes.make, Models.model, Years.year, Years.body_styles FROM Makes  
      JOIN Models ON Makes.id = Models.make_id  
      JOIN Years ON Models.id = Years.model_id
      WHERE make = ? COLLATE NOCASE;`,
      request.params.make
    );
  });

  server.get<{
    Params: {
      make: string;
      model: string;
    };
  }>("/make/:make/:model", async (request) => {
    return db.get<MakeRow[]>(
      `SELECT Makes.make, Models.model, Years.year, Years.body_styles FROM Makes  
        JOIN Models ON Makes.id = Models.make_id  
        JOIN Years ON Models.id = Years.model_id
        WHERE make = ? COLLATE NOCASE AND Models.model = ? COLLATE NOCASE;`,
      request.params.make || "",
      request.params.model || ""
    );
  });

  // /models?year=2021&bodyStyles=suv
  server.get<{
    Querystring: {
      year: string;
    };
  }>("/models", async (request) => {
    const year = Number(request.query.year) || undefined;

    console.log({ year });
    return year
      ? db.all<CarRow[]>(
          `SELECT Years.year, Makes.make, Models.model FROM Makes
      JOIN Models ON Makes.id = Models.make_id
      JOIN Years ON Models.make_id = Years.model_id
      WHERE year = ?;`,
          year
        )
      : db.all<CarRow[]>(
          `SELECT Years.year, Makes.make, Models.model FROM Makes
      JOIN Models ON Makes.id = Models.make_id
      JOIN Years ON Models.make_id = Years.model_id;`
        );
  });

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
