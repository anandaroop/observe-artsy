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
      isAdmin: JSON.parse(roles || "[]").includes("admin"),
    };
  })
  .filter((event) => {
    if (excludeAdmins) {
      return !event.isAdmin;
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
const excludeAdmins = view(
  Inputs.toggle({ label: "Exclude admins?", value: false })
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
