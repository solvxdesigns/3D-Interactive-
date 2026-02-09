import { motion, Variants } from "framer-motion";
import { Paperclip, Mic, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatInterface() {
  const [isVisible, setIsVisible] = useState(false);
  const [messages] = useState([
    { id: 1, type: "ai", text: "System Online. Hello, I am HAI. How can I assist you today?" }
  ]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), 1500); 
        } else {
            setIsVisible(false);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const aiMessageVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section ref={ref} className="h-screen w-full flex relative overflow-hidden bg-[#050505]">
      
      {/* Sidebar - Memory Archive */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={isVisible ? { x: 0, opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.8 }}
        className="w-[25%] h-full glass border-r border-white/10 p-6 flex flex-col z-20 pointer-events-auto"
      >
        <h3 className="text-lg font-semibold text-white/90 mb-6 flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          Memory Archive
        </h3>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              whileHover={{ x: 8 }}
              className="p-4 rounded-lg bg-white/5 border border-transparent hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer group"
            >
              <div className="text-sm font-medium text-white/80 group-hover:text-white">Conversation Alpha-{i}</div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-[10px] text-white/40 uppercase tracking-tighter">Last seen: {i * 2}h ago</div>
                <div className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">ACTIVE</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* Main Chat Feed */}
      <main className="flex-1 relative flex flex-col h-full pointer-events-auto">
        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              variants={m.type === "ai" ? aiMessageVariants : itemVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className={`max-w-[70%] p-6 rounded-2xl relative group ${
                m.type === "ai" 
                ? "mr-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-bl-none" 
                : "ml-auto bg-gradient-to-br from-primary to-secondary rounded-br-none shadow-[0_8px_24px_rgba(0,242,255,0.2)]"
              }`}
            >
              {m.type === "ai" && (
                <div className="text-[10px] font-bold text-primary mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  HAI Character
                </div>
              )}
              <p className="text-white/90 leading-relaxed font-body">{m.text}</p>
              
              {/* Digital decoration for AI bubble */}
              {m.type === "ai" && (
                <div className="absolute -left-1 top-0 bottom-0 w-[2px] bg-primary/30 group-hover:bg-primary transition-colors" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Floating Chat Bar */}
        <div className="w-full flex justify-center pb-10 px-6">
          <motion.div 
            initial={{ width: "50px", opacity: 0, borderRadius: "50%" }}
            animate={isVisible ? { 
                width: "min(1000px, 90vw)", 
                opacity: 1, 
                borderRadius: "40px" 
            } : {}}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="glass pointer-events-auto flex items-center px-6 py-3 gap-4 z-50 origin-center h-[75px] border-white/20"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="flex w-full items-center gap-4"
            >
                {/* File Upload with Liquid Splash Logic */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="p-3 rounded-full hover:bg-white/10 transition-colors text-primary relative group"
                >
                    <Paperclip size={24} />
                    {/* Splash hint */}
                    <div className="absolute inset-0 rounded-full border border-primary/0 group-active:border-primary/50 group-active:scale-150 transition-all duration-300 opacity-0 group-active:opacity-100" />
                </motion.button>

                {/* Input Area */}
                <motion.div variants={itemVariants} className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="Command HAI..." 
                        className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/40 font-body focus:placeholder:opacity-0 transition-all"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 focus-within:scale-x-100 transition-transform duration-500" />
                </motion.div>

                {/* 3D Microphone (Transformed Head) */}
                <motion.div 
                    variants={itemVariants}
                    className="relative"
                >
                    <motion.button 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-shadow"
                    >
                        <div className="w-full h-full bg-white flex items-center justify-center gap-1.5">
                          <motion.div 
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-2 h-2 rounded-full bg-primary" 
                          />
                          <motion.div 
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-primary" 
                          />
                        </div>
                    </motion.button>
                    
                    {/* Pulsing Ripple Rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-[ping_3s_infinite] opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 rounded-full border border-primary animate-[ping_4s_infinite] opacity-10 pointer-events-none" />
                </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Atmospheric Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(0,242,255,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_80%,rgba(255,0,229,0.05)_0%,transparent_50%)]" />
      </div>

    </section>
  );
}
