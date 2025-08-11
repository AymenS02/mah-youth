import { Suspense } from "react";
import Header from "/components/header/Header";
import LoginForm from "./LoginForm";

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
