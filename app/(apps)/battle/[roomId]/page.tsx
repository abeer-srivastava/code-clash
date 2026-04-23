"use client";

import { NavBarComp } from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/lib/useSocket";
import Editor from "@monaco-editor/react";
import PixelBlast from "@/components/PixelBlast";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Terminal, Zap, Trophy, ShieldAlert, CheckCircle2, Loader2, Send, MessageSquare, Play, Code2, Globe, Activity } from "lucide-react";
import { useEffect as useGsapEffect } from "react";
import gsap from "gsap";

interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  time?: number;
  statusDescription?: string;
}

interface ExecutionResult {
  success: boolean;
  testResults?: TestCaseResult[];
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
  starterCode?: Record<string, string>;
}

interface BattleState {
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
  winnerId?: string;
  durationSeconds?: number;
}

interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export default function BattlePage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { isConnected, sendMessage, socket } = useSocket();
  const user = useUserStore((state) => state.user);

  const [triggerEffect, setTriggerEffect] = useState(false);
  const [code, setCode] = useState("// Write your solution here\n");
  const [language, setLanguage] = useState("javascript");
  const [battleState, setBattleState] = useState<BattleState>({ status: "WAITING" });
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null);
  const [opponentProgress, setOpponentProgress] = useState<{
    activity: "RUNNING" | "SUBMITTING" | "IDLE";
    testsPassed?: number;
    totalTests?: number;
    success?: boolean;
    lastUpdate: number;
  }>({ activity: "IDLE", lastUpdate: 0 });
  const [opponentCursor, setOpponentCursor] = useState<{ line: number; ch: number } | null>(null);

  // Tracks if code has been initialized for each language
  const initializedLanguages = useRef<Set<string>>(new Set());

  // Initialize code when question loads
  useEffect(() => {
    if (question?.starterCode && !initializedLanguages.current.has(language)) {
      const starterCodeObj = question.starterCode as any;
      const starter = starterCodeObj[language];
      if (starter) {
        setCode(starter);
        initializedLanguages.current.add(language);
      }
    }
  }, [question, language]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    // If we haven't initialized this language yet, useEffect will handle it
    // If we have, it keeps what the user wrote
    if (question?.starterCode && !initializedLanguages.current.has(newLang)) {
      const starterCodeObj = question.starterCode as any;
      const starter = starterCodeObj[newLang];
      if (starter) {
        setCode(starter);
        initializedLanguages.current.add(newLang);
      }
    }
  };

  // Lobby State
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showVS, setShowVS] = useState(false);

  useEffect(() => {
    if (battleState.status === "IN_PROGRESS") {
      setShowVS(true);
      const timer = setTimeout(() => setShowVS(false), 3000);
      const interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [battleState.status]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !isConnected || !roomId || !user?.uid) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case "ROOM_STATE":
            setBattleState(message.payload.battleState);
            setPlayers(message.payload.players);
            setQuestion(message.payload.question);
            if (message.payload.votes) setVotes(message.payload.votes);
            const opponent = message.payload.players.find((p: PlayerInfo) => p.userId !== user?.uid);
            setOpponentInfo(opponent || null);
            break;
          case "VOTE_UPDATE":
            setVotes(message.payload.votes);
            break;
          case "CHAT_MESSAGE":
            setMessages((prev) => [...prev, message.payload]);
            break;
          case "RUN_RESULT":
            if (message.payload.userId === user?.uid) {
              setResult({
                success: message.payload.success,
                testResults: message.payload.testResults,
                error: message.payload.error,
                time: message.payload.time,
              });
              setIsRunning(false);
            }
            break;
          case "SUBMISSION_RESULT":
            if (message.payload.userId === user?.uid) {
              setResult({
                success: message.payload.passedAllTests,
                testResults: message.payload.testResults,
                error: message.payload.error,
                time: message.payload.time,
              });
              setIsSubmitting(false);
            }
            break;
          case "CURSOR_MOVE":
            if (message.payload.userId !== user?.uid) {
              setOpponentCursor({ line: message.payload.line, ch: message.payload.ch });
            }
            break;
          case "OPPONENT_PROGRESS":
            if (message.payload.userId !== user?.uid) {
              setOpponentProgress({
                activity: message.payload.activity,
                testsPassed: message.payload.testsPassed,
                totalTests: message.payload.totalTests,
                success: message.payload.success,
                lastUpdate: Date.now(),
              });
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
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socket.addEventListener("message", handleMessage);
    sendMessage("JOIN_ROOM", { roomId, userId: user.uid });
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, isConnected, roomId, user?.uid, sendMessage]);

  useEffect(() => {
    if (result?.success) {
      setTriggerEffect(true);
      const timer = setTimeout(() => setTriggerEffect(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleRun = async () => {
    if (!user?.uid || !roomId || isRunning) return;
    setIsRunning(true);
    sendMessage("RUN_CODE", {
      roomId,
      userId: user.uid,
      code,
      language,
    });
  };

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

  const handleVote = (difficulty: string) => {
    sendMessage("SET_VOTE", { roomId, difficulty });
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage("CHAT", { roomId, message: chatInput });
    setChatInput("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-heading overflow-hidden flex flex-col">
      <NavBarComp />

      {battleState.status === "WAITING" ? (
        /* LOBBY VIEW */
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 pt-32">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left: Voting Arena */}
            <div className="lg:col-span-7 space-y-10">
              <div className="inline-block bg-main border-4 border-black px-6 py-2 shadow-shadow text-black font-black uppercase tracking-widest -rotate-1">
                Arena Setup Phase
              </div>

              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-foreground italic">
                CHOOSE YOUR <span className="text-main drop-shadow-[4px_4px_0px_white]">LEVEL</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["EASY", "MEDIUM", "HARD"].map((diff) => {
                  const myVote = votes[user?.uid || ""] === diff;
                  const opponentVote = opponentInfo ? votes[opponentInfo.userId] === diff : false;
                  const colorClass = diff === "EASY" ? "bg-green-400" : diff === "MEDIUM" ? "bg-yellow-400" : "bg-red-500";

                  return (
                    <div key={diff} className="space-y-4">
                      <Button
                        onClick={() => handleVote(diff)}
                        variant={myVote ? "default" : "neutral"}
                        className={`w-full h-32 text-2xl font-black uppercase tracking-widest border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all ${myVote ? colorClass + " text-black" : "bg-white text-black"}`}
                      >
                        {diff}
                      </Button>
                      <div className="flex justify-center gap-2 h-8">
                        {myVote && <div className="bg-black text-white text-[10px] px-2 py-1 font-black uppercase">YOU</div>}
                        {opponentVote && <div className="bg-main text-black text-[10px] px-2 py-1 font-black uppercase">OPPONENT</div>}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-black border-4 border-white/20 p-6 font-mono text-sm text-green-500">
                <p>{">"} WAITING FOR CONSENSUS...</p>
                <p className="opacity-50">{">"} BOTH OPERATORS MUST SELECT THE SAME PROTOCOL TO INITIATE.</p>
              </div>
            </div>

            {/* Right: Communications Terminal */}
            <div className="lg:col-span-5 flex flex-col border-8 border-black bg-white shadow-[12px_12px_0px_0px_rgba(255,191,0,1)] text-black overflow-hidden h-[600px]">
              <div className="bg-black p-4 flex items-center justify-between">
                <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-main" /> COMS_CHANNEL
                </h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 border border-white/20" />
                  <div className="w-3 h-3 bg-yellow-500 border border-white/20" />
                  <div className="w-3 h-3 bg-green-500 border border-white/20" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-bold uppercase text-sm">
                {messages.length === 0 && (
                  <p className="text-black/30 italic text-center py-10">Channel silent. Initiate conversation.</p>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.userId === user?.uid ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-black/60 mb-1 font-black uppercase tracking-tighter">{msg.username}</span>
                    <div className={`px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm ${msg.userId === user?.uid ? 'bg-main text-black' : 'bg-secondary-background text-foreground'}`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={sendChat} className="p-4 bg-black flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="TYPE_MESSAGE..."
                  className="flex-1 bg-[#111] border-2 border-white/20 p-3 font-mono text-white text-xs focus:outline-none focus:border-main uppercase"
                />
                <Button type="submit" className="h-full px-4 bg-main text-black border-2 border-black font-black uppercase">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* BATTLE VIEW (Existing Code) */
        <>
          {/* HUD / VS Header */}
          <div className="pt-20 px-4 md:px-8 border-b-4 border-black bg-secondary-background">
            <div className="max-w-[1600px] mx-auto py-6 flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Player 1 */}
              <div className="flex items-center gap-4 bg-white border-4 border-black p-3 shadow-shadow min-w-[240px] text-black transition-all relative overflow-hidden">
                {(isRunning || isSubmitting) && (
                  <div className="absolute inset-0 bg-main/5 animate-pulse pointer-events-none" />
                )}
                <div className="w-14 h-14 bg-main border-2 border-black flex items-center justify-center font-black text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">
                  {isRunning || isSubmitting ? <Activity className="w-8 h-8 animate-spin" /> : "P1"}
                </div>
                <div className="overflow-hidden flex-1 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/50">LOCAL_OPERATOR</p>
                  <p className="text-xl font-black uppercase truncate">{user?.displayName || "YOU"}</p>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className={`h-2 flex-1 border border-black bg-black/10 overflow-hidden`}>
                      {isRunning || isSubmitting ? (
                        <div className="h-full bg-green-500 w-full animate-progress-fast"></div>
                      ) : (
                        <div 
                          className={`h-full transition-all duration-500 ${result?.success ? 'bg-green-500' : (result?.testResults ? 'bg-red-500' : 'bg-black/10')}`} 
                          style={{ width: result?.testResults ? `${(result.testResults.filter(r => r.passed).length) / (result.testResults.length) * 100}%` : '0%' }}
                        />
                      )}
                    </div>
                    {result?.testResults && (
                      <p className="text-[8px] font-black text-black/60 uppercase">
                        Passed: {result.testResults.filter(r => r.passed).length}/{result.testResults.length} Tests
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* VS Center */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 md:gap-10 mb-2">
                  <div className={`h-14 px-8 border-4 border-black flex items-center justify-center font-black text-3xl shadow-shadow ${battleState.status === 'IN_PROGRESS' ? 'bg-main text-black' : 'bg-white text-black'}`}>
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-5xl font-black italic tracking-tighter text-main drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] outline-black px-2">VS</div>
                  <div className={`h-14 px-8 border-4 border-black flex items-center justify-center font-black text-2xl bg-white text-black shadow-shadow hidden md:flex`}>
                    ARENA: {roomId.slice(0, 8).toUpperCase()}
                  </div>
                </div>
                <div className="bg-green-500 text-black px-6 py-1.5 text-sm font-black uppercase tracking-[0.2em] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
                  BATTLE_IN_PROGRESS
                </div>
              </div>

              {/* Player 2 */}
              <div className="flex items-center gap-4 bg-white border-4 border-black p-3 shadow-shadow min-w-[240px] text-black relative overflow-hidden">
                {opponentProgress.activity !== "IDLE" && (
                  <div className="absolute inset-0 bg-main/10 animate-pulse pointer-events-none" />
                )}
                <div className="text-right overflow-hidden flex-1 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/50">
                    {opponentProgress.activity === "RUNNING" ? "EXECUTING_CODE..." : 
                     opponentProgress.activity === "SUBMITTING" ? "FINALIZING_SUBMISSION..." : 
                     "REMOTE_TARGET"}
                  </p>
                  <p className="text-xl font-black uppercase truncate">{opponentInfo?.username || "???"}</p>
                  
                  {/* Opponent Progress Bar */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className={`h-2 w-full border border-black bg-black/10 overflow-hidden`}>
                      {opponentProgress.activity !== "IDLE" ? (
                        <div className="h-full bg-main w-full animate-progress-fast" />
                      ) : (
                        <div 
                          className={`h-full transition-all duration-500 ${opponentProgress.success ? 'bg-green-500' : 'bg-red-500'}`} 
                          style={{ width: `${(opponentProgress.testsPassed || 0) / (opponentProgress.totalTests || 1) * 100}%` }}
                        />
                      )}
                    </div>
                    {opponentProgress.totalTests && (
                      <p className="text-[8px] font-black text-black/60 uppercase">
                        Progress: {opponentProgress.testsPassed}/{opponentProgress.totalTests} Tests
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-14 h-14 bg-red-500 border-2 border-black flex items-center justify-center font-black text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">
                  {opponentProgress.activity === "IDLE" ? "P2" : <Activity className="w-8 h-8 animate-spin" />}
                </div>
              </div>
            </div>
          </div>

          {/* Impact Effect Layer */}
          {triggerEffect && (
            <div className="fixed inset-0 z-[100] pointer-events-none opacity-40">
              <PixelBlast 
                color="#22c55e" 
                variant="diamond" 
                pixelSize={20} 
                patternDensity={2} 
                speed={2}
                edgeFade={1}
              />
            </div>
          )}

          {/* Main Arena */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">

            {/* Left: Problem Terminal */}
            <div className="lg:col-span-4 bg-white border-r-8 border-black overflow-y-auto p-10 space-y-10 text-black">
              {question ? (
                <>
                  <div className="flex justify-between items-start">
                    <div className="bg-black text-white inline-block px-4 py-1 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]">
                      ACTIVE_PROTOCOL
                    </div>
                    <div className="text-black/30 font-mono text-xs">REF_ID: #{question.id}</div>
                  </div>

                  <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-black border-b-8 border-black pb-4">
                    {question.title}
                  </h1>

                  <div className="flex gap-4">
                    <div className="border-4 border-black px-4 py-2 font-black text-sm uppercase bg-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      LVL: {question.difficulty}
                    </div>
                    <div className="border-4 border-black px-4 py-2 font-black text-sm uppercase bg-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      REWARD: +500 XP
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-lg font-bold leading-snug uppercase tracking-tight text-black/80 p-6 bg-secondary-background/5 border-4 border-black border-dashed">
                      {question.prompt}
                    </p>
                  </div>

                  <div className="space-y-6 pt-6">
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-black">
                      <Terminal className="w-6 h-6" /> DATA_SAMPLES
                    </h3>
                    <div className="space-y-6">
                      {question.examples.map((ex, i) => (
                        <div key={i} className="border-4 border-black bg-secondary-background p-6 space-y-4 font-mono text-base text-white shadow-shadow">
                          <div className="flex gap-2">
                            <span className="text-main font-black underline">INPUT:</span>
                            <code className="text-green-400">{ex.input || "null"}</code>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-cyan-400 font-black underline">OUTPUT:</span>
                            <code className="text-white">{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <p className="text-xs text-white/50 border-t border-white/20 pt-2 italic">
                              {"// "} {ex.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-6 text-black">
                  <div className="relative">
                    <Zap size={80} className="animate-bounce text-main fill-main stroke-black stroke-[2px]" />
                    <div className="absolute -inset-4 border-4 border-black border-dashed animate-spin-slow"></div>
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-2xl animate-pulse">Syncing Arena...</p>
                </div>
              )}
            </div>

            {/* Right: Code Arena */}
            <div className="lg:col-span-8 flex flex-col bg-secondary-background">
              <div className="flex-1 relative">
                <div className="absolute top-6 right-10 z-20 flex gap-4">
                  <div className="flex items-center bg-black border-4 border-white/20 p-1 shadow-shadow">
                    <div className="flex items-center gap-2 px-3 py-1 bg-main text-black font-black text-xs uppercase">
                      <Globe className="w-3 h-3" /> LANG:
                    </div>
                    <select 
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-black text-white font-mono text-xs px-4 py-1.5 focus:outline-none cursor-pointer uppercase hover:bg-white/10 transition-colors"
                    >
                      <option value="javascript">JAVASCRIPT (NODE_JS)</option>
                      <option value="python">PYTHON 3.10</option>
                      <option value="cpp">C++ 17</option>
                      <option value="java">JAVA 17</option>
                    </select>
                  </div>
                  <div className="bg-main border-4 border-black px-6 py-2 font-black text-sm uppercase shadow-shadow text-black flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> ENGINE_READY
                  </div>
                </div>
                <div className="h-full border-l-4 border-black">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language={language}
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    onMount={(editor) => {
                      editor.onDidChangeCursorPosition((e) => {
                        if (isConnected && user?.uid && roomId) {
                          sendMessage("CURSOR_MOVE", {
                            roomId,
                            userId: user.uid,
                            line: e.position.lineNumber,
                            ch: e.position.column
                          });
                        }
                      });
                    }}
                    options={{
                      fontSize: 18,
                      fontFamily: 'Share Tech Mono',
                      minimap: { enabled: false },
                      padding: { top: 60, bottom: 20 },
                      scrollBeyondLastLine: false,
                      lineNumbersMinChars: 3,
                      cursorStyle: 'block',
                      cursorBlinking: 'solid',
                      renderLineHighlight: 'all',
                    }}
                  />
                </div>
              </div>

              {/* Bottom Console */}
              <div className="h-[420px] bg-black border-t-8 border-black p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-main text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <Terminal className="w-6 h-6" /> OPERATOR_CONSOLE
                  </h4>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleRun} 
                      disabled={isRunning || isSubmitting || battleState.status !== "IN_PROGRESS"}
                      className="h-16 px-8 text-xl font-black uppercase tracking-tighter bg-white text-black border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex gap-2"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" /> RUNNING...
                        </>
                      ) : (
                        <>
                          <Play className="h-6 w-6 fill-current" /> RUN
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isRunning || isSubmitting || battleState.status !== "IN_PROGRESS"}
                      className="h-16 px-10 text-xl font-black uppercase tracking-tighter bg-main text-black border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" /> SUBMITTING...
                        </>
                      ) : (
                        <>
                          <Send className="h-6 w-6" /> SUBMIT
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto font-mono text-base border-4 border-white/10 p-4 bg-[#0a0a0a]">
                  {result ? (
                    <div className="h-full flex flex-col">
                      {/* Test Case Tabs */}
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {result.testResults?.map((tr, i) => (
                          <button
                            key={tr.testCaseId}
                            onClick={() => setActiveTestCase(i)}
                            className={`px-4 py-2 border-2 font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                              activeTestCase === i 
                                ? 'bg-main text-black border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' 
                                : tr.passed 
                                  ? 'bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20' 
                                  : 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20'
                            }`}
                          >
                            {tr.passed ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                            TEST_{i + 1}
                          </button>
                        ))}
                      </div>

                      {/* Active Test Case Detail */}
                      {result.testResults?.[activeTestCase] ? (
                        <div className={`flex-1 p-4 border-4 ${result.testResults[activeTestCase].passed ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Expected Output</p>
                              <pre className="p-3 bg-black/60 border border-white/10 text-white text-xs rounded">
                                {result.testResults[activeTestCase].expected}
                              </pre>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Actual Output</p>
                              <pre className={`p-3 bg-black/60 border border-white/10 text-xs rounded ${result.testResults[activeTestCase].passed ? 'text-green-400' : 'text-red-400'}`}>
                                {result.testResults[activeTestCase].actual || "(no output)"}
                              </pre>
                            </div>
                          </div>
                          
                          {result.testResults[activeTestCase].error && (
                            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-bold whitespace-pre-wrap">
                              {result.testResults[activeTestCase].error}
                            </div>
                          )}

                          <div className="mt-4 flex gap-4 text-[10px] font-black uppercase text-white/40 border-t border-white/5 pt-4">
                            <span>Status: <span className={result.testResults[activeTestCase].passed ? 'text-green-500' : 'text-red-500'}>{result.testResults[activeTestCase].statusDescription || (result.testResults[activeTestCase].passed ? "Accepted" : "Failed")}</span></span>
                            <span>Time: {result.testResults[activeTestCase].time?.toFixed(2)}ms</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center border-4 border-white/5 bg-white/5 opacity-40 italic text-sm">
                          Select a test case to view details
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 opacity-60 italic text-green-500/70">
                      <p className="flex gap-2">
                        <span className="text-main font-black tracking-widest animate-pulse">[IDLE]</span>
                        Awaiting operator input...
                      </p>
                      <p className="text-xs tracking-widest">SYSTEM_VERSION: 1.0.4-STABLE</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completion Overlay */}
          {battleState.status === "COMPLETED" && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
              <div className="bg-main border-8 border-black p-16 max-w-3xl w-full text-center shadow-[24px_24px_0px_0px_rgba(255,255,255,1)] animate-in zoom-in-50 duration-500 text-black">
                <div className="inline-block bg-white border-4 border-black p-6 mb-8 transform rotate-3 shadow-shadow">
                  <Trophy size={100} className="text-black" />
                </div>
                <h2 className="text-8xl font-black uppercase tracking-tighter italic mb-6 leading-none">
                  {battleState.winnerId === user?.uid ? "DOMINATION" : "TERMINATED"}
                </h2>
                <div className="h-4 bg-black w-full mb-8 relative">
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
                <p className="text-3xl font-black uppercase tracking-tighter text-black/90 mb-12 border-b-4 border-black inline-block px-4">
                  ARENA_TIME: {formatTime(battleState.durationSeconds || 0)}
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <Button variant="neutral" onClick={() => window.location.href = '/'} className="h-20 px-12 text-2xl font-black uppercase tracking-tighter border-4 border-black bg-white text-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                    Return Base
                  </Button>
                  <Button onClick={() => window.location.href = '/competitions'} className="h-20 px-12 text-2xl font-black uppercase tracking-tighter border-4 border-black bg-black text-white shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                    Next Match
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* VS Animation Overlay */}
          {showVS && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              </div>

              <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
                {/* Player 1 */}
                <div className="flex-1 w-full flex justify-center md:justify-end animate-in slide-in-from-left-full duration-700 ease-out px-10">
                  <div className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(255,191,0,1)] text-black text-center min-w-[280px] transform -rotate-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50">OPERATOR_01</p>
                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{user?.displayName?.split(' ')[0] || "YOU"}</h3>
                    <div className="mt-4 bg-black text-white py-1 px-4 font-black text-sm inline-block">ELO: 1200</div>
                  </div>
                </div>

                {/* VS Text */}
                <div className="relative z-10 flex items-center justify-center">
                   <div className="bg-main border-8 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_white] animate-in zoom-in-50 spin-in-12 duration-500 delay-300">
                      <span className="text-7xl md:text-9xl font-black italic tracking-tighter text-black">VS</span>
                   </div>
                   {/* Decorative elements */}
                   <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-400 border-4 border-black animate-ping opacity-20"></div>
                   <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-red-500 border-4 border-black animate-ping opacity-20 delay-300"></div>
                </div>

                {/* Player 2 */}
                <div className="flex-1 w-full flex justify-center md:justify-start animate-in slide-in-from-right-full duration-700 ease-out px-10">
                  <div className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] text-black text-center min-w-[280px] transform rotate-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50">OPERATOR_02</p>
                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{opponentInfo?.username || "???"}</h3>
                    <div className="mt-4 bg-black text-white py-1 px-4 font-black text-sm inline-block">ELO: {opponentInfo?.elo || "???"}</div>
                  </div>
                </div>
              </div>

              {/* Background text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/5 whitespace-nowrap pointer-events-none select-none uppercase italic tracking-tighter">
                CODE_CLASH_ARENA
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
