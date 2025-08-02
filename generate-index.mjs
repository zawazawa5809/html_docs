// generate-index.mjs
import { readdir, writeFile } from "node:fs/promises";
import { basename } from "node:path";

async function main() {
  const files = (await readdir("pages"))
    .filter((f) => f.endsWith(".html"))
    .sort(); // 名前順（YYYY-MM-DD-... 形式なら時系列になる）

  const listItems = files
    .map((f) => {
      const title = f
        .replace(/^\d{4}-\d{2}-\d{2}-/, "")
        .replace(/\.html$/, "")
        .replace(/-/g, " ");
      return `<li><a href="pages/${encodeURIComponent(
        f
      )}">${title}</a> <small>(${f})</small></li>`;
    })
    .join("\n    ");

  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>LLM Explain Pages</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body {font-family: system-ui,-apple-system,BlinkMacSystemFont,sans-serif; padding:2rem; max-width:900px; margin:auto;}
    h1 {margin-bottom:.5rem;}
    ul {padding:0; list-style:none;}
    li {margin:.6rem 0;}
    small {color:#666;}
    nav {margin-top:2rem; font-size:.9em;}
  </style>
</head>
<body>
  <h1>📝 LLM Explain Pages</h1>
  <p>自動生成された単一 HTML 解説ページ一覧。</p>
  <ul>
    ${listItems}
  </ul>
  <nav>
    <p>更新日時: ${new Date().toLocaleString("ja-JP")}</p>
  </nav>
</body>
</html>`;

  await writeFile("index.html", html);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
