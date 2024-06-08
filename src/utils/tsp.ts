export const solveTSP = (distances: number[][]): number[] => {
    const n = distances.length;
    const visited = Array(n).fill(false);
    const path: number[] = [];
    let minCost = Infinity;
    let optimalPath: number[] = [];
  
    const branchAndBound = (currentIndex: number, count: number, cost: number, path: number[]) => {
      if (count === n && distances[currentIndex][0] > 0) {
        const totalCost = cost + distances[currentIndex][0];
        if (totalCost < minCost) {
          minCost = totalCost;
          optimalPath = [...path, 0];
        }
        return;
      }
  
      for (let i = 0; i < n; i++) {
        if (!visited[i] && distances[currentIndex][i] > 0) {
          visited[i] = true;
          branchAndBound(i, count + 1, cost + distances[currentIndex][i], [...path, i]);
          visited[i] = false;
        }
      }
    };
  
    visited[0] = true;
    branchAndBound(0, 1, 0, [0]);
  
    return optimalPath;
  };