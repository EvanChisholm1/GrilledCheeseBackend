export function calcSimilarity(pointA, pointB) {
    // dot product
    const nonNormSimilarity = pointA.embedding.reduce(
        (acc, cur, i) => acc + cur * pointB.embedding[i]
    );

    const aNorm = Math.sqrt(
        pointA.embedding.reduce((acc, cur) => acc + cur ** 2)
    );
    const bNorm = Math.sqrt(
        pointB.embedding.reduce((acc, cur) => acc + cur ** 2)
    );

    const similarity = nonNormSimilarity / (aNorm * bNorm);
    return similarity;
}

export function knn(target, points, k) {
    const mostSimilar = new Array(k).fill({ point: null, similarity: 0 });

    for (const point of points) {
        const sim = calcSimilarity(target, point);
        // not the fastest if k is quite large, will likely switch to binary search at some point
        // time complextiy with binary search would become O(n * log(k)) instead of O(nk)
        for (const [i, previousPoint] of mostSimilar.entries()) {
            if (!(sim > previousPoint.similarity)) continue;

            mostSimilar.splice(i, 0, { point, similarity: sim });
            mostSimilar.pop();
            break;
        }
    }

    return mostSimilar;
}
