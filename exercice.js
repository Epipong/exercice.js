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




class GameMaster {
  /**
   * @param {number} id 
   * @param {string} name 
   * @param {number[]} trained_rooms 
   */
  constructor(id, name, trained_rooms) {
    this.id = id;
    this.name = name;
    this.trained_rooms = trained_rooms;
  }
}

class Room {
  /**
   * @param {number} id 
   * @param {string} name 
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class Session {
  /**
   * @param {Room} room 
   * @param {GameMaster} gamemaster 
   */
  constructor(room, gamemaster) {
    this.room = room;
    this.gamemaster = gamemaster;
  }
}

class EscapeGame {
  #gamemasters
  #sessions

  /**
   * @param {GameMaster[]} gamemasters 
   * @param {Session[]} sessions 
   */
  constructor(gamemasters, sessions) {
    this.#gamemasters = gamemasters;
    this.#sessions = sessions;
  }

  /**
   * Returns a list of trained gamemasters ids by session.
   * @returns {number[][]}
   */
  #getGamemasterIdsBySession = () => {
    const GMIdsBySession = [];

    for (const session of this.#sessions) {
      const ids = this.#gamemasters
        .filter(gm => gm.trained_rooms.includes(session.room.id))
        .map(gm => gm.id);
      if (ids.length === 0) {
        throw new Error(`Aucun Game Master n'est disponible pour la salle \x1b[32m${session.room.name}\x1b[0m`);
      }
      GMIdsBySession.push(ids);
    }

    return GMIdsBySession;
  }

  /**
   * Find unique ids in the list of ids array given.
   * @param {number[][]} idsArr 
   * @returns {number[]}
   */
  #findUniqueIds = (idsArr) => {
    const result = [];
    const selected = new Set();

    idsArr.map(ids => {
      for (const id of ids) {
        if (!selected.has(id)) {
          selected.add(id);
          result.push(id);
          break;
        }
      }
    });

    if (result.length !== idsArr.length) {
      throw new Error("Le tirage est impossible");
    }

    return result;
  };

  /**
   * Assign the gamemasters to the session.
   */
  assignGamemasterToSession = () => {
    const gamemasterIdsBySession = this.#getGamemasterIdsBySession();
    const availableGamemasterIds = this.#findUniqueIds(gamemasterIdsBySession);

    for (const [index, session] of this.#sessions.entries()) {
      session.gamemaster = this.#gamemasters.find(gm => gm.id === availableGamemasterIds[index]);
    }
  };

  /**
   * Display the gamemaster assigned by session.
   */
  displayAssignedGamemasters = () => {
    this.#sessions.forEach(session => {
      if (session.gamemaster) {
        console.log(`Salle : \x1b[32m${session.room.name}\x1b[0m - gamemaster : \x1b[36m${session.gamemaster?.name}\x1b[0m`);
      } else {
        console.warn(`Salle : \x1b[32m${session.room.name}\x1b[0m - gamemaster : \x1b[31m${session.gamemaster?.name}\x1b[0m`);
      }
    })
  }
}

const main = () => {
  const gamemasters = random_gamemaster_array(ROOMS.length + 2);
  const sessions = ROOMS.map(room => { return { room: room } });
  const escapeGame = new EscapeGame(gamemasters, sessions);

  try {
    escapeGame.assignGamemasterToSession();
    escapeGame.displayAssignedGamemasters();
  } catch (error) {
    console.warn(`\x1b[31m${error.message}\x1b[0m`);
  }
}

main();
