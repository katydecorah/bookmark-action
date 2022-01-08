import { readFileSync, writeFileSync } from "fs";
import { version } from "../package.json";
import { load } from "js-yaml";

function writeDocs(doc, name) {
  const readme = readFileSync("./README.md", "utf-8");
  const comment = {
    start: `<!-- START GENERATED ${name} -->`,
    end: `<!-- END GENERATED ${name} -->`,
  };

  const regex = new RegExp(`${comment.start}([\\s\\S]*?)${comment.end}`, "gm");
  const oldFile = readme.match(regex);
  const newFile = readme.replace(
    oldFile,
    `${comment.start}
${doc}
${comment.end}`
  );
  writeFileSync("./README.md", newFile);
}

// SETUP
let yml = readFileSync("./.github/workflows/recipe.yml", "utf8");
// TODO: clean this up!
writeDocs(
  `\`\`\`yml
${yml
  .replace("uses: ./", `uses: katydecorah/bookmark-action@${version}`)
  .replace(/recipe/g, "bookmark")}
\`\`\`
`,
  "SETUP"
);

// INPUT
const { inputs } = load(readFileSync("./action.yml", "utf8"));
const docs = Object.keys(inputs)
  .map(
    (key) =>
      `- \`${key}\`: ${inputs[key].required ? "Required. " : ""}${
        inputs[key].description
      }${inputs[key].default ? ` Default: \`${inputs[key].default}\`.` : ""}\n`
  )
  .join("");
writeDocs(docs, "OPTIONS");
