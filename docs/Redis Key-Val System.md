Format to handle multiple, simultaneous Redis DB's spun as needed.
Each DB is stored as a reference via it's Game ID (GID)

Keys: PID:NUM        [Number]
         :ROLE       [String]
         :VOTE       [Bool]
      STAGE:SIZE     [Number, 5 - 10]
           :ROUND    [Number, 1 - 5]
      LEADER         [Number, PID:NUM]
      TEAM           [List - Numbers, PID:NUM]
      VETO           [Number, 1 - 5]
      QRESULT        [List - Bool]
      GAMESCORE:WIN  [Number, 1 - 3]
               :LOSS [Number, 1 - 3]
      MGUESS         [Number, PID:NUM]