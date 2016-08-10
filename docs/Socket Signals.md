Mapping of socket signals to events on the client and server side:

SIGNAL 			EVENT
'assignRoles'	Every player will be assigned their roles in the game
'sendParty'		Party leader begins the process of choosing the quest members
'resolveParty'	Inform players of the party leader's final decision and begin next phase
'startVote'		Informs players voting has begun and gives option to accept/reject
'resolveVote'	Reveals results of player voting to accept/reject party and begin next phase
'startQuest'	Quest is starting and informs players that the party members are voting
'resolveQuest'	Inform players that the quest is over and the results of the quest