// @ts-expect-error
import * as React from "npm:react";

import type { ArtworkData } from "../../components/ArtworkBrick.tsx";
import { ArtworkBrick } from "../../components/ArtworkBrick.js";

type ISODate = string;
type CollectionTitle = string;
type CurationData = Record<ISODate, Record<CollectionTitle, ArtworkData[]>>;

export function CurationReport(props: { data: CurationData }) {
  const { data } = props;
  const datesAndCollections = Object.entries(data);

  return datesAndCollections.map(([date, collections]) => (
    <DateReport date={date} collections={collections} />
  ));
}

function DateReport(props: {
  date: ISODate;
  collections: Record<CollectionTitle, ArtworkData[]>;
}) {
  const { date, collections } = props;
  const collectionsAndArtworks = Object.entries(collections);

  return (
    <div>
      <h2>{date}</h2>
      {collectionsAndArtworks.map(([collection, artworks]) => (
        <CollectionReport collection={collection} artworks={artworks} />
      ))}
    </div>
  );
}

function CollectionReport(props: {
  collection: CollectionTitle;
  artworks: ArtworkData[];
}) {
  const { collection, artworks } = props;

  return (
    <div>
      <h3>{collection}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
        {artworks.map((artwork) => (
          <ArtworkBrick artwork={artwork} />
        ))}
      </div>
    </div>
  );
}
