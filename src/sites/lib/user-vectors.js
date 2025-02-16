import _ from 'lodash';

// type PageData = {
//   email: string,
//   path: string,
//   …etc
// }

export function getUserVectors(pageData) {
  const uniqueUsers = _.uniq(pageData.map((p) => p.email));
  const uniquePaths = _.uniq(pageData.map((p) => p.path)).sort();

  const userVectors = uniqueUsers.reduce((vectors, email) => {
    const userVisits = pageData.filter((p) => p.email === email);
    const userVector = uniquePaths.map((path) => {
      const visits = userVisits.filter((v) => v.path === path);
      return visits.length;
    });
    vectors.push({
      user: email,
      vector: userVector,
    });
    return vectors;
  }, []);

  return userVectors;
}
