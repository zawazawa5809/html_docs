// generate-index.mjs
import { readdir, writeFile } from "node:fs/promises";

function toTitle(filename) {
  return filename
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\.html$/, "")
    .replace(/-/g, " ");
}

async function main() {
  const files = (await readdir("pages"))
    .filter((f) => f.endsWith(".html"))
    .sort();

  const listCards = files
    .map((f) => {
      const title = toTitle(f);
      return `
      <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <h2 class="text-lg font-semibold mb-1">${title}</h2>
        <p class="text-xs text-gray-500 mb-2">${f}</p>
        <div class="flex gap-2">
          <a href="pages/${encodeURIComponent(
            f
          )}" class="text-blue-600 hover:underline">閲覧する →</a>
        </div>
      </div>
    `;
    })
    .join("\n");

  const now = new Date().toLocaleString("ja-JP");

  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>LLM Explain Pages</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* optional: カスタム微調整 */
    body {background: #f5f7fa;}
  </style>
</head>
<body class="antialiased text-gray-800">
  <div class="max-w-5xl mx-auto py-12 px-6">
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-2">📝 LLM Explain Pages</h1>
        <p class="mt-1 text-gray-500">単一 HTML 解説ページのカタログ（自動生成）</p>
      </div>
      <div>
        <a href="https://github.com/zawazawa5809/html_docs" class="inline-block bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition">
          GitHub を見る
        </a>
      </div>
    </header>

    <main class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${listCards}
    </main>

    <footer class="mt-12 text-sm text-gray-500 border-t pt-4 flex flex-col sm:flex-row justify-between">
      <div>最終更新: ${now}</div>
      <div><a href="https://github.com/your-name/llm-explain-pages" class="underline">改善や PR はこちら</a></div>
    </footer>
  </div>
</body>
</html>`;

  await writeFile("index.html", html);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
