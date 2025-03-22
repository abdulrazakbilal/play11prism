
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings, Trophy, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 mb-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-display font-bold text-slate-800 dark:text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome to Play11 Prism
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Advanced cricket analytics for optimal team selection
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to="/team-management" className="block">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 h-full flex flex-col items-center text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <Plus className="h-8 w-8 text-cricket-blue" />
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-white">Create a New Team</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">Start building your cricket team from scratch and optimize your playing XI.</p>
                <Button className="mt-auto bg-cricket-blue hover:bg-blue-700">Get Started</Button>
              </div>
            </Link>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 h-full flex flex-col items-center text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-white">Analytics Overview</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">Gain insights into team performance, player statistics, and optimization recommendations.</p>
              <Button variant="outline" className="mt-auto" disabled>Coming Soon</Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mb-3">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-medium mb-2 text-slate-800 dark:text-white">Create Your Squad</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Add players with their stats to build your team roster.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                  <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium mb-2 text-slate-800 dark:text-white">Optimize Selection</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Our algorithm analyzes player stats to determine the best possible XI.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
                  <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-medium mb-2 text-slate-800 dark:text-white">Maximize Performance</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Get the optimal team combination for the best possible match results.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link to="/team-management">
              <Button size="lg" className="bg-cricket-blue hover:bg-blue-700">
                Start Creating Your Team Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
