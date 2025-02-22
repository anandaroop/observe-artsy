```js
import { ArtworkBrick } from "/components/artwork-brick.js";
ArtworkBrick.addStyles();
```

```js
const curations = (await FileAttachment("data/curations.csv").csv()).map(
  (c) => ({
    ...c,
    curated_at_date: new Date(c.curated_at),
  })
);
```

# Curation by day

```js
const plot = Plot.plot({
  width,
  height: 200,
  x: { label: "Curation date", interval: "day" },
  y: { label: "Artworks" },
  marks: [
    Plot.waffleY(
      curations,
      Plot.binX(
        { y: "count" },
        {
          x: "curated_at_date",
          fill: "collection_title",
          tip: {
            format: {
              x: false,
              y: (d) => `${d} works`,
            },
          },
        }
      )
    ),
  ],
});

display(plot);
```

```js
let lastDate = undefined;
let lastCollection = undefined;

curations.map((curation) => {
  if (curation.curation_date != lastDate) {
    lastDate = curation.curation_date;
    display(html`<h2>${lastDate}</h2>`);
  }

  if (curation.collection_slug != lastCollection) {
    lastCollection = curation.collection_slug;
    display(
      html`<h3>
        <a
          href="https://www.artsy.net/collection/${curation.collection_slug}"
          target="artsy"
          >${curation.collection_title}</a
        >
      </h3>`
    );
  }

  display(ArtworkBrick.render(curation));
});
```

<style>

body {
  font-family: var(--sans-serif);
}

h1 {
  max-width: 100% !important;
  font-size: 4em;
  color: var(--theme-foreground-faint);
}

h2 {
  max-width: 100% !important;
  font-size: 3em;
  margin: 1em 0 0 0;
  padding-top: 0.5em;
  border-top: solid 12px var(--theme-foreground-faint);
  color: var(--theme-foreground-faint);
}

h3 {
  max-width: 100% !important;
  font-size: 2em;
  margin: 1em 0 1em 0;
  padding-top: 0.5em;
  border-top: solid 4px var(--theme-foreground-focus);
}

</style>
