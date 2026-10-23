'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };
const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hey, I’m Manish’s portfolio assistant. Ask me about his projects, experience, skills, or hackathon wins.',
};
const SUGGESTIONS = [
  'What has Manish built?',
  'Which hackathons has he won?',
  'What is NexCord?',
];

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [open, messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        abortRef.current?.abort();
        setBusy(false);
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(async (rawText = input) => {
    const text = rawText.trim();
    if (!text || busy) return;

    const conversation = [...messages, { role: 'user' as const, content: text }];
    setMessages(conversation);
    setInput('');
    setError('');
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.slice(-9) }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = typeof data.message === 'string' ? data.message : 'Chat is temporarily unavailable. Please try again or email Manish.';
        setMessages([...conversation, { role: 'assistant', content: message }]);
        if (response.status !== 503) setError('The assistant could not complete that request.');
        return;
      }
      setMessages([...conversation, {
        role: 'assistant',
        content: typeof data.message === 'string' ? data.message : 'I don’t have an answer for that yet.',
      }]);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setMessages([...conversation, {
        role: 'assistant',
        content: 'I can’t reach the assistant right now. Please try again, or email Manish at msaimanishreddy123@gmail.com.',
      }]);
      setError('Connection problem. Check your connection and try again.');
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setBusy(false);
    }
  }, [busy, input, messages]);

  function clearChat() {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    setError('');
    setInput('');
    setMessages([INITIAL_MESSAGE]);
    inputRef.current?.focus();
  }

  return (
    <>
      <button
        className="chat-launch glass"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close chat' : 'Ask about Manish'}
        aria-expanded={open}
        aria-controls="portfolio-chat-panel"
        type="button"
      >
        {open ? '×' : <MessageCircle
                        size={22}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
        }
      </button>

      {open && (
        <section id="portfolio-chat-panel" className="chat-panel glass" aria-label="Ask about Manish">
          <div className="chat-head">
            <div className="chat-avatar" aria-hidden="true">M.</div>
            <div className="chat-heading-copy">
              <strong>Ask about Manish</strong>
              <p><span className="chat-status-dot" /> Portfolio assistant</p>
            </div>
            <button className="chat-clear" onClick={clearChat} type="button" aria-label="Clear conversation" title="Clear conversation">↺</button>
            <button className="chat-close" onClick={() => setOpen(false)} type="button" aria-label="Close chat">×</button>
          </div>

          <div className="chat-messages" aria-live="polite" aria-relevant="additions text" role="log">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`chat-message ${message.role}`}>
                {message.content}
              </div>
            ))}
            {busy && <div className="chat-message assistant chat-thinking"><span /> <span /> <span /><span className="sr-only">Thinking…</span></div>}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="suggestions" aria-label="Suggested questions">
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" disabled={busy} onClick={() => void send(suggestion)}>{suggestion}</button>
              ))}
            </div>
          )}

          {error && <p className="chat-error" role="status">{error}</p>}

          <form className="chat-input" onSubmit={(event) => { event.preventDefault(); void send(); }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question…"
              maxLength={500}
              aria-label="Your question"
              autoComplete="off"
              disabled={busy}
            />
            {busy ? (
              <button type="button" className="chat-stop" onClick={() => abortRef.current?.abort()}>Stop</button>
            ) : (
              <button type="submit" disabled={!input.trim()}>Send <span aria-hidden="true">↗</span></button>
            )}
          </form>
          <p className="chat-disclaimer">Answers are based on Manish’s portfolio. <a href="mailto:msaimanishreddy123@gmail.com">Contact him directly</a>.</p>
        </section>
      )}
    </>
  );
}
