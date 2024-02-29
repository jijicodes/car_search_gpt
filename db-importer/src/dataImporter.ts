import * as fs from 'fs';
import { parse } from 'csv-parse';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type CarDataRow = [
  year: string,
  make: string,
  model: string,
  bodyStyles: string,
];
type ParsedCarDataRow = {
  year: number;
  make: string;
  model: string;
  bodyStyles: string[];
};

(async () => {
  const db = await open({
    filename: './CarsDatabase/carsDatabase.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
        DROP TABLE IF EXISTS Makes;
        DROP TABLE IF EXISTS Models;
        DROP TABLE IF EXISTS Years;

      CREATE TABLE IF NOT EXISTS Makes (
          id integer PRIMARY KEY AUTOINCREMENT,
          make varchar,
          UNIQUE(make)
      );
      CREATE TABLE IF NOT EXISTS Models (
          id integer PRIMARY KEY AUTOINCREMENT,
          make_id integer,
          model varchar,
          UNIQUE(model)
      );
      CREATE TABLE IF NOT EXISTS Years (
          id integer PRIMARY KEY AUTOINCREMENT,
          model_id integer,
          year integer,
          body_styles text
      );
  `);

  const START_YEAR = 2020;
  // const END_YEAR = 2026;
  const END_YEAR = 2026;
  const DATA_PATH = './carData/';

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    fs.createReadStream(`${DATA_PATH}${year}.csv`)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', async function ([year, make, model, bodyStyles]: CarDataRow) {
        const parsedCar: ParsedCarDataRow = {
          year: Number(year),
          make,
          model,
          // unreleased cars will have a bodystyles of empty string so for now we can
          // say they have no body styles for data consistency sake
          bodyStyles: bodyStyles === '' ? [] : JSON.parse(bodyStyles),
        };

        const { lastID: make_id } = await db.run(
          `INSERT OR IGNORE INTO Makes (make) VALUES (?);
          SELECT id FROM Makes WHERE make=? LIMIT 1;`,
          parsedCar.make
        );

        const { lastID: model_id } = await db.run(
          `INSERT OR IGNORE INTO Models (make_id, model) VALUES (:make_id, :model);
            SELECT id FROM Models WHERE model= :model LIMIT 1;`,
          { ':make_id': make_id, ':model': parsedCar.model }
        );

        const yearResp = await db.run(
          `INSERT OR IGNORE INTO Years (model_id, year, body_styles) VALUES (:model_id, :year, :body_styles);`,
          {
            ':model_id': model_id,
            ':year': parsedCar.year,
            ':body_styles': JSON.stringify(parsedCar.bodyStyles),
          }
        );

        console.log(yearResp);
      })
      .on('error', function (error: any) {
        console.log(error.message);
      })
      .on('end', function () {
        console.log('finished');
      });
  }
})();
