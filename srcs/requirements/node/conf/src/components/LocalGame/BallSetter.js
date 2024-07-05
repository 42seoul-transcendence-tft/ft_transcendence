import HitChecker from "./HitChecker";
import { BALL, PADDLE } from "./constant.js";

class BallSetter {
    setBallMove(setGame) {
        this.#ballLoop = setInterval(() => {
            setGame((prev) => {
                const newDirection = this.#getBallDirection(prev);
                const ball = prev.ball

                return ({
                    ...prev,
                    ball: {
                        ...prev.ball,
                        x: ball.x + newDirection.x * ball.speed,
                        y: ball.y + newDirection.y * ball.speed,
                        direction: newDirection,
                        speed: (ball.speed < BALL.SPEED.MAX) ? 
                            ball.speed + BALL.SPEED.ACCELLERATION : ball.speed,
                    },
                });
            });
        }, 30);
    }
    setBallStop() {
        clearInterval(this.#ballLoop);
        this.#ballLoop = undefined;
    }
    #getBallDirection(game) {
        if (HitChecker.isBallHitWall(game.ball)) 
            return ({ ...game.ball.direction, y: game.ball.direction.y * (-1) });
        else if (HitChecker.isBallHitPaddle(game.ball, game.paddle)) 
            return (this.#getPaddleBounceDirection(game.ball, game.paddle));
        else
            return (game.ball.direction);
    }
    #getPaddleBounceDirection(ball, paddles) {
        const paddle = ball.direction.x < 0 ? paddles[0] : paddles[1];
        const ballCenterY = ball.y + BALL.RADIUS;
        const paddleCenterY = paddle.y + ( PADDLE.HEIGHT / 2 );
        const relativeInterSectY = ( ballCenterY - paddleCenterY ) / ( PADDLE.HEIGHT / 2);
        const maxBounceAngle = Math.PI / 3;
        const bounceAngle = relativeInterSectY * maxBounceAngle;
        const newDirectionX = ball.direction.x < 0 ? Math.cos(bounceAngle) : -Math.cos(bounceAngle);
        const newDirectionY = Math.sin(bounceAngle);

        return ({ x: newDirectionX, y: newDirectionY });
    }
    #ballLoop;
}

export default BallSetter;