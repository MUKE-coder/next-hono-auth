import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";

export function InstallCommandCard() {
  const [copiedFirst, setCopiedFirst] = useState(false);
  const [copiedSecond, setCopiedSecond] = useState(false);

  const copyFirstCommand = async () => {
    await navigator.clipboard.writeText("npm i -g desishub-cli");
    setCopiedFirst(true);
    setTimeout(() => setCopiedFirst(false), 2000);
  };

  const copySecondCommand = async () => {
    await navigator.clipboard.writeText("desishub new my-app");
    setCopiedSecond(true);
    setTimeout(() => setCopiedSecond(false), 2000);
  };

  return (
    <div className="group relative max-w-2xl mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>

      {/* Command card */}
      <div className="relative bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800 overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">terminal</span>
        </div>

        {/* First command */}
        <div className="flex items-center justify-between font-mono text-sm mb-3">
          <div className="flex items-center gap-3">
            <Terminal className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span className="text-gray-100">
              <span className="text-purple-400">npm</span> i -g desishub-cli
            </span>
          </div>
          <button
            onClick={copyFirstCommand}
            className="ml-4 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Copy first command"
          >
            {copiedFirst ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Second command */}
        <div className="flex items-center justify-between font-mono text-sm">
          <div className="flex items-center gap-3">
            <Terminal className="h-4 w-4 text-green-400 flex-shrink-0 opacity-0" />
            <span className="text-gray-100">
              <span className="text-purple-400">desishub</span> new my-app
            </span>
          </div>
          <button
            onClick={copySecondCommand}
            className="ml-4 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Copy second command"
          >
            {copiedSecond ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Progress indicators */}
        {copiedFirst && (
          <div className="absolute bottom-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"></div>
        )}
        {copiedSecond && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"></div>
        )}
      </div>

      {/* Helper text */}
      <p className="mt-2 text-center text-sm text-gray-500">
        Run these commands to install and create a new project
      </p>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s linear;
        }
      `}</style>
    </div>
  );
}
