import { Send, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface QueryInputBarProps {
  onSend: (query: string) => void;
  isLoading: boolean;
}

export const QueryInputBar: React.FC<QueryInputBarProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-surface/50 backdrop-blur-md rounded-2xl border border-border shadow-2xl">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question about campus life..."
          className="w-full bg-surface-elevated border border-border rounded-xl py-4 pl-4 pr-14 text-base text-text-primary focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-text-muted"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:bg-surface-elevated disabled:text-text-muted transition-colors flex items-center justify-center"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};
