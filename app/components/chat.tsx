"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./chat.module.css";
import { SendHorizonal, Copy, Check, User, Bot } from "lucide-react";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  const searchParams = useSearchParams();
  const profilePicUrl = searchParams.get("profilePicUrl");

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="flex justify-end items-start mb-6 group">
      <div className="flex flex-col items-end max-w-[70%]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[#A2C3E0] text-[#FFFCF8] p-4 rounded-2xl rounded-br-md shadow-lg relative"
        >
          <div className="whitespace-pre-wrap break-words">{text}</div>
        </motion.div>

        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs text-gray-500">{getCurrentTime()}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">You</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A2C3E0] to-[#8AB4D3] ml-3 flex-shrink-0 flex items-center justify-center shadow-lg">
        {profilePicUrl ? (
          <img
            src={profilePicUrl}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              // Fallback to User icon if image fails to load
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.removeAttribute("style");
            }}
          />
        ) : (
          <User size={16} className="text-white" />
        )}
      </div>
    </div>
  );
};

const AssistantMessage = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex justify-start items-start mb-6 group">
      <div className="w-12 h-12 rounded-full bg-[#A2C3E033]/20 flex items-center justify-center mr-3 overflow-hidden shadow-md ">
        <img
          src="/lawggle_ai_bot.png"
          alt="Assistant Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start max-w-[70%]">
        <div className="flex items-end space-x-2">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r bg-[#A2C3E0] p-4 rounded-2xl rounded-tl-md shadow-lg text-white border  relative"
          >
            <Markdown className="prose prose-sm max-w-none">{text}</Markdown>
          </motion.div>
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-full bg-white shadow-md hover:shadow-lg mb-1"
          >
            {copied ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} className="text-gray-500" />
            )}
          </motion.button>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs text-gray-400">MatchBot Assistant</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{getCurrentTime()}</span>
        </div>
      </div>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex justify-start items-start mb-6 group">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 mr-3 flex-shrink-0 flex items-center justify-center shadow-lg">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex flex-col items-start max-w-[70%]">
        <div className="flex items-start space-x-2">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#A2C3E0] text-[#FFFCF8] p-4 rounded-2xl font-mono text-sm overflow-x-auto shadow-lg relative"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-[#7B7CFF]"></div>
              </div>
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded bg-slate-700/50 hover:bg-slate-600/50"
              >
                {copied ? (
                  <Check size={12} className="text-green-400" />
                ) : (
                  <Copy size={12} className="text-slate-300" />
                )}
              </motion.button>
            </div>
            <div className="whitespace-pre-wrap">
              {text.split("\n").map((line, index) => (
                <div key={index} className="group/line">
                  <span className="text-[#7B7CFF] mr-2 group-hover/line:text-[#E4E5FF] transition-colors select-none">{`${
                    index + 1
                  }. `}</span>
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs text-gray-400">Code Output</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{getCurrentTime()}</span>
        </div>
      </div>
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant" | "code"; text: string }[]
  >([
    {
      role: "assistant",
      text: "**Heyy! I'm your AI Assistant ! 👋** Ask me anything—right here on your dashboard. No need to head to ChatGPT! ",
    },
  ]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
      setIsLoading(false);
    };
    createThread();
  }, []);

  const sendMessage = async (text) => {
    setIsLoading(true);
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // imageFileDone - show image in chat
  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta, snapshot) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    setInputDisabled(false);
    setIsLoading(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // image
    stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col w-full h-full bg-white shadow-xl overflow-hidden border-0"
    >
      {/* Header */}
      <div className=" bg-[#FDE0B6] text-[#39444E] p-4 shadow-[0_24px_34px_rgba(162,195,224,0.45)]">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#A2C3E033]/20 flex items-center justify-center mr-3 overflow-hidden shadow-md ">
            {/* <video 
              src="/bird_waving.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            /> */}
            <img
              src="/lawggle_ai_bot.png"
              alt="Assistant Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg">MatchBot Assistant</h1>
            <p className="text-xs font-normal text-[#39444E]">
              Your personalised AI lawyer assistant
            </p>
            <div className="flex items-center mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#8AD696] mr-1 align-middle"></span>
              <span className="text-xs text-[#8AD696]">online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-5 relative bg-[#FFFAF4] bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lawggle_ai_bot.png')",
          backgroundSize: "400px 400px",
        }}
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-[#A2C3E033]/20 flex items-center justify-center mr-3 overflow-hidden shadow-md ">
                <img
                  src="/lawggle_ai_bot.png"
                  alt="Assistant Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#A2C3E0] to-[#8AB4D3] p-4 rounded-2xl rounded-tl-md shadow-lg border "
              >
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </div>
                <span className="text-sm text-white">Thinking...</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="relative">
        {/* Top border/shadow effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-100/20 to-transparent pointer-events-none"></div>

        <form
          onSubmit={handleSubmit}
          className={`p-4 bg-[#FEF5E8] relative z-10 ${styles.customForm}`}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full px-4 py-3 pr-14 bg-[#FDE0B6] focus:bg-white border border-gray-200 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#39444E]/50 text-[#39444E]"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your prompt here"
              disabled={inputDisabled}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute right-2 w-10 h-10 bg-[#39444E] text-white rounded-full flex items-center justify-center transition-all duration-200 ${
                inputDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#2D3339] hover:shadow-lg hover:shadow-[#39444E]/25"
              }`}
              disabled={inputDisabled}
            >
              {inputDisabled ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <motion.span
                  initial={{ x: -2, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <SendHorizonal size={18} />
                </motion.span>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Chat;
