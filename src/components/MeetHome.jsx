import app from '../firebase/firebase.config.js'
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Import the uuid function
import { useEffect, useState, useRef } from 'react';

const MeetHome = () => {

	// %% taking the params and work it with firebase database
	const database = getDatabase();
	let dbRef;
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
	const roomId = urlParams.get("id");

if(roomId){
        dbRef = ref(getDatabase(), roomId)
}else{
        const newRoomKey = uuidv4();
        window.history.replaceState(null,"Meet",`?id=${newRoomKey}`)

        const newData = {

        }
        dbRef = ref(getDatabase() , newRoomKey)
        set(dbRef, newData)

}                                                                                                        




	return (
		<div>
			<div className="mx-auto w-fit">{userName}</div>

		</div>
	);
};

export default MeetHome;
