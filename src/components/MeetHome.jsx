import app from '../firebase/firebase.config.js'
import { getDatabase, ref, set, push, child } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Import the uuid function
import { useEffect, useState, useRef } from 'react';

const MeetHome = () => {

	// %% taking the params and work it with firebase database
	const database = getDatabase(app);


	let [userName, setUserName] = useState(null);	
	console.log(userName)
	const userNameSetRef = useRef(false); // Use a ref to track whether userName has been set

    useEffect(() => {
        if (!userNameSetRef.current) {
            const inputName = prompt("What's your name?             ");
            if (inputName) {
                setUserName(inputName);
                userNameSetRef.current = true; // Set the ref to true to indicate that userName has been set
            }
        }
    }, []);


	const urlParams = new URLSearchParams(window.location.search);
	const roomId = urlParams?.get("id");
	let dbRef = roomId? ref(database, roomId) :  ref(database,"ref_path") ;
	console.log(dbRef)
	if(roomId){
        	//dbRef = ref(getDatabase(), roomId)
        	dbRef = child(dbRef,roomId)
		}
	else{
		dbRef = push(dbRef)
        	//const newRoomKey = uuidv4();
        	//window.history.replaceState(null,"Meet",`?id=${newRoomKey}`)
        	window.history.replaceState(null,"Meet",`?id=${dbRef.key}`)
		console.log(dbRef.key,"eita")

	}

{/*
	let connectedRef = ref(database, ".info/connected")
	const participantRef = child(dbRef,"participants")
	useEffect(()=>{
		connectedRef.on('value', (snap)=>{
			if(snap.val()){
				const defaultPreferences = {
					audio: true,
					video: false,
					screen: false
				}
				const userRef = participantRef?.push({
					userName,
					preference: defaultPreferences
				})
				userRef.onDisconnect().remove();
			}
		})
	},[])
	
*/}

	return (
		<div>
			<div className="mx-auto w-fit">{userName}</div>

		</div>
	);
};

export default MeetHome;
