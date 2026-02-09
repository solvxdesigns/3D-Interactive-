import { motion } from "framer-motion";
import { MessageSquare, Brain, TrendingUp } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <MessageSquare size={40} className="text-primary" />,
      title: "Natural Conversations",
      desc: "Engage in human-like dialogue with context awareness and emotional intelligence."
    },
    {
      icon: <Brain size={40} className="text-secondary" />,
      title: "Multi-Modal Intelligence",
      desc: "Process text, voice, and visual inputs seamlessly for comprehensive understanding."
    },
    {
      icon: <TrendingUp size={40} className="text-white" />,
      title: "Continuous Learning",
      desc: "Adapts to your preferences and evolves with every interaction for personalized experiences."
    }
  ];

  return (
    <section className="h-screen w-full flex items-center justify-end px-10 relative pointer-events-none">
       <div className="w-[60%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-events-auto">
         {features.map((f, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.2, duration: 0.5 }}
             className="glass p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300 group"
           >
             <div className="mb-6 p-4 rounded-full bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
               {f.icon}
             </div>
             <h3 className="text-2xl font-bold mb-4 text-white">{f.title}</h3>
             <p className="text-white/70 leading-relaxed">{f.desc}</p>
           </motion.div>
         ))}
       </div>
    </section>
  );
}
