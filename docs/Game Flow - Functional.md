- Lobby -
  Sends:
    5+ Player IDs
    Redis server to use

avalonLogic(players, db) {
  Tasks Required:
   1: Assign Roles
   2: Choose Team
   3: Vote Team
        If veto
          If 5th veto
            Go to 6: Game Over - Lose
          Else
            Go to 2: Choose Team
        Else
          Go to 4: Mission
   4: Mission
        If Success
          If 3 wins
            Go to 5: Guess Merlin
          Else
            Go to 2: Choose Team
        If Failure
          If 3 losses
            Go to 6: Game Over - Lose
   5: Guess Merlin
        If Guessed
          Go to 6: Game Over - Lose
        Else
          Go to 6: Game Over - Win
   6: Game Over
        Win or Loss
        Update pertinent scores
    Return players to lobby
}