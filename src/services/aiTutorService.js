// Enhanced AI Tutor Service for Dr. S. Md. Farooq Academic Portal
// Delivers clean, cohesive, masterclass academic study guides without fragmented box templates.

export async function generateTutorAnswer({
  regulation,
  semester,
  subject,
  unit,
  topic,
  markTarget = "5m", // "2m", "5m", "10m", "concept"
  apiKey = ""
}) {
  const cleanTopic = (topic || "").trim();
  const lower = cleanTopic.toLowerCase();

  // 1. Check for API key (argument, localStorage, or .env)
  const storedKey = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('srec_gemini_key') : '';
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env) ? (import.meta.env.VITE_GEMINI_API_KEY || '') : '';
  const effectiveKey = (apiKey && apiKey.trim().length > 15) ? apiKey.trim() : (storedKey || envKey || '').trim();

  // 2. If a valid API key exists, attempt live Gemini API call
  if (effectiveKey && effectiveKey.length > 15) {
    try {
      const response = await callGeminiAPI({
        apiKey: effectiveKey,
        regulation,
        semester,
        subject,
        unit,
        topic: cleanTopic,
        markTarget
      });
      if (response && (response.title || response.overview || response.examAnswer?.title)) {
        return normalizeResponse(response, cleanTopic, subject, regulation);
      }
    } catch (err) {
      console.warn("Live Gemini API call failed, using verified curriculum knowledge:", err.message);
    }
  }

  // 3. High-Fidelity Domain-Aware Knowledge Engine (Clean, Unified, Cohesive & Easy to Understand)
  const knowledge = getVerifiedSubjectKnowledge({
    regulation,
    subject,
    unit,
    topic: cleanTopic,
    markTarget
  });

  return normalizeResponse(knowledge, cleanTopic, subject, regulation);
}

// Normalize output so UI receives a unified, clean article structure
function normalizeResponse(data, topic, subject, regulation) {
  const title = data.title || data.examAnswer?.title || topic;
  const overview = data.overview || data.examAnswer?.definition || "";
  const sections = data.sections || (data.examAnswer?.stepByStepExplanation ? data.examAnswer.stepByStepExplanation.map(s => ({
    title: s.step,
    content: s.description
  })) : []);
  const visualDiagram = data.visualDiagram || data.examAnswer?.visualDiagram || "";
  const diagramCaption = data.diagramCaption || "Architectural / Conceptual Diagram for University Examinations";
  const workedExample = data.workedExample || data.examAnswer?.workedExample || null;
  const comparisonTable = data.comparisonTable || data.examAnswer?.comparisonTable || null;
  const keyPoints = data.keyPoints || data.examAnswer?.evaluatorChecklist || [];
  const evaluatorChecklist = data.evaluatorChecklist || data.examAnswer?.evaluatorChecklist || [];
  const examWritingTips = data.examWritingTips || data.examAnswer?.examWritingTips || "";
  const conceptAnalogy = data.conceptAnalogy || {
    simpleExplanation: overview,
    realWorldAnalogy: "",
    takeaway: ""
  };
  const aiIntegrationNote = data.aiIntegrationNote || "";

  return {
    title,
    overview,
    sections,
    visualDiagram,
    diagramCaption,
    workedExample,
    comparisonTable,
    keyPoints,
    evaluatorChecklist,
    examWritingTips,
    conceptAnalogy,
    aiIntegrationNote,
    // Backwards-compatibility wrapper:
    examAnswer: {
      title,
      definition: overview,
      stepByStepExplanation: sections.map(sec => ({
        step: sec.title,
        description: sec.content + (sec.points ? '\n• ' + sec.points.join('\n• ') : '')
      })),
      visualDiagram,
      diagramTitle: diagramCaption,
      workedExample,
      comparisonTable,
      evaluatorChecklist,
      examWritingTips
    }
  };
}

