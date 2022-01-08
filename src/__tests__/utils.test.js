import { setImage, getMetadata, titleParser, addBookmark } from "../utils.ts";
import pen15 from "./fixtures/pen15.json";
import soup from "./fixtures/slow-cooker-soup.json";
import { mockResolvedValueOnce } from "open-graph-scraper";
import fs from "fs";

jest.mock("open-graph-scraper");
jest.mock("fs");
jest.mock("@actions/core");

const newRecipe = {
  date: "2022-01-01",
  description:
    "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
  image:
    "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg",
  notes: "Delicious!",
  site: "NYT Cooking",
  title: "Slow-Cooker Cauliflower, Potato and White Bean Soup Recipe",
  type: "article",
  url: "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
};

describe("titleParser", () => {
  test("no date", () => {
    expect(
      titleParser(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d"
      )
    ).toEqual({
      date: "2022-01-04",
      url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    });
  });
  test("with date", () => {
    expect(
      titleParser(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d 2022-01-01"
      )
    ).toEqual({
      date: "2022-01-01",
      url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    });
  });
});

describe("addBookmark", () => {
  test("Add bookmark and sort by date", () => {
    jest.spyOn(fs, "readFileSync")
      .mockReturnValueOnce(`- title: Cornmeal Lime Shortbread Fans Recipe
  site: NYT Cooking
  date: '2021-01-03'
  url: https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
- title: Mini Meatball Soup With Broccoli and Orecchiette Recipe
  site: NYT Cooking
  date: '2022-03-27'
  url: >-
    https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette`);

    expect(addBookmark("recipes.yml", newRecipe)).toMatchInlineSnapshot(`
      Array [
        Object {
          "date": "2021-01-03",
          "site": "NYT Cooking",
          "title": "Cornmeal Lime Shortbread Fans Recipe",
          "url": "https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans",
        },
        Object {
          "date": "2022-01-01",
          "description": "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
          "image": "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg",
          "notes": "Delicious!",
          "site": "NYT Cooking",
          "title": "Slow-Cooker Cauliflower, Potato and White Bean Soup Recipe",
          "type": "article",
          "url": "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
        },
        Object {
          "date": "2022-03-27",
          "site": "NYT Cooking",
          "title": "Mini Meatball Soup With Broccoli and Orecchiette Recipe",
          "url": "https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette",
        },
      ]
    `);
  });
});

describe("getMetadata", () => {
  test("tv show", async () => {
    mockResolvedValueOnce({ result: pen15 });
    expect(
      await getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",

        date: "2022-01-01",
      })
    ).toMatchInlineSnapshot(`
      Object {
        "date": "2022-01-01",
        "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
        "image": "bookmark-pen15.jpg",
        "site": "Hulu",
        "title": "PEN15",
        "type": "tv_show",
        "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
      }
    `);
  });
  test("recipe, with note", async () => {
    mockResolvedValueOnce({ result: soup });
    expect(
      await getMetadata({
        url: "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
        body: "Delicious!",
        date: "2022-01-01",
      })
    ).toMatchInlineSnapshot(`
      Object {
        "date": "2022-01-01",
        "description": "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
        "image": "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg",
        "notes": "Delicious!",
        "site": "NYT Cooking",
        "title": "Slow-Cooker Cauliflower, Potato and White Bean Soup Recipe",
        "type": "article",
        "url": "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
      }
    `);
  });
});

describe("setImage", () => {
  test("set image without type", () => {
    expect(setImage(pen15)).toEqual("bookmark-pen15.jpg");
  });

  test("set image with type", () => {
    expect(setImage(soup)).toEqual(
      "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg"
    );
  });

  test("skip, if no title", () => {
    expect(
      setImage({
        ogImage: {
          url: "my-image.jpg",
        },
      })
    ).toBeUndefined();
  });

  test("skip, if no ogImage", () => {
    expect(
      setImage({
        ogTitle: "Good soup",
        ogImage: {
          type: "jpg",
        },
      })
    ).toBeUndefined();
  });
});
