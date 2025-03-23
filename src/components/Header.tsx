
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
          <Link to="/">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <img 
                src="/lovable-uploads/73223a4b-fe7e-48fe-a149-750ab81a9f01.png" 
                alt="Play11 Prism Logo" 
                className="h-32 mb-2 cursor-pointer hover:opacity-90 transition-opacity"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-slate-600 dark:text-slate-300 text-lg font-medium italic"
              >
                Optimized Cricket Lineups, Perfected.
              </motion.p>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