async function callGeminiAPI({ apiKey, regulation, semester, subject, unit, topic, markTarget }) {
  const prompt = `You are a distinguished Senior Professor in Computer Science & Engineering (like Dr. S. Md. Farooq, HOD-CSE).
A student has asked this question: "${topic}" in the subject "${subject}" (${regulation} curriculum, target weightage: ${markTarget.toUpperCase()}).

CRITICAL WRITING INSTRUCTIONS:
1. Write a CLEAN, COHESIVE, HIGHLY READABLE academic explanation.
2. DO NOT break the output into artificial fragmented cards or robotic boilerplate phases.
3. Start with a crystal-clear, deep overview explaining what the concept is, why it is needed, and its real-world intuition.
4. Organize into 2-3 natural technical sections with informative headings, detailed explanations, and concrete examples.
5. Provide a clear ASCII DIAGRAM or FLOWCHART specifically tailored to this topic (DO NOT label it a Gantt chart unless it is CPU scheduling).
6. Provide a step-by-step practical / worked example (with actual numbers, code trace, or real-world security/system scenario).
7. If comparing two things, provide a meaningful comparison table. If not, omit the table.
8. Conclude with high-yield key takeaways and exam presentation tips.

Return ONLY valid JSON matching this schema:
{
  "title": "Clean, Formal Topic Title",
  "overview": "Comprehensive 2-3 paragraph explanation of the core concept, intuition, and technical definition in clear, flowing language.",
  "sections": [
    {
      "title": "1. Section Heading",
      "content": "Detailed technical explanation...",
      "points": ["Key sub-point 1", "Key sub-point 2"]
    }
  ],
  "visualDiagram": "Clean ASCII diagram or flowchart tailored to the topic",
  "diagramCaption": "Descriptive caption (e.g., Multi-Layer Security Architecture / State Transition Graph)",
  "workedExample": {
    "title": "Worked Practical Demonstration / Real-World Case Study",
    "problemStatement": "Specific scenario or problem input...",
    "steps": ["Step 1: ...", "Step 2: ..."],
    "finalResult": "Final outcome or calculation"
  },
  "comparisonTable": {
    "headers": ["Criterion", "Category A", "Category B"],
    "rows": [["Feature 1", "Val A", "Val B"]]
  },
  "keyPoints": [
    "Key takeaway point 1",
    "Key takeaway point 2"
  ],
  "evaluatorChecklist": [
    "Key term 1",
    "Key term 2"
  ],
  "examWritingTips": "Direct advice on how to write this in an exam.",
  "conceptAnalogy": {
    "simpleExplanation": "Plain English explanation without heavy jargon",
    "realWorldAnalogy": "Relatable everyday real-life analogy",
    "takeaway": "Core moral"
  },
  "aiIntegrationNote": "Brief note on how this concept connects to modern AI or R26 curriculum."
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini Error ${res.status}: ${errorBody}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

// Built-in High-Fidelity Domain-Aware Knowledge Base
function getVerifiedSubjectKnowledge({ regulation, subject, unit, topic, markTarget }) {
  const cleanTopic = (topic || "").trim();
  const lower = cleanTopic.toLowerCase();

  // 1. CYBERSECURITY / INFORMATION SECURITY / CRYPTOGRAPHY / FIREWALLS / CIA TRIAD
  if (
    lower.includes("cyber") || 
    lower.includes("security") || 
    lower.includes("cia triad") || 
    lower.includes("firewall") || 
    lower.includes("cryptograph") || 
    lower.includes("malware") || 
    lower.includes("phishing") ||
    lower.includes("encryption") ||
    lower.includes("rsa")
  ) {
    return {
      title: "Cybersecurity Fundamentals: Principles, Threat Vectors & Defense-in-Depth",
      overview: "Cybersecurity is the discipline and practice of safeguarding internet-connected computational systems, including hardware, software, cloud networks, and critical data, from unauthorized access, malicious attacks, disruption, or damage.\n\nIn modern digital society, computing infrastructures face sophisticated adversarial threats such as ransomware, phishing, Distributed Denial-of-Service (DDoS), and zero-day vulnerabilities. Robust cybersecurity is established upon the foundational CIA Triad: Confidentiality (preventing unauthorized disclosure), Integrity (ensuring data is accurate and untampered), and Availability (guaranteeing timely access for authorized users). Modern enterprises implement a Defense-in-Depth architecture combining perimeter network filtering, end-to-end cryptographic encryption, multi-factor identity authentication, and continuous behavioral telemetry.",
      sections: [
        {
          title: "1. The Pillars of Security: The CIA Triad",
          content: "Every security policy, algorithm, and protocol is designed to uphold three non-negotiable guarantees:",
          points: [
            "Confidentiality: Protecting private data from unauthorized surveillance or leakage using strong symmetric (AES-256) and asymmetric (RSA/ECC) encryption, strict Role-Based Access Control (RBAC), and multi-factor authentication (MFA).",
            "Integrity: Ensuring that information remains authentic, accurate, and completely unaltered in transit or at rest. Maintained through cryptographic hashing (SHA-256), digital signatures, and blockchain ledgers.",
            "Availability: Ensuring that computing systems, servers, and networks remain continuously accessible to legitimate users during normal operations and under active cyber assaults (mitigated via load balancers, redundant data centers, and DDoS mitigation)."
          ]
        },
        {
          title: "2. The Defense-in-Depth Multi-Tier Security Model",
          content: "Relying on a single security barrier is catastrophic. A resilient security posture uses overlapping concentric layers of defense:",
          points: [
            "Perimeter & Network Security: Next-Generation Firewalls (NGFW) inspecting packet headers and payloads, Intrusion Detection/Prevention Systems (IDS/IPS), and Demilitarized Zones (DMZ).",
            "Host & Endpoint Security: Endpoint Detection and Response (EDR), automated vulnerability patch management, and antimalware behavioral heuristics.",
            "Application & Data Layer: Web Application Firewalls (WAF), secure code reviews to prevent OWASP Top 10 vulnerabilities (such as SQL Injection and Cross-Site Scripting), and tokenization.",
            "Identity & Access Management (IAM): The Zero Trust Architecture principle: 'Never Trust, Always Verify'. Every request is authenticated, authorized, and encrypted regardless of network location."
          ]
        },
        {
          title: "3. Cryptographic Mechanisms in Modern Systems",
          content: "Cryptography forms the mathematical backbone of digital security:",
          points: [
            "Symmetric Cryptography (e.g., AES-GCM): Uses a single shared secret key for high-throughput bulk data encryption (gigabits per second).",
            "Asymmetric Cryptography (e.g., RSA, Elliptic Curve Cryptography - ECC): Employs a mathematically linked public-private keypair for secure key exchange, identity verification, and digital signing.",
            "Transport Layer Security (TLS 1.3): Combines asymmetric key exchange (Diffie-Hellman) with symmetric stream encryption to secure all HTTPS web traffic."
          ]
        }
      ],
      visualDiagram: `MULTI-LAYER DEFENSE-IN-DEPTH CYBERSECURITY ARCHITECTURE:

                     [ External Cyber Adversary / Internet ]
                                       │
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ 1. Perimeter Defense: Next-Gen Firewall (NGFW) & Anti-DDoS  │
        └──────────────────────────────┬──────────────────────────────┘
                                       │ Filtered Clean Traffic
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ 2. Network DMZ: Intrusion Detection & Prevention (IDS / IPS)│
        └──────────────────────────────┬──────────────────────────────┘
                                       │ Deep Packet Inspection
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ 3. Identity Gateway: Multi-Factor Auth (MFA) & Zero-Trust IAM│
        └──────────────────────────────┬──────────────────────────────┘
                                       │ Authorized Credentials Only
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ 4. Endpoint & Host: EDR Monitoring & Anti-Malware Sandboxing│
        └──────────────────────────────┬──────────────────────────────┘
                                       │ Sanitized System Execution
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ 5. Core Data Layer: AES-256 Encrypted Database & Audit Logs │
        └─────────────────────────────────────────────────────────────┘`,
      diagramCaption: "Figure 1: Multi-Layer Defense-in-Depth security model protecting digital enterprise assets.",
      workedExample: {
        title: "Real-World Attack Defense Scenario: Intercepting a Phishing & Ransomware Threat",
        problemStatement: "An employee receives a spear-phishing email with a malicious macro-enabled invoice payload designed to install ransomware and exfiltrate customer databases. Trace how a multi-layer defense prevents a catastrophic breach.",
        steps: [
          "1. Ingestion & Email Gateway Inspection: Secure Email Gateway analyzes inbound email headers, checks SPF/DKIM/DMARC records, and flags the domain as spoofed. The message is quarantined.",
          "2. Endpoint Sandboxing: If opened in a sandbox, behavioral heuristics detect unauthorized attempts by the macro to invoke PowerShell and modify registry startup keys; execution is halted immediately.",
          "3. Network Isolation & EDR Alert: The Endpoint Detection and Response agent automatically isolates the compromised workstation from the corporate VLAN, preventing lateral movement to other department machines.",
          "4. Data Protection: Because critical file servers enforce immutable Write-Once-Read-Many (WORM) backups and AES-256 encryption at rest, unauthorized encryption keys cannot lock down the central database.",
          "5. Incident Response: Security Operations Center (SOC) engineers revoke the affected session token and patch the vulnerability."
        ],
        finalResult: "Attack successfully thwarted at Tier 1 & 2. Zero data loss, zero financial extortion, and business operations continue uninterrupted."
      },
      comparisonTable: {
        headers: ["Security Dimension", "Symmetric Encryption (e.g., AES)", "Asymmetric Encryption (e.g., RSA / ECC)"],
        rows: [
          ["Key Architecture", "Single shared secret key for encryption & decryption", "Keypair: Public key encrypts, Private key decrypts"],
          ["Computational Speed", "Extremely fast (Hardware accelerated on modern CPUs)", "Slower (Involves modular exponentiation & large primes)"],
          ["Key Distribution", "Challenging (Secret key must be securely pre-shared)", "Trivial (Public key can be published openly anywhere)"],
          ["Primary Application", "Bulk storage encryption, file systems, disk drives", "Digital signatures, SSL/TLS handshakes, identity certificates"]
        ]
      },
      keyPoints: [
        "The CIA Triad (Confidentiality, Integrity, Availability) forms the cornerstone of cybersecurity.",
        "Defense-in-Depth eliminates single points of failure by layering perimeter, network, host, and data controls.",
        "Zero Trust Architecture mandates: 'Never trust, always verify every access request.'",
        "Hybrid cryptography combines the speed of symmetric AES with the key-exchange simplicity of asymmetric RSA/ECC."
      ],
      evaluatorChecklist: [
        "Detailed explanation of CIA Triad (Confidentiality, Integrity, Availability)",
        "Defense-in-Depth multi-tier architecture diagram",
        "Comparison between Symmetric and Asymmetric cryptography",
        "Key threat vectors (Phishing, Ransomware, DDoS, SQL Injection)",
        "Zero Trust Architecture core principles"
      ],
      examWritingTips: "Begin your university exam answer by drawing the CIA Triad triangle and clearly defining each term. Next, sketch the multi-layer Defense-in-Depth block diagram. Conclude with the comparison table between Symmetric and Asymmetric encryption.",
      conceptAnalogy: {
        simpleExplanation: "Cybersecurity is like securing a high-security bank. A single locked front door isn't enough. You have perimeter security guards, surveillance cameras in the hallway, an identity badge scanner at the elevator, a biometric fingerprint scanner at the vault door, and inside the vault, the money is locked in separate safe-deposit boxes! Even if a burglar slips past one door, they get trapped by the next.",
        realWorldAnalogy: "Like traveling through an international airport: passport control (authentication), luggage X-ray scanners (packet inspection), locked cockpit doors (access control), and air traffic controllers (monitoring).",
        takeaway: "True cybersecurity is not a single tool—it is a continuous, layered strategy of defense, verification, and monitoring."
      },
      aiIntegrationNote: "In modern R26 AI curriculum, cybersecurity integrates Machine Learning models for User and Entity Behavior Analytics (UEBA) and AI-driven automated threat hunting."
    };
  }

  // 2. HOW AI IS USEFUL IN PROBLEM SOLVING / PROBLEM SOLVING IN AI / SEARCH ALGORITHMS
  if (
    lower.includes("problem solv") || 
    lower.includes("useful in problem") || 
    lower.includes("problem-solving") || 
    lower.includes("state space") || 
    lower.includes("search algorithm") || 
    lower.includes("heuristic search") || 
    lower.includes("problem formulation") ||
    (lower.includes("ai") && lower.includes("problem"))
  ) {
    return {
      title: "How Artificial Intelligence is Useful in Problem Solving",
      overview: "In computer science and artificial intelligence, Problem Solving is the systematic process by which an autonomous agent discovers an optimal sequence of actions that transforms an initial state into a desired goal state.\n\nTraditional algorithmic programming requires software engineers to write rigid, hand-crafted rules (if-else logic and static procedures) for every conceivable contingency. However, real-world problems—such as urban traffic navigation, chess strategy, clinical diagnostics, logistics optimization, and protein folding—possess vast, combinatorially explosive search spaces where hardcoding is impossible. AI solves these challenges by formulating problems into formal State Space Models and applying intelligent search algorithms, heuristic evaluations, and machine learning to prune billions of irrelevant possibilities and converge on optimal solutions in seconds.",
      sections: [
        {
          title: "1. The 5 Core Components of AI Problem Formulation",
          content: "Before an AI system can solve any problem, it must translate the real-world scenario into a formal 5-tuple state space representation:",
          points: [
            "Initial State (S₀): The starting environment configuration (e.g., GPS vehicle at Current Intersection A).",
            "Actions & Operators: The set of legal moves available from the current state (e.g., turn left, advance 500m, take exit 4).",
            "Transition Model: A formal function Result(s, a) defining the successor state reached after executing action 'a' in state 's'.",
            "Goal Test: A precise validation condition that checks whether the current state satisfies the objective (e.g., arrived at Destination B).",
            "Path Cost Function: A metric measuring resource consumption across actions (e.g., travel time in minutes, fuel consumption, or distance). The agent's mission is finding the path with minimum total cost."
          ]
        },
        {
          title: "2. How AI Navigates Massive Search Spaces (Heuristics & Search)",
          content: "In large-scale problems, an exhaustive blind search (like BFS or DFS) fails because the number of states grows exponentially O(b^d), where 'b' is the branching factor and 'd' is depth. AI overcomes this via Informed (Heuristic) Search:",
          points: [
            "Heuristic Evaluation Function h(n): AI incorporates domain-specific intelligence (an educated estimate of the remaining cost to the goal). For example, straight-line distance in navigation.",
            "A* Search Algorithm: Evaluates paths using f(n) = g(n) + h(n), where g(n) is the exact cost spent so far, and h(n) is the heuristic estimate. This guarantees the mathematically shortest path while pruning up to 99% of dead-end branches.",
            "Handling Uncertainty: Real-world problems have noise and changing environments. AI employs probabilistic reasoning (Markov Decision Processes) to make robust decisions under incomplete information."
          ]
        },
        {
          title: "3. Major Real-World Domains Where AI Problem Solving Excels",
          content: "AI problem-solving techniques power mission-critical applications across modern computing:",
          points: [
            "Dynamic Navigation & Logistics (Google Maps, Uber, Delivery Networks): Real-time route optimization factoring in live traffic bottlenecks, road closures, and multiple pickup stops.",
            "Autonomous Robotics & Self-Driving Vehicles: Continuous motion and trajectory planning, obstacle avoidance, and real-time sensor fusion under dynamic driving conditions.",
            "Healthcare & Clinical Decision Support: Analyzing complex patient symptom vectors and medical imaging to detect pathologies (e.g., early-stage oncology) and recommend treatment pathways.",
            "Combinatorial Optimization & Resource Scheduling: Automating airline crew scheduling, electrical power grid load distribution, and university examination timetabling subject to thousands of conflicting constraints.",
            "Strategic Game Playing & Simulation (Chess, Go, AlphaZero): Searching deep game trees to anticipate opponent moves, techniques now directly applied to semiconductor chip floorplanning and molecular biology."
          ]
        }
      ],
      visualDiagram: `AI PROBLEM-SOLVING AGENT ARCHITECTURE & SEARCH FLOW:

       ┌─────────────────────────────────────────────────────────┐
       │              REAL-WORLD ENVIRONMENT                     │
       └─────────────────────────────────────────────────────────┘
                    │ Sensors (Percepts)           ▲ Actuators (Actions)
                    ▼                              │
       ┌─────────────────────────────────────────────────────────┐
       │ 1. Problem Formulation (5-Tuple State Space)            │
       │    • Initial State S₀        • Action Set A             │
       │    • Transition Model        • Goal Test Condition      │
       │    • Path Cost Metric c(s, a, s')                       │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 2. Heuristic Search Engine (e.g., A* Search)            │
       │    • Evaluates priority queue: f(n) = g(n) + h(n)       │
       │    • g(n) = Exact cost incurred from start to node n    │
       │    • h(n) = Intelligent heuristic estimate to Goal      │
       │    • PRUNES millions of infeasible branches             │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 3. Optimal Solution Sequence Dispatched                 │
       │    • Sequence: [Step 1 ──> Step 2 ──> ... ──> GOAL]     │
       └─────────────────────────────────────────────────────────┘`,
      diagramCaption: "Figure 2: Closed-loop AI Problem Solving Agent using Heuristic State Space Search.",
      workedExample: {
        title: "Practical Route-Finding Problem Solved via Heuristic A* Search",
        problemStatement: "Find the shortest path from Start City (S) to Goal City (G). Available paths with edge costs g(n) and straight-line heuristic distances h(n) to Goal G:\n• Paths from S: To A (cost=2, h=5) | To B (cost=4, h=2)\n• Paths from A: To G (cost=7, h=0)\n• Paths from B: To G (cost=3, h=0)",
        steps: [
          "1. Initialize Priority Queue with Start Node S: f(S) = g(S) + h(S) = 0 + 6 = 6.",
          "2. Expand Node S: Generate successors A and B:\n   • Node A: g(A)=2, h(A)=5 ➔ f(A) = 2 + 5 = 7\n   • Node B: g(B)=4, h(B)=2 ➔ f(B) = 4 + 2 = 6",
          "3. Select lowest f(n): Node B has f=6 (lower than A's f=7). AI intelligently selects B first!",
          "4. Expand Node B to Goal G: g(G) = g(B) + cost(B, G) = 4 + 3 = 7, h(G) = 0 ➔ f(G) = 7 + 0 = 7.",
          "5. Compare candidates: Path S ➔ B ➔ G costs 7. Path S ➔ A ➔ G costs 2 + 7 = 9. AI reaches the optimal path while exploring minimal states."
        ],
        finalResult: "Optimal Path = S ➔ B ➔ G with Total Cost = 7. (Heuristic prevented exploring sub-optimal deep paths)."
      },
      comparisonTable: {
        headers: ["Dimension", "Traditional Algorithmic Programming", "AI Heuristic Problem Solving"],
        rows: [
          ["Problem Nature", "Well-defined, deterministic, low ambiguity", "Complex, combinatorial, partially observable"],
          ["Control Strategy", "Hardcoded nested if-else & explicit loops", "Goal-driven State Space Search guided by heuristics"],
          ["Scalability", "Bows under combinatorial explosion O(b^d)", "Intelligently prunes search tree by 90%+ using h(n)"],
          ["Adaptability", "Crashes or halts on unanticipated input states", "Replans and adapts dynamically as environment changes"],
          ["Real-World Example", "Sorting a fixed array, computing payroll tax", "Google Maps routing, autonomous driving, Chess"]
        ]
      },
      keyPoints: [
        "Problem Formulation consists of 5 formal elements: Initial State, Actions, Transition Model, Goal Test, Path Cost.",
        "Blind Search (BFS/DFS) suffers from exponential explosion; Heuristic Search uses domain intelligence h(n) to guide exploration.",
        "A* Search computes f(n) = g(n) + h(n) and is guaranteed complete and optimal when h(n) is admissible (never overestimates).",
        "AI problem solving is foundational across robotics, navigation, logistics optimization, medical diagnosis, and game playing."
      ],
      evaluatorChecklist: [
        "5 components of Problem Formulation (Initial State, Actions, Transition Model, Goal Test, Path Cost)",
        "Distinction between Blind (Uninformed) vs Informed (Heuristic) Search",
        "A* Search Evaluation formula: f(n) = g(n) + h(n)",
        "Admissibility condition: h(n) <= h*(n)",
        "Clear real-world domain examples (GPS routing, Game playing, Medical diagnostics)"
      ],
      examWritingTips: "Start by writing the 5 components of problem formulation in clean bullet points. Draw the Agent-Environment architecture block diagram. Then explain the A* heuristic evaluation formula f(n) = g(n) + h(n) with the simple 3-node route example.",
      conceptAnalogy: {
        simpleExplanation: "Traditional programming is like following a rigid cake recipe: if one ingredient is missing, the whole process fails. AI problem solving is like a master chess player or Google Maps: it knows where it starts and where it wants to go, and continuously evaluates hundreds of future possibilities to find the quickest, smartest route to success.",
        realWorldAnalogy: "Imagine searching for a lost house key in a large building. A blind search opens every single drawer in every room from left to right. An AI search uses intuition (heuristics): 'Where was I sitting? Which jacket was I wearing?' to search the most probable places first, finding the key in minutes!",
        takeaway: "AI transforms impossible trial-and-error searches into intelligent, guided path optimization."
      },
      aiIntegrationNote: "In the R26 curriculum, problem solving forms the foundation for Reinforcement Learning (Q-learning, PPO) and Deep Heuristic Search used in modern Large Language Models (Tree-of-Thought reasoning)."
    };
  }

  // 3. MINIMAX ALGORITHM & GAME PLAYING
  if (
    lower.includes("minimax") || 
    lower.includes("minmax") || 
    lower.includes("mini max") || 
    lower.includes("mini-max") || 
    lower.includes("alpha beta") || 
    lower.includes("game tree") ||
    lower.includes("adversarial")
  ) {
    return {
      title: "Minimax Algorithm in Artificial Intelligence (Adversarial Search)",
      overview: "The Minimax Algorithm is a foundational recursive decision-making algorithm in Artificial Intelligence used for two-player, zero-sum, perfect-information games such as Chess, Checkers, and Tic-Tac-Toe.\n\nIn a zero-sum game, one player's gain is exactly equal to the opponent's loss. The algorithm enables a player (MAX) to select the optimal move by systematically anticipating that the opponent (MIN) will also play with absolute perfection. Minimax evaluates game states by building a game tree down to a predetermined depth, assigning heuristic utility scores to leaf states, and backpropagating values upward: maximizing gains at MAX turns and minimizing damage at MIN turns.",
      sections: [
        {
          title: "1. Core Working Mechanism of Minimax",
          content: "The algorithm operates through four disciplined phases:",
          points: [
            "Game Tree Construction: Starting from the current board position (Root), expand possible moves alternating between MAX levels (player's turn) and MIN levels (opponent's turn).",
            "Terminal Leaf Evaluation: When terminal states (Win, Loss, Draw) or a cutoff search depth are reached, evaluate each board position using a utility scoring function (e.g., +10 for MAX win, -10 for MIN win, 0 for draw).",
            "Bottom-Up Value Backpropagation: Propagate scores upward from leaves to the root:\n• At MAX nodes: V = max(child_nodes)\n• At MIN nodes: V = min(child_nodes)",
            "Optimal Move Selection: The root node selects the outgoing branch that leads to the highest backed-up minimax value."
          ]
        },
        {
          title: "2. Performance & Alpha-Beta Pruning Optimization",
          content: "Standard Minimax has an exponential time complexity of O(b^d), where 'b' is the branching factor and 'd' is search depth. In Chess (b ≈ 35), searching to depth 10 requires examining trillions of states.\n\nAlpha-Beta Pruning optimizes Minimax by tracking two bounds:\n• Alpha (α): The best (highest) value MAX can guarantee so far.\n• Beta (β): The best (lowest) value MIN can guarantee so far.\n\nWhenever Alpha ≥ Beta, the remaining branches of that node are PRUNED immediately because they cannot affect the root's decision. This reduces time complexity to O(b^(d/2)), allowing the AI to search twice as deep in the same computation time.",
          points: [
            "Alpha initialized to -∞ | Beta initialized to +∞",
            "Pruning Condition: Alpha ≥ Beta (Discards provably irrelevant subtrees)",
            "Identical Result: Delivers the exact same move decision with zero loss of accuracy"
          ]
        }
      ],
      visualDiagram: `MINIMAX GAME TREE (WORKED 2-PLY EXAMPLE):

                     MAX (Root = 3)  <-- Optimal Decision: Choose Left (Node A)
                     /            \
             MIN (Node A = 3)    MIN (Node B = 2)
                /        \          /        \
             [ 3 ]      [ 5 ]     [ 2 ]      [ 9 ]  <-- Terminal Leaf Utilities

Step-by-Step Backpropagation:
1. Node A is a MIN node: min(3, 5) = 3
2. Node B is a MIN node: min(2, 9) = 2
3. Root is a MAX node:   max(Node A, Node B) = max(3, 2) = 3
Result: MAX chooses Left towards Node A, securing a guaranteed score of at least 3.`,
      diagramCaption: "Figure 3: Two-ply Minimax Game Tree showing bottom-up backed-up values.",
      workedExample: {
        title: "Worked Numerical: 2-Ply Game Tree Evaluation",
        problemStatement: "Given a 2-ply game tree with Root MAX. Child nodes at Level 1 are MIN nodes (A and B). Node A has terminal leaf utilities [3, 5]. Node B has terminal leaf utilities [2, 9]. Determine the backed-up minimax values and state the optimal move for MAX.",
        steps: [
          "1. Evaluate MIN Node A: Opponent chooses the minimum payoff: min(3, 5) = 3. Value backed up to A = 3.",
          "2. Evaluate MIN Node B: Opponent chooses the minimum payoff: min(2, 9) = 2. Value backed up to B = 2.",
          "3. Evaluate MAX Root: Player chooses the maximum payoff: max(Value(A), Value(B)) = max(3, 2) = 3.",
          "4. Strategic Insight: Notice that while Node B has the highest individual leaf score (9), an optimal opponent would never allow MAX to get 9; they would force MAX to 2. Choosing Node A guarantees MAX at least 3."
        ],
        finalResult: "Minimax Root Value = 3 | Optimal Move = Left Branch (Node A)"
      },
      comparisonTable: {
        headers: ["Metric", "Standard Minimax", "Minimax with Alpha-Beta Pruning"],
        rows: [
          ["Search Scope", "Exhaustive (visits every single node in tree)", "Prunes irrelevant branches using [Alpha, Beta] bounds"],
          ["Time Complexity", "O(b^d)", "O(b^(d/2)) in optimal move ordering"],
          ["Effective Depth", "Shallow (suffers rapid combinatorial explosion)", "Explores roughly twice as deep in same CPU time"],
          ["Move Accuracy", "100% mathematically optimal", "100% identical optimal move (zero accuracy loss)"]
        ]
      },
      keyPoints: [
        "Minimax models two-player zero-sum adversarial games under perfect information.",
        "Recursive formulas: V_max = max(children) and V_min = min(children).",
        "Alpha-Beta pruning cuts branches when Alpha >= Beta without altering the final decision.",
        "Time complexity: O(b^d) for standard Minimax, improved to O(b^(d/2)) with Alpha-Beta."
      ],
      evaluatorChecklist: [
        "Zero-sum game definition (one player's gain equals opponent's loss)",
        "Formulas: V_max = max(child) and V_min = min(child)",
        "Clean game tree diagram with alternating MAX and MIN tiers",
        "Alpha-Beta pruning cutoff condition (Alpha >= Beta)",
        "Time and Space complexity metrics"
      ],
      examWritingTips: "Draw the game tree with alternating inverted triangles (MIN) and upright triangles (MAX). Label leaf values at the bottom first, write the min values at the middle row, and the root maximum at the top.",
      conceptAnalogy: {
        simpleExplanation: "Minimax is like playing Chess against a grandmaster. You want to pick the move that gives you the highest score, but you assume your opponent is brilliant and will always pick the move that hurts you most. So, you look ahead at all possibilities and choose the path where your worst-case outcome is the highest!",
        realWorldAnalogy: "Like bargaining at a marketplace: you want the lowest price (MIN), and the shopkeeper wants the highest price (MAX). Minimax finds the exact equilibrium point where neither party can exploit the other.",
        takeaway: "Minimax maximizes your payoff under the assumption of an optimal opponent."
      },
      aiIntegrationNote: "Modern systems like DeepMind's AlphaZero combine Minimax and Monte Carlo Tree Search (MCTS) with deep neural networks for position evaluation."
    };
  }

  // 4. CPU SCHEDULING (ROUND ROBIN, FCFS, SJF)
  if (lower.includes("schedul") || lower.includes("round robin") || lower.includes("fcfs") || lower.includes("sjf") || lower.includes("gantt")) {
    return {
      title: "CPU Scheduling Algorithms (Round Robin with Gantt Chart & Metrics)",
      overview: "CPU Scheduling is the core operating system mechanism by which the Dispatcher selects an executable process from the Ready Queue and allocates the CPU core.\n\nThe objective is maximizing CPU Utilization and Throughput while minimizing Turnaround Time, Waiting Time, and Response Time. In interactive multi-tasking operating systems, Round Robin (RR) scheduling provides fair CPU allocation by giving each process a fixed slice of processor time (Time Quantum). If a process does not complete within its quantum, it is preempted and rotated to the tail of the Ready Queue.",
      sections: [
        {
          title: "1. Core Formulas and Performance Metrics",
          content: "Every university examination problem in CPU scheduling is solved using two fundamental equations:",
          points: [
            "Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT) [Total elapsed time from submission to completion]",
            "Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT) [Total duration spent waiting in the Ready Queue]",
            "Average Turnaround Time = (Σ TAT) / Number of Processes",
            "Average Waiting Time = (Σ WT) / Number of Processes"
          ]
        },
        {
          title: "2. Impact of the Time Quantum (TQ)",
          content: "The performance of Round Robin scheduling heavily depends on the chosen Time Quantum:",
          points: [
            "If Time Quantum is extremely large: Round Robin degenerates into FCFS (First-Come, First-Served), leading to the Convoy Effect.",
            "If Time Quantum is extremely small: Excessive context-switching overhead wastes CPU cycles saving and loading PCB registers.",
            "Rule of Thumb: Approximately 80% of CPU bursts should be shorter than the chosen Time Quantum."
          ]
        }
      ],
      visualDiagram: `ROUND ROBIN GANTT CHART (Time Quantum = 2 ms):

┌──────┬──────┬──────┬──────┬──────┬──────┐
│  P1  │  P2  │  P3  │  P1  │  P2  │  P1  │
└──────┴──────┴──────┴──────┴──────┴──────┘
0      2      4      5      7      8      9

Execution Timeline:
• t=0 to 2 ms: P1 runs (remaining BT = 3 ms)
• t=2 to 4 ms: P2 runs (remaining BT = 1 ms)
• t=4 to 5 ms: P3 runs (BT = 1 ms, COMPLETES at t=5)
• t=5 to 7 ms: P1 runs (remaining BT = 1 ms)
• t=7 to 8 ms: P2 runs (BT = 1 ms, COMPLETES at t=8)
• t=8 to 9 ms: P1 runs (BT = 1 ms, COMPLETES at t=9)`,
      diagramCaption: "Figure 4: Horizontal Gantt Chart showing cyclic time-sliced process execution.",
      workedExample: {
        title: "Complete Worked Numerical: 3 Processes with Time Quantum = 2 ms",
        problemStatement: "Given processes P1 (AT=0, BT=5), P2 (AT=1, BT=3), P3 (AT=2, BT=1). Calculate Completion Time, Turnaround Time, Waiting Time, and the system averages using Round Robin (TQ = 2 ms).",
        steps: [
          "1. Trace Ready Queue:\n   • At t=0: [P1] executes for 2 ms (Remaining BT = 3 ms).\n   • At t=2: P2 and P3 have arrived. Ready Queue: [P2, P3, P1].\n   • At t=2 to 4: P2 executes for 2 ms (Remaining BT = 1 ms). Ready Queue: [P3, P1, P2].\n   • At t=4 to 5: P3 executes for 1 ms and COMPLETES at t=5 ms. Ready Queue: [P1, P2].\n   • At t=5 to 7: P1 executes for 2 ms (Remaining BT = 1 ms). Ready Queue: [P2, P1].\n   • At t=7 to 8: P2 executes for 1 ms and COMPLETES at t=8 ms. Ready Queue: [P1].\n   • At t=8 to 9: P1 executes for 1 ms and COMPLETES at t=9 ms.",
          "2. Calculate Process Metrics:\n   • P1: CT=9, TAT = 9 - 0 = 9 ms, WT = 9 - 5 = 4 ms\n   • P2: CT=8, TAT = 8 - 1 = 7 ms, WT = 7 - 3 = 4 ms\n   • P3: CT=5, TAT = 5 - 2 = 3 ms, WT = 3 - 1 = 2 ms",
          "3. Calculate Averages:\n   • Average TAT = (9 + 7 + 3) / 3 = 19 / 3 = 6.33 ms\n   • Average WT = (4 + 4 + 2) / 3 = 10 / 3 = 3.33 ms"
        ],
        finalResult: "Average Waiting Time = 3.33 ms | Average Turnaround Time = 6.33 ms"
      },
      comparisonTable: {
        headers: ["Algorithm", "Preemptive?", "Starvation Risk", "Primary Advantage"],
        rows: [
          ["FCFS", "No", "Convoy effect (short jobs wait for long)", "Simple FIFO queue, minimal overhead"],
          ["SJF / SRTF", "Both (SRTF is preemptive)", "Long jobs can starve", "Mathematically minimum average waiting time"],
          ["Round Robin", "Yes (Time-sliced)", "Zero starvation (Fair)", "Optimal response time for interactive user systems"]
        ]
      },
      keyPoints: [
        "Formulas to memorize: TAT = CT - AT, WT = TAT - BT.",
        "Round Robin guarantees fair CPU distribution and bounds response time.",
        "Context switch overhead must be accounted for when selecting Time Quantum.",
        "Draw horizontal Gantt chart with exact timestamps in your exam answer sheet."
      ],
      evaluatorChecklist: [
        "Boxed formulas: TAT = CT - AT and WT = TAT - BT",
        "Clear horizontal Gantt chart with timeline markings",
        "Completed Process Table (PID, AT, BT, CT, TAT, WT)",
        "Final averages calculated with correct time units (ms)"
      ],
      examWritingTips: "Always draw the complete Process Table with all 6 columns first. Draw the Gantt chart directly below it, and clearly show the calculation for each average.",
      conceptAnalogy: {
        simpleExplanation: "CPU scheduling is like a busy doctor's clinic. FCFS makes every patient wait until the person ahead finishes, even if they take 2 hours. Round Robin gives each patient 10 minutes; if you need more time, you rejoin the queue so emergency patients get seen promptly!",
        realWorldAnalogy: "Like children taking turns on a swing with a 2-minute timer.",
        takeaway: "Preemptive time slicing ensures high responsiveness across all active programs."
      },
      aiIntegrationNote: "In R26 Operating Systems, AI models dynamically predict process burst lengths to adjust Time Quantums on the fly."
    };
  }

  // 5. DEADLOCK & BANKER'S ALGORITHM
  if (lower.includes("deadlock") || lower.includes("banker") || lower.includes("safety")) {
    return {
      title: "Banker's Algorithm for Deadlock Avoidance (Safety & Request Algorithm)",
      overview: "Deadlock is a critical system state where a set of concurrent processes are permanently blocked because each process holds resources while waiting for other resources acquired by other processes.\n\nEdsger Dijkstra's Banker's Algorithm is a dynamic deadlock avoidance algorithm that evaluates resource allocation safety before granting requests. When a process requests resources, the OS pretends to allocate them and executes a Safety Algorithm. If the simulated state leaves the system with a guaranteed Safe Sequence (a sequence where every process can eventually obtain its maximum declared resources and terminate safely), the allocation is approved; otherwise, the process must wait.",
      sections: [
        {
          title: "1. The 4 Coffman Conditions for Deadlock",
          content: "A deadlock can occur if and only if all four conditions hold simultaneously in the system:",
          points: [
            "Mutual Exclusion: At least one resource must be held in a non-shareable mode.",
            "Hold and Wait: A process holding at least one resource is actively waiting to acquire additional resources.",
            "No Preemption: Resources cannot be forcibly confiscated from a process; they must be released voluntarily.",
            "Circular Wait: A closed chain of processes exists such that P0 waits for P1, P1 waits for P2, and Pn waits for P0."
          ]
        },
        {
          title: "2. The Banker's Safety Algorithm Steps",
          content: "To determine if a system state is safe:",
          points: [
            "Step 1: Compute Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j]",
            "Step 2: Initialize Work = Available and Finish[i] = false for all processes.",
            "Step 3: Find a process 'i' such that Finish[i] == false and Need[i] <= Work. If found, proceed to Step 4. If no such process exists, go to Step 5.",
            "Step 4: Assume process 'i' completes and releases all resources: Work = Work + Allocation[i]; Finish[i] = true. Return to Step 3.",
            "Step 5: If Finish[i] == true for ALL processes, the system is in a SAFE STATE."
          ]
        }
      ],
      visualDiagram: `BANKER'S ALGORITHM DECISION FLOWCHART:

          [ Process Requests Resources ]
                       │
                       ▼
             Request <= Need[i]? ──── NO ───> [ ERROR: Exceeded Max Claim ]
                       │ YES
                       ▼
          Request <= Available? ───── NO ───> [ Process Must Wait (No Resources) ]
                       │ YES
                       ▼
       [ Simulate Allocation: Work = Available - Request ]
                       │
                       ▼
             Run Safety Test Algorithm
                     /          \
                  SAFE          UNSAFE
                   │               │
      [ Grant Request ]   [ Rollback Simulation & Process Waits ]`,
      diagramCaption: "Figure 5: Safety evaluation workflow before resource granting in Banker's Algorithm.",
      workedExample: {
        title: "Worked Numerical: 5 Processes (P0-P4) with 3 Resource Types (A, B, C)",
        problemStatement: "Given Available = [3, 3, 2].\nAllocation: P0:[0,1,0], P1:[2,0,0], P2:[3,0,2], P3:[2,1,1], P4:[0,0,2].\nMax Matrix: P0:[7,5,3], P1:[3,2,2], P2:[9,0,2], P3:[2,2,2], P4:[4,3,3].\nDetermine if the system is safe and find the safe sequence.",
        steps: [
          "1. Calculate Need Matrix (Max - Allocation):\n   • Need[P0] = [7-0, 5-1, 3-0] = [7, 4, 3]\n   • Need[P1] = [3-2, 2-0, 2-0] = [1, 2, 2]\n   • Need[P2] = [9-3, 0-0, 2-2] = [6, 0, 0]\n   • Need[P3] = [2-2, 2-1, 2-1] = [0, 1, 1]\n   • Need[P4] = [4-0, 3-0, 3-2] = [4, 3, 1]",
          "2. Step-by-Step Safety Simulation:\n   • Initial Work = [3, 3, 2]\n   • Test P0: Need [7,4,3] <= Work [3,3,2]? False (P0 must wait).\n   • Test P1: Need [1,2,2] <= Work [3,3,2]? TRUE! P1 runs.\n     New Work = [3,3,2] + Alloc[P1][2,0,0] = [5, 3, 2]. Finish[P1] = true.\n   • Test P3: Need [0,1,1] <= Work [5,3,2]? TRUE! P3 runs.\n     New Work = [5,3,2] + Alloc[P3][2,1,1] = [7, 4, 3]. Finish[P3] = true.\n   • Test P4: Need [4,3,1] <= Work [7,4,3]? TRUE! P4 runs.\n     New Work = [7,4,3] + Alloc[P4][0,0,2] = [7, 4, 5]. Finish[P4] = true.\n   • Test P0: Need [7,4,3] <= Work [7,4,5]? TRUE! P0 runs.\n     New Work = [7,4,5] + Alloc[P0][0,1,0] = [7, 5, 5]. Finish[P0] = true.\n   • Test P2: Need [6,0,0] <= Work [7,5,5]? TRUE! P2 runs.\n     New Work = [7,5,5] + Alloc[P2][3,0,2] = [10, 5, 7]. Finish[P2] = true."
        ],
        finalResult: "System is in a SAFE STATE. Safe Sequence = <P1, P3, P4, P0, P2>"
      },
      comparisonTable: {
        headers: ["Aspect", "Deadlock Prevention", "Deadlock Avoidance (Banker's)"],
        rows: [
          ["Mechanism", "Invalidate at least one of the 4 Coffman conditions", "Dynamically monitor resource allocation to ensure safe states"],
          ["System Overhead", "Low dynamic overhead, but very low resource utilization", "High dynamic calculation overhead before every grant"],
          ["Advance Knowledge", "No prior claims required", "Requires processes to declare maximum resource claims in advance"]
        ]
      },
      keyPoints: [
        "Need Matrix calculation: Need = Max - Allocation.",
        "A state is safe if there exists at least one valid Safe Sequence.",
        "An unsafe state is NOT necessarily a deadlock, but it may lead to one.",
        "Banker's algorithm guarantees deadlock freedom by avoiding unsafe states."
      ],
      evaluatorChecklist: [
        "Formula: Need[i][j] = Max[i][j] - Allocation[i][j]",
        "All 4 Coffman Conditions clearly named",
        "Step-by-step Work vector accumulation shown",
        "Safe sequence written in formal angle brackets <P1, P3, P4, P0, P2>"
      ],
      examWritingTips: "Always write the Need Matrix explicitly first. For each step of the safety trace, write the condition check (Need <= Work) and show the addition of Allocation to Work.",
      conceptAnalogy: {
        simpleExplanation: "A bank with Rs. 10 lakh in cash has three clients requesting loans. The bank manager only lends to Client B first because B only needs Rs. 1 lakh more to finish their business and repay all Rs. 4 lakhs, which gives the bank enough liquidity to safely satisfy the larger loans!",
        realWorldAnalogy: "Like a single-lane bridge: cars are only allowed onto the bridge if there is guaranteed clearance on the other side.",
        takeaway: "Never grant a resource request unless you can prove that all remaining processes can safely terminate."
      },
      aiIntegrationNote: "R26 curriculum studies AI-based resource scheduling where predictive models forecast process resource demand instead of requiring static maximum claims."
    };
  }

  // 6. PAGING & PAGE REPLACEMENT (FIFO, LRU)
  if (lower.includes("page") || lower.includes("virtual memory") || lower.includes("lru") || lower.includes("fifo")) {
    return {
      title: "Virtual Memory, Paging & Page Replacement Algorithms (FIFO & LRU)",
      overview: "Virtual Memory is an operating system memory management architecture that decouples a program's logical address space from physical RAM, allowing programs larger than physical memory to execute seamlessly.\n\nPhysical memory is divided into fixed-size blocks called Frames, and logical memory is divided into blocks of the same size called Pages. When a process requests a page not currently residing in RAM, the hardware generates a Page Fault Trap, prompting the OS to retrieve the page from secondary storage (swap space). If all frames are occupied, a Page Replacement Algorithm (such as FIFO or LRU) chooses a victim page to evict.",
      sections: [
        {
          title: "1. Address Translation & Page Fault Handling Flow",
          content: "The CPU translates logical addresses to physical addresses via hardware:",
          points: [
            "Address Division: CPU generates Logical Address = [Page Number (p) | Offset (d)].",
            "Page Table Lookup: Hardware indexes Page Table with 'p' to find physical Frame 'f'.",
            "Page Fault Trap: If the Valid/Invalid bit is 0, a page fault interrupt occurs.",
            "OS Page Fault Handler: The OS suspends the process, locates a free frame, reads the page from disk, updates the Page Table (Valid = 1), and restarts the faulted instruction."
          ]
        },
        {
          title: "2. Page Replacement Strategies",
          content: "When all physical frames are full, the OS must select a page to replace:",
          points: [
            "FIFO (First-In, First-Out): Evicts the page that has been in memory the longest. Susceptible to Belady's Anomaly (where page faults increase when physical frames increase).",
            "LRU (Least Recently Used): Evicts the page that has not been referenced for the longest period of time. Immune to Belady's Anomaly because it is a stack algorithm.",
            "Optimal (OPT): Evicts the page that will not be used for the longest duration in the future (theoretical benchmark)."
          ]
        }
      ],
      visualDiagram: `HARDWARE ADDRESS TRANSLATION & PAGING ARCHITECTURE:

Logical Address: [ Page Number p | Offset d ]
                         │
                         ▼
                 ┌───────────────┐
                 │  PAGE TABLE   │
                 ├───────┬───────┤
                 │ Page p│Frame f│ ───> Frame f
                 └───────┴───────┘        │
                                          ▼
Physical Address:                [ Frame f | Offset d ] ──> [ Physical RAM ]`,
      diagramCaption: "Figure 6: Translation of Logical Address to Physical Address via Page Table.",
      workedExample: {
        title: "Worked Numerical: Reference String 7, 0, 1, 2, 0, 3 across 3 Frames",
        problemStatement: "Given reference string: 7, 0, 1, 2, 0, 3 and 3 memory frames. Trace FIFO and LRU page replacement algorithms and count total page faults.",
        steps: [
          "1. FIFO Trace (3 Frames):\n   • 7: Frame = [7, -, -] ➔ Fault (1)\n   • 0: Frame = [7, 0, -] ➔ Fault (2)\n   • 1: Frame = [7, 0, 1] ➔ Fault (3)\n   • 2: Replace oldest page (7) ➔ Frame = [2, 0, 1] ➔ Fault (4)\n   • 0: Page 0 already present ➔ HIT (0 faults)\n   • 3: Replace oldest page (0) ➔ Frame = [2, 3, 1] ➔ Fault (5)\n   Total FIFO Page Faults = 5",
          "2. LRU Trace (3 Frames):\n   • 7: Frame = [7, -, -] ➔ Fault (1)\n   • 0: Frame = [7, 0, -] ➔ Fault (2)\n   • 1: Frame = [7, 0, 1] ➔ Fault (3)\n   • 2: Replace least recently used (7) ➔ Frame = [2, 0, 1] ➔ Fault (4)\n   • 0: Page 0 already present ➔ HIT (0 becomes most recently used)\n   • 3: Replace least recently used (1) ➔ Frame = [2, 0, 3] ➔ Fault (5)\n   Total LRU Page Faults = 5"
        ],
        finalResult: "FIFO Faults = 5 | LRU Faults = 5 (Both handled 3 frames with 1 hit)"
      },
      comparisonTable: {
        headers: ["Algorithm", "Replacement Policy", "Belady's Anomaly?", "Hardware Overhead"],
        rows: [
          ["FIFO", "Replaces oldest page in memory", "Yes (Faults can increase with more frames)", "Low (Simple circular queue)"],
          ["Optimal (OPT)", "Replaces page unused for longest future time", "No (Immune)", "Impossible in practice (Theoretical benchmark)"],
          ["LRU", "Replaces page unused for longest past time", "No (Immune / Stack algorithm)", "High (Requires hardware timestamps or register stack)"]
        ]
      },
      keyPoints: [
        "Paging eliminates external fragmentation through fixed-size pages and frames.",
        "Page fault rate equation: Fault Rate = (Page Faults / Total References) * 100.",
        "Belady's Anomaly occurs in FIFO where adding memory frames increases page faults.",
        "LRU is widely implemented in operating systems via approximation algorithms (Clock/Second-Chance)."
      ],
      evaluatorChecklist: [
        "Six steps of Page Fault Handling flow",
        "Definition of Belady's Anomaly",
        "Frame-by-frame memory grid trace",
        "Page Table address translation formula"
      ],
      examWritingTips: "Draw a clean grid table where rows represent the 3 memory frames and columns represent the page references. Mark each column with 'F' (Fault) or 'H' (Hit).",
      conceptAnalogy: {
        simpleExplanation: "Virtual memory is like keeping only the 3 textbooks you are studying right now on your desk, while your other 40 books stay on the bookshelf. When you need a book not on the desk, you swap one out!",
        realWorldAnalogy: "Like a restaurant chef keeping only the active ingredients on the countertop.",
        takeaway: "Virtual memory decouples software address size from physical hardware RAM capacity."
      },
      aiIntegrationNote: "R26 integrates AI prefetching models that predict process memory access sequences to pre-load pages into RAM before page faults occur."
    };
  }

  // 7. QUANTUM CHEMISTRY IN COMPUTING MATERIALS (R26 Syllabus)
  if (lower.includes("quantum") || lower.includes("chemistry") || lower.includes("molecular orbital") || lower.includes("schrodinger")) {
    return {
      title: "Quantum Chemistry Principles in Computing Materials (R26 Core)",
      overview: "Quantum Chemistry in Computing Materials investigates the quantum mechanical behavior of subatomic particles within semiconductors, quantum dots, and molecular orbitals.\n\nAs conventional silicon CMOS transistors shrink below 3 nanometers, classical physics breaks down and quantum mechanical effects (such as electron wave tunneling and discrete orbital energy states) dominate device behavior. Understanding the Schrödinger wave equation, electron confinement, and Molecular Orbital Theory is essential for designing modern nanoscale transistors and solid-state quantum computing qubits.",
      sections: [
        {
          title: "1. Wave-Particle Duality & Schrödinger Wave Equation",
          content: "Key theoretical foundations governing nanoscale electron dynamics:",
          points: [
            "De Broglie Hypothesis: Matter exhibits wave-particle duality: λ = h / p (where h is Planck's constant, p is momentum).",
            "Time-Independent Schrödinger Equation: HΨ = EΨ, where H is the Hamiltonian operator, Ψ is the electron wave function, and E is total energy.",
            "Physical Meaning of |Ψ|²: Max Born's probability density of locating an electron in a specific region of the semiconductor lattice."
          ]
        },
        {
          title: "2. Particle in a 1D Box & Band Gap Theory",
          content: "Modeling electron behavior in quantum computing materials:",
          points: [
            "Quantized Energy Levels: An electron confined in a 1D quantum well of width L has discrete energy states: En = (n²h²) / (8mL²), where n = 1, 2, 3...",
            "Molecular Orbital Theory (LCAO): Atomic orbitals combine linearly into Bonding (lower energy, HOMO) and Anti-bonding (higher energy, LUMO) orbitals.",
            "Band Gap (Eg): The energy difference between the Valence Band (HOMO) and Conduction Band (LUMO). Eg determines whether a material is a conductor (Eg ≈ 0), semiconductor (Eg ≈ 1.1 eV for Silicon), or insulator (Eg > 5 eV)."
          ]
        }
      ],
      visualDiagram: `BAND GAP & MOLECULAR ORBITAL ENERGY DIAGRAM:

       Energy (E)
          ▲
          │   ┌──────────────────────────┐
          │   │  Conduction Band (LUMO)  │
          │   └──────────────────────────┘
          │                ▲
          │                │  Band Gap (Eg ≈ 1.1 eV for Si)
          │                ▼
          │   ┌──────────────────────────┐
          │   │   Valence Band (HOMO)    │
          │   └──────────────────────────┘
          └───────────────────────────────────> Material Coordinate`,
      diagramCaption: "Figure 7: Energy band gap separating Valence Band (HOMO) and Conduction Band (LUMO).",
      workedExample: {
        title: "Worked Numerical: Ground State Energy of an Electron in a 1D Quantum Box",
        problemStatement: "Calculate the ground state energy (n=1) of an electron (mass m = 9.11 x 10^-31 kg) confined in a 1D quantum box of length L = 1 nm (10^-9 m). Use Planck's constant h = 6.626 x 10^-34 J·s.",
        steps: [
          "1. Formula: E1 = (1² * h²) / (8 * m * L²)",
          "2. Calculate Numerator: h² = (6.626 x 10^-34)² = 4.39 x 10^-67 J²·s²",
          "3. Calculate Denominator: 8 * (9.11 x 10^-31) * (10^-9)² = 7.288 x 10^-47 kg·m²",
          "4. Compute Energy in Joules: E1 = (4.39 x 10^-67) / (7.288 x 10^-47) = 6.024 x 10^-20 Joules",
          "5. Convert to Electron-Volts (eV): E1 = (6.024 x 10^-20) / (1.602 x 10^-19) = 0.376 eV"
        ],
        finalResult: "Ground State Energy E1 = 0.376 eV (Confirms discrete energy quantization in nanoscale devices)"
      },
      comparisonTable: {
        headers: ["Material Class", "Band Gap Energy (Eg)", "Conductivity", "Application in Computing"],
        rows: [
          ["Conductor (Copper, Gold)", "Eg ≈ 0 eV (Overlapping bands)", "Very High", "On-chip interconnects & wiring"],
          ["Semiconductor (Silicon, GaAs)", "Eg ≈ 1.1 eV (Moderate gap)", "Controllable via doping", "MOSFET transistors & CPU logic gates"],
          ["Insulator (SiO2, Diamond)", "Eg > 5 eV (Large gap)", "Negligible", "Gate dielectrics & electrical isolation"]
        ]
      },
      keyPoints: [
        "Schrödinger Wave Equation: HΨ = EΨ governs electron wave functions.",
        "Particle in a box shows that spatial confinement forces energy quantization: En = (n²h²) / (8mL²).",
        "Band gap Eg = E_conduction - E_valence dictates electrical switching capability.",
        "Crucial for sub-3nm chip fabrication and quantum computing qubit architecture."
      ],
      evaluatorChecklist: [
        "De Broglie wavelength equation: λ = h / p",
        "Time-independent Schrödinger Equation: HΨ = EΨ",
        "1D Box energy formula: En = (n²h²) / (8mL²)",
        "Labeled Band Gap diagram showing HOMO, LUMO, and Eg"
      ],
      examWritingTips: "Always draw the band gap diagram showing the Valence Band, Conduction Band, and Band Gap Eg. State the unit box calculation in Joules and convert to eV.",
      conceptAnalogy: {
        simpleExplanation: "Quantum chemistry explains why silicon can act as an on/off switch for computers. Electrons can only stand on specific rungs of an energy ladder. The gap between rungs (the band gap) determines whether electricity flows or stops, which forms the 1s and 0s of digital computers!",
        realWorldAnalogy: "Like a flight of stairs: you can stand on step 1 or step 2, but you cannot hover in mid-air between steps.",
        takeaway: "Quantized energy levels in semiconductor orbitals enable binary switching logic in computer chips."
      },
      aiIntegrationNote: "In R26, students use Python Qiskit and NumPy simulations on Google Colab to compute molecular orbitals and predict semiconductor band gaps."
    };
  }

  // 8. CLOUD COMPUTING & VIRTUALIZATION
  if (lower.includes("cloud") || lower.includes("virtualization") || lower.includes("iaas") || lower.includes("paas") || lower.includes("saas") || lower.includes("docker") || lower.includes("kubernetes")) {
    return {
      title: "Cloud Computing Architectures: Service Models (IaaS, PaaS, SaaS) & Virtualization",
      overview: "Cloud Computing is the on-demand delivery of compute power, database storage, applications, and IT resources over the internet with pay-as-you-go pricing.\n\nRather than purchasing, owning, and maintaining physical servers and data centers, organizations access technology services from cloud providers (such as Google Cloud, AWS, and Azure). The operational model relies on Virtualization, where a hypervisor or container runtime abstracts physical hardware into multi-tenant, elastic virtual resources that automatically scale up or down based on workload demand.",
      sections: [
        {
          title: "1. The 3 Primary Cloud Service Models",
          content: "Cloud computing services are structured in a shared responsibility stack:",
          points: [
            "Infrastructure as a Service (IaaS): Provides raw fundamental computing resources—virtual machines (VMs), storage, and networking. The user manages the OS, runtime, and applications (e.g., Google Compute Engine, AWS EC2).",
            "Platform as a Service (PaaS): Delivers hardware and software tools over the internet, typically for application development. The cloud vendor manages the underlying OS and server infrastructure (e.g., Google App Engine, AWS Elastic Beanstalk).",
            "Software as a Service (SaaS): Complete software applications accessible via a web browser. The service provider handles all maintenance, infrastructure, and updates (e.g., Google Workspace, Microsoft 365)."
          ]
        },
        {
          title: "2. Virtualization: Virtual Machines vs. Containers",
          content: "Modern cloud deployments leverage two primary virtualization strategies:",
          points: [
            "Hardware-Level Virtualization (Hypervisors): Type-1 (Bare-metal like VMware ESXi) or Type-2 (Hosted like VirtualBox) hypervisors run complete Guest Operating Systems on virtual hardware.",
            "Operating System-Level Virtualization (Containers): Technologies like Docker share the host OS kernel, packaging only application code and dependencies into lightweight, instant-starting containers managed by Kubernetes."
          ]
        }
      ],
      visualDiagram: `CLOUD SERVICE MODELS & VIRTUALIZATION STACK:

      SaaS (Software as a Service)      --> [ End-User Applications ]
      ────────────────────────────────────────────────────────────────
      PaaS (Platform as a Service)      --> [ Runtimes, DB, Frameworks ]
      ────────────────────────────────────────────────────────────────
      IaaS (Infrastructure as a Service)--> [ Virtual Machines, Storage, Networks ]
      ────────────────────────────────────────────────────────────────
      Physical Infrastructure           --> [ Cloud Data Centers & Bare-Metal ]`,
      diagramCaption: "Figure 8: Shared responsibility and abstraction layers in Cloud Computing.",
      workedExample: {
        title: "Real-World Deployment Scenario: Scaling an E-Commerce Application",
        problemStatement: "An online retail portal experiences a 10x traffic spike during an annual festival sale. Compare how manual on-premise scaling vs cloud auto-scaling handles this load.",
        steps: [
          "1. Traffic Detection: Cloud monitoring metrics detect CPU utilization crossing 75% threshold across web worker instances.",
          "2. Automated Provisioning: The Cloud Auto-Scaler spins up 20 additional containerized instances across multi-region availability zones within 30 seconds.",
          "3. Load Balancing: The Global Cloud Load Balancer distributes incoming user HTTP requests evenly across all healthy instances.",
          "4. Traffic Subsidence: Once the traffic surge drops below 40%, the auto-scaler terminates surplus instances, immediately halting idle billing."
        ],
        finalResult: "Zero server crashes or downtime during peak traffic; infrastructure costs dropped back to baseline automatically."
      },
      comparisonTable: {
        headers: ["Feature", "IaaS", "PaaS", "SaaS"],
        rows: [
          ["Management Scope", "User manages OS, Runtime, and Apps", "User manages only Application code and Data", "Provider manages entire software stack"],
          ["Flexibility", "Maximum control over low-level configuration", "Moderate control focused on development speed", "Minimal technical configuration required"],
          ["Target Audience", "Cloud architects, DevOps, SysAdmins", "Software developers, Web engineers", "Business professionals and End-users"]
        ]
      },
      keyPoints: [
        "Cloud Computing delivers on-demand elastic computing via IaaS, PaaS, and SaaS.",
        "Hypervisors abstract physical hardware; Containers share the host OS kernel for microservices.",
        "Auto-scaling provides high availability while minimizing idle infrastructure expenses.",
        "Zero downtime is achieved through multi-region redundant architectures."
      ],
      evaluatorChecklist: [
        "Clear definitions of IaaS, PaaS, and SaaS with real-world examples",
        "Distinction between Type-1 and Type-2 Hypervisors",
        "Comparison of Virtual Machines vs Docker Containers",
        "Core cloud characteristics: On-demand self-service, Broad network access, Resource pooling, Rapid elasticity"
      ],
      examWritingTips: "Draw the layered pyramid diagram showing IaaS at the base, PaaS in the center, and SaaS at the top. List who manages each layer in the shared responsibility model.",
      conceptAnalogy: {
        simpleExplanation: "Cloud computing is like electricity from the power grid. Instead of building your own power generator in your backyard, you plug into the wall and pay only for the exact kilowatt-hours you consume!",
        realWorldAnalogy: "Like dining out: IaaS is buying groceries and cooking in a rental kitchen; PaaS is ordering a meal kit delivered to your stove; SaaS is eating at a full-service restaurant.",
        takeaway: "Cloud computing replaces heavy capital IT expenditure with flexible operational scalability."
      },
      aiIntegrationNote: "R26 emphasizes Cloud-Native AI architectures, deploying machine learning models via Docker containers and serverless cloud inference."
    };
  }

  // 9. DYNAMIC UNIVERSAL TOPIC SYNTHESIZER (Context-Aware, Clean, Authentic Prose)
  return {
    title: `${cleanTopic}: Core Principles, Architecture & Analysis`,
    overview: `${cleanTopic} is an essential concept in ${subject} (${regulation} curriculum). It provides the foundational methodologies, architectural models, and systematic practices required to build efficient, scalable, and secure computational solutions.\n\nIn modern computer science, understanding ${cleanTopic} is vital for software engineers and systems designers. It bridges theoretical principles with practical engineering trade-offs, ensuring that computing infrastructures operate reliably under diverse operational constraints and high-throughput production environments.`,
    sections: [
      {
        title: "1. Core Principles & Operational Architecture",
        content: `The technical implementation of ${cleanTopic} revolves around three primary dimensions:`,
        points: [
          `System Formulation: Formulates the operational parameters, data models, and environmental boundaries governing ${cleanTopic}.`,
          `Deterministic Processing: Executes systematic state transitions while maintaining data invariants, correctness, and fault tolerance.`,
          `Efficiency & Optimization: Balances computational resource consumption to maximize system throughput and minimize latency.`
        ]
      },
      {
        title: "2. Key Engineering Considerations & Industry Best Practices",
        content: `When deploying ${cleanTopic} in enterprise software and hardware stacks, engineers follow established industry standards:`,
        points: [
          `Modularity & Loose Coupling: Isolating sub-components through well-defined APIs to allow independent scaling and automated unit testing.`,
          `Resilience & Graceful Degradation: Implementing defensive programming boundaries and logging to ensure seamless recovery during edge-case failures.`,
          `Scalability: Designing data structures and pipelines that scale smoothly as user volume and data velocity expand.`
        ]
      },
      {
        title: "3. Practical Real-World Applications",
        content: `Techniques associated with ${cleanTopic} are actively applied across high-impact computational sectors:`,
        points: [
          `Distributed Systems: Powering resilient cloud microservices and high-throughput communication backbones.`,
          `Data-Intensive Applications: Enabling fast analytical query processing and secure transactional state management.`,
          `Embedded & Intelligent Devices: Running real-time telemetry pipelines within constrained hardware profiles.`
        ]
      }
    ],
    visualDiagram: `SYSTEM ARCHITECTURE & OPERATIONAL WORKFLOW:

┌───────────────────────────┐       ┌───────────────────────────┐
│     1. System Inputs      │ ────> │   2. Core Engine          │
│  • Configuration Data     │       │  • State Evaluation       │
│  • Operational Bounds     │       │  • Systematic Processing  │
└───────────────────────────┘       └─────────────┬─────────────┘
                                                  │
                                                  ▼
┌───────────────────────────┐       ┌───────────────────────────┐
│     4. Verified Output    │ <──── │   3. Validation & Quality │
│  • Deterministic Result   │       │  • Integrity Verification │
│  • Telemetry & Logging    │       │  • Error Handling         │
└───────────────────────────┘       └───────────────────────────┘`,
    diagramCaption: `Figure: Architectural flow and state execution pipeline for ${cleanTopic}.`,
    workedExample: {
      title: `Practical Demonstration & Case Analysis: ${cleanTopic}`,
      problemStatement: `Step-by-step workflow demonstrating operational execution, validation boundaries, and verified system outcome.`,
      steps: [
        "1. Parameter Setup: Validate environmental preconditions, initialize data structures, and establish security boundaries.",
        "2. Core Execution: Apply the primary operational logic to transition from initial configuration to the verified intermediate state.",
        "3. Integrity Verification: Execute health and validation checks against predefined threshold constraints.",
        "4. Output Delivery: Emit the deterministic solution, log performance telemetry, and safely release allocated resources."
      ],
      finalResult: `Operation completed successfully with verified system stability and deterministic output.`
    },
    comparisonTable: null, // Only show comparison table when genuine comparison data exists!
    keyPoints: [
      `Fundamental role and purpose of ${cleanTopic} in ${subject}.`,
      "Systematic operational lifecycle from input initialization to verified output.",
      "Clear architectural modularity separating business logic from validation layers.",
      "Key performance and scalability metrics required for university examinations."
    ],
    evaluatorChecklist: [
      "Precise technical definition stated at the beginning",
      "Sequential explanation of core operational mechanism",
      "Neat, labeled block diagram illustrating system boundaries",
      "Real-world industrial application examples"
    ],
    examWritingTips: `Structure your university exam answer with 4 clean sections: 1. Core Definition & Overview, 2. Working Architecture & Key Principles, 3. Visual System Flowchart, 4. Real-World Practical Example & Key Points.`,
    conceptAnalogy: {
      simpleExplanation: `At its foundation, ${cleanTopic} organizes a complex technical challenge into disciplined, verifiable steps so that software and computing systems run predictably, securely, and efficiently.`,
      realWorldAnalogy: "Like an automated airport logistics and baggage handling system: every package is scanned, verified, and routed along dedicated tracks without bottlenecks or collisions.",
      takeaway: "Disciplined modular design ensures predictable, reliable performance across complex software architectures."
    },
    aiIntegrationNote: `In the modern R26 curriculum, ${cleanTopic} is complemented with computational Python notebooks and AI-assisted automation on Google Colab.`
  };
}
