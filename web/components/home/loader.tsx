import React from "react";
import {
  Heart,
  Stethoscope,
  Plus,
  Activity,
  Users,
  Shield,
  Database,
  Zap,
} from "lucide-react";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  text?: string;
  variant?: "wave" | "pulse" | "heartbeat";
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = "md",
  showText = true,
  text = "Loading UNMU Database...",
  variant = "wave",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  const healthcareIcons = [
    Heart,
    Stethoscope,
    Plus,
    Activity,
    Users,
    Shield,
    Database,
    Zap,
  ];

  if (variant === "heartbeat") {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="heartbeat-animation">
            <Heart className="w-16 h-16 text-red-600" fill="currentColor" />
          </div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring-delayed"></div>
        </div>
        {showText && (
          <div className="text-center">
            <p className="text-red-700 font-medium">{text}</p>
            <p className="text-yellow-600 text-sm italic mt-1">
              "To Love and Serve"
            </p>
          </div>
        )}
        <style jsx>{`
          .heartbeat-animation {
            animation: heartbeat 1.5s ease-in-out infinite;
            position: relative;
            z-index: 10;
          }

          .pulse-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border: 3px solid rgba(220, 38, 38, 0.3);
            border-radius: 50%;
            animation: pulse 1.5s ease-out infinite;
          }

          .pulse-ring-delayed {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border: 3px solid rgba(234, 179, 8, 0.3);
            border-radius: 50%;
            animation: pulse 1.5s ease-out infinite 0.75s;
          }

          @keyframes heartbeat {
            0%,
            50%,
            100% {
              transform: scale(1);
            }
            25% {
              transform: scale(1.2);
            }
          }

          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center space-x-2">
          {healthcareIcons.slice(0, 4).map((Icon, index) => (
            <div
              key={index}
              className={`${sizeClasses[size]} flex items-center justify-center`}
              style={{
                animation: `pulseScale 2s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <Icon
                className="w-full h-full text-red-600"
                fill={index % 2 === 0 ? "currentColor" : "none"}
              />
            </div>
          ))}
        </div>
        {showText && (
          <div className="text-center">
            <p className="text-red-700 font-medium">{text}</p>
            <p className="text-yellow-600 text-sm italic mt-1">
              "To Love and Serve"
            </p>
          </div>
        )}
        <style jsx>{`
          @keyframes pulseScale {
            0%,
            100% {
              transform: scale(1);
              color: #dc2626;
            }
            50% {
              transform: scale(1.3);
              color: #eab308;
            }
          }
        `}</style>
      </div>
    );
  }

  // Default wave variant
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div
        className={`flex ${gapClasses[size]} perspective-[80px] transform-style-preserve-3d`}
      >
        {healthcareIcons.map((Icon, index) => (
          <div
            key={index}
            className={`${sizeClasses[size]} relative inline-block transform-origin-center transform-style-preserve-3d healthcare-wave-shape`}
            style={{
              animation: `healthcareWave 2.4s ease infinite`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <Icon
              className="w-full h-full"
              fill={index % 2 === 0 ? "currentColor" : "none"}
              strokeWidth={index % 2 === 0 ? 1 : 2}
            />
          </div>
        ))}
      </div>

      {showText && (
        <div className="text-center animate-pulse">
          <p className="text-red-700 font-medium">{text}</p>
          <p className="text-yellow-600 text-sm italic mt-1">
            "To Love and Serve"
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes healthcareWave {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotateY(0deg);
            color: #dc2626;
            filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.3));
          }
          12% {
            transform: translate3d(2px, -6px, 3px) scale(1.2) rotateY(10deg);
            color: #ef4444;
            filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.6));
          }
          15% {
            color: #f97316;
            filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.7));
          }
          24% {
            transform: translate3d(0, 0, 0) scale(1) rotateY(0deg);
            color: #eab308;
            filter: drop-shadow(0 0 18px rgba(234, 179, 8, 0.8));
          }
          36% {
            color: #84cc16;
            filter: drop-shadow(0 0 15px rgba(132, 204, 22, 0.6));
          }
          48% {
            color: #10b981;
            filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.5));
          }
          60% {
            color: #06b6d4;
            filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.4));
          }
          72% {
            color: #3b82f6;
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3));
          }
          84% {
            color: #8b5cf6;
            filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.25));
          }
          100% {
            transform: scale(1);
            color: #dc2626;
            filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.2));
          }
        }

        .healthcare-wave-shape {
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .healthcare-wave-shape {
            animation-duration: 2s;
          }
        }
      `}</style>
    </div>
  );
};
