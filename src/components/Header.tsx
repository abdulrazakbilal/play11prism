
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      className="py-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <img 
              src="/lovable-uploads/b7ebb4c6-6b05-423c-9722-fa8411a46168.png" 
              alt="Play11 Prism Logo" 
              className="h-24 mb-2"
            />
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-cricket-blue to-cricket-green bg-clip-text text-transparent pb-2">
              Play11 Prism
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Cricket Analytics
          </motion.p>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
