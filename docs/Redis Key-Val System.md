Format to handle multiple, simultaneous Redis DB's spun as needed.
Each DB is stored as a reference via it's Game ID (GID)

Keys: PID:NUM        [Number]
         :ROLE       [String]
      STAGE:SIZE     [Number, 5 - 10]
           :ROUND    [Number, 1 - 5]
      LEADER         [Number, PID:NUM]
      TEAM:MEMBERS   [List - Numbers, PID:NUM]
          :VOTE      [List - Bool]
      VETO           [Number, 1 - 5]
      QRESULT        [List - Bool]
      GAMESCORE:WIN  [Number, 1 - 3]
               :LOSS [Number, 1 - 3]