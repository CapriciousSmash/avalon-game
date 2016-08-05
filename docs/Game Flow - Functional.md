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

Each step will be a function, make pertinent calls to Redis DB.
Each Function will make call to pertinent next function
CARE: Each function should terminate into only 1 single function.
POSSIBLE ISSUE: Could be problematic as it forms a pseudo-recursive situation.

ALTERNATE:
  Jump back or forward in code as required
  Unsafe as it can cause errors if jumps aren't clear