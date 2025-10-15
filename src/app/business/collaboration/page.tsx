'use client'
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import CollaborationCreationForm from "@/components/business/collaboration/CollaborationCreationForm";
import CollaborationCard from "@/components/cards/CollaborationCard";
import Link from "next/link";
import { useState } from "react";

export default function Page(): JSX.Element {


  const [createCollab, setCreateCollab] = useState<boolean>(false)

  const COLLABORATION_DATA = [
    {
      title: "Titi’s Wedding",
      desc: "A shared space to plan Ada’s big day from choosing the perfect decorator to finding trusted makeup artists, caterers, and more. Let’s save vendors, share feedback, and make every detail unforgettable together.",
      count: 8,
      image: "/collaboration/collab.jpg"
    },

    {
      title: "Q4 Office Party",
      desc: "Let’s plan the perfect end-of-year celebration! From venues and decorators to food vendors and entertainment, this group keeps everyone in sync. Share vendors, drop ideas, and make this Q4 party one to remember.",
      count: 4,
      image: "/collaboration/collab.jpg"
    }
  ]

  return (
    <main className='relative flex flex-col items-center overflow-x-hidden '>
      {/* <div className='relative flex sm:h-[83.5vh] h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'> */}
      {/* New Navbar component  */}
      {/* <div className='sm:hidden flex'> */}
      {/* <NavbarLandingPage /> */}
      {/* </div>  */}
      {/* </div> */}


      {/* Back and create action buttons  */}
      <div className="sm:w-[1540px] mt-20 z-10">
        <div className="flex items-center justify-between w-full mb-4">
          {createCollab ? <button className="flex items-center gap-3 " onClick={() => {
            setCreateCollab(!createCollab)
          }}> <ArrowLeftIcon /> <p className="text-[18.5px]">Back</p></button> : <Link href={'/business/saved-businesses'} className="text-[18px] font-inter flex items-center gap-3">  <ArrowLeftIcon /> <p>Back</p></Link>}
          {createCollab ?
            <button className="bg-primary text-white sm:w-[148px] sm:h-[52px] rounded-2xl" onClick={() => {
              alert("Changes made")
            }}> Save changes</button> :
            <button className="bg-primary text-white sm:w-[128px] sm:h-[52px] rounded-2xl" onClick={() => {
              setCreateCollab(!createCollab)
            }}> + Create</button>}
        </div>

      </div>

      {/* Collaboration form */}
      <div className='mt:px-0 relative sm:w-[1540px] flex w-full flex-col items-center justify-center'>
        <div className='flex w-full justify-between mb-10'>
            <h1 className='text-[16px] font-bold sm:text-2xl'>
            Collaborate With Your Crew
          </h1>
        </div>

        {
          createCollab ? <CollaborationCreationForm /> : <div className="flex w-full gap-8 items-center">
            {COLLABORATION_DATA.map((collaboration, key) => {
              return <CollaborationCard key={key} title={collaboration.title} imgUrl={collaboration.image} count={collaboration.count} desc={collaboration.desc} />
            })}

          </div>
        }
      </div>
    </main>
  );
}
