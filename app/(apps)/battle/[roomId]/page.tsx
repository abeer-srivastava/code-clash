"use client";

import { NavBarComp } from "@/app/components/Navbar";
import Background from "@/components/Background";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket";
import Editor from "@monaco-editor/react";
import { useUserStore } from "@/store/useUserStore";

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  time?: number;
}

interface PlayerInfo {
  userId: string;
  username: string;
  elo: number;
  hasSubmitted: boolean;
  submissionTime?: number;
  executionTime?: number;
  testsPassed?: number;
  totalTests?: number;
}

interface QuestionData {
  id: number;
  title: string;
  prompt: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
}

interface BattleState {
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
  winnerId?: string;
  durationSeconds?: number;
}

export default function BattlePage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { isConnected, sendMessage, socket } = useSocket();
  const user = useUserStore((state) => state.user);

  // Code editor state
  const [code, setCode] = useState("// Write your code here\nconsole.log('Hello Code Clash!');");
  const [language, setLanguage] = useState("javascript");

  // Battle state
  const [battleState, setBattleState] = useState<BattleState>({ status: "WAITING" });
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null);

  // Timer for battle duration
  useEffect(() => {
    if (battleState.status !== "IN_PROGRESS") return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [battleState.status]);

  // Handle WebSocket connection, message listening, and joining room
  useEffect(() => {
    if (!socket || !isConnected || !roomId || !user?.uid) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Battle Message Received:", message.type, message.payload);

        switch (message.type) {
          case "ROOM_STATE":
            setBattleState(message.payload.battleState);
            setPlayers(message.payload.players);
            setQuestion(message.payload.question);
            
            // Find opponent info
            const opponent = message.payload.players.find(
              (p: PlayerInfo) => p.userId !== user?.uid
            );
            if (opponent) {
              setOpponentInfo(opponent);
            } else {
              setOpponentInfo(null);
            }
            break;

          case "SUBMISSION_RESULT":
            if (message.payload.userId === user?.uid) {
              setResult({
                success: message.payload.passedAllTests,
                output: message.payload.output,
                error: message.payload.error,
                time: message.payload.time,
              });
              setIsSubmitting(false);
            }
            break;

          case "BATTLE_END":
            setBattleState((prev) => ({
              ...prev,
              status: "COMPLETED",
              winnerId: message.payload.winnerId,
              durationSeconds: message.payload.durationSeconds,
            }));
            break;

          case "ERROR":
            console.error("Battle Server Error:", message.payload);
            break;
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socket.addEventListener("message", handleMessage);
    
    // Join room AFTER adding listener to ensure we don't miss the initial ROOM_STATE
    console.log("Sending JOIN_ROOM for", roomId);
    sendMessage("JOIN_ROOM", { roomId, userId: user.uid });

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, isConnected, roomId, user?.uid, sendMessage]);

  const handleSubmit = async () => {
    if (!user?.uid || !roomId || isSubmitting) return;

    setIsSubmitting(true);
    sendMessage("SUBMIT_CODE", {
      roomId,
      userId: user.uid,
      code,
      language,
      submissionTime: timeElapsed,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const difficultyColor = {
    EASY: "text-green-400",
    MEDIUM: "text-yellow-400",
    HARD: "text-red-400",
  };

  const hasSubmitted = players.some(
    (p) => p.userId === user?.uid && p.hasSubmitted
  );

  return (
    <Background>
      <NavBarComp />
      <div className="min-h-screen flex flex-col text-amber-500 p-4 pt-20">
        {/* Header with battle info */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex gap-4">
            <span>⏱️ {formatTime(timeElapsed)}</span>
            {question && (
              <>
                <span className={difficultyColor[question.difficulty]}>
                  {question.difficulty}
                </span>
              </>
            )}
          </div>
          {battleState.status === "WAITING" && (
            <div className="animate-pulse text-amber-400 font-bold">
              ⌛ WAITING FOR OPPONENT...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          {/* Left: Problem Statement */}
          <div className="lg:col-span-1 flex flex-col gap-4 bg-black/40 backdrop-blur-md p-4 border-amber-300/30 border rounded-lg overflow-y-auto">
            {question ? (
              <>
                <div>
                  <h2 className="text-xl font-bold border-b border-amber-300/30 pb-2 mb-2">
                    {question.title}
                  </h2>
                  <p className="text-sm text-amber-100/80 whitespace-pre-wrap">
                    {question.prompt}
                  </p>
                </div>

                {question.examples.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-amber-400">Examples:</h3>
                    <div className="space-y-2">
                      {question.examples.map((ex, idx) => (
                        <div key={idx} className="text-xs bg-black/60 p-2 rounded">
                          <p className="text-amber-300">Input: {ex.input || "(empty)"}</p>
                          <p className="text-green-400">Output: {ex.output}</p>
                          {ex.explanation && (
                            <p className="text-amber-100/60 mt-1">{ex.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="text-amber-500/50 text-lg">
                  {battleState.status === "WAITING" 
                    ? "Invite someone to join this room to start the battle!" 
                    : "Loading problem..."}
                </div>
                {battleState.status === "WAITING" && (
                  <div className="text-xs bg-black/40 p-2 rounded border border-amber-500/20">
                    Room ID: <span className="text-amber-300 font-mono">{roomId}</span>
                  </div>
                )}
              </div>
            )}

            {/* Execution Result */}
            <div className="mt-auto pt-4 border-t border-amber-300/30">
              <h3 className="font-semibold mb-2 text-amber-400">Execution Result:</h3>
              <div className="bg-black/60 p-3 rounded border border-amber-300/20 min-h-20 font-mono text-xs">
                {result ? (
                  <div className={result.success ? "text-green-400" : "text-red-400"}>
                    <pre className="whitespace-pre-wrap text-xs">
                      {result.output || result.error || "No output"}
                    </pre>
                    {result.time && (
                      <p className="text-amber-500/50 mt-1">
                        Execution: {result.time}ms
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-amber-500/40">
                    {hasSubmitted
                      ? "Waiting for results..."
                      : "Submit code to see output"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center: Code Editor */}
          <div className="lg:col-span-1 flex flex-col gap-2 bg-black/40 backdrop-blur-md p-2 border-amber-300/30 border rounded-lg">
            <div className="flex justify-between items-center px-3 py-2 border-b border-amber-300/30">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/60 text-amber-500 text-xs border border-amber-300/30 rounded px-2 py-1"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || battleState.status !== "IN_PROGRESS"}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-1 px-3 rounded text-xs transition-colors"
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT CODE"}
              </button>
            </div>
            <div className="flex-1 rounded overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  readOnly: battleState.status !== "IN_PROGRESS"
                }}
              />
            </div>
          </div>

          {/* Right: Opponent Info & Battle Status */}
          <div className="lg:col-span-1 flex flex-col gap-4 bg-black/40 backdrop-blur-md p-4 border-amber-300/30 border rounded-lg">
            {/* Your Stats */}
            <div className="bg-black/60 p-3 rounded border border-green-400/30">
              <h3 className="font-bold text-green-400 mb-2">You</h3>
              <div className="space-y-1 text-xs">
                <p className="text-amber-100/80">
                  {players.find((p) => p.userId === user?.uid)?.username ||
                    "Player"}
                </p>
                <p className="text-amber-500/60">
                  ELO:{" "}
                  {players.find((p) => p.userId === user?.uid)?.elo || 1200}
                </p>
                {hasSubmitted && (
                  <div className="mt-2 pt-2 border-t border-green-400/30">
                    <p className="text-green-400">✓ Submitted</p>
                    {players
                      .find((p) => p.userId === user?.uid)
                      ?.submissionTime && (
                      <p className="text-amber-500/60">
                        Time:{" "}
                        {formatTime(
                          (players.find((p) => p.userId === user?.uid)
                            ?.submissionTime || 0) / 1000
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Opponent Stats */}
            {opponentInfo ? (
              <div className="bg-black/60 p-3 rounded border border-red-400/30">
                <h3 className="font-bold text-red-400 mb-2">Opponent</h3>
                <div className="space-y-1 text-xs">
                  <p className="text-amber-100/80">{opponentInfo.username}</p>
                  <p className="text-amber-500/60">ELO: {opponentInfo.elo}</p>
                  {opponentInfo.hasSubmitted && (
                    <div className="mt-2 pt-2 border-t border-red-400/30">
                      <p className="text-green-400">✓ Submitted</p>
                      {opponentInfo.submissionTime && (
                        <p className="text-amber-500/60">
                          Time:{" "}
                          {formatTime(opponentInfo.submissionTime / 1000)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-black/20 p-8 rounded border border-amber-500/10 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-500/30 flex items-center justify-center mb-2">
                  <span className="text-amber-500/30 text-xl">?</span>
                </div>
                <p className="text-xs text-amber-500/30">No opponent yet</p>
              </div>
            )}

            {/* Battle Result */}
            {battleState.status === "COMPLETED" && (
              <div
                className={`mt-auto p-4 rounded text-center border animate-pulse ${
                  battleState.winnerId === user?.uid
                    ? "bg-green-500/20 border-green-500"
                    : "bg-red-500/20 border-red-500"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">
                  {battleState.winnerId === user?.uid
                    ? "🏆 YOU WON!"
                    : battleState.winnerId
                      ? "💀 YOU LOST"
                      : "🤝 DRAW"}
                </h3>
                {battleState.durationSeconds && (
                  <p className="text-xs text-amber-500/70">
                    Duration: {formatTime(battleState.durationSeconds)}
                  </p>
                )}
              </div>
            )}

            {battleState.status === "IN_PROGRESS" && (
              <div className="mt-auto p-3 bg-amber-500/10 border border-amber-500/30 rounded text-center text-xs text-amber-300">
                ⚔️ Battle in progress...
              </div>
            )}
            
            {battleState.status === "WAITING" && (
              <div className="mt-auto p-3 bg-blue-500/10 border border-blue-500/30 rounded text-center text-xs text-blue-300">
                ⌛ Waiting for someone to join...
              </div>
            )}
          </div>
        </div>
      </div>
    </Background>
  );
}
