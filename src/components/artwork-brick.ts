import { html } from "npm:htl";

/**
 * These attributes represent columns in a CSV result.
 *
 * They typically come from a big SQL JOIN query,
 * where the columns from the artworks table are aliased
 * with the prefix "artwork_"; columns from the artists
 * table are aliased with the prefix "artist_"; etc
 *
 * The object supplied as an argument to the ArtworkBrick
 * should have these attributes (and possibly others, which will
 * be ignored).
 */
interface Artwork {
  artist_name: string;
  artwork_slug: string;
  artwork_title: string;
  artwork_thumbnail_url: string;
}

/**
 * Options for controlling the appearance of the ArtworkBrick.
 */
interface StyleOptions {
  size?: "small" | "medium" | "large";
}

/**
 * A helper for rendering an artwork as a small square brick component.
 *
 * ```js
 * import { ArtworkBrick } from "/components/artwork-brick.js";
 * ArtworkBrick.addStyles();
 *
 * //...
 *
 * ArtworkBrick.render(someRow)
 * ```
 */
export class ArtworkBrick {
  artwork: Artwork;

  static addStyles(options: StyleOptions) {
    const style = document.createElement("style");
    style.textContent = this.css(options);
    document.head.appendChild(style);
  }

  static render(artwork: Artwork) {
    return new ArtworkBrick(artwork).render();
  }

  static css(options: StyleOptions = {}) {
    const { size = "medium" } = options;

    const values = {
      imageSize: {
        small: "57.5px",
        medium: "115px",
        large: "230px",
      },
      fontSize: {
        small: "0.8em",
        medium: "1em",
        large: "1.2em",
      },
    };

    return `
      .artwork-brick {
        display: inline-block;
        position: relative;
      }

      .artwork-brick img {
        width: ${values.imageSize[size]};
        height: ${values.imageSize[size]};
      }

      .artwork-brick .tombstone {
        display: none; /* hide until hover */

        position: absolute;
        box-sizing: border-box;
        background: var(--theme-background);
        opacity: 0.97;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0.5em;
        overflow: scroll;

        font-size: ${values.fontSize[size]};
        line-height: 1.2;
      }

      .artwork-brick:hover .tombstone {
        display: block;
        z-index: 1;
      }

      .artwork-brick .tombstone .artist {  }
      .artwork-brick .tombstone .title { font-weight: bold; }
    `;
  }

  constructor(artwork: Artwork) {
    this.artwork = artwork;
  }

  render() {
    const { artist_name, artwork_slug, artwork_title, artwork_thumbnail_url } =
      this.artwork;

    return html`
      <a href="https://www.artsy.net/artwork/${artwork_slug}" target="artsy"
        ><div class="artwork-brick">
          <div class="image"><img src="${artwork_thumbnail_url}" /></div>
          <div class="tombstone">
            <div class="artist">${artist_name}</div>
            <div class="title">${artwork_title}</div>
          </div>
        </div></a
      >
    `;
  }
}
