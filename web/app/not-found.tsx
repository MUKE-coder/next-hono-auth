"use client";

import { ArrowLeft, Home, MoveLeft, SearchX, Ghost } from "lucide-react";
import { motion } from "framer-motion";

import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center  p-1">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto w-[300px] sm:w-[400px] flex items-center justify-center">
          <div className="relative">
            {/* 404 Text with floating effect */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl sm:text-9xl font-bold text-purple-200"
            >
              404
            </motion.div>

            {/* Floating ghost icon */}
            <motion.div
              animate={{
                y: [-5, 5, -5],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-4 -right-8"
            >
              <Ghost className="w-16 h-16 text-purple-400" />
            </motion.div>

            {/* Search X icon with pulse */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-4 -left-4"
            >
              <SearchX className="w-12 h-12 text-purple-500" />
            </motion.div>

            {/* Decorative dots */}
            <div className="absolute inset-0 -z-10">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [0.5, 1, 0.5],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className="absolute w-2 h-2 bg-purple-300 rounded-full"
                  style={{
                    top: `${20 + (i % 3) * 30}%`,
                    left: `${10 + (i % 2) * 80}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-purple-700">
          Oops! Page Not Found
        </h1>

        <p className="text-gray-600 max-w-md mx-auto text-base">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <RainbowButton link="/dashboard" className="w-full sm:w-auto text-xs">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </RainbowButton>
          <RainbowButton
            onClick={() => window.history.back()}
            className="w-full sm:w-auto text-xs"
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Go Back
          </RainbowButton>
        </div>
      </motion.div>
    </main>
  );
}
