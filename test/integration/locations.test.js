import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { buildApp } from "../../backend/src/app.js";
import { createPool } from "../../backend/src/database/index.js";
import { seedLocations } from "../../backend/src/database/seed-locations.js";

const pool = createPool(process.env.TEST_DATABASE_URL);
let app;
let cookie;
let userId;
before(async () => {
  app = await buildApp({
    pool,
    boss: null,
    config: { NODE_ENV: "test", FRONTEND_URL: "http://localhost:3000" },
    logger: false,
  });
  const registered = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    remoteAddress: "10.90.0.1",
    payload: {
      name: "Pessoa Localização",
      email: `location-${randomUUID()}@example.test`,
      password: "senha-segura-123",
    },
  });
  assert.equal(registered.statusCode, 201, registered.body);
  userId = registered.json().user.id;
  cookie = registered.headers["set-cookie"].split(";")[0];
});
after(async () => {
  await app?.close();
  if (userId) await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  await pool.end();
});
const request = (url, method = "GET", payload) =>
  app.inject({ url, method, payload, headers: { cookie } });

test("seed geográfico é repetível e preserva os IDs utilizados em perfis", async () => {
  const first = await seedLocations(pool);
  const second = await seedLocations(pool);
  assert.deepEqual(first, second);
  assert.ok(first.countries >= 240);
  assert.ok(first.states >= 3000);
  assert.equal(
    Number((await pool.query("SELECT count(*) FROM countries")).rows[0].count),
    first.countries,
  );
  assert.equal(
    Number((await pool.query("SELECT count(*) FROM states")).rows[0].count),
    first.states,
  );
  assert.equal(
    (await pool.query("SELECT name FROM states WHERE id = 2021 AND country_code = 'BR'")).rows[0]
      .name,
    "São Paulo",
  );
});

test("catálogo autenticado retorna países e apenas os estados do país solicitado", async () => {
  assert.equal((await app.inject({ url: "/api/locations/countries" })).statusCode, 401);
  const countries = await request("/api/locations/countries");
  assert.equal(countries.statusCode, 200, countries.body);
  assert.deepEqual(
    countries.json().countries.find((country) => country.code === "BR"),
    { code: "BR", name: "Brasil", hasStates: true },
  );
  const brazil = await request("/api/locations/countries/BR/states");
  assert.equal(brazil.statusCode, 200, brazil.body);
  assert.equal(brazil.json().states.length, 27);
  assert.ok(brazil.json().states.every((state) => state.code.startsWith("BR-")));
  assert.deepEqual((await request("/api/locations/countries/AI/states")).json(), { states: [] });
  assert.equal((await request("/api/locations/countries/ZZ/states")).statusCode, 404);
  assert.equal((await request("/api/locations/countries/invalid/states")).statusCode, 400);
  const options = await request("/api/locations/options");
  assert.equal(options.statusCode, 200, options.body);
  assert.ok(
    options
      .json()
      .locations.some(
        (location) =>
          location.stateId === 2021 &&
          location.stateName === "São Paulo" &&
          location.countryCode === "BR" &&
          location.countryName === "Brasil",
      ),
  );
  assert.ok(
    options
      .json()
      .locations.some((location) => location.countryCode === "AI" && location.stateId === null),
  );
});

test("perfil exige país válido e estado correspondente e não aceita cidades", async () => {
  const finish = { interests: ["Tecnologia", "Saúde", "Economia"], onboardingCompleted: true };
  assert.equal((await request("/api/auth/profile", "PUT", finish)).statusCode, 400);
  for (const location of [
    { countryCode: "ZZ", stateId: null },
    { countryCode: "BR", stateId: null },
    { countryCode: "US", stateId: 2021 },
    { countryCode: "BR", stateId: 99999999 },
    { countryCode: "BR", stateId: 2021, city: "São Paulo" },
    { countryCode: "BR", stateId: "2021" },
  ]) {
    const response = await request("/api/auth/profile", "PUT", {
      name: "Não deve salvar",
      location,
    });
    assert.equal(response.statusCode, 400, JSON.stringify(location));
  }
  const unchanged = (await request("/api/auth/profile")).json();
  assert.equal(unchanged.user.name, "Pessoa Localização");
  assert.equal(unchanged.location, null);
  const saved = await request("/api/auth/profile", "PUT", {
    name: "Nome Atualizado",
    location: { countryCode: "BR", stateId: 2021 },
  });
  assert.equal(saved.statusCode, 200, saved.body);
  assert.deepEqual((await request("/api/auth/profile")).json().location, {
    countryCode: "BR",
    stateId: 2021,
  });
  await seedLocations(pool);
  assert.deepEqual((await request("/api/auth/profile")).json().location, {
    countryCode: "BR",
    stateId: 2021,
  });
  assert.equal((await request("/api/auth/profile", "PUT", finish)).statusCode, 200);
  assert.equal(
    (await request("/api/auth/profile", "PUT", { location: { countryCode: "AI", stateId: null } }))
      .statusCode,
    200,
  );
  assert.deepEqual((await request("/api/auth/profile")).json().location, {
    countryCode: "AI",
    stateId: null,
  });
  await assert.rejects(
    pool.query("UPDATE users SET country_code = 'US', state_id = 2021 WHERE id = $1", [userId]),
    { code: "23503" },
  );
});
