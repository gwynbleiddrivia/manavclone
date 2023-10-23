import app from '../firebase/firebase.config.js';
import { getDatabase, ref, set, push, child, onDisconnect, get, remove, onValue } from 'firebase/database';
import { useEffect, useState, useRef } from 'react';




const MeetHome = () => {
	//Defining database
	const database = getDatabase(app);
	let dbRef;

	//Room Id generation -- start
	const urlParams = new URLSearchParams(window.location.search);
	const roomId = urlParams?.get("id");
	if(roomId){
		dbRef = child(ref(database),roomId)
	}
	else{
		dbRef = push(ref(database),"/")
		window.history.replaceState(null,"Meet",`?id=${dbRef.key}`)

	}


	console.log(dbRef.key, "This is Room Key");
	console.log(dbRef, "This is dbRef")


	//Room Id generation -- end

	
	//Defining some important parameters -- start

	const connectedRef = ref(database, "info/connected");
	const participantRef = child(dbRef, "participants");
	let userRef = useRef(null);
	
	const [participantsCount, setParticipantsCount] = useState(0);
	const [participantsList, setParticipantsList] = useState(null);
	const [roleList, setRoleList] = useState(null);
	const [keyList, setKeyList] = useState(null);
	const [audioList, setAudioList] = useState(null);

	//Defining some important parameters -- end 
	
	//Handling user removal upon window unload -- start
	
	const handleBeforeUnload = (event) => {
		if(userRef.current){
			try{
				remove(userRef.current);
			} catch (error) {
				console.error("Error while removing user", error)
			}
		}
	};

	



	//Handling user removal upon window unload -- end 




	//User name taken from prompt and put to database -- start
	const userNameSetRef = useRef(false);
	const [userName, setUserName] = useState("")

	useEffect(()=>{
		if(!userNameSetRef.current){
			const inputName = prompt("What's your name?");
			if(inputName){
				setUserName(inputName);
				if (inputName.trim() !== ""){
					
					let defaultPref = {
						audio: true,
						video: false,
						screen: false,
						role: "user",
						admitStat: false
					}
					console.log(userName,"eida nam")
					userRef.current = push(participantRef,{
							userName: inputName,
							preference: defaultPref
							})


					onValue(participantRef, (snapshot) => {
						if(snapshot.exists()){
							setParticipantsCount(Object.keys(snapshot.val()).length);
							const objParticipants = snapshot.val()
							const objKeyParticipants = [objParticipants].map(item=>Object.keys(item))
							const objValParticipants = [objParticipants].map(item=>Object.values(item))
							const p_list = objValParticipants[0]?.map(item=>item?.userName)
							const r_list = objValParticipants[0]?.map(item=>item?.preference?.role)
							const k_list = objKeyParticipants[0]
							const a_list = objValParticipants[0]?.map(item=>item?.preference?.audio)

							setParticipantsList(p_list)
							setRoleList(r_list)
							setKeyList(k_list)
							setAudioList(a_list)
						}

					})
				



				}
			userNameSetRef.current = true;

			}


		}
		
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		}

	},[userName]);

	//User name taken from prompt and put to database -- end 
	
	//Making the first user host -- start

	if(participantsCount === 1){
		set(child(dbRef ,`/participants/${userRef.current?.key}/preference/role`),"host");
	}

	//Making the first user host -- end 





	//Zipping up username, role and userkey and sort users alphabetically based on roles, remembering hostKey -- start
	
	console.log(participantsList,"userguli");
	console.log(roleList,"roleguli");
	console.log(keyList,"keyguli");
	console.log(audioList, "audioguli")	

	const zipDouble = participantsList?.map((user,role)=>[user,roleList[role]])
	const zipTriple = zipDouble?.map((userrole, key) => userrole.concat(keyList[key]))
	const zip = zipTriple?.map((userrolekey, audio) => userrolekey.concat(audioList[audio]))
	console.log(zip,"zip")
	const zipList = zip?.sort((a,b) => a[1].localeCompare(b[1]));
	//const zipList = zip;
	console.log(zipList)

	const hostKeyIndex = roleList?.findIndex((item)=> item === 'host')
	const hostKey = keyList?  keyList[hostKeyIndex] : null
	console.log(hostKey,"hostKey")

	//Zipping up username, role and userkey and sort users alphabetically based on roles, remembering hostKey -- end 






	
	//Make Host Function -- start
	
	
	const makeHost = (key) => {
		if(hostKey){
			set(child(dbRef, `/participants/${hostKey}/preference/role`),"user");
			set(child(dbRef, `/participants/${key}/preference/role`),"host");
		}
	};




	//Make Host Function -- end 

	
	//Mute Unmute function -- start


	const makeUnmute = (key) => {
		set(child(dbRef, `/participants/${key}/preference/audio`),true)
	}
	const makeMute = (key) => {
		set(child(dbRef, `/participants/${key}/preference/audio`),false)
	}
	
	const makeMuteAll = () => {
		const zipListSlice = zipList?.slice(1);
		const keyListSlice = zipListSlice?.map(item => item[2])
		keyListSlice.map((key) => {
			set(child(dbRef, `/participants/${key}/preference/audio`),false)
		})

	}


	//Mute Unmute function -- end 




	return (
		<div>
			<div className="flex flex-col mx-auto mt-2 w-fit">
				<div className="flex justify-between">
					<div className="justify-start">
						user name: {userName}
					</div>
					<div className="justify-end">
						<button onClick={makeMuteAll}>Mute all</button>
					</div>
				</div>
				<div>
					{zipList?.map((participant)=>{
						const participantKey = participant[2]

						return <div className="flex gap-12">

							 <div className="">  
							 	{participant[2]}
							 </div>  

							 <div className="">  
							 	{participant[0]}
							 </div>  

							 <div>
								{participant[1]}
							 </div>

							 <div className="">
							 

							 	{participant[3] ? 
								<>
								"on" 
								<button onClick={()=>makeMute(participantKey)}>Mute</button>
								</>
								: 
								<>
								"off"
								<button onClick={()=>makeUnmute(participantKey)}>Unmute</button>
								</>
								}
							 
							 </div>  


							<button onClick={()=>makeHost(participantKey)}>Make host</button>
						</div>
					})}
				</div>
			</div>
			

		</div>
	);
};

export default MeetHome;
