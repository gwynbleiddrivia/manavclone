import { ADD_PARTICIPANT, REMOVE_PARTICIPANT, SET_USER } from './actiontype';
let initialState = {
	currentUser: null,
	participants: {},
}
export const reducer = (state = initialState, action) => {
					switch(action.type){
						case SET_USER: {
							let { payload } = action;
							state = {...state, currentUser: {...payload.currentUser}};
							return state;
						}
						case ADD_PARTICIPANT: {
							let { payload } = action;
							const currentUserId = Object.keys(state.currentUser)[0]
							const participantId = Object.keys(payload.participant)[0]
							let participants = {...state.participants, ...payload.participant }
							if(currentUserId === participantId){
							//	payload.participant[participantId].currentUser = true;
							  participants = {
							  		...participants, [participantId]: {...participants[participantId], currentUser: true,
									},
									};

							}
							state = {...state, participants};
							return state;
						}
						case REMOVE_PARTICIPANT: {
							let { payload } = action;
							let participants = {...state.participants }
							delete participants[payload.participantKey]
							state = {...state, participants};
							return state;
						}
						default:{
							return state
						}
					}					
				}
