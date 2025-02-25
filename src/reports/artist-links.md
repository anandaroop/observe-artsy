```js
const report = (
  await FileAttachment("./data/artist-links.csv").csv({ typed: true })
).map((row) => {
  return {
    ...row,
    public_url: `https://www.artsy.net/artist/${row.artist_slug}`,
    admin_url: `https://tools.artsy.net/artists/${row.artist_slug}`,
  };
});
```

```js
const sortedReport = _.sortBy(
  report,
  (r) => !r.artist_is_target_supply,
  (r) => -r.artist_follow_count,
  (r) => -r.artist_slug
);
```

# Artist broken links

Use the **view** and **edit** links below to review and update the affected artist biographies.

```js
display(
  Inputs.table(sortedReport, {
    columns: [
      "http_status",
      "url",
      "artist_slug",
      "public_url",
      "admin_url",
      "artist_is_target_supply",
      "artist_follow_count",
    ],
    header: {
      http_status: "Broken Link Code",
      url: "Broken Link URL",
      artist_slug: "Artist page",
      artist_is_target_supply: "Target supply?",
      artist_follow_count: "Follow count",
      public_url: "View",
      admin_url: "Edit",
    },
    layout: "fixed",
    height: "auto",
    width: {
      http_status: "10%",
      url: "35%",
      artist_slug: "15%",
      artist_is_target_supply: "10%",
      artist_follow_count: "10%",
      public_url: "10%",
      admin_url: "10%",
    },
    align: {
      http_status: "right",
    },
    format: {
      http_status: (x) => html`<span style="color: red">${x}</span>`,
      public_url: (x) => html`<a href="${x}" target="view">View</a>`,
      admin_url: (x) => html`<a href="${x}" target="edit">Edit</a>`,
      artist_is_target_supply: (x) =>
        html`<span style="font-weight: ${x ? "bold" : "normal"}">${x}</span>`,
    },
    rows: 40,
  })
);
```
