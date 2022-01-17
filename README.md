# bookmark-action

This GitHub action bookmarks websites to a YAML file.

Create a new issue with the URL in the title. The action will then fetch the web page's metadata using [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper) and add it to your YAML file in your repository, always sorting by the bookmark date.

<!-- START GENERATED DOCUMENTATION -->

<!-- END GENERATED DOCUMENTATION -->

## Create an issue

The title of your issue must start with the URL:

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
```

The action will automatically set the bookmarked date to today. To specify a different date, add the date after the URL in `YYYY-MM-DD` format.

```
https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans 2020-06-12
```

If you add content to the body of the comment, the action will add it as the value of `notes`.
