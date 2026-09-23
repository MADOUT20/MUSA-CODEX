import sys

file_path = 'src/components/TrackScreen.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # FIX 1: Recent Reports Section
    # We find the specific line that starts the "Recent" mapping and replace the block.
    if '<span className="text-[10px]">Recent:</span>' in line:
        new_lines.append(line)
        i += 1
        # The mapping starts on the next line(s). We replace the map block.
        # We'll skip lines until we find the closing ternary/map.
        while i < len(lines) and 'reports.slice(0, 3).map' in lines[i]:
            i += 1
        # We need to skip until the end of that mapping block
        depth = 0
        # We already skipped the first line of the map, so we need to account for the opening '('
        depth = 1 
        while i < len(lines) and depth > 0:
            curr = lines[i]
            depth += curr.count('(')
            depth -= curr.count(')')
            i += 1
        
        # Now we insert the correct ternary logic
        new_lines.append('              {reports.length > 0 ? (\n')
        new_lines.append('                reports.slice(0, 3).map((rep) => (\n')
        new_lines.append('                  <button\n')
        new_lines.append('                    key={rep.id}\n')
        new_lines.append('                    type="button"\n')
        new_lines.append('                    onClick={() => {\n')
        new_lines.append('                      setSearchToken(rep.id);\n')
        new_lines.append('                      setSelectedReport(rep);\n')
        new_lines.append('                      setErrorNotFound(false);\n')
        new_lines.append('                    }}\n')
        new_lines.append('                    className={`px-2 py-0.5 rounded font-mono text-[10px] border transition-colors cursor-pointer ${ \n')
        new_lines.append('                      selectedReport?.id === rep.id\n')
        new_lines.append('                        ? \'border-[#0E1E32] bg-[#0E1E32] text-white\'\n')
        new_lines.append('                        : \'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0E1E32]\'\n')
        new_lines.append('                    }`}\n')
        new_lines.append('                  >\n')
        new_lines.append('                    {rep.id}\n')
        new_lines.append('                  </button>\n')
        new_lines.append('                ))\n')
        new_lines.append('              ) : (\n')
        new_lines.append('                <span className="italic opacity-70">No reports submitted yet.</span>\n')
        new_lines.append('              )}\n')
        continue

    # FIX 2: Chat Section
    # Find the messages area: <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 py-1">
    if '<div className="space-y-2.5 flex-1 overflow-y-auto pr-1 py-1">' in line:
        new_lines.append(line)
        i += 1
        # Skip the entire old mapping block until the closing </div>
        depth = 1
        while i < len(lines) and depth > 0:
            curr = lines[i]
            depth += curr.count('<div')
            depth -= curr.count('</div')
            i += 1
        # Wait, that replaces the outer div. We want to keep the outer div.
        # Let's go back one line.
        new_lines.pop() # remove the </div> we just found
        
        # Now insert the static messages
        new_lines.append('              {[')
        new_lines.append("                { id: 'm1', sender: 'system', timestamp: '10:00 AM', content: 'Hello. How can we assist you with your complaint?' },\n")
        new_lines.append("                { id: 'm2', sender: 'student', timestamp: '10:01 AM', content: 'I would like an update on my report.' },\n")
        new_lines.append("                { id: 'm3', sender: 'support', timestamp: '10:02 AM', content: 'Your report is currently under review. We will keep you updated.' },\n")
        new_lines.append('              ].map((msg) => (')
        new_lines.append('                <div')
        new_lines.append('                  key={msg.id}')
        new_lines.append('                  className={`p-2.5 rounded-xl text-xs leading-relaxed ${')
        new_lines.append("                    msg.sender === 'student'")
        new_lines.append("                      ? 'bg-[#0E1E32] text-white ml-6 shadow-xs'")
        new_lines.append("                      : 'bg-[#F8FAFC] text-[#0E1E32] border border-[#E2E8F0] mr-6'")
        new_lines.append('                  }`}')
        new_lines.append('                >')
        new_lines.append('                  <div className="flex items-center justify-between mb-1 opacity-75 text-[10px]">')
        new_lines.append('                    <span className="font-semibold">')
        new_lines.append("                      {msg.sender === 'student' ? 'You (Anonymous)' : 'Campus Safety Ombudsperson'}")
        new_lines.append('                    </span>')
        new_lines.append('                    <span>{msg.timestamp}</span>')
        new_lines.append('                  </div>')
        new_lines.append('                  <p>{msg.content}</p>')
        new_lines.append('                </div>')
        new_lines.append('              ))}')
        new_lines.append('            </div>\n')
        continue

    new_lines.append(line)
    i += 1

with open(file_path, 'w') as f:
    f.writelines(new_lines)
