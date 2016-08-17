Format to handle multiple, simultaneous Redis DB's spun as needed.
Each DB is stored as a reference via it's Game ID (GID)

Keys: GAMEID         [String]
      PIDS           [List - Number, PID:NUM]
      PID:ROLE       [String]
         :VOTE       [Bool]
      KNIGHTS        [List - Number, PID:NUM]
      MINIONS        [List - Number, PID:NUM]
      SIZE           [Number, 5 - 10]
      STAGE:ROUND    [Number, 1 - 5]
           :PHASE    [String]
      LEADER         [Number, PID:NUM]
      TEAM           [List - Numbers, PID:NUM]
      VETO           [Number, 1 - 5]
      QRESULT        [List - Bool] 
      VOTECOUNT      [List - Bool, PID:VOTE]
      SCORE:WIN      [Number, 1 - 3]
           :LOSS     [Number, 1 - 3]
      MGUESS         [Number, PID:NUM]
      MERLIN         [Number, PID:NUM]
      ASSASSIN       [Number. PID:NUM]
      WINNER         [Bool, true/knights - false/minions]


DB Info - handler to track all of the info and setup about the db's handling the game logic

Keys: GAMEID:CAP:MAX    [Number, 5 - 10]
                :CUR    [Number, 0 - MAX]
             STATUS     [String, Ready-Running-Waiting]
      GAMEIDS           [Set - Strings]