```js
const curations = await FileAttachment("data/curations.csv").csv();
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

  display(renderArtworkBrick(curation));
});
```

```js
function renderArtworkBrick({
  artwork_slug,
  artwork_title,
  artwork_thumbnail_url,
}) {
  return html`
    <a href="https://www.artsy.net/artwork/${artwork_slug}" target="artsy">
      <div class="artwork-brick">
        <div><img src="${artwork_thumbnail_url}" /></div>
      </div>
    </a>
  `;
}
```

<style>

body {
  font-family: var(--sans-serif);
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

.artwork-brick {
  display: inline-block;
}

.artwork-brick img {
  width: 115px;
  height: 115px;
}

</style>
