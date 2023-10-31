import app from '../firebase/firebase.config.js';
import { getDatabase, ref, set, push, child, onDisconnect, get, remove, onValue } from 'firebase/database';
import { useEffect, useState, useRef } from 'react';

import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'wrtc'; // You need to install a WebRTC library like 'wrtc'



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
	const [admitStatList, setAdmitStatList] = useState(null);
	const [videoList, setVideoList] = useState(null);
	const [screenList, setScreenList] = useState(null);

	const [remoteStreams, setRemoteStreams] = useState({});

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



	//Creating a peer connection and a media stream for aduio and video -- start

	// Step 1: Create a peer connection
	const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }; // Use a STUN server
	const peerConnection = new RTCPeerConnection(configuration);
	// Step 2: Create a media stream for audio and video
	const mediaConstraints = { audio: true, video: true };
	let localStream; // Store the local media stream


	//Creating a peer connection and a media stream for aduio and video -- end 

	


	//Offerer and Answerer functions -- start
	
	// Offer Creation (Offerer)
	const createOffer = async () => {
	  const offer = await peerConnection.createOffer();
	  await peerConnection.setLocalDescription(offer);

	  // Send the offer to the other peer using your signaling mechanism
	  // Example: sendOfferToOtherPeer(offer);
	  const sdpOffer = peerConnection.localDescription;
	  set(child(participantRef, 'sdpOffer'), sdpOffer);

	};

	// Answer Creation (Answerer)
	const createAnswer = async (receivedOffer) => {
	  await peerConnection.setRemoteDescription(receivedOffer);
	  const answer = await peerConnection.createAnswer();
	  await peerConnection.setLocalDescription(answer);

	  // Send the answer back to the offerer
	  // Example: sendAnswerToOfferer(answer);
	   const sdpAnswer = peerConnection.localDescription; // Get the SDP answer
	   set(child(participantRef, 'sdpAnswer'), sdpAnswer);

	};

	// Receiving Offer (Answerer)
	  const receiveOffer = async () => {
	    const offerSnapshot = await get(child(participantRef, 'sdpOffer'));
	    if (offerSnapshot.exists()) {
	      const offer = new RTCSessionDescription(offerSnapshot.val());
	      await createAnswer(offer);
	    }
	  };





	// Receiving Answer (Offerer)

	  const receiveAnswer = async () => {
	    const answerSnapshot = await get(child(participantRef, 'sdpAnswer'));
	    if (answerSnapshot.exists()) {
	      const answer = new RTCSessionDescription(answerSnapshot.val());
	      await peerConnection.setRemoteDescription(answer);
	    }
	  };




	//Offerer and Answerer functions -- end






	//User name taken from prompt and put to database -- start
	const userNameSetRef = useRef(false);
	const [userName, setUserName] = useState("")
	const [currentKey, setCurrentKey] = useState("")
