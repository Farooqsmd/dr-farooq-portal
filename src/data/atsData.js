export const TARGET_ROLES = [
  {
    id: "sde",
    title: "Software Development Engineer (SDE / Full-Stack)",
    description: "Core software engineering, DSA, backend & frontend development for MNCs and product companies.",
    icon: "Code2",
    requiredKeywords: [
      "Data Structures", "Algorithms", "Java", "Python", "C++", "JavaScript", "React", "Node.js", 
      "REST API", "SQL", "Database", "Git", "GitHub", "Object Oriented Programming", "OOP", 
      "Operating Systems", "Computer Networks", "DBMS", "System Design", "Agile", "Unit Testing", "Debugging"
    ],
    bonusKeywords: ["Docker", "Kubernetes", "Microservices", "Redis", "AWS", "CI/CD", "TypeScript", "NoSQL"]
  },
  {
    id: "aiml",
    title: "AI / Machine Learning Engineer",
    description: "Machine Learning, Deep Learning, Natural Language Processing, Computer Vision & Generative AI.",
    icon: "Brain",
    requiredKeywords: [
      "Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", 
      "Pandas", "NumPy", "Data Preprocessing", "Neural Networks", "CNN", "RNN", "Transformers", 
      "Model Evaluation", "Cross-Validation", "Supervised Learning", "Linear Regression", "Classification", 
      "Statistics", "Git", "Google Colab", "Jupyter"
    ],
    bonusKeywords: ["Hugging Face", "LLMs", "Prompt Engineering", "OpenCV", "NLP", "MLOps", "Fine-tuning", "RAG"]
  },
  {
    id: "data",
    title: "Data Analyst / Data Scientist",
    description: "Data visualization, statistical analysis, SQL querying, and business decision intelligence.",
    icon: "BarChart3",
    requiredKeywords: [
      "SQL", "Python", "Data Visualization", "Power BI", "Tableau", "Excel", "Data Cleaning", 
      "Pandas", "NumPy", "Statistics", "Hypothesis Testing", "Exploratory Data Analysis", "EDA", 
      "Dashboard", "Reporting", "Relational Database", "Business Intelligence"
    ],
    bonusKeywords: ["BigQuery", "Snowflake", "ETL", "Spark", "A/B Testing", "Time Series", "Data Warehousing"]
  },
  {
    id: "cloud",
    title: "Cloud & DevOps Engineer",
    description: "Cloud infrastructure, containerization, automated CI/CD pipelines, and site reliability.",
    icon: "Cloud",
    requiredKeywords: [
      "AWS", "Azure", "GCP", "Linux", "Shell Scripting", "Bash", "Docker", "Kubernetes", 
      "CI/CD", "Jenkins", "GitHub Actions", "Git", "Networking", "TCP/IP", "DNS", 
      "Infrastructure as Code", "Terraform", "Monitoring", "Security"
    ],
    bonusKeywords: ["Ansible", "Prometheus", "Grafana", "Serverless", "Lambda", "Nginx", "Load Balancing"]
  },
  {
    id: "security",
    title: "Cybersecurity Analyst",
    description: "Information security, ethical hacking, vulnerability assessment, cryptography, and network defense.",
    icon: "ShieldAlert",
    requiredKeywords: [
      "Cybersecurity", "Network Security", "Cryptography", "Vulnerability Assessment", "Penetration Testing", 
      "Wireshark", "Kali Linux", "Firewall", "IDS/IPS", "Ethical Hacking", "OWASP", "Information Security", 
      "Incident Response", "Identity and Access Management", "Linux"
    ],
    bonusKeywords: ["SIEM", "Splunk", "Burp Suite", "SOC", "Malware Analysis", "Threat Hunting", "ISO 27001"]
  }
];

export const STRONG_ACTION_VERBS = [
  "architected", "engineered", "developed", "implemented", "optimized", "spearheaded", "designed", 
  "formulated", "deployed", "automated", "refactored", "integrated", "benchmarked", "accelerated", 
  "orchestrated", "streamlined", "enhanced", "resolved", "collaborated", "mentored", "published"
];

export const WEAK_WORDS = [
  "worked on", "helped with", "responsible for", "handled", "assisted", "did", "made", "participated in", "tried to"
];

export const SAMPLE_RESUME = `Dr. S. Md. Farooq Student Mentee
Nandyal, Andhra Pradesh | email@example.com | +91 9876543210
GitHub: github.com/student | LinkedIn: linkedin.com/in/student | LeetCode: leetcode.com/student

EDUCATION
B.Tech in Computer Science and Engineering | Santhiram Engineering College (Autonomous)
CGPA: 8.7/10.0 | Expected Graduation: 2026

TECHNICAL SKILLS
- Programming Languages: Java, Python, C++, JavaScript, SQL
- Core Concepts: Data Structures & Algorithms, Object Oriented Programming (OOP), Operating Systems, DBMS, Computer Networks
- Frameworks & Web: React.js, Node.js, Express, REST APIs, Tailwind CSS
- Developer Tools: Git, GitHub, Docker, VS Code, Linux, Postman

PROJECTS
1. Intelligent Operating System Resource Scheduler (AI-Driven)
- Engineered a CPU scheduling simulator with Round Robin and Priority algorithms using Java and JavaFX.
- Implemented an AI-assisted heuristic model that reduced average turnaround time by 18% compared to standard FCFS.
- Benchmarked performance across 1,000 simulated process threads and published interactive Gantt charts.

2. Campus Placement & ATS Resume Optimizer
- Architected a full-stack React and Node.js web application utilizing REST APIs and natural language processing.
- Integrated automated keyword gap analysis against top tech job descriptions, serving 500+ student queries.
- Deployed containerized microservices using Docker on cloud infrastructure with 99.8% uptime.

EXPERIENCE & INTERNSHIPS
Software Engineering Intern | Tech Solutions Pvt. Ltd. (Summer 2025)
- Automated data ingestion pipelines using Python and SQL, reducing manual data processing latency by 35%.
- Collaborated in an Agile Scrum team of 6 engineers to build responsive client dashboards using React.
- Wrote automated unit tests achieving 85% code test coverage, accelerating release validation.

ACHIEVEMENTS & CERTIFICATIONS
- Solved 350+ problems on LeetCode focusing on Dynamic Programming, Graphs, and Trees.
- IEEE Student Member & Active Participant in College Hackathons (Top 5 Finalist).
- Certified in Python for Data Science and Machine Learning.`;
