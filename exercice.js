const GAMEMASTERS = [
  { id: 1, name: 'John', trained_rooms: [2, 3] },
  { id: 2, name: 'Alice', trained_rooms: [4, 10] },
  { id: 3, name: 'David', trained_rooms: [5] },
  { id: 4, name: 'Emily', trained_rooms: [8, 6, 2, 7] },
  { id: 5, name: 'Michael', trained_rooms: [9, 1, 4, 3, 11, 8, 6, 12] },
  { id: 6, name: 'Sophia', trained_rooms: [7, 10] },
  { id: 7, name: 'Daniel', trained_rooms: [8] },
  { id: 8, name: 'Olivia', trained_rooms: [3, 9] },
  { id: 9, name: 'Matthew', trained_rooms: [2, 6, 1, 7, 3, 4] },
  { id: 10, name: 'Emma', trained_rooms: [5, 4] },
  { id: 11, name: 'James', trained_rooms: [11] },
  { id: 12, name: 'Isabella', trained_rooms: [7, 4, 12] },
  { id: 13, name: 'William', trained_rooms: [11] },
  { id: 14, name: 'Ava', trained_rooms: [9] },
  { id: 15, name: 'Benjamin', trained_rooms: [8, 4] },
  { id: 16, name: 'Mia', trained_rooms: [1, 3, 7, 5, 8] },
  { id: 17, name: 'Ethan', trained_rooms: [4, 2] },
  { id: 18, name: 'Charlotte', trained_rooms: [10] },
  { id: 19, name: 'Alexandre', trained_rooms: [9, 2, 8] },
  { id: 20, name: 'Harper', trained_rooms: [1, 12] }
];

const ROOMS = [
  { id: 1, name: "Le Braquage à la francaise" },
  { id: 2, name: "Le Braquage de casino" },
  { id: 3, name: "L'Enlèvement" },
  { id: 4, name: "Le Métro" },
  { id: 5, name: "Les Catacombes" },
  { id: 6, name: "Assassin's Creed" },
  { id: 7, name: "L'Avion" },
  { id: 8, name: "La Mission spatiale" },
  { id: 9, name: "Le Tremblement de terre" },
  { id: 10, name: "Le Cinéma hanté" },
  { id: 11, name: "Le Farwest" },
  { id: 12, name: "Mission secrète" }
];

// Tirage aléatoire des gamemasters
const random_gamemaster_array = size => GAMEMASTERS.sort(() => Math.random() - 0.5).slice(0, size);

/**
 * Returns a list of trained gamemasters ids by session.
 * @param {{ id: number; trained_rooms: number[] }[] } gamemasters 
 * @param {{ room: { id: number } }[] } sessions 
 * @returns {number[][]}
 */
const getGamemasterIdsBySession = (gamemasters, sessions) =>
  sessions.map(session =>
    gamemasters
      .filter(gm => gm.trained_rooms.includes(session.room.id))
      .map(gm => gm.id));

/**
 * Backtracking algorithm to find unique combinaison of ids.
 * @param {{ index: number; selected: Set<number>; result: number[]; idsArr: number[][] }}
 * @returns 
 */
const backtrack = ({ index, selected, result, idsArr }) => {
  // if the end is reached, we found a valid combination.
  if (index === idsArr.length) {
    result.push([...selected]);
    return;
  }

  for (let id of idsArr[index]) {
    if (!selected.has(id)) {
      selected.add(id);
      // recurse to the next array
      backtrack({ index: index + 1, selected, result, idsArr });
      selected.delete(id);
    }
  }
}

/**
 * Find unique ids in the list of ids array given.
 * @param {number[][]} idsArr 
 * @returns 
 */
const findUniqueIds = (idsArr) => {
  const result = [];
  backtrack({ index: 0, selected: new Set(), result, idsArr });

  if (result.length === 0) {
    throw new Error("Le tirage est impossible");
  }

  return result[0];
}

/**
 * Assign the available gamemaster by session.
 * @param {{ sessions: { gamemaster }[]; gamemasters: { id: number }[]; availableGamemasterIds: number[] }}
 */
const assignGamemasterToSession = ({ sessions, gamemasters, availableGamemasterIds }) => {
  for (const [index, session] of sessions.entries()) {
    session.gamemaster = gamemasters.find(gm => gm.id === availableGamemasterIds[index]);
  }
}

/**
 * Display the gamemaster assigned by session.
 * @param {{ room: { name: string }, gamemaster: { name: string }}[]} sessions
 */
const displayAssignedGM = (sessions) => {
  sessions.forEach(session => {
    console.log(`Salle : \x1b[32m${session.room.name}\x1b[0m - gamemaster : \x1b[36m${session.gamemaster.name}\x1b[0m`);
  })
}
const main = () => {
  const gamemasters = random_gamemaster_array(ROOMS.length);
  const sessions = ROOMS.map(room => { return { room: room } });

  try {
    const gamemasterIdsBySession = getGamemasterIdsBySession(gamemasters, sessions);
    const availableGamemasterIds = findUniqueIds(gamemasterIdsBySession);
    assignGamemasterToSession({ sessions, gamemasters, availableGamemasterIds });
    displayAssignedGM(sessions)
  } catch (error) {
    console.warn(error.message);
  }
}

main();
