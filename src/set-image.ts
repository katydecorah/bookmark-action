import { exportVariable, info } from "@actions/core";
import { slugify } from "./utils";
import fetch from "node-fetch";

function handleMimeType(type: string) {
  const matches = type.match("(jpe?g)|(png|svg|gif|webp)");
  // TO DO: Refactor
  return matches ? matches[0].replace("jpeg", "jpg") : "jpg";
}

export async function setImage(result): Promise<string | undefined> {
  if (!result.ogImage || !result.ogTitle) return;
  const image = Array.isArray(result.ogImage)
    ? result.ogImage[0]
    : result.ogImage;
  if (!image.url) return;
  const imageType = image.type ? `.${handleMimeType(image.type)}` : ".jpg";
  const imageName = `bookmark-${slugify(result.ogTitle)}${imageType}`;

  const response = await fetch(image.url);
  if (!response.ok) {
    info(`Image ${image.url} is broken. Skipping...`);
    return undefined;
  }

  exportVariable("BookmarkImageOutput", imageName);
  exportVariable("BookmarkImage", image.url);
  return imageName;
}
