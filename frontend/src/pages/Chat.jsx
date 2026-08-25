import { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { getResumes, chatWithResume } from '../services/api';

// Suggested prompt chips
const SUGGESTED_PROMPTS = [
  'SUMMARIZE CANDIDATE',
  'STRENGTHS',
  'WEAKNESSES',
  'ATS SCORE',
  'MISSING SKILLS',
  'SUGGEST IMPROVEMENTS',
  'WOULD YOU HIRE THIS CANDIDATE?',
  'EXPLAIN EXPERIENCE',
  'EDUCATION SUMMARY',
];

// ---------------------------------------------------------------------------
// ChatMessage — single chat bubble
// ---------------------------------------------------------------------------
const ChatMessage = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] border-3 px-4 py-3 font-mono text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#121212] text-[#E0E0E0] border-[#888888]'
            : 'bg-[#888888] text-[#121212] border-[#121212]'
        }`}
      >
        {/* Role label */}
        <div
          className={`text-xs font-extrabold uppercase tracking-widest mb-2 ${
            isUser ? 'text-[#B0B0B0]' : 'text-[#121212]'
          }`}
        >
          {isUser ? '▶ YOU' : '◀ INTELLIPARSE AI'}
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// LoadingDots — animated typing indicator
// ---------------------------------------------------------------------------
const LoadingDots = () => (
  <div className="flex justify-start mb-4">
    <div className="border-3 border-[#121212] bg-[#888888] px-5 py-4 flex items-center gap-1.5 text-[#121212]">
      <div className="text-xs font-extrabold uppercase tracking-widest text-[#121212] mr-2">
        ◀ INTELLIPARSE AI
      </div>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-[#121212] inline-block animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Chat — main page component
// ---------------------------------------------------------------------------
const Chat = ({ resumeData }) => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Fetch all resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
        // Pre-select if resumeData was passed from Resume page
        if (resumeData?.id) {
          setSelectedResumeId(String(resumeData.id));
        } else if (data.length > 0) {
          setSelectedResumeId(String(data[0].id));
        }
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
        setError('Failed to load resumes. Is the backend running?');
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, [resumeData]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const selectedResume = resumes.find((r) => String(r.id) === selectedResumeId);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question) return;
    if (!selectedResumeId) {
      setError('Please select a resume first.');
      return;
    }
    setError('');

    const userMsg = { role: 'user', content: question };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build history excluding the message we just added (API receives it as 'question')
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const reply = await chatWithResume({
        resumeId: Number(selectedResumeId),
        question,
        conversationHistory: history,
        jobDescription: jobDescription || null,
      });

      setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: '⚠ ERROR: Failed to get a response. Please check the backend and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
  };

  const handleResumeChange = (e) => {
    setSelectedResumeId(e.target.value);
    setMessages([]);
    setError('');
  };

  const jdActive = jobDescription.trim().length > 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-mono">
      <PageHeader
        title="AI RESUME CHAT"
        subtitle="CONVERSATIONAL RESUME INTELLIGENCE // POWERED BY GEMINI"
        statusTag={jdActive ? 'MODE: RESUME + JD' : 'MODE: RESUME ONLY'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 border-3 border-[#121212]">
        {/* ---------------------------------------------------------------- */}
        {/* LEFT PANEL — controls                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="border-b-3 lg:border-b-0 lg:border-r-3 border-[#888888] bg-[#121212] flex flex-col">
          {/* Resume selector */}
          <div className="border-b-3 border-[#888888] p-5">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#B0B0B0] mb-2">
              SELECT RESUME
            </div>

            {loadingResumes ? (
              <div className="text-xs font-bold uppercase text-[#B0B0B0] py-2">
                Loading...
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-xs font-bold uppercase text-[#E0E0E0] border-3 border-[#888888] p-3">
                No resumes found. Upload one first.
              </div>
            ) : (
              <select
                id="resume-select"
                value={selectedResumeId}
                onChange={handleResumeChange}
                className="w-full border-3 border-[#888888] bg-[#121212] text-[#E0E0E0] font-bold text-sm px-4 py-3 focus:outline-none focus:border-[#E0E0E0] uppercase tracking-wide appearance-none cursor-pointer"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.name} (ID: {r.id})
                  </option>
                ))}
              </select>
            )}

            {selectedResume && (
              <div className="mt-3 text-xs font-bold text-[#B0B0B0] uppercase space-y-1">
                <div>✉ {selectedResume.email}</div>
                <div>☎ {selectedResume.phone}</div>
              </div>
            )}
          </div>

          {/* Job Description textarea */}
          <div className="border-b-3 border-[#888888] p-5 flex-1">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#B0B0B0] mb-2 flex items-center gap-2">
              JOB DESCRIPTION
              <span className="text-[#888888] font-bold normal-case tracking-normal">
                (optional)
              </span>
            </div>
            {jdActive && (
              <div className="inline-block border-3 border-[#888888] bg-[#444444] text-[#E0E0E0] text-xs font-extrabold px-2 py-0.5 mb-2 uppercase tracking-widest">
                JD ACTIVE
              </div>
            )}
            <textarea
              id="jd-textarea"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="PASTE JOB DESCRIPTION HERE TO ENABLE JD MATCH MODE..."
              rows={8}
              className="w-full border-3 border-[#888888] bg-[#121212] text-[#E0E0E0] font-mono text-xs px-4 py-3 focus:outline-none focus:border-[#E0E0E0] placeholder:text-[#888888] resize-none uppercase tracking-wide transition-colors"
            />
            {jdActive && (
              <button
                id="clear-jd-btn"
                onClick={() => setJobDescription('')}
                className="mt-2 text-xs font-extrabold uppercase tracking-widest text-[#E0E0E0] hover:text-[#888888] transition-colors"
              >
                ✕ CLEAR JD
              </button>
            )}
          </div>

          {/* Suggested prompts */}
          <div className="p-5">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#B0B0B0] mb-3">
              QUICK PROMPTS
            </div>
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  id={`prompt-${prompt.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading || !selectedResumeId}
                  className="text-left border-3 border-[#888888] bg-[#444444] text-[#E0E0E0] text-xs font-extrabold uppercase tracking-wider px-3 py-2 hover:bg-[#888888] hover:text-[#121212] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  → {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT PANEL — chat                                                */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-[#444444] flex flex-col" style={{ height: '700px' }}>
          {/* Chat toolbar */}
          <div className="border-b-3 border-[#888888] px-5 py-3 flex items-center justify-between bg-[#121212] shrink-0">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#B0B0B0]">
              {messages.length > 0
                ? `${messages.length} MESSAGE${messages.length !== 1 ? 'S' : ''}`
                : 'NO MESSAGES YET'}
            </div>
            <button
              id="clear-chat-btn"
              onClick={handleClearChat}
              disabled={messages.length === 0 || isLoading}
              className="text-xs font-extrabold uppercase tracking-widest text-[#E0E0E0] hover:text-[#888888] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ✕ CLEAR CHAT
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="border-3 border-[#888888] p-8 bg-[#121212]">
                  <div className="text-3xl font-extrabold uppercase tracking-tight text-[#B0B0B0] mb-2">
                    READY
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#888888]">
                    Select a resume and ask a question, or click a quick prompt.
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}

            {isLoading && <LoadingDots />}

            <div ref={messagesEndRef} />
          </div>

          {/* Error bar */}
          {error && (
            <div className="border-t-3 border-[#888888] bg-[#121212] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#E0E0E0] shrink-0">
              ⚠ {error}
            </div>
          )}

          {/* Input bar */}
          <div className="border-t-3 border-[#888888] p-4 flex gap-3 shrink-0 bg-[#121212]">
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="TYPE YOUR QUESTION... (ENTER TO SEND, SHIFT+ENTER FOR NEWLINE)"
              rows={2}
              disabled={isLoading || !selectedResumeId}
              className="flex-1 border-3 border-[#888888] bg-[#121212] text-[#E0E0E0] font-mono text-sm px-4 py-3 focus:outline-none focus:border-[#E0E0E0] placeholder:text-[#888888] resize-none uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              id="send-btn"
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim() || !selectedResumeId}
              variant="primary"
              size="md"
              className="self-end shrink-0"
            >
              {isLoading ? '...' : '→ SEND'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
