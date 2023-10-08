import { useState, useEffect } from 'react';
import GlobesCanvas from './Globes';
import { Link } from 'react-router-dom';


const Home = () =>{ 
	const [toTop, setToTop] = useState(false);
	useEffect(()=>{
		const interval = setInterval(()=>{
			setToTop((prev)=>!prev)
		},1000)
		return () => clearInterval(interval)

	},[]); 
	//const position = toTop ? 'bottom-2' : 'top-2';
	const position = toTop ? 'translate-y-0' : '-translate-y-full';
	return (
		<div className="bg-[#050816] h-full">
			<div className="bg-[url('/other/herobg.png')] w-full h-screen bg-cover bg-no-repeat flex flex-col">
			<div className="text-start flex px-20 py-16 gap-12 h-screen">
				<div className="flex flex-col justify-center items-center"> 				    
					<div className="bg-[#915eff] rounded-full h-5 w-5"></div>
					<div className="from-[#915eff] to-[#050816] h-full w-1 bg-gradient-to-b"></div>
				</div>
				<div className="flex flex-col gap-12">
					<div className="text-white text-7xl font-bold">Welcome to <span className="text-[#915eff]">  ManavApp </span> </div>
					<div className="text-white text-3xl">I solve mental health problem by using
<br/>conversational AI (a form of generative AI)</div>
				</div>
			</div>

			<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl m-auto px-0.5 py-4">
					<Link to="/meethome" className="m-auto bg-[#151030] rounded-2xl px-5 py-4 text-white">Meet a Counsellor</Link>
			</div>
			<div className="mx-auto border border-white py-6 px-3 border-4 rounded-full relative mt-12">
				<div className={`w-2 h-3 rounded-full bg-white absolute transition-transform duration-1000 ease-in-out transform ${position} left-2 right-2`}></div>
			</div>
			</div>

			
			<div className="flex flex-col text-white h-full px-20 py-16 bg-[#050816] gap-20">
				<div className="flex flex-col gap-8">
					<div>INTRODUCTION</div>
					<div className="text-7xl font-bold">Overview</div>
					<div>In today's fast-paced and interconnected world, taking care of our mental health has become more<br/>crucial than ever. However, finding the time and resources to seek help can be challenging. Imagine<br/> having a dedicated companion to assist you anytime, anywhere, and on your own terms. Introducing<br/> a Conversational AI Chatbot designed to address your mental health concerns, providing a safe and<br/> confidential space for self-reflection, guidance, and support.</div>
				</div>
				<div className="grid grid-cols-4 gap-20">
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
						<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?mental-health,hobby" alt=""/>
					</div>
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
					<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?mental-health,reading" alt=""/>
					</div>
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
					<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?mental-health,technology" alt=""/>
					</div>
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
					<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?mental-health,meditation" alt=""/>
					</div>
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
					<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?mental-health,exercise" alt=""/>
					</div>
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
					<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?mental-health,relaxation" alt=""/>
					</div>
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
					<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?technology,mental-health" alt=""/>
					</div>
					<div className="bg-gradient-to-b from-emerald-500 to-violet-500 rounded-2xl">
					<img className="rounded-2xl p-0.5" src="https://source.unsplash.com/random/1000x683/?technology,chatbot" alt=""/>
					</div>
				</div>

			</div>
			<div className="bg-[#050816] h-full px-20 py-16 flex justify-between gap-12">
				<div className="justify-start bg-[#100d25] rounded-xl flex flex-col p-5 text-white gap-12 w-1/2 h-fit">
					<div>GET IN TOUCH</div>
					<div className="text-6xl font-bold">Contact.</div>

					<div className="flex flex-col gap-5">
						<div>Your Name</div>
						<div>
							<input type="text" placeholder="What's your name?" className="bg-[#151030] p-4 w-full rounded-xl"/>
						</div>
					</div>

					<div className="flex flex-col gap-5">
						<div>Your Email</div>
						<div>
							<input type="email" placeholder="What's your email?" className="bg-[#151030] p-4 w-full rounded-xl"/>
						</div>
					</div>

					<div className="flex flex-col gap-5">
						<div>Your Message</div>
						<div>
							<textarea id="" name="" cols="30" rows="2" className="bg-[#151030] p-4 w-full rounded-xl" placeholder="What do you want to say?" ></textarea>
						</div>
					</div>

					<div>
						<button className="bg-[#151030] px-12 py-4 rounded-xl shadow-xl">
							Send
						</button>
					</div>



				</div>
				

				<div className="justify-end w-1/2">
					<GlobesCanvas/>
				</div>
			</div>

		</div>
	);
};

export default Home;
