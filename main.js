const WIDTH = 10;
const HEIGHT = 10;
const MINE_COUNT = 3;
const CELL_SIZE = 30;

let gameover = false;
let left_count = 0;

const board = [];
const open_targets = [];

const reset_board = () => {
  // ボードを作成する
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      left_count++;
      board[y][x] = {
        text: ""
      };
    }
  }

  // 爆弾を設置する
  for (let i = 0; i < MINE_COUNT; i++) {
    let x, y;
    do {
      x = Math.trunc(Math.random() * WIDTH);
      y = Math.trunc(Math.random() * HEIGHT);
    } while (board[y][x].mine);
    board[y][x].mine = true;
    left_count--;
  }
};

const init = () => {
  const container = document.getElementById("container");
  container.style.width = `${WIDTH * CELL_SIZE}px`;
  container.style.height = `${HEIGHT * CELL_SIZE}px`;

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const div = document.createElement("div");
      container.appendChild(div);
      board[y][x].element = div;

      div.style.position = "absolute";
      div.style.width = `${CELL_SIZE}px`;
      div.style.height = `${CELL_SIZE}px`;
      div.style.left = `${x * CELL_SIZE}px`;
      div.style.top = `${y * CELL_SIZE}px`;
      div.style.backgroundColor = "#ccc";
      div.style.border = "3px outset #ddd";
      div.style.boxSizing = "border-box";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "center";
      div.style.fontSize = `${CELL_SIZE * 0.7}px`;

      div.onpointerdown = () => {
        if (gameover) {
          return;
        }

        if (document.getElementById("flag").checked) {
          flag(x, y);
        } else {
          open_targets.push([x, y]);
          open();
        }
      };
    }
  }
};

const flag = (x, y) => {
  const cell = board[y][x];
  if (cell.open) {
    return;
  }
  if (cell.text === "🚩") {
    cell.text = "";
  } else {
    cell.text = "🚩";
  }
  update();
};

const update = () => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = board[y][x];
      cell.element.textContent = cell.text;
      if (cell.open) {
        cell.element.style.border = "1px solid #888";
      }
    }
  }
};

const showAllMines = () => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = board[y][x];
      if (cell.mine) {
        cell.text = "💣";
      }
    }
  }
};

const open = () => {
  while (open_targets.length) {
    const [x, y] = open_targets.pop();
    const cell = board[y][x];
    if (cell.open) {
      continue;
    }
    cell.open = true;
    left_count--;
    if (cell.mine) {
      gameover = true;
      showAllMines();
      cell.text = "💥";
      update();
      continue;
    }

    let count = 0;
    let targets = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = x + dx;
        const cy = y + dy;
        if (cx < 0 || cy < 0 || cx >= WIDTH || cy >= HEIGHT) {
          continue;
        }
        targets.push([cx, cy]);
        if (board[cy][cx].mine) {
          count++;
        }
      }
    }
    if (count > 0) {
      cell.text = count;
    } else {
      cell.text = "";
      open_targets.push(...targets);
    }
    if (left_count === 0) {
      gameover = true;
      showAllMines();
    }
  }
  update();
};

window.onload = () => {
  reset_board();
  init();
  const start_time = Date.now();
  const tick = () => {
    if (gameover) {
      return;
    }
    const time = Date.now() - start_time;
    document.getElementById("timer").textContent = (time / 1000).toFixed(2);
    requestAnimationFrame(tick);
  };
  tick();
};
