import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID;
        if (!liffId) throw new Error("VITE_LIFF_ID is not set");

        await liff.init({ liffId });
        setMessage("LIFF init succeeded.");

        // 未ログインならログインへ（戻ってきた後に再実行される）
        if (!liff.isLoggedIn()) {
          liff.login(); // redirect
          return;
        }

        // ここに来る時点で access_token があるはず
        const profile = await liff.getProfile();
        setName(profile.displayName);

        // もしバックエンドAPIを使うなら
        // const token = liff.getAccessToken(); // Bearer に載せる
      } catch (e) {
        setMessage("LIFF init failed.");
        setError(String(e?.message ?? e));
        console.error(e);
      }
    })();
  }, []); // ← 依存配列を入れて初回だけ実行

  return (
    <div className="App">
      {message && <p>{message}</p>}
      {error && <p><code>{error}</code></p>}
      {name && <p>こんにちは、{name}さん</p>}
    </div>
  );
}

export default App;