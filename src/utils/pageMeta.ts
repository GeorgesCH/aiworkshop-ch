import type { Page } from "../components/router/types";

export interface DocumentProps {
  title: string;
  description: string;
}

export function getPageMeta(page: Page, language: string): DocumentProps {
  const meta = {
    en: {
      home: {
        title: "AI Workshop Switzerland - Expert Corporate AI Training & Workshops",
        description: "Professional AI training and workshops across Switzerland. Master Generative AI, Agentic AI, and AI for Business Intelligence. Zurich, Geneva, Basel, Lausanne."
      },
      about: {
        title: "About Us — AI Workshop Switzerland",
        description: "Learn about our expert AI facilitators and our mission to empower Swiss businesses with cutting-edge AI skills and practical training programs."
      },
      contact: {
        title: "Contact Us — AI Workshop Switzerland",
        description: "Get in touch for corporate AI training inquiries. Book workshops and training sessions for your team in Zurich, Geneva, Basel, and Lausanne."
      },
      coaching: {
        title: "AI Coaching & Consulting - Personalized AI Strategy & Implementation Support",
        description: "Expert AI coaching services for businesses. Get personalized guidance on AI strategy, tool selection, and implementation roadmaps tailored to your organization."
      },
      develop: {
        title: "Develop — AI Tools, Platforms & Apps",
        description: "Design and build AI-driven web apps, admin dashboards, and mobile apps with Swiss-quality delivery. Get an instant estimate and 4-month milestone plan."
      },
      learn: {
        title: "Learn AI — Comprehensive AI Education Platform",
        description: "Interactive AI learning platform covering fundamentals, machine learning, deep learning, generative AI, and business intelligence applications."
      },
      "learn-ai-overview": {
        title: "AI Overview — Understanding Artificial Intelligence",
        description: "Comprehensive overview of artificial intelligence concepts, applications, and future trends. Perfect starting point for your AI journey."
      },
      "learn-intelligence": {
        title: "AI & Intelligence — Exploring Machine Intelligence",
        description: "Deep dive into artificial intelligence and machine intelligence concepts, from basic principles to advanced applications."
      },
      "learn-machine-learning": {
        title: "Machine Learning — Algorithms & Applications",
        description: "Learn machine learning algorithms, supervised and unsupervised learning, model training, and real-world applications."
      },
      "learn-deep-learning": {
        title: "Deep Learning — Neural Networks & AI",
        description: "Master deep learning concepts including neural networks, convolutional networks, and advanced AI architectures."
      },
      "learn-neural-networks": {
        title: "Neural Networks — Building AI Systems",
        description: "Comprehensive guide to neural networks, from basic perceptrons to complex multi-layer architectures and their applications."
      },
      "learn-foundation-models": {
        title: "Foundation Models — Large Language Models & AI",
        description: "Explore foundation models, large language models (LLMs), and how they're revolutionizing AI applications across industries."
      },
      "learn-generative-ai": {
        title: "Generative AI — Creating with Artificial Intelligence",
        description: "Learn about generative AI technologies including ChatGPT, DALL-E, and other AI-powered content creation tools."
      },
      "learn-llm-players": {
        title: "LLM Players — Major AI Companies & Models",
        description: "Overview of major players in the large language model space, including OpenAI, Google, Anthropic, and emerging competitors."
      },
      "learn-ai-tools": {
        title: "AI Tools — Essential Software for AI Work",
        description: "Discover essential AI tools and software for development, deployment, and integration of artificial intelligence solutions."
      },
      "learn-ai-tools-directory": {
        title: "AI Tools Directory — Comprehensive AI Software Guide",
        description: "Complete directory of AI tools, platforms, and software solutions for businesses and developers across all industries."
      },
      "learn-interactive-exercises": {
        title: "Interactive AI Exercises — Hands-on AI Learning",
        description: "Practice AI concepts with interactive exercises and practical examples. Build real AI applications and test your knowledge."
      },
      assessment: {
        title: "AI Skills Assessment — Evaluate Your AI Knowledge",
        description: "Comprehensive AI skills assessment to evaluate your current knowledge and identify areas for improvement in artificial intelligence."
      },
      "ai-fundamentals": {
        title: "AI Fundamentals Course — Master AI Basics",
        description: "Comprehensive AI fundamentals training covering core concepts, algorithms, and practical applications for beginners and professionals."
      },
      "ai-business-intelligence": {
        title: "AI for Business Intelligence — Transform Your Data",
        description: "Learn how to leverage AI for business intelligence, data analysis, predictive modeling, and strategic decision-making."
      },
      "generative-ai": {
        title: "Generative AI Course — Create with AI",
        description: "Master generative AI technologies including text generation, image creation, and content production using cutting-edge AI tools."
      },
      "agentic-ai": {
        title: "Agentic AI — Autonomous AI Systems",
        description: "Explore agentic AI systems, autonomous agents, and how they're revolutionizing automation and decision-making processes."
      },
      "workshop-booking": {
        title: "Book AI Workshop — Corporate AI Training & Workshops",
        description: "Book your corporate AI training workshop. Choose from AI Fundamentals, Business Intelligence, Generative AI, and Agentic AI courses across Switzerland."
      },
      "discovery-call": {
        title: "Book Discovery Call — Free AI Consultation",
        description: "Schedule a free discovery call with our AI experts. Get personalized guidance on AI strategy, implementation, and training for your business in Switzerland."
      },
      "seo-landing": {
        title: "AI Training in Zurich — Professional AI Workshops",
        description: "Professional AI training and workshops in Zurich. Master generative AI, machine learning, and business intelligence with expert facilitators."
      },
      "not-found": {
        title: "Page Not Found — AI Workshop Switzerland",
        description: "The page you're looking for doesn't exist. Find AI training programs, workshops, and coaching services across Switzerland."
      }
    },
    fr: {
      home: {
        title: "AI Workshop Suisse - Formation IA d'Entreprise Professionnelle & Ateliers Experts",
        description: "Formations et ateliers IA pour équipes en Suisse: IA Générative, Agentic AI et IA pour le business. Zurich, Genève, Bâle, Lausanne."
      },
      about: {
        title: "À Propos — AI Workshop Suisse",
        description: "Découvrez nos facilitateurs IA experts et notre mission d'autonomiser les entreprises suisses avec des compétences IA de pointe et des programmes de formation pratiques."
      },
      contact: {
        title: "Contact — AI Workshop Suisse",
        description: "Contactez-nous pour des demandes de formation IA d'entreprise. Réservez des ateliers et sessions de formation pour votre équipe à Zurich, Genève, Bâle et Lausanne."
      },
      coaching: {
        title: "Coaching IA & Conseil - Stratégie IA Personnalisée & Support d'Implémentation",
        description: "Services de coaching IA experts pour les entreprises. Obtenez des conseils personnalisés sur la stratégie IA, la sélection d'outils et les feuilles de route d'implémentation."
      },
      develop: {
        title: "Develop — Outils, Plateformes & Apps IA",
        description: "Concevez et développez des applications IA web, des dashboards admin et des apps mobiles avec une qualité suisse. Estimation instantanée et plan sur 4 mois."
      },
      learn: {
        title: "Apprendre l'IA — Plateforme d'Éducation IA Complète",
        description: "Plateforme d'apprentissage IA interactive couvrant les fondamentaux, l'apprentissage automatique, le deep learning, l'IA générative et les applications d'intelligence d'affaires."
      },
      "learn-ai-overview": {
        title: "Aperçu IA — Comprendre l'Intelligence Artificielle",
        description: "Aperçu complet des concepts d'intelligence artificielle, des applications et des tendances futures. Point de départ parfait pour votre parcours IA."
      },
      "learn-intelligence": {
        title: "IA & Intelligence — Explorer l'Intelligence Machine",
        description: "Plongée approfondie dans l'intelligence artificielle et les concepts d'intelligence machine, des principes de base aux applications avancées."
      },
      "learn-machine-learning": {
        title: "Apprentissage Automatique — Algorithmes & Applications",
        description: "Apprenez les algorithmes d'apprentissage automatique, l'apprentissage supervisé et non supervisé, l'entraînement de modèles et les applications réelles."
      },
      "learn-deep-learning": {
        title: "Deep Learning — Réseaux de Neurones & IA",
        description: "Maîtrisez les concepts de deep learning incluant les réseaux de neurones, les réseaux convolutionnels et les architectures IA avancées."
      },
      "learn-neural-networks": {
        title: "Réseaux de Neurones — Construire des Systèmes IA",
        description: "Guide complet des réseaux de neurones, des perceptrons de base aux architectures multi-couches complexes et leurs applications."
      },
      "learn-foundation-models": {
        title: "Modèles de Base — LLM & IA",
        description: "Explorez les modèles de base, les grands modèles de langage (LLM) et comment ils révolutionnent les applications IA dans tous les secteurs."
      },
      "learn-generative-ai": {
        title: "IA Générative — Créer avec l'Intelligence Artificielle",
        description: "Découvrez les technologies d'IA générative incluant ChatGPT, DALL-E et d'autres outils de création de contenu alimentés par l'IA."
      },
      "learn-llm-players": {
        title: "Acteurs LLM — Principales Entreprises & Modèles IA",
        description: "Aperçu des principaux acteurs dans l'espace des grands modèles de langage, incluant OpenAI, Google, Anthropic et les concurrents émergents."
      },
      "learn-ai-tools": {
        title: "Outils IA — Logiciels Essentiels pour le Travail IA",
        description: "Découvrez les outils et logiciels IA essentiels pour le développement, le déploiement et l'intégration de solutions d'intelligence artificielle."
      },
      "learn-ai-tools-directory": {
        title: "Annuaire Outils IA — Guide Complet Logiciels IA",
        description: "Annuaire complet des outils IA, plateformes et solutions logicielles pour les entreprises et développeurs dans tous les secteurs."
      },
      "learn-interactive-exercises": {
        title: "Exercices IA Interactifs — Apprentissage IA Pratique",
        description: "Pratiquez les concepts IA avec des exercices interactifs et des exemples pratiques. Construisez des applications IA réelles et testez vos connaissances."
      },
      assessment: {
        title: "Évaluation Compétences IA — Évaluez Vos Connaissances IA",
        description: "Évaluation complète des compétences IA pour évaluer vos connaissances actuelles et identifier les domaines d'amélioration en intelligence artificielle."
      },
      "ai-fundamentals": {
        title: "Cours Fondamentaux IA — Maîtrisez les Bases IA",
        description: "Formation complète sur les fondamentaux IA couvrant les concepts de base, algorithmes et applications pratiques pour débutants et professionnels."
      },
      "ai-business-intelligence": {
        title: "IA pour Business Intelligence — Transformez Vos Données",
        description: "Apprenez à exploiter l'IA pour l'intelligence d'affaires, l'analyse de données, la modélisation prédictive et la prise de décision stratégique."
      },
      "generative-ai": {
        title: "Cours IA Générative — Créez avec l'IA",
        description: "Maîtrisez les technologies d'IA générative incluant la génération de texte, la création d'images et la production de contenu avec des outils IA de pointe."
      },
      "agentic-ai": {
        title: "IA Agentique — Systèmes IA Autonomes",
        description: "Explorez les systèmes d'IA agentique, les agents autonomes et comment ils révolutionnent l'automatisation et les processus de prise de décision."
      },
      "workshop-booking": {
        title: "Réserver Atelier IA — Formation & Ateliers IA d'Entreprise",
        description: "Réservez votre atelier de formation IA d'entreprise. Choisissez parmi les cours Fondamentaux IA, Business Intelligence, IA Générative et IA Agentique en Suisse."
      },
      "discovery-call": {
        title: "Réserver Appel Découverte — Consultation IA Gratuite",
        description: "Planifiez un appel de découverte gratuit avec nos experts IA. Obtenez des conseils personnalisés sur la stratégie IA, l'implémentation et la formation pour votre entreprise en Suisse."
      },
      "seo-landing": {
        title: "Formation IA à Zurich — Ateliers IA Professionnels",
        description: "Formation IA professionnelle et ateliers à Zurich. Maîtrisez l'IA générative, l'apprentissage automatique et l'intelligence d'affaires avec des facilitateurs experts."
      },
      "not-found": {
        title: "Page Non Trouvée — AI Workshop Suisse",
        description: "La page que vous recherchez n'existe pas. Trouvez des programmes de formation IA, ateliers et services de coaching en Suisse."
      }
    },
    de: {
      home: {
        title: "AI Workshop Schweiz - Professionelle Unternehmens-KI-Schulungen & Experten-Workshops",
        description: "Professionelle KI-Schulungen und Workshops in der Schweiz. Beherrschen Sie Generative KI, Agentic AI und KI für Business Intelligence. Zürich, Genf, Basel, Lausanne."
      },
      about: {
        title: "Über Uns — AI Workshop Schweiz",
        description: "Erfahren Sie mehr über unsere KI-Experten und unsere Mission, Schweizer Unternehmen mit modernsten KI-Fähigkeiten und praktischen Trainingsprogrammen zu stärken."
      },
      contact: {
        title: "Kontakt — AI Workshop Schweiz",
        description: "Kontaktieren Sie uns für Unternehmens-KI-Trainingsanfragen. Buchen Sie Workshops und Trainingssitzungen für Ihr Team in Zürich, Genf, Basel und Lausanne."
      },
      coaching: {
        title: "KI-Coaching & Beratung - Personalisierte KI-Strategie & Implementierungsunterstützung",
        description: "Experte KI-Coaching-Dienste für Unternehmen. Erhalten Sie personalisierte Beratung zu KI-Strategie, Tool-Auswahl und Implementierungs-Roadmaps für Ihre Organisation."
      },
      develop: {
        title: "Develop — KI-Tools, Plattformen & Apps",
        description: "Entwickeln Sie KI-gestützte Web-Apps, Admin-Dashboards und Mobile-Apps mit Schweizer Qualität. Sofortige Schätzung und 4-Monats-Meilensteinplan."
      },
      learn: {
        title: "KI Lernen — Umfassende KI-Bildungsplattform",
        description: "Interaktive KI-Lernplattform mit Grundlagen, maschinellem Lernen, Deep Learning, generativer KI und Business-Intelligence-Anwendungen."
      },
      "learn-ai-overview": {
        title: "KI-Übersicht — Künstliche Intelligenz Verstehen",
        description: "Umfassende Übersicht über KI-Konzepte, Anwendungen und zukünftige Trends. Perfekter Ausgangspunkt für Ihre KI-Reise."
      },
      "learn-intelligence": {
        title: "KI & Intelligenz — Maschinenintelligenz Erkunden",
        description: "Tiefes Eintauchen in künstliche Intelligenz und Maschinenintelligenz-Konzepte, von Grundprinzipien bis zu fortgeschrittenen Anwendungen."
      },
      "learn-machine-learning": {
        title: "Maschinelles Lernen — Algorithmen & Anwendungen",
        description: "Lernen Sie Algorithmen des maschinellen Lernens, überwachtes und unüberwachtes Lernen, Modelltraining und reale Anwendungen."
      },
      "learn-deep-learning": {
        title: "Deep Learning — Neuronale Netze & KI",
        description: "Beherrschen Sie Deep-Learning-Konzepte einschließlich neuronaler Netze, Convolutional Networks und fortschrittlicher KI-Architekturen."
      },
      "learn-neural-networks": {
        title: "Neuronale Netze — KI-Systeme Bauen",
        description: "Umfassender Leitfaden zu neuronalen Netzen, von grundlegenden Perzeptronen zu komplexen Multi-Layer-Architekturen und deren Anwendungen."
      },
      "learn-foundation-models": {
        title: "Foundation-Modelle — LLM & KI",
        description: "Erkunden Sie Foundation-Modelle, Large Language Models (LLM) und wie sie KI-Anwendungen in allen Branchen revolutionieren."
      },
      "learn-generative-ai": {
        title: "Generative KI — Mit Künstlicher Intelligenz Erstellen",
        description: "Erfahren Sie mehr über generative KI-Technologien einschließlich ChatGPT, DALL-E und anderer KI-gestützter Content-Erstellungstools."
      },
      "learn-llm-players": {
        title: "LLM-Anbieter — Wichtige KI-Unternehmen & Modelle",
        description: "Übersicht der wichtigsten Akteure im Large-Language-Model-Bereich, einschließlich OpenAI, Google, Anthropic und aufstrebender Wettbewerber."
      },
      "learn-ai-tools": {
        title: "KI-Tools — Wesentliche Software für KI-Arbeit",
        description: "Entdecken Sie wesentliche KI-Tools und Software für Entwicklung, Bereitstellung und Integration von KI-Lösungen."
      },
      "learn-ai-tools-directory": {
        title: "KI-Tools-Verzeichnis — Umfassender KI-Software-Leitfaden",
        description: "Vollständiges Verzeichnis von KI-Tools, Plattformen und Softwarelösungen für Unternehmen und Entwickler in allen Branchen."
      },
      "learn-interactive-exercises": {
        title: "Interaktive KI-Übungen — Praktisches KI-Lernen",
        description: "Üben Sie KI-Konzepte mit interaktiven Übungen und praktischen Beispielen. Bauen Sie reale KI-Anwendungen und testen Sie Ihr Wissen."
      },
      assessment: {
        title: "KI-Fähigkeiten-Bewertung — Bewerten Sie Ihr KI-Wissen",
        description: "Umfassende KI-Fähigkeiten-Bewertung zur Evaluierung Ihres aktuellen Wissensstandes und Identifizierung von Verbesserungsbereichen in künstlicher Intelligenz."
      },
      "ai-fundamentals": {
        title: "KI-Grundlagen-Kurs — KI-Basics Beherrschen",
        description: "Umfassende KI-Grundlagen-Schulung mit Kernkonzepten, Algorithmen und praktischen Anwendungen für Anfänger und Profis."
      },
      "ai-business-intelligence": {
        title: "KI für Business Intelligence — Transformieren Sie Ihre Daten",
        description: "Lernen Sie, KI für Business Intelligence, Datenanalyse, prädiktive Modellierung und strategische Entscheidungsfindung zu nutzen."
      },
      "generative-ai": {
        title: "Generative KI-Kurs — Mit KI Erstellen",
        description: "Beherrschen Sie generative KI-Technologien einschließlich Textgenerierung, Bilderstellung und Content-Produktion mit modernsten KI-Tools."
      },
      "agentic-ai": {
        title: "Agentic KI — Autonome KI-Systeme",
        description: "Erkunden Sie agentic KI-Systeme, autonome Agenten und wie sie Automatisierung und Entscheidungsprozesse revolutionieren."
      },
      "workshop-booking": {
        title: "KI-Workshop Buchen — Unternehmens-KI-Schulungen & Workshops",
        description: "Buchen Sie Ihren Unternehmens-KI-Schulungsworkshop. Wählen Sie aus KI-Grundlagen, Business Intelligence, Generativer KI und Agentic KI-Kursen in der Schweiz."
      },
      "discovery-call": {
        title: "Entdeckungsgespräch Buchen — Kostenlose KI-Beratung",
        description: "Vereinbaren Sie ein kostenloses Entdeckungsgespräch mit unseren KI-Experten. Erhalten Sie personalisierte Beratung zu KI-Strategie, Implementierung und Schulung für Ihr Unternehmen in der Schweiz."
      },
      "seo-landing": {
        title: "KI-Training in Zürich — Professionelle KI-Workshops",
        description: "Professionelles KI-Training und Workshops in Zürich. Beherrschen Sie generative KI, maschinelles Lernen und Business Intelligence mit Experten."
      },
      "not-found": {
        title: "Seite Nicht Gefunden — AI Workshop Schweiz",
        description: "Die gesuchte Seite existiert nicht. Finden Sie KI-Schulungsprogramme, Workshops und Coaching-Services in der Schweiz."
      }
    },
    it: {
      home: {
        title: "AI Workshop Svizzera - Formazione IA Aziendale Professionale & Workshop Esperti",
        description: "Formazione professionale IA e workshop in Svizzera. Padroneggiare l'IA Generativa, Agentic AI e IA per Business Intelligence. Zurigo, Ginevra, Basilea, Losanna."
      },
      about: {
        title: "Chi Siamo — AI Workshop Svizzera",
        description: "Scopri i nostri facilitatori IA esperti e la nostra missione di potenziare le aziende svizzere con competenze IA all'avanguardia e programmi di formazione pratica."
      },
      contact: {
        title: "Contatto — AI Workshop Svizzera",
        description: "Contattaci per richieste di formazione IA aziendale. Prenota workshop e sessioni di formazione per il tuo team a Zurigo, Ginevra, Basilea e Losanna."
      },
      coaching: {
        title: "Coaching IA & Consulenza - Strategia IA Personalizzata & Supporto Implementazione",
        description: "Servizi di coaching IA esperti per le aziende. Ottieni guidance personalizzata su strategia IA, selezione strumenti e roadmap di implementazione per la tua organizzazione."
      },
      develop: {
        title: "Develop — Strumenti, Piattaforme & App IA",
        description: "Progetta e sviluppa web app IA, dashboard amministrative e app mobile con qualità svizzera. Stima immediata e piano in 4 mesi."
      },
      learn: {
        title: "Impara IA — Piattaforma Educativa IA Completa",
        description: "Piattaforma di apprendimento IA interattiva che copre fondamenti, machine learning, deep learning, IA generativa e applicazioni di business intelligence."
      },
      "learn-ai-overview": {
        title: "Panoramica IA — Comprendere l'Intelligenza Artificiale",
        description: "Panoramica completa dei concetti di intelligenza artificiale, applicazioni e tendenze future. Punto di partenza perfetto per il tuo percorso IA."
      },
      "learn-intelligence": {
        title: "IA & Intelligenza — Esplorare l'Intelligenza Macchina",
        description: "Immersione profonda nell'intelligenza artificiale e nei concetti di intelligenza macchina, dai principi base alle applicazioni avanzate."
      },
      "learn-machine-learning": {
        title: "Machine Learning — Algoritmi & Applicazioni",
        description: "Impara algoritmi di machine learning, apprendimento supervisionato e non supervisionato, addestramento modelli e applicazioni reali."
      },
      "learn-deep-learning": {
        title: "Deep Learning — Reti Neurali & IA",
        description: "Padroneggia concetti di deep learning inclusi reti neurali, reti convoluzionali e architetture IA avanzate."
      },
      "learn-neural-networks": {
        title: "Reti Neurali — Costruire Sistemi IA",
        description: "Guida completa alle reti neurali, dai percettroni base alle architetture multi-layer complesse e alle loro applicazioni."
      },
      "learn-foundation-models": {
        title: "Modelli Foundation — LLM & IA",
        description: "Esplora modelli foundation, large language models (LLM) e come stanno rivoluzionando le applicazioni IA in tutti i settori."
      },
      "learn-generative-ai": {
        title: "IA Generativa — Creare con Intelligenza Artificiale",
        description: "Scopri tecnologie IA generativa inclusi ChatGPT, DALL-E e altri strumenti di creazione contenuti alimentati da IA."
      },
      "learn-llm-players": {
        title: "Giocatori LLM — Principali Aziende & Modelli IA",
        description: "Panoramica dei principali giocatori nello spazio dei large language model, inclusi OpenAI, Google, Anthropic e concorrenti emergenti."
      },
      "learn-ai-tools": {
        title: "Strumenti IA — Software Essenziale per Lavoro IA",
        description: "Scopri strumenti e software IA essenziali per sviluppo, deployment e integrazione di soluzioni di intelligenza artificiale."
      },
      "learn-ai-tools-directory": {
        title: "Directory Strumenti IA — Guida Completa Software IA",
        description: "Directory completa di strumenti IA, piattaforme e soluzioni software per aziende e sviluppatori in tutti i settori."
      },
      "learn-interactive-exercises": {
        title: "Esercizi IA Interattivi — Apprendimento IA Pratico",
        description: "Pratica concetti IA con esercizi interattivi ed esempi pratici. Costruisci applicazioni IA reali e testa le tue conoscenze."
      },
      assessment: {
        title: "Valutazione Competenze IA — Valuta le Tue Conoscenze IA",
        description: "Valutazione completa delle competenze IA per valutare le tue conoscenze attuali e identificare aree di miglioramento nell'intelligenza artificiale."
      },
      "ai-fundamentals": {
        title: "Corso Fondamenti IA — Padroneggia Basi IA",
        description: "Formazione completa sui fondamenti IA che copre concetti base, algoritmi e applicazioni pratiche per principianti e professionisti."
      },
      "ai-business-intelligence": {
        title: "IA per Business Intelligence — Trasforma i Tuoi Dati",
        description: "Impara come sfruttare l'IA per business intelligence, analisi dati, modellazione predittiva e decision-making strategico."
      },
      "generative-ai": {
        title: "Corso IA Generativa — Crea con IA",
        description: "Padroneggia tecnologie IA generativa inclusa generazione testo, creazione immagini e produzione contenuti con strumenti IA all'avanguardia."
      },
      "agentic-ai": {
        title: "IA Agentica — Sistemi IA Autonomi",
        description: "Esplora sistemi IA agentica, agenti autonomi e come stanno rivoluzionando l'automazione e i processi decisionali."
      },
      "workshop-booking": {
        title: "Prenota Workshop IA — Formazione & Workshop IA Aziendali",
        description: "Prenota il tuo workshop di formazione IA aziendale. Scegli tra corsi Fondamenti IA, Business Intelligence, IA Generativa e IA Agentica in Svizzera."
      },
      "discovery-call": {
        title: "Prenota Chiamata Scoperta — Consulenza IA Gratuita",
        description: "Programma una chiamata di scoperta gratuita con i nostri esperti IA. Ottieni guidance personalizzata su strategia IA, implementazione e formazione per la tua azienda in Svizzera."
      },
      "seo-landing": {
        title: "Formazione IA a Zurigo — Workshop IA Professionali",
        description: "Formazione IA professionale e workshop a Zurigo. Padroneggia IA generativa, machine learning e business intelligence con facilitatori esperti."
      },
      "not-found": {
        title: "Pagina Non Trovata — AI Workshop Svizzera",
        description: "La pagina che stai cercando non esiste. Trova programmi di formazione IA, workshop e servizi di coaching in Svizzera."
      }
    }
  };

  return meta[language]?.[page] || meta.en.home;
}
