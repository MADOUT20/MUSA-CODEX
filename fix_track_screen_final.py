import re

file_path = 'src/components/TrackScreen.tsx'
with open(file_path, 'r') as f:
    content = f.read()

def replace_recent(match):
    start = match.group(1)
    end = match.group(3)
    inner = r'''<span className="text-[10px]">Recent:</span>
              {reports.length > 0 ? (
                reports.slice(0, 3).map((rep) => (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => {
                      setSearchToken(rep.id);
                      setSelectedReport(rep);
                      setErrorNotFound(false);
                    }}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] border transition-colors cursor-pointer ${
                      selectedReport?.id === rep.id
                        ? 'border-[#0E1E32] bg-[#0E1E32] text-white'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0E1E32]'
                    }`}
                  >
                    {rep.id}
                  </button>
                ))
              ) : (
                <span className="italic opacity-70">No reports submitted yet.</span>
              )}'''
    return start + inner + end

def replace_chat(match):
    start = match.group(1)
    end = match.group(3)
    static_messages = r'''              {[
                { id: 'm1', sender: 'system', timestamp: '10:00 AM', content: 'Hello. How can we assist you with your complaint?' },
                { id: 'm2', sender: 'student', timestamp: '10:01 AM', content: 'I would like an update on my report.' },
                { id: 'm3', sender: 'support', timestamp: '10:02 AM', content: 'Your report is currently under review. We will keep you updated.' },
              ].map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'student'
                      ? 'bg-[#0E1E32] text-white ml-6 shadow-xs'
                      : 'bg-[#F8FAFC] text-[#0E1E32] border border-[#E2E8F0] mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 opacity-75 text-[10px]">
                    <span className="font-semibold">
                      {msg.sender === 'student' ? 'You (Anonymous)' : 'Campus Safety Ombudsperson'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              ))}\n'''
    return start + static_messages + end

# Apply replacements using div boundaries
content = re.sub(r'(<div className="flex items-center gap-1\.5 mt-1\.5 overflow-x-auto pb-0\.5 text-xs text-\[#607994\]">\n)(.*?)(</div>\n)', replace_recent, content, flags=re.DOTALL)
content = re.sub(r'(<div className="space-y-2\.5 flex-1 overflow-y-auto pr-1 py-1">\n)(.*?)(</div>\n)', replace_chat, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
