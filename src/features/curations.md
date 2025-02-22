```js
import { CurationReport } from "./components/CurationReport.js";
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
  color: { label: "Collection" },
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

```tsx
/*
Get the curations csv into a hierarchical format that looks like…

const artworksByDateAndCollection = {
  "2025-02-20": {
    "Best Bids": [
      { "artwork_slug": "tim-berg-and-rebekah-myers-all-that-glitters",
        "collection_title": "Best Bids",
        "curated_at": "2025-02-20 14:32:13.419671" … },
      { "artwork_slug": "stanley-whitney-untitled-2784",
        "collection_title": "Best Bids",
        "curated_at": "2025-02-20 14:32:13.398133" … }
    ],
    "Flora and Fauna": [
      { "artwork_slug": "rudy-cremonini-pianta",
        "collection_title": "Flora and Fauna",
        "curated_at": "2025-02-19 17:15:24.93443" … },
      …
    ]
  },
  "2025-02-19": {
    …
  }
}
*/

const artworksByDate = _.groupBy(curations, (d) => d.curation_date);
const artworksByDateAndCollection = _.mapValues(artworksByDate, (day) =>
  _.groupBy(day, (d) => d.collection_title)
);

// Then render the hierarhical data with a React component
display(<CurationReport data={artworksByDateAndCollection} />);
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
