import { motion, Variants } from "framer-motion";
import { Paperclip, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatInterface() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            // Wait for the robot to "hit" the bottom (approx 1s fall)
            setTimeout(() => setIsVisible(true), 1000); 
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

  return (
    <section ref={ref} className="h-screen w-full flex flex-col items-center justify-end pb-20 px-4 pointer-events-none relative overflow-hidden">
      
      {/* Shatter/Reform Animation Overlay (Simulated) */}
      {isVisible && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
             {/* Particles flying to center could be added here for extra polish */}
        </motion.div>
      )}

      {/* Chat Bar */}
      <motion.div 
        initial={{ width: "50px", opacity: 0, borderRadius: "50%" }}
        animate={isVisible ? { 
            width: "min(1000px, 90vw)", 
            opacity: 1, 
            borderRadius: "40px" 
        } : {}}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="glass pointer-events-auto flex items-center px-6 py-3 gap-4 z-50 origin-center h-[80px]"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="flex w-full items-center gap-4"
        >
            {/* File Upload */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="p-3 rounded-full hover:bg-white/10 transition-colors text-primary"
            >
                <Paperclip size={24} />
            </motion.button>

            {/* Input */}
            <motion.div variants={itemVariants} className="flex-1">
                <input 
                    type="text" 
                    placeholder="Command HAI..." 
                    className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/50 font-body"
                />
            </motion.div>

            {/* Mic / Send (Morphing Head) */}
            <motion.div 
                variants={itemVariants}
                className="relative"
            >
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.5)]"
                >
                    <Mic size={24} className="text-black" />
                </motion.button>
                
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-[ping_2s_ease-in-out_infinite] opacity-50" />
            </motion.div>
        </motion.div>

      </motion.div>
      
      {/* Background hint of robot shattered pieces */}
      {isVisible && (
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 0.5 }}
           transition={{ delay: 0.5 }}
           className="absolute bottom-40 text-center text-white/30 text-sm font-mono tracking-widest uppercase"
        >
           System Online // Ready for Input
        </motion.div>
      )}

    </section>
  );
}
