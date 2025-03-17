import { twMerge } from "tailwind-merge";
import { usePathfinding } from "../hooks/usePathfinding";
import { MAX_COLS, MAX_ROWS } from "../utils/constants";
import { Tile } from "./Tile";
import { MutableRefObject, useState } from "react";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";

export function Grid({
  isVisualizationRunningRef,
}: {
  isVisualizationRunningRef: MutableRefObject<boolean>;
}) {
  const { grid, setGrid } = usePathfinding();
  const [isMouseDown, setIsMouseDown] = useState(false);
  

  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizationRunningRef.current || checkIfStartOrEnd(row, col)) {
      return;
    }

    setIsMouseDown(true);
    const newGrid = createNewGrid(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = (row: number, col: number) => {
    if (isVisualizationRunningRef.current || checkIfStartOrEnd(row, col)) {
      return;
    }

    setIsMouseDown(false);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isVisualizationRunningRef.current || checkIfStartOrEnd(row, col)) {
      return;
    }

    if (isMouseDown) {
      const newGrid = createNewGrid(grid, row, col);
      setGrid(newGrid);
    }
  };
  const gridHeightLg = MAX_ROWS * 17;
  const gridHeightMd = MAX_ROWS * 15;
  const gridHeightXs = MAX_ROWS * 8;
  const gridHeight = MAX_ROWS * 7;

  const gridWidthLg = MAX_COLS * 17;
  const gridWidthMd = MAX_COLS * 15;
  const gridWidthXs = MAX_COLS * 8;
  const gridWidth = MAX_COLS * 7;

  return (
    <div
    className={twMerge(
      // Base classes
      "flex items-center flex-col justify-center border-sky-300 mt-10",
      // Control Grid height
       `lg:min-h-[${gridHeightLg}px] md:min-h-[${gridHeightMd}px] xs:min-h-[${gridHeightXs}px] min-h-[${gridHeight}px]`,
      // Controlling grid width
      `lg:w-[${gridWidthLg}px] md:w-[${gridWidthMd}px] xs:w-[${gridWidthXs}px] w-[${gridWidth}px]`
          )}
    >
      {grid.map((r, rowIndex) => (
        <div key={rowIndex} className="flex">
          {r.map((tile, tileIndex) => {
            const { row, col, isEnd, isStart, isPath, isTraversed, isWall } =
              tile;
            return (
              <Tile
                key={tileIndex}
                row={tile.row}
                col={tile.col}
                isEnd={isEnd}
                isStart={isStart}
                isPath={isPath}
                isTraversed={isTraversed}
                isWall={isWall}
                handleMouseDown={() => handleMouseDown(row, col)}
                handleMouseUp={() => handleMouseUp(row, col)}
                handleMouseEnter={() => handleMouseEnter(row, col)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
