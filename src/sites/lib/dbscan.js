// with help from Claude
// adapted from https://claude.ai/chat/d7a1fb8e-0854-49bb-8f7b-62bca89ce66d

export function getDbscanClusters(userVectors, eps, minPts, metric = "euclidean") {
  const n = userVectors.length;
  const clusters = new Array(n).fill(-1); // -1: unvisited, 0: noise, >0: cluster ID
  let currentCluster = 0;

  // Distance metric functions
  const distanceMetrics = {
    euclidean: (p1, p2) => {
      if (p1.length !== p2.length) {
        throw new Error("Points must have same dimensions");
      }
      return Math.sqrt(
        p1.reduce((sum, val, i) => sum + Math.pow(val - p2[i], 2), 0)
      );
    },

    cosine: (p1, p2) => {
      if (p1.length !== p2.length) {
        throw new Error("Points must have same dimensions");
      }

      // Calculate dot product
      const dotProduct = p1.reduce((sum, val, i) => sum + val * p2[i], 0);

      // Calculate magnitudes
      const mag1 = Math.sqrt(p1.reduce((sum, val) => sum + val * val, 0));
      const mag2 = Math.sqrt(p2.reduce((sum, val) => sum + val * val, 0));

      // Avoid division by zero
      if (mag1 === 0 || mag2 === 0) return 1;

      // Return cosine distance (1 - similarity)
      return 1 - dotProduct / (mag1 * mag2);
    },
  };

  // Validate and get distance function
  if (!distanceMetrics[metric]) {
    throw new Error(
      `Unsupported distance metric: ${metric}. Supported metrics are: ${Object.keys(
        distanceMetrics
      ).join(", ")}`
    );
  }
  const distance = distanceMetrics[metric];

  // Find all points within eps distance of point
  function getNeighbors(pointIdx) {
    const neighbors = [];
    for (let i = 0; i < n; i++) {
      if (
        i !== pointIdx &&
        distance(userVectors[pointIdx].vector, userVectors[i].vector) <= eps
      ) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  // Expand cluster from seed point
  function expandCluster(pointIdx, neighbors) {
    clusters[pointIdx] = currentCluster;

    let i = 0;
    while (i < neighbors.length) {
      const currentPoint = neighbors[i];

      // If point was previously marked as noise, add it to cluster
      if (clusters[currentPoint] === 0) {
        clusters[currentPoint] = currentCluster;
      }

      // If point hasn't been visited
      if (clusters[currentPoint] === -1) {
        clusters[currentPoint] = currentCluster;

        // Find neighbors of current point
        const currentNeighbors = getNeighbors(currentPoint);

        // If enough neighbors, add them to search list
        if (currentNeighbors.length >= minPts) {
          neighbors.push(
            ...currentNeighbors.filter((p) => !neighbors.includes(p))
          );
        }
      }

      i++;
    }
  }

  // Main DBSCAN algorithm
  for (let i = 0; i < n; i++) {
    // Skip if point has been visited
    if (clusters[i] !== -1) continue;

    // Find neighbors
    const neighbors = getNeighbors(i);

    // Mark as noise if not enough neighbors
    if (neighbors.length < minPts) {
      clusters[i] = 0;
      continue;
    }

    // Start new cluster
    currentCluster++;
    expandCluster(i, neighbors);
  }

  // Format results
  const results = {
    clusters: {},
    noise: [],
  };

  // Group points by cluster
  userVectors.forEach((uv, i) => {
    if (clusters[i] === 0) {
      results.noise.push(uv.user);
    } else {
      results.clusters[clusters[i]] = results.clusters[clusters[i]] || [];
      results.clusters[clusters[i]].push(uv.user);
    }
  });

  return results;
}
