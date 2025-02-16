<!-- IMPORTS -->

```js
import { getDbscanClusters } from "./lib/dbscan.js";
import { getUserVectors } from "./lib/user-vectors.js";
```

<!-- DATA -->

```js
// all page visits
const pages = await FileAttachment("data/torque-pages.csv").csv();

// unique page paths
const uniquePages = _.uniq(pages.map((p) => p.path).sort());

// munged page visits
const cleanPages = pages.map((page) => {
  let { path, sent_at } = page;

  path = path.replace(/\/artist\/[-\w]+/, "/artist/:id");
  path = path.replace(/\/purchases\/artwork\/[-\w]+/, "/purchases/artwork/:id");
  path = path.replace(/\/purchases\/user\/[-\w]+/, "/purchases/user/:id");
  path = path.replace(/\/artworks\/partner\/[-\w]+/, "/artworks/partner/:id");

  return {
    ...page,
    path,
    date: new Date(sent_at),
    localDate: new Date(sent_at).toLocaleString("en-US", {
      timeZone: "America/New_York",
    }),
  };
});
```

<!-- DOCUMENT -->

# Torque usage

A peek into the page-view data that [Torque is now](https://github.com/artsy/torque/pull/1388) sending [to Redshift](https://github.com/artsy/degas/pull/259).

---

## Visualizations

```js
const groupBy = view(
  Inputs.radio(
    new Map([
      ["By user", "user"],
      ["By page", "page"],
      ["By user & page", "user-page"],
    ]),
    { value: "user", label: "Group results" }
  )
);
```

```js
const margins = { "user-page": 220, user: 120, page: 150 };
const titles = { "user-page": "user & page", user: "user", page: "page" };

const plot = Plot.plot({
  title: `Grouped by ${titles[groupBy]}`,
  width,
  marginLeft: margins[groupBy],
  color: groupBy === "user-page" ? {} : { legend: true },
  marks: [
    Plot.barX(
      cleanPages,
      Plot.groupY(
        { x: "count" },
        {
          y: (d) =>
            groupBy === "user-page"
              ? `${d.name} @ ${d.path}`
              : groupBy === "page"
              ? d.path
              : d.name,
          fill: groupBy === "user" ? "path" : "name",
          tip: true,
          sort: { y: "-x" },
        }
      )
    ),
  ],
});

display(plot);
```

```js
const plot = Plot.plot({
  title: "Timeline",
  subtitle: "(utc)",
  marginLeft: 150,
  width,
  grid: true,
  marks: [
    Plot.dot(cleanPages, {
      x: "date",
      // y: (d) => [d.name, d.path].join(" @ "),
      y: "name",
      r: 8,
      fill: "name",
      opacity: 0.25,
      tip: true,
    }),
  ],
});

display(plot);
```

```js
const plot = Plot.plot({
  title: "Grouped by day",
  marginLeft: 150,
  height: 200,
  width,
  x: { interval: "day" },
  color: { legend: true },
  marks: [
    Plot.waffleY(
      cleanPages,
      Plot.binX(
        { y: "count" },
        { x: "date", thresholds: d3.utcDay, fill: "name", tip: true }
      )
    ),
  ],
});

display(plot);
```

---

## User clusters

Derived with the [DBSCAN clustering algorithm](https://en.wikipedia.org/wiki/DBSCAN) applied to user vectors.

For user vectors, each dimension is the count of page views for a specific kind of page:

```js echo
const someAdmin = [
  5, // number of artist page visits
  2, // number of artwork page visits
  // etc…
];
```

```js
const distanceFn = view(
  Inputs.radio(["cosine", "euclidean"], {
    label: "Distance ƒn",
    value: "cosine",
  })
);
```

```js
const eps = view(
  distanceFn === "cosine"
    ? Inputs.range([0, 1], { label: "Epsilon", value: 0.3, step: 0.05 })
    : Inputs.range([1, 100], { label: "Epsilon", value: 3, step: 1 })
);
```

```js
const minPts = view(
  Inputs.range([0, 10], { label: "Min points", value: 0, step: 1 })
);
```

```js
const topN = view(Inputs.range([2, 10], { label: "Top n pages", value: 3 }));
```

<table>
  <thead>
    <tr>
      <th>Cluster</th>
      <th>Users</th>
      <th>Top ${topN} pages for this cluster</th>
    </tr>
  </thead>

  <tbody>
    ${getClusterData().map(cluster =>
      html`<tr>
        <td>${cluster.label}</td>
        <td>${cluster.users.map(user => html`<div><b>${user}</b></div>`)}</td>
        <td>${cluster.pages.map(page => html`<div>${page}</div>`)}</td>
      </tr>`
    )}
  </tbody>
</table>

```js
function getClusterData() {
  function topNpathsForCluster(users, n = 3) {
    const pages = cleanPages
      .filter((p) => users.includes(p.email))
      .map((p) => p.path);
    const tally = _.countBy(pages);
    const top = _.sortBy(Object.entries(tally), ([path, count]) => -count);
    const topN = _.take(top, n).map(_.first);
    return topN;
  }

  const { clusters, noise } = getDbscanClusters(
    getUserVectors(cleanPages),
    eps,
    minPts,
    distanceFn
  );

  let result = [];

  for (let i in clusters) {
    const users = clusters[i];
    const topNpaths = topNpathsForCluster(users, topN);
    result.push({
      label: `Cluster ${i}`,
      users: users.map((u) => u.replace(/@.*/, "")),
      pages: topNpaths,
    });
  }

  for (let user of noise) {
    console.log(user);
    const users = [user];
    const topNpaths = topNpathsForCluster(users, topN);
    result.push({
      label: `Outlier`,
      users: users.map((u) => u.replace(/@.*/, "")),
      pages: topNpaths,
    });
  }

  return result;
}
```

---

## The data

Browse or search entries from either the…

- **raw** data straight from Redshift
- **cooked** data, munged so that `sent_at` is parsed into a JS date, and urls like `/artist/kaws` and `/artist/stik` are coalesced into `/artist/:id`

```js
const searchAgainst = view(
  Inputs.radio(["raw", "cooked"], { label: "Version", value: "cooked" })
);
```

```js
const dataset = searchAgainst === "cooked" ? cleanPages : pages;
const search = view(Inputs.search(dataset));
```

```js
display(Inputs.table(search));
```

---

## Pages visited

Visit the pages recorded in this dataset by following the links below.

```js
const env = view(
  Inputs.radio(["production", "staging"], {
    label: "Environment",
    value: "production",
  })
);
```

```html
<ul style="list-style-type: none; padding: 0;">
${
    uniquePages.map(
        p => html`<li><code><a href="https://${env === "staging" ? "admin-staging" : "admin"}.artsy.net${p}" target="artsy">${p}</a></code></li>`
    )
}
</ul>
```
