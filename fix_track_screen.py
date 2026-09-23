import sys

file_path = 'src/components/TrackScreen.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

# 1. Fix Recent Reports
# Find the start of the mapping
start_recent = -1
for idx, line in enumerate(lines):
    if '{reports.slice(0, 3).map((rep) => (' in line:
        start_recent = idx
        break

if start_recent != -1:
    # Find the end of the mapping
    depth = 0
    end_recent = -1
    for idx in range(start_recent, len(lines)):
        depth += lines[idx].count('(')
        depth -= lines[idx].count(')')
        if depth <= 0:
            end_recent = idx
            break
    
    # Wrap with ternary
    lines[start_recent] = lines[start_recent].replace('{reports.slice(0, 3).map((rep) => (', '              {reports.length > 0 ? (\n                ')
    lines.insert(end_recent + 1, '              ) : (\n                <span className="italic opacity-70">No reports submitted yet.</span>\n              )}\n')

# 2. Fix Chat Messages
# Find the start of the ternary
start_chat = -1
for idx, line in enumerate(lines):
    if '{(selectedReport?.messages && selectedReport.messages.length > 0) ? (' in line:
        start_chat = idx
        break

if start_chat != -1:
    # Find the end of the ternary
    # This ternary is complex. Let's find the line where the final ')' closes the whole expression.
    # It's usually the line before the </div> of the messages area.
    
    # Find the end of the true branch
    depth = 0
    idx = start_chat
    while idx < len(lines):
        depth += lines[idx].count('(')
        depth -= lines[idx].count(')')
        idx += 1
        if depth <= 0:
            break
    
    # Now find the end of the false branch
    depth = 0
    while idx < len(lines):
        depth += lines[idx].count('(')
        depth -= lines[idx].count(')')
        idx += 1
        if depth <= 0:
            break
    end_chat = idx - 1
    
    # Replace the whole block with static messages
    static_chat = [
        '              {[',
        "                { id: 'm1', sender: 'system', timestamp: '10:00 AM', content: 'Hello. How can we assist you with your complaint?' },\n",
        "                { id: 'm2', sender: 'student', timestamp: '10:01 AM', content: 'I would like an update on my report.' },\n",
        "                { id: 'm3', sender: 'support', timestamp: '10:02 AM', content: 'Your report is currently under review. We will keep you updated.' },\n",
        '              ].map((msg) => (\n',
        "                <div\n",
        "                  key={msg.id}\n",
        "                  className={`p-2.5 rounded-xl text-xs leading-relaxed ${ \n",
        "                    msg.sender === 'student'\n",
        "                      ? 'bg-[#0E1E32] text-white ml-6 shadow-xs'\n",
        "                      : 'bg-[#F8FAFC] text-[#0E1E32] border border-[#E2E8F0] mr-6'\n",
        "                  }`}\n",
        "                >\n",
        "                  <div className=\"flex items-center justify-between mb-1 opacity-75 text-[10px]\">\n",
        "                    <span className=\"font-semibold\">\n",
        "                      {msg.sender === 'student' ? 'You (Anonymous)' : 'Campus Safety Ombudsperson'}\n",
        "                    </span>\n",
        "                    <span>{msg.timestamp}</span>\n",
        "                  </div>\n",
        "                  <p>{msg.content}</p>\n",
        "                </div>\n",
        "              ))}\n"
    ]
    
    # Replace the lines from start_chat to end_chat
    lines[start_chat : end_chat+1] = static_chat

with open(file_path, 'w') as f:
    f.writelines(lines)
