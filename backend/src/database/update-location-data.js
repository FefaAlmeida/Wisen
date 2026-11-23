import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const revision = process.argv[2];
if (!/^[a-f0-9]{40}$/.test(revision ?? "")) {
  throw new Error("Informe o SHA completo do commit da base geográfica.");
}
const base = `https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/${revision}/`;
async function download(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Falha ao baixar ${path}: HTTP ${response.status}`);
  return response.text();
}
const [rawCountries, rawStates, license, contents, unicode] = await Promise.all([
  download("json/countries.json"),
  download("json/states.json"),
  download("LICENSE"),
  download(".github/CONTENT_LICENSE"),
  download(".github/licenses/Unicode-3.0.txt"),
]);
const name = (item) => item.translations?.["pt-BR"] || item.translations?.pt || item.name;
const countries = JSON.parse(rawCountries)
  .map((item) => ({ code: item.iso2, name: name(item) }))
  .sort((a, b) => a.code.localeCompare(b.code));
const states = JSON.parse(rawStates)
  .filter((item) => String(item.level) === "1" || (item.level == null && !item.parent_id))
  .map((item) => ({
    id: item.id,
    countryCode: item.country_code,
    code: item.iso3166_2 || null,
    name: name(item),
  }))
  .sort((a, b) => a.id - b.id);
const codes = new Set(countries.map((country) => country.code));
if (
  countries.length < 200 ||
  states.length < 3000 ||
  codes.size !== countries.length ||
  new Set(states.map((state) => state.id)).size !== states.length ||
  states.some((state) => !codes.has(state.countryCode)) ||
  states.filter((state) => state.countryCode === "BR").length !== 27
) {
  throw new Error("A fonte não passou nas verificações de integridade. Revise antes de importar.");
}
const sha256 = (raw) => createHash("sha256").update(raw).digest("hex");
const data = {
  source: {
    repository: "https://github.com/dr5hn/countries-states-cities-database",
    revision,
    sha256: { countries: sha256(rawCountries), states: sha256(rawStates) },
  },
  countries,
  states,
};
const folder = new URL("../../data/locations/", import.meta.url);
await writeFile(new URL("data.json", folder), `${JSON.stringify(data, null, 2)}\n`);
await writeFile(new URL("LICENSE-ODbL.txt", folder), license);
await writeFile(new URL("LICENSE-CONTENTS.txt", folder), contents);
await writeFile(new URL("LICENSE-UNICODE.txt", folder), unicode);
console.log({ countries: countries.length, states: states.length, revision });
