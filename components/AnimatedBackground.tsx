"use client"
export default function AnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(0.9)} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,20px)} 66%{transform:translate(-15px,-10px)} }
      `}</style>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:`linear-gradient(rgba(153,69,255,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(153,69,255,0.04) 1px, transparent 1px)`,backgroundSize:'64px 64px'}} />
      <div style={{position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'900px',height:'500px',pointerEvents:'none',zIndex:0,background:'radial-gradient(ellipse at center top, rgba(153,69,255,0.18) 0%, transparent 65%)'}} />
      <div style={{position:'fixed',top:'10%',left:'5%',width:300,height:300,borderRadius:'50%',background:'rgba(153,69,255,0.08)',filter:'blur(80px)',pointerEvents:'none',zIndex:0,animation:'orb1 12s ease-in-out infinite'}} />
      <div style={{position:'fixed',top:'60%',right:'8%',width:250,height:250,borderRadius:'50%',background:'rgba(20,241,149,0.06)',filter:'blur(80px)',pointerEvents:'none',zIndex:0,animation:'orb2 15s ease-in-out infinite'}} />
      <div style={{position:'fixed',top:'30%',right:'25%',width:200,height:200,borderRadius:'50%',background:'rgba(153,69,255,0.05)',filter:'blur(80px)',pointerEvents:'none',zIndex:0,animation:'orb3 18s ease-in-out infinite'}} />
      <div style={{position:'fixed',bottom:'10%',left:'20%',width:350,height:350,borderRadius:'50%',background:'rgba(20,241,149,0.04)',filter:'blur(80px)',pointerEvents:'none',zIndex:0,animation:'orb1 20s ease-in-out infinite reverse'}} />
      <div style={{position:'fixed',top:'5%',right:'5%',width:150,height:150,borderRadius:'50%',background:'rgba(249,115,22,0.04)',filter:'blur(80px)',pointerEvents:'none',zIndex:0,animation:'orb2 10s ease-in-out infinite'}} />
      <div style={{position:'fixed',bottom:'30%',right:'40%',width:180,height:180,borderRadius:'50%',background:'rgba(153,69,255,0.06)',filter:'blur(80px)',pointerEvents:'none',zIndex:0,animation:'orb3 14s ease-in-out infinite reverse'}} />
    </>
  )
}
