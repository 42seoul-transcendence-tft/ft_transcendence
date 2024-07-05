export const BOARD = {
    WIDTH: 1300,
    HEIGHT: 800,
};

export const PADDLE = {
    WIDTH: 20,
    HEIGHT: 120,
    OFFSET_X: 50,
    BORDER_RADIUS: 10,
    COLOR: "white",
    DIRECTION: {
        UP: -1,
        DOWN: 1,
        NONE: 0,
    },
    TRANSITION: "top 0.05s linear",
    SPEED: 20,
    COUNT: 2,
};

export const BALL = {
    RADIUS: 15,
    WIDTH: 30,
    HEIGHT: 30,
    COLOR: "white",
    TRANSITION: "top 0.1s linear, left 0.1s linear",
};

export const INIT = {
    BALL: {
        X: (BOARD.WIDTH / 2) - BALL.RADIUS,
        Y: (BOARD.HEIGHT / 2) - BALL.RADIUS,
        SPEED: 5,
        DIRECTION: { X: -1, Y: 0 },
    },
    PADDLE1: {
        X: PADDLE.OFFSET_X - (PADDLE.WIDTH / 2),
        Y:  (BOARD.HEIGHT / 2) - (PADDLE.HEIGHT / 2),
    },
    PADDLE2: {
        X: BOARD.WIDTH - (PADDLE.OFFSET_X + (PADDLE.WIDTH / 2)),
        Y:  (BOARD.HEIGHT / 2) - (PADDLE.HEIGHT / 2),
    }
};

export const KEY = {
    P1: ['w', 's'],
    P2: ['ArrowUp', 'ArrowDown'],
    UP: ['w', 'ArrowUp'],
    DOWN: ['s', 'ArrowDown'],
    VALUE: {
        UP: -1,
        DOWN: 1,
        NONE: 0,
    }
}

export const GAME = {
    TYPE: {
        PONG: "pong",
        MTT: "mtt",
    },
    POSITION: {
        LEFT: "left",
        RIGHT: "right",
    },
    RESULT: {
        WIN: "win",
        LOSE: "lose",
    },
    SCORE: {
        START: 0,
        END: 7,
    },
};

const DEFAULT_URL = "https://10.32.6.1:4242/";

const PORT = {
    BACK_API: 8000,
    SOCKET: 8001,
}
const PATH = {
    SOCKET: {
        PONG: "/api/pong",
        MTT: "/api/mtt",
    },
}

export const URL_PATH = {
    BACK_API: `${DEFAULT_URL}:${PORT.BACK_API}`,
    SOCKET: {
        PONG: `https://10.15.6.2:4242/api/pong`,
        MTT: `https://10.15.6.2:4242/api/mtt`,
    }
}

export const SOCKET = {
    EVENT: {
        KEY: "key",
        ROOM: "room",
        JOIN_ROOM: "join_room",
        LEAVE_ROOM: "leave_room",
        GAME: "game",
        READY: "ready",
        RESULT: "result",
        NEXT_GAME: "next_game",
    },
    VALUE: {
        KEY: {
            UP: -1,
            DOWN: 1,
            NONE: 0,
        },
    },
}