//	const [currentRole, setCurrentRole] = useState("")


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
					setCurrentKey(userRef.current?.key);

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
							const ad_list = objValParticipants[0]?.map(item=>item?.preference?.admitStat)
							const v_list = objValParticipants[0]?.map(item=>item?.preference?.video)
							const s_list = objValParticipants[0]?.map(item=>item?.preference?.screen)

							setParticipantsList(p_list)
							setRoleList(r_list)
							setKeyList(k_list)
							setAudioList(a_list)
							setAdmitStatList(ad_list)
							setVideoList(v_list)
							setScreenList(s_list)
						}

					})
				



				}
			userNameSetRef.current = true;

			}


		}
		

		// Function to get user media and add it to the peer connection
		const setupMedia = async () => {
			try {
				localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
				localStream.getTracks().forEach((track) => {
					peerConnection.addTrack(track, localStream);
				});
				// Handle the stream here (e.g., display it in your UI)
				
				console.log(localStream,"This is local stream");

			} catch (error) {
				console.error('Error accessing user media:', error);
			}
		};

		setupMedia();
		createOffer();
	





		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		}

	},[userName]);

	//User name taken from prompt and put to database -- end 



	
		peerConnection?.addEventListener('track',(event) => {
			const remoteStream = event.streams[0];
			console.log(remoteStream,"Hereeee");
			const participantKey = currentKey;
			console.log(currentKey, "This is experimental current Key!!!!!!!!!");
			setRemoteStreams((prevStreams) => ({
				...prevStreams, [participantKey]: remoteStream,
			}));
		});















	//Zipping up username, role and userkey and sort users alphabetically based on roles, remembering hostKey -- start
	
	console.log(participantsList,"userguli");
	console.log(roleList,"roleguli");
	console.log(keyList,"keyguli");
	console.log(audioList, "audioguli")	
	console.log(admitStatList,"admitStatguli")

	const zipDouble = participantsList?.map((user,role)=>[user,roleList[role]])
	const zipTriple = zipDouble?.map((userrole, key) => userrole.concat(keyList[key]))
	const zipQuadruple = zipTriple?.map((userrolekey, audio) => userrolekey.concat(audioList[audio]))
	const zipPenta = zipQuadruple?.map((userrolekeyaudio, admitStat) => userrolekeyaudio.concat(admitStatList[admitStat]))
	const zipHexa = zipPenta?.map((userrolekeyaudioadmitStat, video) => userrolekeyaudioadmitStat.concat(videoList[video]))
	const zip = zipHexa?.map((userrolekeyaudioadmitStatvideo, screen) => userrolekeyaudioadmitStatvideo.concat(screenList[screen]))

	const zipList = zip?.sort((a,b) => a[1].localeCompare(b[1]));
	//const zipList = zip;
	console.log(zipList, "zipList")

	const hostKeyIndex = roleList?.findIndex((item)=> item === 'host')
	const hostKey = keyList?  keyList[hostKeyIndex] : null
	console.log(hostKey,"hostKey")

	//Zipping up username, role and userkey and sort users alphabetically based on roles, remembering hostKey -- end 


	//Determining current user role, audio, video, screen --start

	const currentRole = zipList?.filter(item => item[2] === currentKey)[0][1]
	const currentAudio = zipList?.filter(item => item[2] === currentKey)[0][3]
	const currentAdmit = zipList?.filter(item => item[2] === currentKey)[0][4]
	const currentVideo = zipList?.filter(item => item[2] === currentKey)[0][5]
	const currentScreen = zipList?.filter(item => item[2] === currentKey)[0][6]

	//Determining current user role, audio, video, screen --end





	// Separate zipList in terms of admitStat -- start
	const trueZipList = zipList?.filter(item => item[4] === true);
	const falseZipList = zipList?.filter(item => item[4] === false);
	
	// Separate zipList in terms of admitStat -- end 


	
	//Making the first user host -- start

	if(keyList?.[0]){
		set(child(dbRef ,`/participants/${keyList?.[0]}/preference/role`),"host");
		set(child(dbRef, `/participants/${keyList?.[0]}/preference/admitStat`),true)
	}

	//Making the first user host -- end 







	
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

	


	//Video On Off function -- start
	

	const makeVideoOn = (key) => {
		set(child(dbRef, `/participants/${key}/preference/video`),true)
	}
	const makeVideoOff = (key) => {
		set(child(dbRef, `/participants/${key}/preference/video`),false)
	}
	

	//Video On Off function -- end 





	//Share Screen On Off function-- start
	

	const makeShareScreenOn = (key) => {
		set(child(dbRef, `/participants/${key}/preference/screen`),true)
	}
	const makeShareScreenOff = (key) => {
		set(child(dbRef, `/participants/${key}/preference/screen`),false)
	}
	

	//Share Screen On Off function-- end 










	// Make admitStat true -- start
	
	const makeAdmitStat = (key) => {
		set(child(dbRef, `/participants/${key}/preference/admitStat`),true)
	}

	const makeAdmitStatAll = () => {
		falseZipList?.map(item=>item[2])?.map((key) => {
			makeAdmitStat(key);
		})
	}

	// Make admitStat true -- end 

	


	return (
		<div className="flex">
			{currentAdmit?

			<div className="flex flex-col w-full border border-black">
			<div className="w-full h-full m-auto grid grid-cols-3 gap-3 border border-black">
				{trueZipList?
					trueZipList?.map(participant => {
					    const participantKey = participant[2];
					    const remoteStream = remoteStreams[participantKey];
					    console.log(remoteStream,"This is remoteStream!!!")
					    console.log(remoteStreams,"This is remoteStreamsszz!!!")
						return (
							<div>
							{
								remoteStream ? 
									<div key={participantKey}>
									    <video autoPlay ref={(videoRef) => {
										if (videoRef && remoteStream) {
										    videoRef.srcObject = remoteStream;
										}
									    }} />
									</div>:

									<div className="w-52 h-52 m-auto border border-black">
										<div className="mx-auto w-fit">
											{participant[0].slice(0,2)}
										</div>
									</div>

							}
							</div>
						)
					})
					:<></>
				}
			</div>
		
			<div className="mx-auto w-fit">
				<div className="flex gap-12">

					<div>
					Audio:
					{currentAudio ? 
					<>
						"on"
						<button onClick={()=>makeMute(currentKey)}>Mute</button>

					</>
					: 
					<>
					"off"
						<button onClick={()=>makeUnmute(currentKey)}>Unmute</button>
					
					</>
					}
					</div>
	
					<div>
					Video:
					{currentVideo ? 
					<>
					"on" 
						<button onClick={()=>makeVideoOff(currentKey)}>Stop Camera</button>

					</>
					: 
					<>
					"off"
						<button onClick={()=>makeVideoOn(currentKey)}>Start Camera</button>
					
					</>
					}
					</div>
									
	
					<div>
					Screen:
					{currentScreen ? 
					<>
					"on" 
						<button onClick={()=>makeShareScreenOff(currentKey)}>Stop Sharing Screen</button>

					</>
					: 
					<>
					"off"
						<button onClick={()=>makeShareScreenOn(currentKey)}>Start Sharing Screen</button>
					
					</>
					}
					</div>
									



				</div>
			</div>
			</div>

			:<></>}

			<div className="flex flex-col mx-auto mt-2 w-fit">
				<div className="flex flex-col justify-between gap-2 mx-auto w-fit">
				<div className="flex gap-12 mx-auto">
					<div className="justify-start">
						user name: {userName}
					</div>
{/*
					<div className="justify-start">
						key: {currentKey}
					</div>

*/}
					<div className="justify-start">
						role: {currentRole}
					</div>
	
				</div>
				<div className="flex gap-12 mx-auto">
					<div>
						audio: {currentAudio? "on" : "off"}
					</div>

					<div>
						video: {currentVideo? "on" : "off"}
					</div>

					<div>
						screen: {currentScreen? "on" : "off"}
					</div>

					{ currentRole === "host" ?
					<div className="justify-end">
						<button onClick={makeMuteAll}>Mute all</button>
					</div> :
					<></>
					}


				</div>
				</div>

				<div className="w-fit mx-auto">
					{currentAdmit? "connected":"waiting to be approved by host.."}
				</div>

		

				{trueZipList?.length > 0 ? 
				<div>
					<p className= "w-fit mx-auto mt-12">Admitted List</p>
				</div>
				:
				<></>

				}

				<div className="">
					{trueZipList?.map((participant)=>{
							
							const participantKey = participant[2]

							return <div className="flex gap-12 w-fit mx-auto">
{/*
								 <div className="">  
									{participantKey}
								 </div>  
*/}

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
									{currentRole === "host"?
										<button onClick={()=>makeMute(participantKey)}>Mute</button>:
										<></>
									}

									</>
									: 
									<>
									"off"
									{currentRole === "host"?
										<button onClick={()=>makeUnmute(participantKey)}>Unmute</button>:
										<></>
									}	
									
									</>
									}
								 
								 </div>
{/*
								<div>
									{participant[4] ? "true" : "false"}
								</div>
*/}
								{currentRole === "host"?
									<button onClick={()=>makeHost(participantKey)}>Make host</button>:
									<></>
								}
							</div>
					})}
				
					{ currentRole === "host" ?
					<div>	

							{falseZipList?.length > 0 ? 
							<div className="flex w-fit mx-auto gap-12 mt-12">
							<div>
								<p className= "w-fit mx-auto">Waiting List</p>
							</div>
							<button onClick={makeAdmitStatAll}>Admit All</button>
							</div>
							:
							<></>

							}
							
						
							{falseZipList?.map((participant)=>{


									const participantKey = participant[2]
									return <div className="flex gap-12 mx-auto w-fit">

										{/*
										<div>
											{participantKey}
										</div>
										*/}	
										
										<div>
											{participant[0]}
										</div>

										<div>
											{participant[1]}
										</div>
										{/*
										<div>
											{participant[4] ? "true" : "false"}

										</div>
										*/}

										<button onClick={()=>makeAdmitStat(participantKey)}>
											Admit
										</button>
									


									</div>






							})}

					</div> :
					<></>
					}


				</div>
			</div>
			

		</div>
	);
};

export default MeetHome;
