'use client'
import { Settings2, Layout, Sliders } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full h-full max-h-[90vh] flex flex-col p-10 max-md:p-5 gap-8 mb-10">
      <div className="flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-64 h-64"
        >
          {/* Fond décoratif */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-primary/10 rounded-full"
          />

          {/* Icônes flottantes */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-10 left-10"
            >
              <Settings2 className="w-8 h-8 text-primary" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute bottom-10 right-10"
            >
              <Layout className="w-10 h-10 text-primary" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 right-8"
            >
              <Sliders className="w-8 h-8 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Configure your dashboard
          </h1>
          <p className="text-gray-500 max-w-md">
            Customize your dashboard settings to create the perfect workspace
            for your needs.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg shadow-primary/20"
        >
          Start Configuration
        </motion.button>
      </div>
    </div>
  );
}
