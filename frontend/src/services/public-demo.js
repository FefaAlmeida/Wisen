import { categories } from "@/components/meuConhecimento/historicoDemo";
import { stories } from "@/data/noticiasDemo";

const demoProfile = {
  user: { id: "landing-preview", name: "Marina", email: "marina@example.com", role: "user" },
  preferences: {
    interests: [...new Set(stories.map(({ category }) => category))],
    notifications: { reviewReminders: true, weeklySummary: false },
  },
  avatarDataUrl: null,
};
let profile = demoProfile;
const dismissed = new Set();
const feed = stories.map((story) => ({ ...story, topics: [story.category] }));

function normalize(text) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");
}

function getFeed(params) {
  const topic = params.get("topic");
  const term = normalize(params.get("q")?.trim() ?? "");
  const items = feed.filter(
    (story) =>
      !dismissed.has(story.id) &&
      (!topic || story.category === topic) &&
      normalize([story.title, story.summary, ...story.concepts].join(" ")).includes(term),
  );
  const isRecent = params.get("order") === "recent";
  items.sort((a, b) => {
    const rank = (story) => Number(profile.preferences.interests.includes(story.category));
    return (isRecent ? 0 : rank(b) - rank(a)) || a.minutes - b.minutes;
  });
  const limit = Number(params.get("limit")) || 12;
  const start = ((Number(params.get("page")) || 1) - 1) * limit;
  return { items: items.slice(start, start + limit), hasMore: start + limit < items.length };
}

export function demoRequest(path, method, body) {
  const { pathname, searchParams } = new URL(path, "https://demo.invalid");
  switch (`${method} ${pathname}`) {
    case "GET /auth/session":
      return { user: profile.user };
    case "GET /auth/profile":
      return profile;
    case "PUT /auth/profile": {
      const { name = profile.user.name, email = profile.user.email, ...preferences } = body;
      profile = {
        ...profile,
        user: { ...profile.user, name, email },
        preferences: { ...profile.preferences, ...preferences },
      };
      return profile;
    }
    case "PUT /auth/avatar":
      profile = { ...profile, avatarDataUrl: body.avatarDataUrl };
      return profile;
    case "POST /auth/logout":
      profile = demoProfile;
      dismissed.clear();
      return null;
    case "GET /categories":
      return { categories };
    case "GET /feed":
      return getFeed(searchParams);
    case "POST /feed/interactions":
      dismissed.add(body.eventId);
      return null;
    default:
      throw new Error("Esta ação está disponível na sua conta Wisen.");
  }
}
