import AuthScreen from "@/components/authScreen";

export const metadata = {
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <AuthScreen onboarding />;
}
