# easyCodeExplinator
helping people understand code better
explain-my-code/
├── frontend/                    # React + Tailwind
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx        # Monaco-based editor
│   │   │   ├── ExplanationPanel.jsx  # ELI5 / Intermediate / Advanced tabs
│   │   │   ├── FlowChart.jsx         # Mermaid.js diagram renderer
│   │   │   ├── BugReport.jsx         # Severity-tagged bug list
│   │   │   ├── InterviewMode.jsx     # Q&A accordion
│   │   │   └── VoiceAvatar.jsx       # Web Speech API controls
│   │   ├── hooks/
│   │   │   ├── useCodeAnalysis.js    # Orchestrates all API calls
│   │   │   ├── useSpeech.js          # Web Speech synthesis hook
│   │   │   └── useHistory.js         # localStorage + DB sync
│   │   ├── services/
│   │   │   └── api.js                # Axios client → .NET backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
│
├── backend/                     # .NET 8 Web API
│   ├── Controllers/
│   │   ├── AnalysisController.cs     # POST /api/analyze
│   │   └── HistoryController.cs      # GET/DELETE /api/history
│   ├── Services/
│   │   ├── ClaudeService.cs          # Anthropic API client
│   │   └── AnalysisOrchestrator.cs   # Parallel prompt execution
│   ├── Models/
│   │   ├── AnalysisRequest.cs
│   │   ├── AnalysisResult.cs
│   │   └── HistoryEntry.cs
│   ├── Data/
│   │   └── AppDbContext.cs           # EF Core + PostgreSQL
│   ├── Migrations/
│   └── Program.cs
│
└── docker-compose.yml           # postgres + backend + frontend
