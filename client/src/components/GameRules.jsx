
const GameRules = () => {
  return (
    <div>
      <h2>How to Play : </h2>
      <p>
        Every two minutes, five random numbers between 1 and 90 are drawn. You can place a bet on 1, 2, or 3 numbers before each draw.
      </p>
      <p>
        Betting costs points: 5 points for 1 number, 10 points for 2 numbers, and 15 points for 3 numbers. You start with 100 points and can only continue playing if you have enough points to place a bet.
      </p>
      <p>
        After the draw, there are three possible outcomes:
      </p>
      <ul>
        <li>
          <strong>All numbers guessed correctly:</strong> you win double the points you bet.
        </li>
        <li>
          <strong>No numbers guessed correctly:</strong> you don’t win any points.
        </li>
        <li>
          <strong>Some numbers guessed correctly:</strong> you win points proportionally based on how many numbers you guessed correctly.
        </li>
      </ul>
      <p>
        Once your points reach zero, you can no longer play.
      </p>
      <h3>List of Users:</h3>
      <ul>
        <li>user1 - password1</li>
        <li>user2 - password2</li>
        <li>user3 - password3</li>
        <li>user4 - password4</li>
        <li>user5 - password5</li>
      </ul>
    </div>
  );
};

export {GameRules};