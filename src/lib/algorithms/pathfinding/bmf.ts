import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";
import { dropFromQueue, isEqual } from "../../../utils/helpers";
import { GridType, TileType } from "../../../utils/types";
import { MinPriorityQueue } from "@datastructures-js/priority-queue"; // Import a Min Priority Queue for efficient sorting

export const bmf = (grid: GridType, startTile: TileType, endTile: TileType) => {
  // An array to store all traversed tiles (for visualization)
  const traversedTiles: TileType[] = [];

  // Get the starting tile from the grid
  const base = grid[startTile.row][startTile.col];
  base.distance = 0; // Set the start tile's distance to 0 (it's the source)
  base.isTraversed = true; // Mark the start tile as traversed
  const untraversedTiles = [base];

  // Create a Priority Queue (Min Heap) that sorts tiles by their distance
  const pq = new MinPriorityQueue<TileType>((tile) => tile.distance);

  pq.enqueue(base); // Add the start tile to the queue

  // Continue processing while there are tiles in the queue
  while (!pq.isEmpty()) {
    untraversedTiles.sort((a, b) => a.distance - b.distance); // Sort the queue by distance
    const currentTile = untraversedTiles.shift(); // Get the tile with the smallest distance

    // If the current tile is null or a wall, skip it
    if (!currentTile || currentTile.isWall) continue;

    // If the tile's distance is Infinity, stop (no further updates possible)
    if (currentTile.distance === Infinity) break;

    // Mark the current tile as traversed and add it to the list
    currentTile.isTraversed = true;
    // If we have reached the end tile, stop early
    if (isEqual(currentTile, endTile)) break;

    // Get all untraversed neighbors of the current tile
    const neighbors = getUntraversedNeighbors(grid, currentTile);

    let prevParents: any
    // Process each neighbor
    for (let i = 0; i < neighbors.length; i += 1) {
      dropFromQueue(neighbors[i], untraversedTiles); // Remove the neighbor from the queue
      if (neighbors[i].distance >= -1) {
        neighbors[i].distance = currentTile.distance + 1;
        neighbors[i].parent = currentTile; // Set the neighbor's parent to the current tile
        untraversedTiles.push(neighbors[i]); // Add the neighbor to the queue
        traversedTiles.push(currentTile);
        prevParents = currentTile
      }
      else {
        neighbors[i].distance = currentTile.distance - 1;
        neighbors[i].parent = prevParents ?? currentTile
        untraversedTiles.push(neighbors[i === 0 ? i : i - 1]); // Add the neighbor to the queue
        traversedTiles.push(prevParents);
      }

      if (prevParents.distance < neighbors[i].distance) {
        neighbors[i].distance = prevParents.distance; // Update the neighbor's distance
        neighbors[i].parent = currentTile; // Set the current tile as its parent (for path reconstruction)
        pq.enqueue(neighbors[i]); // Add the updated neighbor to the priority queue
      }
    }
  }

  // Reconstruct the shortest path by backtracking from the end tile
  const path: TileType[] = [];
  let current: TileType | null = grid[endTile.row][endTile.col];

  // Follow the parent links back to the start
  while (current) {
    current.isPath = true; // Mark the tile as part of the path
    path.unshift(current); // Add it to the path (prepend)
    current = current.parent || null; // Move to the previous tile
  }

  console.log('bmf tiles', traversedTiles, path);

  // Return both the traversed tiles (for visualization) and the final path
  return { traversedTiles, path };
};

