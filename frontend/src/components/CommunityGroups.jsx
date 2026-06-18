import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Send, Users, ShieldAlert, Sparkles, MessageCircle } from 'lucide-react';

const CommunityGroups = () => {
  const { user } = useSelector((state) => state.auth);

  const [activeGroup, setActiveGroup] = useState('Class 10 Group');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Initialise active group based on user settings
  useEffect(() => {
    if (user) {
      if (user.class === '10') {
        setActiveGroup('Class 10 General Forum');
      } else {
        setActiveGroup(`Class 12 ${user.stream || 'Science'} Channel`);
      }
    }
  }, [user]);

  // Initialise mock discussion threads
  useEffect(() => {
    const mockChats = {
      'Class 10 General Forum': [
        { sender: 'Aarav Sharma', text: 'Hey guys, did anyone finish the Chemistry quiz today?', role: 'student', time: '10 mins ago' },
        { sender: 'Ananya Goel', text: 'Yes! The lead nitrate question was tricky but the explanation was really helpful.', role: 'student', time: '8 mins ago' },
        { sender: 'Mr. Verma (Science Educator)', text: 'Excellent progress, Aarav and Ananya. Make sure to review the decomposition reactions equations.', role: 'teacher', time: '5 mins ago' },
      ],
      'Class 12 Science Channel': [
        { sender: 'Rohan Sen', text: 'Anyone solved the electrostatic potential numericals?', role: 'student', time: '15 mins ago' },
        { sender: 'Priya Iyer', text: 'Yes, remember that the work done is independent of the path because electrostatic forces are conservative.', role: 'student', time: '11 mins ago' },
        { sender: 'Dr. Nair (Physics HOD)', text: 'Correct Priya! I will upload a formula sheet for capacitors shortly.', role: 'teacher', time: '2 mins ago' },
      ],
      'Class 12 Commerce Channel': [
        { sender: 'Kabir Mehta', text: 'Stuck on Partnership Account balance sheets calculations. Any tips?', role: 'student', time: '12 mins ago' },
        { sender: 'Sanya Gupta', text: 'Always ensure capital adjustments match partner ratio parameters.', role: 'student', time: '7 mins ago' },
      ],
      'Class 12 Humanities Channel': [
        { sender: 'Sneha Roy', text: 'The Cold War alliances breakdown is really interesting.', role: 'student', time: '20 mins ago' },
        { sender: 'Dev Jha', text: 'Yes, especially the bipolar system alignment rules.', role: 'student', time: '15 mins ago' },
      ]
    };

    setMessages(mockChats[activeGroup] || mockChats['Class 10 General Forum']);
  }, [activeGroup]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: user?.name || 'You',
      text: inputText,
      role: user?.role || 'student',
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 dark:bg-[#0b0f19]">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-md">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Student Community Groups</h1>
          <p className="text-xs text-slate-500">Collaborate with peers and request verified teacher assists</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* Left column list of workspace channels */}
        <div className="md:col-span-1 glass-card p-4 rounded-3xl border shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Workspace Channels</h3>
          <div className="space-y-1">
            {[
              'Class 10 General Forum',
              'Class 12 Science Channel',
              'Class 12 Commerce Channel',
              'Class 12 Humanities Channel',
            ].map((groupName) => (
              <button
                key={groupName}
                onClick={() => setActiveGroup(groupName)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeGroup === groupName
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                    : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                {groupName}
              </button>
            ))}
          </div>
        </div>

        {/* Right column Chat Workspace Panel */}
        <div className="md:col-span-3 glass-card p-5 rounded-3xl border shadow-sm h-[480px] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/20">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4.5 w-4.5 text-blue-500" />
              <h4 className="font-bold text-xs sm:text-sm">{activeGroup}</h4>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Live Discussion
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{msg.sender}</span>
                    {msg.role === 'teacher' ? (
                      <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                        Teacher verified
                      </span>
                    ) : (
                      <span className="text-[8px] font-semibold text-slate-400">Classmate</span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400">{msg.time}</span>
                </div>
                <p className="p-3 bg-slate-100/50 dark:bg-slate-850/50 rounded-2xl border leading-relaxed text-slate-600 dark:text-slate-300">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-200/20">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send a message to ${activeGroup}...`}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs sm:text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommunityGroups;
