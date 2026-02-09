import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center relative pointer-events-none">
      <div className="text-center z-10 pointer-events-auto">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[120px] font-bold leading-none tracking-tighter text-gradient glow-text"
        >
          HAI
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-2xl font-light tracking-[0.3em] text-white/80 mt-4 font-body"
        >
          HUMANOID ARTIFICIAL INTELLIGENCE
        </motion.h2>

        <motion.button 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05, backgroundColor: "#00F2FF", color: "#000" }}
          className="mt-12 px-10 py-4 border-2 border-primary rounded-full text-primary font-semibold text-lg tracking-wider transition-all duration-300 glow-box"
        >
          Experience HAI
        </motion.button>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 text-white/50"
      >
        <ChevronDown size={30} />
      </motion.div>
    </section>
  );
}
