import app from '../firebase/firebase.config.js'
import { getDatabase, ref, set, push, child, onDisconnect, get, remove, onValue } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Import the uuid function
import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { connect } from 'react-redux';
import { setUser } from '../store/actioncreator'
import { addParticipant } from '../store/actioncreator'
import { removeParticipant } from '../store/actioncreator'

const MeetHome = () => {
	

	const database = getDatabase(app);
	const [data, setData] = useState(null);
	const dataRef = ref(database, "/")


	let [userName, setUserName] = useState(null);	
	let participantsLength;
	let participantsList;
   useEffect(() => {

    const onDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const newData = snapshot.val();
       

	if(newData){

		const roomKey = Object.keys(newData)[Object.keys(newData).length-1]
		console.log(roomKey,"roomKey")
		console.log(newData[roomKey],"participants of that room")
		participantsLength = Object.keys(newData[roomKey].participants).length
		const firstOne = Object.keys(newData[roomKey].participants)[0]
		newData[roomKey].participants[firstOne].preference.role = "host"
		newData[roomKey].participants[firstOne].preference.admitStatus = true
		newData[roomKey].participants[firstOne].preference.mhost = true
		console.log(participantsLength,"participants length")
       		setData(newData);

	}
	


      } else {
        console.log("No data available");
        setData(null);
      }
    };

    const dataListener = onValue(dataRef, onDataChange);

    return () => {
      dataListener();
    };
  }, []);


	
	const handleBeforeUnload = (event) => {
	  // Your cleanup logic here, like removing Firebase references
	  if (userRef.current) {
	    try {
	      remove(userRef.current);
	    } catch (error) {
	      console.error("Error while removing userRef:", error);
	    }
	  }

	  // You can provide a confirmation message to the user
	  //event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
	};


	useEffect(() => {
	  window.addEventListener("beforeunload", handleBeforeUnload);

	  return () => {
	    window.removeEventListener("beforeunload", handleBeforeUnload);
	  };
	}, []);

	console.log(userName)
	const userNameSetRef = useRef(false);

    useEffect(() => {
        if (!userNameSetRef.current) {
            const inputName = prompt("What's your name?");
            if (inputName) {
                setUserName(inputName);
                userNameSetRef.current = true;
            }
        }
    }, []);


	const urlParams = new URLSearchParams(window.location.search);
	const roomId = urlParams?.get("id");
//	let dbRef = roomId? ref(database, roomId) :  ref(database,"ref_path") ;
	let dbRef;
	if(roomId){
        	//dbRef = ref(getDatabase(), roomId)
        	dbRef = child(ref(database),roomId)
		}
	else{
		dbRef = push(ref(database))
        	//const newRoomKey = uuidv4();
        	//window.history.replaceState(null,"Meet",`?id=${newRoomKey}`)
        	window.history.replaceState(null,"Meet",`?id=${dbRef.key}`)
		console.log(dbRef.key,"eita")

	}
	//console.log(dbRef)

	
	const auth = getAuth(app);
	let connectedRef = ref(database, ".info/connected")
	const participantRef = child(dbRef,"participants")
//	console.log(connectedRef,"eita connectedRef")
//	console.log(participantRef,"eita participantRef")
//	console.log(participantRef._path.pieces_[0],"room key")
	let userRef = useRef(null);

