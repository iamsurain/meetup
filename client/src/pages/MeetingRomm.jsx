import React, { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyMeetingDetails, dummyUser } from '../assets/asset'
import VideoGrid from '../components/meeting/VideoGrid'
import useWebRTC from '../hooks/useWebRTC'
import ChatPanel from '../components/meeting/ChatPanel'
import { useChat } from '../hooks/useChat'
import ParticipantsList from '../components/meeting/ParticipantsList'
import ControlBar from '../components/meeting/ControlBar'
import toast from 'react-hot-toast'

const MeetingRomm = () => {
  const {meetingId} = useParams()
  const navigate = useNavigate()
  const userdata = dummyUser;

  const [isParticipantOpen, setIsParticipantOpen] = useState(false)

  const handleMeetingEnded = useCallback(()=>{
    navigate('/dashboard')
  }, [navigate])

  // initialize web rtc
  const {
  localStream,
  remoteUsers,
  audioEnabled,
  videoEnabled,
  toggleAudio,
  toggleVideo,
  endMeeting
} = useWebRTC(meetingId, userdata, handleMeetingEnded)

// initialize chat
const {messages, sendMessage, unreadCount, isChatOpen, toggleChat} = useChat(meetingId, userdata)



  const isHost = true;

  const handleLeave = ()=>{
      toast("You left the meeting");
      navigate("/dashboard")
  }

  const handleEndLeave = ()=>{
      endMeeting();
      toast("Meeting ended for all participants")
      navigate("/dashboard")
  }
  return (
    <div className='h-screen w-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden relative font-sans'>
      
      {/* top bar */}

      <header className='w-full bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs'>
        <div className='flex items-center gap-3'>
        <h2 className='text-base font-semibold text-slate-900 tracking-tight'>
          {dummyMeetingDetails.title} ({meetingId || dummyMeetingDetails.meetingId})
        </h2>
        <span className='size-1.5 rounded-full bg-emerald-500 animate-pulse'/>
        </div>
      </header>

      {/* main content area (video grid) + side panel */}
      <div className='flex-1 flex overflow-hidden relative'>

        {/* video grid center */}
        <VideoGrid
  localStream={localStream}
  localUser={userdata}
  remoteUsers={remoteUsers}
  audioEnabled={audioEnabled}
  videoEnabled={videoEnabled}
/>


        {/* in meeting chat drawer */}
        <ChatPanel isOpen={isChatOpen} onClose={toggleChat} messages={messages} onSendMessage={sendMessage} currentUser={userdata}/>

        {/* participants drawer */}
        <ParticipantsList isOpen={isParticipantOpen} onClose={()=> setIsParticipantOpen(false)} localUser={userdata} localAudio={audioEnabled} localVideo={videoEnabled} remoteUsers={remoteUsers} meetingHostId={dummyUser.id}/>

        
      </div>
      {/* bottom floating control bar */}
        <ControlBar roomId={meetingId || dummyMeetingDetails.meetingId} audioEnabled={audioEnabled} VideoEnabled={videoEnabled} onToggleAudio={toggleAudio} onToggleVideo={toggleVideo} onToggleChat={toggleChat} onToggleParticipants={()=>setIsParticipantOpen((prev)=> !prev)} isChatOpen={isChatOpen} isParticipantOpen={isParticipantOpen} unreadCount={unreadCount} ParticipantCount={1 + remoteUsers.length} isHost={isHost} onLeave={handleLeave} onEndMeeting={handleEndLeave} />
    </div>
  )
}

export default MeetingRomm
