import LoginClient from "@/components/login/LoginClient";

export const metadata = {
  title: "লগইন | আমার রক্ত",
  description:
    "আমার রক্ত অ্যাকাউন্টে লগইন করে ডোনার প্রোফাইল, রক্তের অনুরোধ এবং জরুরি যোগাযোগ পরিচালনা করুন।",
};

export default function LoginPage() {
  return <LoginClient />;
}
