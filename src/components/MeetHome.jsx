import app from '../firebase/firebase.config.js'
import { getDatabase, ref, set, push, child, onDisconnect, get, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Import the uuid function
import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";


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
	console.log(dbRef)

	
	const auth = getAuth(app);
	let connectedRef = ref(database, ".info/connected")
	const participantRef = child(dbRef,"participants")
	console.log(connectedRef,"eita connectedRef")
	console.log(participantRef,"eita participantRef")
	let userRef;

	console.log(auth,"eita auth")

	useEffect(()=>{
	//	if (connectedRef.key == "connected") {
	//	connectedRef.on('value', (snap) => {
			//if(snap.val()){
			if(auth){
				console.log("User is connected")
				const defaultPreferences = {
					audio: true,
					video: false,
					screen: false
				}
				userRef = push(participantRef,{
					userName,
					preference: defaultPreferences
				})
				console.log(userRef,"eita userRef")
				console.log(userRef.key,"eita userRef er key")
				//userRef.onDisconnect().remove();
			} 
			else
			{
				console.log("User is not connected")

			}
//		})
			

		return ()=>{
			remove(userRef);
			console.log(userRef?.key,"eita userRef er key, unmount er pore")
		}
			
	},[userName])
	

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
				onDisconnect(userRef).remove();
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
