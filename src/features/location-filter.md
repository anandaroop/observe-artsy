```js
// all events
const events = await FileAttachment("data/location-select-all.csv").csv();

// cleaned events
const cleanEvents = events
  .map((event) => {
    const { sent_at, query, roles, context_page_path } = event;

    let path = context_page_path;
    path = path.replace(/\/artist\/[-\w]+/, "/artist/:id");
    path = path.replace(/\/collection\/[-\w]+/, "/collection/:id");

    return {
      ...event,
      path,
      query: query.toLowerCase().trim(),
      date: new Date(sent_at),
      isTeam: JSON.parse(roles || "[]").includes("team"),
    };
  })
  .filter((event) => {
    if (excludeTeam) {
      return !event.isTeam;
    }
    return true;
  });
```

```js
// display(cleanEvents);
```

# Artwork location filter select-all

This acts as a proxy for the adoption of the enhanced artwork location filtering.

```js
const excludeTeam = view(
  Inputs.toggle({ label: "Exclude Artsy team?", value: false })
);
```

## Timeline

```js
display(
  Plot.plot({
    width,
    marks: [
      Plot.dot(cleanEvents, {
        x: "date",
        // y: "path",
        fill: "#9996",
        r: 8,
        tip: true,
      }),
    ],
  })
);
```

## By day

```js
display(
  Plot.plot({
    width,
    height: 60,
    x: { interval: "day" },
    marks: [
      Plot.waffleY(
        cleanEvents,
        Plot.binX(
          { y: "count" },
          { x: "date", thresholds: d3.utcDay, fill: "#999", tip: true }
        )
      ),
    ],
  })
);
```

## Top filter terms

```js
display(
  Plot.plot({
    marginLeft: 200,
    width,
    marks: [
      // bar
      Plot.barX(
        cleanEvents,
        Plot.groupY(
          { x: "count" },
          { y: "query", fill: "#999", tip: true, sort: { y: "-x" } }
        )
      ),
      // count
      Plot.text(
        cleanEvents,
        Plot.groupY(
          { text: "count", x: () => 0 },
          {
            y: "query",
            dx: 10,
            fontWeight: "bold",
            fill: "white",
            sort: { y: "-x" },
          }
        )
      ),
    ],
  })
);
```

## Top paths

```js
const coalescePaths = view(Inputs.toggle({ label: "Coalesce?", value: false }));
```

```js
const dimension = coalescePaths ? "path" : "context_page_path";
display(
  Plot.plot({
    marginLeft: 200,
    width,
    marks: [
      // bar
      Plot.barX(
        cleanEvents,
        Plot.groupY(
          { x: "count" },
          { y: dimension, fill: "#999", tip: true, sort: { y: "-x" } }
        )
      ),
      // count
      Plot.text(
        cleanEvents,
        Plot.groupY(
          { text: "count", x: () => 0 },
          {
            y: dimension,
            dx: 10,
            fontWeight: "bold",
            fill: "white",
            tip: true,
            sort: { y: "-x" },
          }
        )
      ),
    ],
  })
);
```

---

## The data

```js
const searchAgainst = view(
  Inputs.radio(["raw", "cooked"], { value: "cooked" })
);
```

```js
const dataset = searchAgainst === "cooked" ? cleanEvents : events;
const search = view(Inputs.search(dataset));
```

```js
display(Inputs.table(search));
```

---

## Visit

Apply the location filter terms to the corresponding pages to repro recent user behavior.

<table class="visit">
  <thead>
    <tr>
      <th class="term">Filter&nbsp;term</th>
      <th class="page">Page</th>
    </tr>
  </thead>
  <tbody>
    ${cleanEvents.map(e => {
      const page = [e.context_page_path, e.context_page_search].join("")
      return (
        html`<tr>
          <td class="term">${e.query}</td>
          <td class="page"><a href="https://www.artsy.net${page}" target="artsy">${page}</a></td>
        </tr>`
      )
    })}
  </tbody>
</table>

<style>
table.visit td {
  padding: 0.5em 0.5em;
}
table.visit td.term {
  text-wrap: nowrap;
}
</style>
