// @ts-expect-error
import * as React from "npm:react";

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
export type ArtworkData = {
  artist_name: string;
  artwork_slug: string;
  artwork_title: string;
  artwork_thumbnail_url: string;
};

export function ArtworkBrick(props: { artwork: ArtworkData }) {
  const {
    artwork: {
      artist_name,
      artwork_slug,
      artwork_title,
      artwork_thumbnail_url,
    },
  } = props;

  React.useEffect(() => {
    const existing = document.getElementById("artwork-brick-styles");
    console.log({ existing });

    if (existing) {
      return;
    }

    const style = document.createElement("style");
    style.id = "artwork-brick-styles";

    style.textContent = `
      .artwork-brick {
        position: relative;
      }

      .artwork-brick .image {
        line-height: 0;
      }

      .artwork-brick img {
        width: 115px;
        height: 115px;
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

        font-size: 1em;
        line-height: 1.2;
      }

      .artwork-brick:hover .tombstone {
        display: block;
        z-index: 1;
      }

      .artwork-brick .tombstone .artist {  }
      .artwork-brick .tombstone .title { font-weight: bold; }
    `;

    document.head.appendChild(style);
  }, []);

  return (
    <a href={`https://www.artsy.net/artwork/${artwork_slug}`} target="artsy">
      <div className="artwork-brick">
        <div className="image">
          <img src={artwork_thumbnail_url} width={115} height={115} />
        </div>
        <div className="tombstone">
          <div className="artist">{artist_name}</div>
          <div className="title">{artwork_title}</div>
        </div>
      </div>
    </a>
  );
}
