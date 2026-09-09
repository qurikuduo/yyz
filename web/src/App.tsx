export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>抑郁自测 · Depression Self-Assessment</h1>
      </header>
      <main className="app-main">
        <p className="muted">
          脚手架已就绪（M0）。后续里程碑将实现：量表选择、个人信息录入、MBTI 式答题、
          逐题解释与答案解析、综合诊断、密码保护的结果分享 URL，以及自助知识库。
        </p>
        <p className="muted">
          Scaffold ready (M0). Upcoming milestones add scale selection, intake, an MBTI-style
          question flow, per-item explanations, comprehensive synthesis, password-protected
          shareable results, and a self-help knowledge base.
        </p>
      </main>
      <footer className="app-footer">
        <p className="disclaimer">
          本工具为筛查/自评用途，<strong>不构成临床诊断</strong>。如有自伤或自杀念头，请立即联系当地急救或心理危机热线。
          <br />
          This is a screening/self-report tool and <strong>not a clinical diagnosis</strong>. If you
          have thoughts of self-harm or suicide, contact local emergency services or a crisis line now.
        </p>
      </footer>
    </div>
  )
}
