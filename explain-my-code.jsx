import { useState, useRef, useEffect, useCallback } from "react";

const LANGUAGES = ["javascript", "python", "java", "csharp", "typescript", "cpp", "go", "rust"];

const LANG_LABELS = {
  javascript: "JavaScript", python: "Python", java: "Java",
  csharp: "C#", typescript: "TypeScript", cpp: "C++", go: "Go", rust: "Rust"
};

const TABS = [
  { id: "explain", label: "Explanations" },
  { id: "flow", label: "Flow & Pseudocode" },
  { id: "bugs", label: "Bug Detection" },
  { id: "interview", label: "Interview Mode" },
];

const SAMPLE_CODE = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  const memo = {};
  function fib(k) {
    if (k in memo) return memo[k];
    if (k <= 1) return k;
    memo[k] = fib(k - 1) + fib(k - 2);
    return memo[k];
  }
  return fib(n);
}

console.log(fibonacci(10)); // 55`,
  python: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3,6,8,10,1,2,1]))`,
  java: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
};

function SyntaxHighlight({ code, language }) {
  const highlighted = code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\/\/.*$)/gm, '<span style="color:#6B7280;font-style:italic">$1</span>')
    .replace(/(#.*$)/gm, '<span style="color:#6B7280;font-style:italic">$1</span>')
    .replace(/\b(function|return|if|else|for|while|const|let|var|class|new|this|import|export|default|async|await|def|print|public|static|int|void|boolean|true|false|null|undefined|in|of)\b/g,
      '<span style="color:#7C3AED;font-weight:500">$1</span>')
    .replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color:#059669">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#D97706">$1</span>');
  return (
    <pre style={{
      margin: 0, padding: "1.25rem", fontFamily: "var(--font-mono)", fontSize: "13px",
      lineHeight: 1.7, overflowX: "auto", background: "transparent",
      color: "var(--color-text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-word"
    }} dangerouslySetInnerHTML={{ __html: highlighted }} />
  );
}

function Loader({ text = "Thinking..." }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--color-text-secondary)", padding: "1.5rem 0" }}>
      <div style={{
        width: 18, height: 18, border: "2px solid var(--color-border-secondary)",
        borderTop: "2px solid #7C3AED", borderRadius: "50%",
        animation: "spin 0.7s linear infinite"
      }} />
      <span style={{ fontSize: 14 }}>{text}{dots}</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Badge({ children, color = "purple" }) {
  const colors = {
    purple: { bg: "#EDE9FE", text: "#6D28D9" },
    green: { bg: "#D1FAE5", text: "#065F46" },
    amber: { bg: "#FEF3C7", text: "#92400E" },
    red: { bg: "#FEE2E2", text: "#991B1B" },
    blue: { bg: "#DBEAFE", text: "#1E40AF" },
  };
  const c = colors[color] || colors.purple;
  return (
    <span style={{
      background: c.bg, color: c.text, fontSize: 11, fontWeight: 500,
      padding: "2px 8px", borderRadius: 20, letterSpacing: "0.02em"
    }}>{children}</span>
  );
}

function Section({ title, badge, badgeColor, children }) {
  return (
    <div style={{
      border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12,
      overflow: "hidden", marginBottom: 16
    }}>
      <div style={{
        padding: "12px 16px", background: "var(--color-background-secondary)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        display: "flex", alignItems: "center", gap: 8
      }}>
        <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{title}</span>
        {badge && <Badge color={badgeColor}>{badge}</Badge>}
      </div>
      <div style={{ padding: "16px", fontSize: 14, lineHeight: 1.75, color: "var(--color-text-primary)" }}>
        {children}
      </div>
    </div>
  );
}

function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <h3 key={i} style={{ fontWeight: 500, fontSize: 15, margin: "8px 0 2px", color: "var(--color-text-primary)" }}>{line.slice(4)}</h3>;
        if (line.startsWith("## ")) return <h2 key={i} style={{ fontWeight: 500, fontSize: 16, margin: "10px 0 2px", color: "var(--color-text-primary)" }}>{line.slice(3)}</h2>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight: 500, margin: 0 }}>{line.slice(2, -2)}</p>;
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#7C3AED", marginTop: 3, flexShrink: 0 }}>▸</span>
              <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, '<code style="background:var(--color-background-secondary);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:12px">$1</code>') }} />
            </div>
          );
        }
        if (/^\d+\./.test(line)) {
          const num = line.match(/^(\d+)\./)[1];
          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ background: "#EDE9FE", color: "#6D28D9", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0, marginTop: 2 }}>{num}</span>
              <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, '<code style="background:var(--color-background-secondary);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:12px">$1</code>') }} />
            </div>
          );
        }
        if (line.trim() === "") return <div key={i} style={{ height: 4 }} />;
        return <p key={i} style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, '<code style="background:var(--color-background-secondary);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:12px">$1</code>') }} />;
      })}
    </div>
  );
}

async function callClaude(prompt, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt || "You are a world-class software engineer and teacher. Be precise, insightful, and structured.",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map(b => b.text || "").join("");
}

export default function App() {
  const [code, setCode] = useState(SAMPLE_CODE.javascript);
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("explain");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const speechRef = useRef(null);
  const fileRef = useRef(null);

  const speak = useCallback((text) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92;
    utt.pitch = 1;
    utt.onend = () => setSpeaking(false);
    speechRef.current = utt;
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  }, []);

  const stopSpeak = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    const langMap = { js: "javascript", py: "python", java: "java", cs: "csharp", ts: "typescript" };
    if (langMap[ext]) setLanguage(langMap[ext]);
    const reader = new FileReader();
    reader.onload = (ev) => setCode(ev.target.result);
    reader.readAsText(file);
  };

  const analyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const sys = `You are an expert software engineer and teacher. Respond with clear, structured content using markdown-style formatting (bullet points with -, numbered lists with 1., bold with **text**, inline code with \`code\`). Be accurate, insightful, and educational.`;

      const [explanations, flowBugs, interview] = await Promise.all([
        callClaude(`Analyze this ${LANG_LABELS[language]} code and provide:

1. **ELI5 (Explain Like I'm 5)**: A simple, friendly explanation using a real-world analogy. 2-3 sentences max.
2. **Intermediate**: A clear explanation suitable for someone learning to code. Cover what it does and how.
3. **Advanced / Technical**: Deep technical breakdown covering design patterns, edge cases, and implementation details.
4. **Execution Flow**: Step-by-step numbered list of what happens when this code runs.
5. **Real-World Analogy**: One clear metaphor that maps to this code's behavior.
6. **Time Complexity**: State the Big-O time complexity with brief explanation.
7. **Space Complexity**: State the Big-O space complexity with brief explanation.

Code:
\`\`\`${language}
${code}
\`\`\`

Format each section with its heading (e.g. "## ELI5") followed by the content.`, sys),

        callClaude(`Analyze this ${LANG_LABELS[language]} code and provide:

## Pseudocode
Convert the code to clean, language-agnostic pseudocode that explains the logic clearly.

## Flowchart Description
Describe the logical flow as numbered steps that could be drawn as a flowchart (Start → decisions → processes → End). Label each node type: [START], [PROCESS], [DECISION], [END].

## Bug Detection
List any bugs, risky patterns, or potential issues found. For each:
- Describe the issue
- Rate severity: Critical / Warning / Info
- Suggest a fix

## Improvements
List 3-5 concrete code improvements or optimizations.

Code:
\`\`\`${language}
${code}
\`\`\``, sys),

        callClaude(`You are a senior engineering interviewer. Based on this ${LANG_LABELS[language]} code, generate 5 interview questions and model answers.

For each question:
- Ask a meaningful technical question about the code
- Provide a strong model answer a senior engineer would give

Include questions about: design choices, optimization, edge cases, trade-offs, and scalability.

Code:
\`\`\`${language}
${code}
\`\`\`

Format as:
**Q1: [question]**
Model Answer: [answer]

(repeat for Q2-Q5)`, sys)
      ]);

      const parsed = {
        explanations,
        flowBugs,
        interview,
        timestamp: new Date().toLocaleString(),
        codeSnippet: code.slice(0, 80) + (code.length > 80 ? "..." : ""),
        language
      };
      setResults(parsed);
      setHistory(h => [parsed, ...h].slice(0, 10));
      const eli5Match = explanations.match(/## ELI5\n([\s\S]*?)(?=##|$)/);
      if (eli5Match) setSpeechText(eli5Match[1].trim());
    } catch (err) {
      setResults({ error: err.message });
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    if (!results) return;
    const content = [results.explanations, results.flowBugs, results.interview].filter(Boolean).join("\n\n---\n\n");
    const blob = new Blob([`EXPLAIN MY CODE — ${LANG_LABELS[language]}\nGenerated: ${results.timestamp}\n\n${content}`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "code-explanation.txt"; a.click();
  };

  const renderExplanations = () => {
    if (!results?.explanations) return null;
    const text = results.explanations;
    const extract = (heading) => {
      const re = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=##|$)`);
      const m = text.match(re);
      return m ? m[1].trim() : "";
    };
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
          {[
            { label: "Time Complexity", value: extract("Time Complexity").split("\n")[0] || "—", color: "#7C3AED" },
            { label: "Space Complexity", value: extract("Space Complexity").split("\n")[0] || "—", color: "#059669" },
            { label: "Language", value: LANG_LABELS[language], color: "#D97706" },
          ].map(m => (
            <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "14px 16px", border: "0.5px solid var(--color-border-tertiary)" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontWeight: 500, fontSize: 15, color: m.color, fontFamily: "var(--font-mono)" }}>{m.value}</div>
            </div>
          ))}
        </div>
        {[
          { title: "ELI5 — Like you're 5", key: "ELI5", badge: "Beginner", badgeColor: "green" },
          { title: "Intermediate explanation", key: "Intermediate", badge: "Intermediate", badgeColor: "blue" },
          { title: "Advanced / Technical", key: "Advanced", badge: "Advanced", badgeColor: "purple" },
          { title: "Real-world analogy", key: "Real-World Analogy", badge: null },
          { title: "Step-by-step execution", key: "Execution Flow", badge: null },
        ].map(s => {
          const content = extract(s.key);
          if (!content) return null;
          return <Section key={s.key} title={s.title} badge={s.badge} badgeColor={s.badgeColor}><MarkdownText text={content} /></Section>;
        })}
      </div>
    );
  };

  const renderFlowBugs = () => {
    if (!results?.flowBugs) return null;
    const text = results.flowBugs;
    const extract = (heading) => {
      const re = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=##|$)`);
      const m = text.match(re);
      return m ? m[1].trim() : "";
    };
    return (
      <div>
        {[
          { title: "Pseudocode", key: "Pseudocode", mono: true },
          { title: "Flowchart description", key: "Flowchart Description" },
          { title: "Bug detection", key: "Bug Detection" },
          { title: "Suggested improvements", key: "Improvements" },
        ].map(s => {
          const content = extract(s.key);
          if (!content) return null;
          return (
            <Section key={s.key} title={s.title}>
              {s.mono
                ? <pre style={{ fontFamily: "var(--font-mono)", fontSize: 13, margin: 0, whiteSpace: "pre-wrap", color: "var(--color-text-primary)" }}>{content}</pre>
                : <MarkdownText text={content} />}
            </Section>
          );
        })}
      </div>
    );
  };

  const renderInterview = () => {
    if (!results?.interview) return null;
    const questions = results.interview.split(/\*\*Q\d+:/).filter(Boolean);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {questions.map((q, i) => {
          const parts = q.split("Model Answer:");
          const question = parts[0].replace(/\*\*/g, "").trim();
          const answer = parts[1]?.trim() || "";
          return (
            <div key={i} style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: "#EDE9FE", padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "#6D28D9", fontWeight: 500, marginBottom: 4 }}>QUESTION {i + 1}</div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#3730A3" }}>{question}</div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, fontWeight: 500 }}>Model Answer</div>
                <MarkdownText text={answer} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0F0F0F" : "var(--color-background-tertiary)", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Explain My Code</h1>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>Paste code. Get instant explanations, bug reports & interview prep.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowHistory(!showHistory)} style={{
              padding: "6px 14px", fontSize: 13, borderRadius: 8, cursor: "pointer",
              border: "0.5px solid var(--color-border-secondary)", background: "transparent",
              color: "var(--color-text-secondary)"
            }}>History ({history.length})</button>
            <button onClick={() => setDarkMode(d => !d)} style={{
              padding: "6px 10px", fontSize: 13, borderRadius: 8, cursor: "pointer",
              border: "0.5px solid var(--color-border-secondary)", background: "transparent",
              color: "var(--color-text-secondary)"
            }}>{darkMode ? "☀" : "◑"}</button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16, marginBottom: 20, background: "var(--color-background-primary)" }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12 }}>Recent analyses</div>
            {history.length === 0 && <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>No history yet.</p>}
            {history.map((h, i) => (
              <div key={i} onClick={() => { setCode(h.codeSnippet.replace("...", "")); setResults(h); setShowHistory(false); }}
                style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 6, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-primary)" }}>{h.codeSnippet}</span>
                  <Badge color="purple">{LANG_LABELS[h.language]}</Badge>
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>{h.timestamp}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Left: Code Input */}
          <div>
            <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, overflow: "hidden", background: "var(--color-background-primary)" }}>
              <div style={{ padding: "10px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                <select value={language} onChange={e => { setLanguage(e.target.value); setCode(SAMPLE_CODE[e.target.value] || ""); }}
                  style={{ fontSize: 13, borderRadius: 6, padding: "4px 8px", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer" }}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
                </select>
                <button onClick={() => fileRef.current.click()}
                  style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                  Upload file
                </button>
                <input ref={fileRef} type="file" accept=".js,.py,.java,.cs,.ts,.cpp,.go,.rs" style={{ display: "none" }} onChange={handleFileUpload} />
                <button onClick={() => setCode("")}
                  style={{ marginLeft: "auto", fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                  Clear
                </button>
              </div>
              <div style={{ position: "relative", minHeight: 320 }}>
                <textarea value={code} onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  placeholder="Paste your code here..."
                  style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    minHeight: 320, fontFamily: "var(--font-mono)", fontSize: 13,
                    lineHeight: 1.7, padding: "1.25rem", border: "none", outline: "none",
                    resize: "vertical", background: "transparent", color: "var(--color-text-primary)",
                    caretColor: "#7C3AED"
                  }} />
              </div>
              <div style={{ padding: "12px 14px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={analyze} disabled={loading || !code.trim()}
                  style={{
                    flex: 1, padding: "10px", fontSize: 14, fontWeight: 500, borderRadius: 8,
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                    background: loading ? "#C4B5FD" : "#7C3AED", color: "white",
                    transition: "opacity 0.2s"
                  }}>
                  {loading ? "Analyzing..." : "Analyze Code ↗"}
                </button>
                {results && (
                  <button onClick={downloadPDF}
                    style={{ padding: "10px 14px", fontSize: 13, borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                    Export
                  </button>
                )}
              </div>
            </div>

            {/* Voice Avatar */}
            {results && speechText && (
              <div style={{ marginTop: 14, border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "14px 16px", background: "var(--color-background-primary)" }}>
                <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 10, color: "var(--color-text-secondary)" }}>Voice explanation (ELI5)</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", background: speaking ? "#EDE9FE" : "var(--color-background-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    border: speaking ? "2px solid #7C3AED" : "0.5px solid var(--color-border-tertiary)",
                    transition: "all 0.3s",
                    animation: speaking ? "pulse 1s infinite" : "none"
                  }}>🤖</div>
                  <div style={{ flex: 1 }}>
                    {speaking && <div style={{ height: 3, background: "linear-gradient(90deg,#7C3AED,#C4B5FD)", borderRadius: 2, animation: "grow 2s ease-in-out infinite" }} />}
                    {!speaking && <div style={{ height: 3, background: "var(--color-background-secondary)", borderRadius: 2 }} />}
                  </div>
                  <button onClick={() => speaking ? stopSpeak() : speak(speechText)}
                    style={{ padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", color: "var(--color-text-primary)" }}>
                    {speaking ? "Pause" : "Play"}
                  </button>
                  <button onClick={() => { stopSpeak(); setTimeout(() => speak(speechText), 100); }}
                    disabled={!speechText}
                    style={{ padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                    Replay
                  </button>
                </div>
                <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.3)}50%{box-shadow:0 0 0 6px rgba(124,58,237,0)}} @keyframes grow{0%,100%{transform:scaleX(0.3);transform-origin:left}50%{transform:scaleX(1)}}`}</style>
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div>
            <div style={{ display: "flex", gap: 2, marginBottom: 14, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{
                    flex: 1, padding: "7px 4px", fontSize: 12.5, fontWeight: activeTab === t.id ? 500 : 400,
                    borderRadius: 7, border: "none", cursor: "pointer",
                    background: activeTab === t.id ? "var(--color-background-primary)" : "transparent",
                    color: activeTab === t.id ? "#7C3AED" : "var(--color-text-secondary)",
                    boxShadow: activeTab === t.id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.15s"
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, background: "var(--color-background-primary)", padding: 16, minHeight: 400, maxHeight: 680, overflowY: "auto" }}>
              {!results && !loading && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-secondary)" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
                  <p style={{ fontSize: 14, margin: 0 }}>Paste your code and click Analyze Code to get instant explanations, bug reports, and interview questions.</p>
                </div>
              )}
              {loading && (
                <div style={{ padding: "20px 0" }}>
                  <Loader text="Analyzing your code" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                    {["Generating explanations...", "Detecting bugs...", "Preparing interview questions..."].map((t, i) => (
                      <div key={i} style={{ height: 14, background: "var(--color-background-secondary)", borderRadius: 6, opacity: 0.6, width: ["100%", "80%", "60%"][i], animation: `pulse2 1.5s ${i * 0.3}s ease-in-out infinite` }} />
                    ))}
                  </div>
                  <style>{`@keyframes pulse2{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style>
                </div>
              )}
              {results?.error && (
                <div style={{ padding: 16, background: "#FEE2E2", borderRadius: 8, color: "#991B1B", fontSize: 13 }}>
                  Error: {results.error}. Make sure the Claude API is accessible.
                </div>
              )}
              {results && !results.error && (
                <>
                  {activeTab === "explain" && renderExplanations()}
                  {activeTab === "flow" && renderFlowBugs()}
                  {activeTab === "bugs" && renderFlowBugs()}
                  {activeTab === "interview" && renderInterview()}
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--color-text-secondary)" }}>
          Powered by Claude · Sonnet 4
        </div>
      </div>
    </div>
  );
}
