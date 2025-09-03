"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Stethoscope,
  Plus,
  Activity,
  Users,
  Shield,
  Database,
  CheckCircle,
} from "lucide-react";

type MessageStatus = "sending" | "sent";

interface Message {
  id: number;
  text: string;
  status: MessageStatus;
}

export default function UNMULoading(): React.ReactElement {
  const [progress, setProgress] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // UNMU healthcare-themed loading messages
  const messageTexts: string[] = [
    "Connecting to UNMU database...",
    "Authenticating healthcare credentials...",
    "Loading member registry...",
    "Syncing professional licenses...",
    "Preparing healthcare dashboard...",
  ];

  useEffect(() => {
    const progressTimer: NodeJS.Timeout = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.8;
        if (newProgress >= 100) {
          setIsCompleted(true);
          return 100;
        }
        return newProgress;
      });
    }, 60);

    // Add messages one by one
    const messageTimer: NodeJS.Timeout = setInterval(() => {
      setMessages((prev) => {
        if (prev.length >= messageTexts.length) return prev;
        return [
          ...prev,
          {
            id: prev.length,
            text: messageTexts[prev.length],
            status: "sending",
          },
        ];
      });
    }, 1200);

    // Update message status to 'sent'
    const statusTimer: NodeJS.Timeout = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg, index) => {
          if (index === prev.length - 2 && msg.status === "sending") {
            return { ...msg, status: "sent" };
          }
          return msg;
        })
      );
    }, 800);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
      clearInterval(statusTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-red-800">
      <div className="flex flex-col items-center justify-center max-w-md px-4">
        {/* Healthcare particles animation in background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="healthcare-particles w-full h-full opacity-10"></div>
        </div>

        {/* Gradient orb background */}
        <div className="absolute h-full w-full overflow-hidden">
          <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 blur-3xl"></div>
        </div>

        {/* UNMU Title with reveal animation */}
        <motion.div
          className="relative text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h1 className="text-2xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-yellow-300 to-red-300">
              UNMU Database System
            </span>
          </h1>
          <p className="text-red-200 text-sm mt-1">
            Uganda Nurses & Midwives Union
          </p>
        </motion.div>

        {/* Healthcare Console */}
        <div className="w-full max-w-md mb-8 bg-red-950/80 backdrop-blur-sm rounded-lg border border-red-700/30 overflow-hidden shadow-2xl">
          <div className="flex items-center px-4 py-3 bg-red-900/80 border-b border-red-700/30">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="ml-3 text-xs text-red-200 font-mono flex items-center">
              <Database className="w-3 h-3 mr-1" />
              healthcare.console
            </div>
          </div>

          <div className="px-4 py-4 h-28 overflow-hidden font-mono text-xs console-container">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex items-center my-2 console-message ${message.status}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-green-400 mr-2">●</span>
                <div>
                  <TypewriterText
                    text={message.text}
                    className="text-red-100"
                  />
                  <motion.div
                    className={`w-2 h-4 bg-yellow-400 inline-block ml-1 blinking-cursor ${
                      message.status === "sent" ? "opacity-0" : "opacity-100"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: message.status === "sent" ? 0 : 1 }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}

            {/* Success message */}
            {isCompleted && (
              <motion.div
                className="flex items-start my-2 success-message"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <CheckCircle className="w-3 h-3 text-green-400 mr-2 mt-0.5" />
                <div className="text-green-300">
                  <TypewriterText
                    text="System ready! Welcome to UNMU..."
                    className="text-green-300"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs text-red-200 mb-2">
            <span className="font-mono">Loading healthcare data</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-red-900/50 rounded-full overflow-hidden border border-red-700/30">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-400 progress-bar relative"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            ></motion.div>
          </div>
        </div>

        {/* Footer motto */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-yellow-300 text-sm italic font-medium">
            "Empowering Healthcare Heroes"
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .rotating-icons {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          animation: rotateIcons 12s linear infinite;
        }

        .healthcare-icon {
          position: absolute;
          width: 20px;
          height: 20px;
        }

        .healthcare-icon:nth-child(1) {
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
        }

        .healthcare-icon:nth-child(2) {
          right: 10%;
          top: 50%;
          transform: translateY(-50%);
        }

        .healthcare-icon:nth-child(3) {
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
        }

        .healthcare-icon:nth-child(4) {
          left: 10%;
          top: 50%;
          transform: translateY(-50%);
        }

        @keyframes rotateIcons {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .pulsing-glow {
          animation: healthcarePulse 3s infinite ease-in-out;
        }

        @keyframes healthcarePulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.4;
          }
        }

        .gradient-orb {
          animation: orbFloat 8s infinite ease-in-out;
        }

        @keyframes orbFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -48%) scale(1.05);
          }
        }

        .healthcare-particles {
          background-image: radial-gradient(
            rgba(239, 68, 68, 0.2) 1px,
            transparent 1px
          );
          background-size: 40px 40px;
          animation: scrollParticles 40s linear infinite;
        }

        @keyframes scrollParticles {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 800px;
          }
        }

        .blinking-cursor {
          animation: blink 1.2s step-end infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .console-container {
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
          );
        }

        .console-message.sent {
          opacity: 0.7;
        }

        .progress-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// Typewriter effect component
function TypewriterText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayedText}</span>;
}
