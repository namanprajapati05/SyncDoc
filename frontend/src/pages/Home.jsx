const DocumentPreview = () => (
    <div className="document-preview" aria-label="SyncDoc document preview">
        <div className="preview-topbar"><span className="preview-logo">S</span><strong>Q4 product narrative</strong><div className="preview-avatars"><span>A</span><span>J</span><span>M</span></div></div>
        <div className="preview-body"><aside className="preview-sidebar"><span className="sidebar-label">OUTLINE</span><span className="selected">Context</span><span>Goals</span><span>Launch plan</span><span>Measures</span></aside><div className="preview-copy"><span className="preview-kicker">PRODUCT BRIEF</span><h3>Q4 product narrative</h3><p>Our next quarter makes collaboration visible, so teams can move from ideas to decisions with less friction.</p><div className="preview-callout">Keep the story focused and the context close.</div><div className="preview-note"><span>!</span> Can we add the customer evidence here?</div></div></div>
    </div>
)

const features = [
    { icon: '▧', title: 'Structured AST blocks', text: 'Documents are stored as explicit, composable content blocks—not an opaque text blob.' },
    { icon: '◈', title: 'Authenticated workspaces', text: 'Secure access and ownership create a dependable collaboration boundary.' },
    { icon: '◷', title: 'Versioned by design', text: 'Resolve document versions, preserve context, and export work when it needs to travel.' },
]

const roadmap = [['React editor', 'Available'], ['Node.js + Express API', 'Available'], ['MongoDB + Mongoose', 'Available'], ['WebSocket transport', 'Planned'], ['Yjs / CRDT sync', 'Planned']]

function Home() {
    return (
        <main>
            <section className="hero-section">
                <div className="hero-inner">
                    <div className="hero-copy">
                        <span className="eyebrow">
                            Built for ideas that evolve</span><h1>Documents that stay structured as your team moves fast.</h1><p>SyncDoc is a collaborative document engine built on structured AST blocks—giving teams a reliable foundation for writing, reviewing, and evolving shared knowledge.</p><div className="hero-actions"><a className="button button-primary" href="/signup">Create your workspace</a><a className="button button-secondary" href="#features">Explore features</a></div><small>Free foundation plan · No credit card required · Export anytime</small></div><DocumentPreview /></div></section>

            <section className="foundation-section" id="features"><div className="section-heading"><span className="eyebrow">Built to last</span><h2>A practical foundation for collaborative documents</h2><p>The current foundation combines a React interface, Node.js and Express services, MongoDB/Mongoose persistence, authentication, structured content, collaboration, version history, and export.</p></div><div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><div className="feature-card-top"><span className="feature-icon">{feature.icon}</span><span className="status-pill">Available</span></div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section>

            <section className="roadmap-section"><div className="roadmap-inner"><div className="roadmap-copy"><span className="eyebrow eyebrow-warm">Roadmap, clearly labeled</span><h2>Real-time collaboration, without pretending it is already done.</h2><p>WebSocket transport and Yjs/CRDT synchronization are planned capabilities. The architecture is being prepared for reliable multi-user editing while today’s product focuses on a sound document foundation.</p><a className="button button-secondary" href="#roadmap">See the product roadmap</a></div><div className="roadmap-list" id="roadmap">{roadmap.map(([name, status]) => <div className="roadmap-item" key={name}><strong>{name}</strong><span className={status === 'Planned' ? 'status-pill status-planned' : 'status-pill'}>{status}</span></div>)}</div></div></section>

            <section className="cta-section"><h2>Make your team’s next document easier to trust.</h2><p>Start with the complete foundation. Grow into real-time collaboration as SyncDoc evolves.</p><a className="button button-light" href="/signup">Get started free</a></section><footer className="site-footer"><div><strong>SyncDoc</strong><span>The collaborative document engine.</span></div><nav><a href="#features">Product</a><a href="#features">Security</a><a href="#roadmap">Roadmap</a><a href="/about">About</a></nav><small>© 2026 SyncDoc</small></footer>
        </main>
    )
}

export default Home;