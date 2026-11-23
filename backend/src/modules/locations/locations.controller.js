import { z } from "zod";

export function locationsController(app, pool) {
  app.get(
    "/api/locations/options",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Localização"],
        response: {
          200: z.object({
            locations: z.array(
              z.object({
                countryCode: z.string(),
                countryName: z.string(),
                stateId: z.number().int().nullable(),
                stateName: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async () => ({
      locations: (
        await pool.query(
          `SELECT countries.code AS "countryCode", countries.name AS "countryName",
              states.id AS "stateId", states.name AS "stateName"
       FROM countries LEFT JOIN states ON states.country_code = countries.code
       ORDER BY COALESCE(states.name, countries.name), countries.name`,
        )
      ).rows,
    }),
  );

  app.get(
    "/api/locations/countries",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Localização"],
        response: {
          200: z.object({
            countries: z.array(
              z.object({ code: z.string(), name: z.string(), hasStates: z.boolean() }),
            ),
          }),
        },
      },
    },
    async () => ({
      countries: (
        await pool.query(
          `SELECT code, name, EXISTS (SELECT 1 FROM states WHERE country_code = countries.code) AS "hasStates"
         FROM countries ORDER BY name`,
        )
      ).rows,
    }),
  );

  app.get(
    "/api/locations/countries/:countryCode/states",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Localização"],
        params: z.object({ countryCode: z.string().regex(/^[A-Z]{2}$/) }),
        response: {
          200: z.object({
            states: z.array(
              z.object({ id: z.number().int(), code: z.string().nullable(), name: z.string() }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const countryCode = request.params.countryCode;
      const country = await pool.query("SELECT 1 FROM countries WHERE code = $1", [countryCode]);
      if (!country.rowCount) return reply.code(404).send({ message: "País não encontrado" });
      return {
        states: (
          await pool.query(
            "SELECT id, code, name FROM states WHERE country_code = $1 ORDER BY name",
            [countryCode],
          )
        ).rows,
      };
    },
  );
}
