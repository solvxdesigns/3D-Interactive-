import { motion } from "framer-motion";

export default function RobotIntro() {
  return (
    <section className="h-screen w-full flex items-center justify-end px-20 relative pointer-events-none">
      <div className="w-[50%] pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ margin: "-20% 0px -20% 0px" }}
        >
          <h2 className="text-5xl font-bold text-white mb-8">Meet Your AI Companion</h2>
          
          <p className="text-lg text-white/80 leading-relaxed mb-6 font-light">
            HAI is a next-generation artificial intelligence designed to understand, 
            assist, and evolve with you.
          </p>
          
          <p className="text-lg text-white/80 leading-relaxed font-light">
            Powered by advanced neural networks and natural language processing, 
            HAI delivers human-like conversations with precision and empathy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
