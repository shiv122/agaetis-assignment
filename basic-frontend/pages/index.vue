<template>
  <div :class="currentPlayer ? 'bg-[#ff9900a4]' : 'bg-[#90d26d9d]'"
    class="bg-gray-300 flex flex-col gap-5 justify-center items-center h-screen">
    <div class="bg-white p-4 rounded-lg shadow-md flex w-[30rem] justify-between">
      <h4 class=" text-lg whitespace-nowrap">Current Player : {{ currentPlayer ? 'X' : 'O' }}</h4>
      <h4 class=" text-md underline whitespace-nowrap">
        <nuxt-link to="/multiplayer" class="flex">
          Play Multiplayer
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z" />
          </svg>
        </nuxt-link>
      </h4>
    </div>
    <div class="bg-white p-8 rounded-lg shadow-md w-[30rem] h-[30rem]">
      <div class="flex w-full justify-around" v-for="(row, i) of grid" :key="i">
        <button class="h-[6rem] w-[6rem] border-4 border-[#D9EDBF] m-[1rem] rounded-lg "
          :class="cell ? 'text-[#FF9800]' : 'text-[#90D26D]'" v-for="(cell, j) of row" :key="j" @click="play(i, j)">
          <span v-if="cell === null"></span>
          <div v-else-if="cell === false">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0" />
            </svg>
          </div>
          <div v-else-if="cell === true">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
        </button>
      </div>
    </div>
    <div class="bg-white p-4 rounded-lg shadow-md w-[30rem]">
      <div class="flex justify-between">
        <button class=" px-4 py-2 bg-red-400 rounded text-white flex gap-1" @click="reset">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4m-4-6v3m0 3h.01" />
          </svg>
          Reset</button>
        <button class=" px-4 py-2 bg-yellow-400 rounded text-white flex gap-1" @click="undo">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="m15 15l-3-3l3-3m-4 6l-3-3l3-3" />
              <path d="M21 12a9 9 0 1 0 0 .265z" />
            </g>
          </svg>
          Undo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const grid = ref([
  [null, null, null],
  [null, null, null],
  [null, null, null],
]);
const winner = ref(null);
const tied = ref(false);
const gameover = ref(false);
const currentPlayer = ref(true);

let timeline = [];
let move = 0;




const play = (i, j) => {
  if (gameover.value) {
    return
  }
  if (grid.value[i][j] !== null) {
    return
  }
  move++;
  grid.value[i][j] = currentPlayer.value
  checkWinner()
  updateTimeline(grid.value.map(row => [...row]), move, currentPlayer.value);
  if (!gameover.value) {
    currentPlayer.value = !currentPlayer.value
  }
}


const router = useRouter()





const updateTimeline = (grid, move, currentPlayer) => {
  timeline.push({
    "move": move,
    "grid": grid,
    "player": currentPlayer,
  })
}

const checkWinner = () => {
  //
  const winningConditions = [
    // --
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // |
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // \
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    const [x1, y1] = a;
    const [x2, y2] = b;
    const [x3, y3] = c;
    if (
      grid.value[x1][y1] !== null &&
      grid.value[x1][y1] === grid.value[x2][y2] &&
      grid.value[x1][y1] === grid.value[x3][y3]
    ) {
      winner.value = grid.value[x1][y1];
      push.success({
        title: "Game Over",
        message: (currentPlayer.value ? 'X' : 'O') + " Won the game"
      })
      gameover.value = true;
      return;
    }
  }

  if (!gameover.value) {
    let isTied = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid.value[i][j] === null) {
          isTied = false;
          break;
        }
      }
      if (!isTied) break;
    }

    if (isTied) {
      push.success({
        title: "Game Over",
        message: "This game as been a tie"
      })
      tied.value = true;
      gameover.value = true;
    }
  }
};


const undo = () => {
  if (timeline.length <= 0) {
    return
  }
  timeline.pop();
  const updatedGrid = timeline[timeline.length - 1]?.grid;
  if (updatedGrid === undefined) {
    console.log(updatedGrid);
    reset();
    return;
  }
  grid.value = updatedGrid;
  currentPlayer.value = !currentPlayer.value
}


const reset = () => {
  grid.value = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  winner.value = null;
  tied.value = false;
  gameover.value = false;
  currentPlayer.value = true;
  timeline = [];
  move = 0;
  push.error('Game Resetted')
}


</script>
