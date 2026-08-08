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
    'modal-docchat': {
      title: 'DocChat — Full-Stack RAG Document Q&A Platform',
      badge: 'FASTAPI · REACT · POSTGRESQL · REDIS · JWT · DOCKER',
      overview: 'DocChat is an end-to-end asynchronous document Q&A platform. Users can upload heterogeneous PDF/text documents and engage in context-aware conversational search via vector embeddings and RAG pipelines.',
      architecture: [
        'FastAPI backend providing asynchronous API endpoints for authentication, file uploads, and stream-based LLM response handling.',
        'React single-page frontend delivering instant streaming token rendering and interactive document previews.',
        'JWT-based stateful/stateless session security for granular user document workspace isolation.',
        'PostgreSQL relational schema storing metadata, access controls, and chat history.',
        'Redis caching layer caching vector retrieval hits and frequently queried embeddings to reduce processing latency.',
        'Full containerization with Docker Compose for seamless local development and production static/cloud deployment.'
      ]
    },
    'modal-dataforge': {
      title: 'DataForge — Enterprise Data Pipeline Orchestrator',
      badge: 'FASTAPI · APACHE SPARK · MINIO · POSTGRESQL · DOCKER',
      overview: 'DataForge is a high-throughput data ingestion and distributed ETL pipeline orchestration platform designed for enterprise data cleaning, aggregation, and analytical data transformation.',
      architecture: [
        'PySpark / Apache Spark execution engine executing distributed transformations on high-volume structured datasets.',
        'MinIO S3-compatible object storage handling raw dataset uploads and processed parquet/delta output artifacts.',
        'PostgreSQL metadata database tracking job execution status, transformation lineage, and workflow schema definitions.',
        'FastAPI API server exposing REST interfaces to schedule, trigger, and monitor ETL pipeline runs asynchronously.',
        'Docker container topology encapsulating Spark worker nodes, API gateway, and storage clusters.'
      ]
    },
    'modal-5g': {
      title: 'Intelligent Cloud-Native 5G Network Slice Orchestration',
      badge: 'PYTHON · KUBERNETES · OPEN5GS · UERANSIM · PROMETHEUS · GRAFANA',
      overview: 'A Kubernetes-native 5G slicing testbed simulating enhanced Mobile Broadband (eMBB), Ultra-Reliable Low-Latency Communication (URLLC), and massive Machine-Type Communication (mMTC) traffic classes. Research under peer review.',
      architecture: [
        'Kubernetes container orchestration managing core network NFs (AMF, SMF, UPF) powered by Open5GS.',
        'UERANSIM gNodeB and UE simulators generating realistic 5G control and user plane traffic.',
        'Automated Python monitoring pipeline querying Prometheus metrics in real-time to compute slice QoS guarantees.',
        'Dynamic resource allocation engine utilizing Kubernetes APIs to dynamically resize Pod CPU limits and network bandwidth bandwidth based on demand spikes.',
        'Grafana dashboard suite visualizing live latency, packet loss, throughput, and CPU metrics across network slices.'
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
