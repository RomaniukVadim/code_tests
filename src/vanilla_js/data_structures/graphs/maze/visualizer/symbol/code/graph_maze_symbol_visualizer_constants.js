// external imports

// internal imports

// implementation
const MAZE_VISUALIZER_WALL_SYMBOL1_INDEX = 0;
const MAZE_VISUALIZER_PATH_SYMBOL1_INDEX = 1;

const MAZE_VISUALIZER_WALL_SYMBOL1 = '\u2593';
const MAZE_VISUALIZER_PATH_SYMBOL1 = '\u2591';

const MAZE_BLOCKS_MAP = new Map();

MAZE_BLOCKS_MAP.set(MAZE_VISUALIZER_WALL_SYMBOL1_INDEX, MAZE_VISUALIZER_WALL_SYMBOL1);
MAZE_BLOCKS_MAP.set(MAZE_VISUALIZER_PATH_SYMBOL1_INDEX, MAZE_VISUALIZER_PATH_SYMBOL1);

// exports
module.exports.MAZE_VISUALIZER_WALL_SYMBOL1_INDEX = MAZE_VISUALIZER_WALL_SYMBOL1_INDEX;
module.exports.MAZE_VISUALIZER_PATH_SYMBOL1_INDEX = MAZE_VISUALIZER_PATH_SYMBOL1_INDEX;

module.exports.MAZE_VISUALIZER_WALL_SYMBOL1 = MAZE_VISUALIZER_WALL_SYMBOL1;
module.exports.MAZE_VISUALIZER_PATH_SYMBOL1 = MAZE_VISUALIZER_PATH_SYMBOL1;

module.exports.MAZE_BLOCKS_MAP = MAZE_BLOCKS_MAP;