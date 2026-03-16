import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!googleClientId) {
  // Helps catch misconfigured Vite env without impacting UI.
  // eslint-disable-next-line no-console
  console.error("Missing VITE_GOOGLE_CLIENT_ID. Restart the dev server after updating Frontend/.env.");
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
);