//	console.log(auth,"eita auth")

	let defaultPreferences = {
					audio: true,
					video: false,
					screen: false,
					role: "user",
					admitStatus: false,
					mhost: false

	};

	useEffect(()=>{
	//	if (connectedRef.key == "connected") {
	//	connectedRef.on('value', (snap) => {
			//if(snap.val()){

			if(auth){
				console.log("User is connected")

				

				
				userRef.current = push(participantRef,{
					userName,
					preference: defaultPreferences
				})
				console.log(userRef.current,"eita userRef")
				console.log(userRef.current?.key,"participant key")
				//userRef.onDisconnect().remove();
					
				{/*
				setUser({
					[userRef.key] : {
						userName,
						...defaultPreferences,
					}
					
				})

				*/}


			} 
			else
			{
				console.log("User is not connected")

			}
//		})
			

		return ()=>{
			if(userRef.current){
				remove(userRef.current).then(()=>{
					console.log(userRef?.key,"eita userRef er key, unmount er pore")
				})
			}
		}
			
	},[userName])

	let presentRole;
	let presentAdmitStatus;
	let roomKey;
	let presentKey = userRef.current?.key;
	if(data){
	roomKey = Object.keys(data)[Object.keys(data).length-1]
	const presentLength = Object.keys(data[roomKey].participants).length
	participantsList = Object.keys(data[roomKey].participants)
	const lastOne = Object.keys(data[roomKey].participants)[presentLength-1]
	presentRole = data[roomKey].participants[presentKey].preference?.role
	presentAdmitStatus = data[roomKey].participants[presentKey].preference?.admitStatus
	console.log(presentRole,"present Role")
	console.log(participantsList,"eita oilist")
	}
	

	const [participantRoles, setParticipantRoles] = useState({});
	const [presentRoles, setPresentRoles] = useState({});
 
  	const setMhostHandler = (participantKey) => {
		console.log(participantKey)
		const roomKey = Object.keys(data)[Object.keys(data).length-1]

		const participantRef = child(ref(database), `/${roomKey}/participants/${participantKey}/preference/role`);
		const participantAdmit = child(ref(database), `/${roomKey}/participants/${participantKey}/preference/admitStatus`);

		    set(participantRef, "host")
		      .then(() => {
			console.log("Role updated successfully in Firebase.");
		      })
		      .catch((error) => {
			console.error("Error updating role in Firebase:", error);
		      });
	
		    set(participantAdmit, true)
		      .then(() => {
			console.log("admitStatus updated successfully in Firebase.");
		      })
		      .catch((error) => {
			console.error("Error updating admitStatus in Firebase:", error);
		      });
	

		    setParticipantRoles((prevRoles) => ({
		      ...prevRoles,
		      [participantKey]: "host",
		      [presentKey]: "user",

		    }));


		const presentRef = child(ref(database), `/${roomKey}/participants/${presentKey}/preference/role`);
		const presentAdmit = child(ref(database), `/${roomKey}/participants/${presentKey}/preference/admitStatus`);

		    set(presentRef, "user")
		      .then(() => {
			console.log("Role updated successfully in Firebase.");
		      })
		      .catch((error) => {
			console.error("Error updating role in Firebase:", error);
		      });

	
		    set(presentAdmit, false)
		      .then(() => {
			console.log("admitStatus updated successfully in Firebase.");
		      })
		      .catch((error) => {
			console.error("Error updating admitStatus in Firebase:", error);
		      });
	





//		data[roomKey].participants[participantKey].preference.role = "host"
//		data[roomKey].participants[presentKey].preference.role = "user"
//		presentRole = data[roomKey].participants[presentKey].preference.role

	}






	return (
		<div>
			<div className="mx-auto w-fit">
				Current user -- Name: {userName}<br/>
				role: {presentRole}
				{
					(presentAdmitStatus)?

					(participantsList)?
						
						<>

						{
						participantsList.map((participantKey)=>{
							const participant = data[roomKey]?.participants[participantKey];
								return <div> 
									{participant.userName} {participant.preference.role} 
									<button onClick={()=>setMhostHandler(participantKey)}>Make host</button>
									</div>
							})


						}

						what
						</> :

						<>
							<div>
								Loading ... No participant available yet
							</div>
						</>


					:
					<>
					This participant is a {presentRole}
					</>
				}
			</div>

		</div>
	);

};

{/*
const mapStateToProps = (state) => (
		{
			user: state.currentUser,
			participants: state.participants
		}
	);

const mapDispatchToProps = (dispatch) => (
		{
			setUser: (user) => dispatch(setUser(user)),
			addParticipant: (participant) => dispatch(addParticipant(participant)),
			removeParticipant: (participantKey) => dispatch(removeParticipant(participantKey))
		}
	);
//export default connect(mapStateToProps, mapDispatchToProps)(MeetHome);

*/}
export default MeetHome;
