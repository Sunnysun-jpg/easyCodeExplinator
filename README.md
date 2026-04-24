Full Project Architecture
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

What's Live in the Artifact
FeatureStatusCode input with syntax highlighting✅8 languages with sample code✅File upload (.js, .py, .java, .cs, .ts)✅ELI5 / Intermediate / Advanced explanations✅Real-world analogy + execution flow✅Time & Space complexity✅Pseudocode + flowchart description✅Bug detection + improvements✅5 interview Q&As with model answers✅Voice avatar (Web Speech API)✅Dark mode toggle✅In-session history (last 10)✅Export as text file✅Claude Sonnet 4 integration✅

Key Backend API (C# — AnalysisController.cs)
csharp[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
    private readonly ClaudeService _claude;
    private readonly AppDbContext _db;

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] AnalysisRequest req)
    {
        // Run all 3 prompts in parallel
        var (explanations, flowBugs, interview) = await (
            _claude.ExplainAsync(req.Code, req.Language),
            _claude.AnalyzeFlowAndBugsAsync(req.Code, req.Language),
            _claude.GenerateInterviewAsync(req.Code, req.Language)
        ).WhenAll();

        var entry = new HistoryEntry { Code = req.Code, Language = req.Language,
            Explanations = explanations, CreatedAt = DateTime.UtcNow };
        _db.History.Add(entry);
        await _db.SaveChangesAsync();

        return Ok(new { explanations, flowBugs, interview, id = entry.Id });
    }
}
PostgreSQL Schema
sqlCREATE TABLE history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,
  language    VARCHAR(30),
  code        TEXT,
  explanations TEXT,
  flow_bugs   TEXT,
  interview   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_history_user ON history(user_id, created_at DESC);
