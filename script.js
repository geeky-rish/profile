/* ============================================================
   RISHI P KULKARNI — EDITORIAL INTERACTION SCRIPT
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  
  /* --------------------------------------------------------
     1. Mobile Menu Drawer Toggle
     -------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileDrawer.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  /* --------------------------------------------------------
     2. System Architecture Deep-Dive Modals
     -------------------------------------------------------- */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body-content');

  const PROJECT_DETAILS = {
    'modal-dataforge': {
      title: 'DataForge — Enterprise Data Pipeline Orchestrator',
      badge: 'FASTAPI · APACHE SPARK · MINIO · POSTGRESQL · DOCKER',
      overview: 'DataForge is a high-throughput data ingestion and distributed ETL pipeline orchestration platform designed for enterprise data cleaning, aggregation, and analytical dataset transformations.',
      architecture: [
        'Built a data pipeline orchestration platform supporting dataset ingestion, Spark-based ETL processing, asynchronous job execution, and metadata management.',
        'Designed reusable Apache Spark transformation workflows for cleaning, validation, aggregation, and schema enforcement of uploaded datasets.',
        'Integrated MinIO S3-compatible object storage alongside PostgreSQL for persistent job metadata, transformation lineage, and workflow tracking.',
        'Implemented Docker-based service orchestration encapsulating Spark worker nodes, FastAPI backend gateway, and object storage clusters for reproducible deployment.'
      ]
    },
    'modal-adaptillm': {
      title: 'AdaptiLLM — Adaptive On-Device LLM Inference Engine',
      badge: 'ACCEPTED @ ICSOFTCOMP 2026 (SPRINGER CCIS) · ANDROID · KOTLIN · C++ · JNI · TFLITE · QWEN2.5',
      overview: 'AdaptiLLM is an adaptive on-device LLM inference framework that dynamically selects optimal inference configurations based on real-time query complexity and mobile hardware constraints. Research paper accepted for publication at ICSoftComp 2026 (Springer CCIS).',
      architecture: [
        'Research paper accepted for publication at ICSoftComp 2026 in the Springer Communications in Computer and Information Science (CCIS) series.',
        'Engineered an adaptive policy engine that dynamically adjusts CPU threads, context length window, and generation token limits using live latency, energy, and quality feedback signals.',
        'Implemented a Lightweight TFLite-based query classifier for zero-overhead workload characterization prior to model execution.',
        'Integrated native C++ runtime bindings via Android NDK / JNI to interface directly with quantized LLM execution backends.',
        'Rigorously benchmarked across 720 inference runs on a quantized Qwen2.5 model, proving significant improvements in battery energy efficiency and TTFT latency while preserving response quality.'
      ]
    },
    'modal-synapse': {
      title: 'Synapse AI Tutor — Adaptive AI Tutoring Platform',
      badge: 'PYTHON · FASTAPI · REACT · GRAPHRAG · FAISS · BM25 · NETWORKX · JWT',
      overview: 'Synapse AI Tutor is an adaptive learning engine that diagnoses learner knowledge gaps and tailors domain explanations to individual student proficiency using LLMs and GraphRAG knowledge graphs.',
      architecture: [
        'Built a hybrid retrieval architecture combining FAISS dense vector search, BM25 sparse lexical search, and NetworkX topological knowledge graphs for high-precision LLM context grounding.',
        'Designed automated learner gap identification algorithms that track conceptual mastery and dynamically adjust explanation granularity.',
        'Exposed async FastAPI REST APIs protected by JWT authentication to guarantee complete state isolation across student sessions.',
        'Integrated interactive React frontend components rendering real-time streaming LLM responses and knowledge graph visualizations.'
      ]
    },
    'modal-docchat': {
      title: 'DocChat — Full-Stack RAG Document Q&A Platform',
      badge: 'FASTAPI · REACT · POSTGRESQL · REDIS · JWT · DOCKER',
      overview: 'DocChat is an end-to-end asynchronous document intelligence platform enabling conversational querying of uploaded documentation via an optimized Retrieval-Augmented Generation (RAG) pipeline.',
      architecture: [
        'FastAPI backend providing asynchronous API endpoints for authentication, document parsing, and streaming token response rendering.',
        'JWT-based session security and tenant isolation for user document workspaces.',
        'PostgreSQL relational schema storing document metadata, access controls, and chat history.',
        'Redis caching layer caching vector retrieval hits and frequently queried embeddings to minimize inference latency.'
      ]
    },
    'modal-5g': {
      title: 'Intelligent Cloud-Native 5G Network Slice Orchestrator',
      badge: 'PYTHON · KUBERNETES · OPEN5GS · UERANSIM · PROMETHEUS · GRAFANA',
      overview: 'A Kubernetes-native 5G slicing testbed simulating eMBB, URLLC, and mMTC network service classes dynamically. Research under peer review.',
      architecture: [
        'Kubernetes container orchestration managing core network NFs (AMF, SMF, UPF) powered by Open5GS.',
        'UERANSIM gNodeB and UE simulators generating realistic 5G control plane and user plane traffic.',
        'Automated Python monitoring pipeline querying Prometheus metrics in real-time to compute slice QoS guarantees and adjust Pod resources dynamically via Kubernetes APIs.'
      ]
    }
  };

  function openModal(modalKey) {
    const data = PROJECT_DETAILS[modalKey];
    if (!data) return;

    modalBody.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;color:var(--gold-accent);letter-spacing:0.08em;margin-bottom:10px;">
        ${data.badge}
      </div>
      <h2 style="font-family:var(--font-display);font-size:1.8rem;font-weight:800;line-height:1.2;margin-bottom:20px;color:var(--text-dark);">
        ${data.title}
      </h2>
      <p style="font-size:1rem;color:var(--text-dark);line-height:1.65;margin-bottom:24px;">
        ${data.overview}
      </p>
      <div style="background:var(--bg-cream-dark);border-left:4px solid var(--gold-accent);padding:20px;border-radius:0 4px 4px 0;">
        <h4 style="font-family:var(--font-display);font-size:1rem;font-weight:800;margin-bottom:12px;color:var(--text-dark);">
          SYSTEM ARCHITECTURE &amp; HIGHLIGHTS:
        </h4>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
          ${data.architecture.map(item => `<li style="font-size:0.92rem;line-height:1.6;color:var(--text-dark);"><strong style="color:var(--gold-accent);">▸</strong> ${item}</li>`).join('')}
        </ul>
      </div>
    `;

    modalOverlay.setAttribute('aria-hidden', 'false');
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal]').forEach(card => {
    card.addEventListener('click', (e) => {
      const modalKey = card.getAttribute('data-modal');
      openModal(modalKey);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  /* --------------------------------------------------------
     3. Smooth Scroll Navigation Offset
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = 70;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
});
