const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="wood-grain-pattern absolute inset-0" />
      
      {/* Brighter floating wood grain elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-wood-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-40 w-56 h-56 bg-wood-primary/15 rounded-full blur-2xl animate-pulse delay-300" />
      <div className="absolute top-1/2 right-32 w-32 h-80 bg-forest-accent/12 rounded-full blur-xl animate-pulse delay-700" />
      
      {/* More vibrant organic shapes */}
      <div className="absolute top-32 right-16 w-20 h-20">
        <div className="w-full h-full bg-wood-accent/30 rounded-full animate-bounce delay-1000 shadow-glow" style={{
          animationDuration: '3s'
        }} />
      </div>
      
      <div className="absolute bottom-32 right-24 w-24 h-24">
        <div className="w-full h-full bg-forest-accent/25 rounded-full animate-bounce delay-1500 shadow-glow" style={{
          animationDuration: '4s'
        }} />
      </div>

      {/* Glowing particles */}
      <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-wood-accent rounded-full animate-ping delay-2000" />
      <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-wood-primary rounded-full animate-ping delay-3000" />
      <div className="absolute top-1/2 right-1/6 w-4 h-4 bg-forest-accent rounded-full animate-ping delay-4000" />

      {/* Enhanced grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,215,0,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,0,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;