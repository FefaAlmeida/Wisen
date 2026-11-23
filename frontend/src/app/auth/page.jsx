import AuthScreen from "@/components/authScreen";

export const metadata = {
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default async function AuthPage({ searchParams }) {
  const params = await searchParams;
  const action = ["forgot", "reset"].includes(params?.action) ? params.action : null;
  const token = typeof params?.token === "string" ? params.token : "";
  return <AuthScreen action={action} token={token} />;
}
