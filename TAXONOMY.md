# Taxonomía y Catálogo de Fuentes - Briefing AI

Esta taxonomía define la estructura oficial de categorías, palabras clave principales, fuentes de referencia y etiquetas para la aplicación **Briefing AI**.

---

## 📊 Matriz de Categorías y Fuentes (9 Ámbitos)

### 1. 🧠 Crecimiento Personal & Psicología
* **ID:** `crecimiento-personal`
* **Palabras Clave Principales:** Sesgos cognitivos, Gestión del tiempo, Comunicación asertiva, Inteligencia emocional, Hábitos atómicos
* **Fuentes y Medios de Referencia:**
  * Psicología y Mente (`psicologiaymente.com`)
  * Psychology Today (`psychologytoday.com`)
  * James Clear Blog (`jamesclear.com`)

### 2. 📈 Finanzas & Inversión
* **ID:** `finanzas`
* **Palabras Clave Principales:** Fondos indexados, Ahorro sistemático, Reducción de deuda, Fiscalidad doméstica, Criptoactivos
* **Fuentes y Medios de Referencia:**
  * Rankia (`rankia.com`)
  * Balio (`balio.app`)
  * Expansión (`expansion.com`)
  * Cinco Días (`cincodias.elpais.com`)
  * CoinDesk (`coindesk.com`)

### 3. ⚡ Tecnología & Innovación
* **ID:** `tecnologia`
* **Palabras Clave Principales:** Automatización, Privacidad digital, Inteligencia artificial, Ciberseguridad, Domótica
* **Fuentes y Medios de Referencia:**
  * Xataka (`xataka.com`)
  * Genbeta (`genbeta.com`)
  * MIT Technology Review (`technologyreview.com`)
  * The Verge (`theverge.com`)
  * TechCrunch (`techcrunch.com`)

### 4. 🍏 Salud & Bienestar
* **ID:** `salud-bienestar`
* **Palabras Clave Principales:** Entrenamiento de fuerza, Meal prep, Higiene del sueño, Ergonomía, Movilidad articular
* **Fuentes y Medios de Referencia:**
  * Examine.com (`examine.com`)
  * Vitónica (`vitonica.com`)
  * PubMed (`pubmed.ncbi.nlm.nih.gov`)
  * ScienceDaily (`sciencedaily.com`)

### 5. 🔬 Ciencia, Historia & Misterio
* **ID:** `ciencia-historia`
* **Palabras Clave Principales:** Civilizaciones antiguas, Exploración espacial, Mitología, Experimentos científicos, Arqueología
* **Fuentes y Medios de Referencia:**
  * National Geographic (`nationalgeographic.com`)
  * Agencia SINC (`agenciasinc.es`)
  * Naukas (`naukas.com`)

### 6. 💼 Negocios & Carrera
* **ID:** `negocios-carrera`
* **Palabras Clave Principales:** Negociación salarial, Marca personal, Trabajo remoto, Emprendimiento digital, Gestión de proyectos
* **Fuentes y Medios de Referencia:**
  * Harvard Business Review (`hbr.org`)
  * Fast Company (`fastcompany.com`)
  * Inc. (`inc.com`)
  * HubSpot Blog (`blog.hubspot.com`)

### 7. 🎨 Creatividad & Diseño
* **ID:** `creatividad-diseno`
* **Palabras Clave Principales:** Storytelling, Fotografía digital, Identidad visual, Edición de vídeo, DIY
* **Fuentes y Medios de Referencia:**
  * Domestika Blog (`domestika.org`)
  * Behance (`behance.net`)
  * PetaPixel (`petapixel.com`)
  * Creative Bloq (`creativebloq.com`)

### 8. 🏛️ Política & Geopolítica
* **ID:** `politica`
* **Palabras Clave Principales:** Conflictos internacionales, Elecciones, Geopolítica energética, Economía política, Diplomacia
* **Fuentes y Medios de Referencia:**
  * El Orden Mundial (`elordenmundial.com`)
  * Foreign Affairs (`foreignaffairs.com`)
  * Politico (`politico.com`)
  * Real Instituto Elcano (`realinstitutoelcano.org`)

### 9. 🏆 Deportes & Competición
* **ID:** `deportes-competicion`
* **Palabras Clave Principales:** Fútbol internacional, Baloncesto (NBA/Euroliga), Deportes de motor, Polideportivo, Rendimiento
* **Fuentes y Medios de Referencia:**
  * The Athletic (`theathletic.com`)
  * Marca (`marca.com`)
  * Diario AS (`as.com`)
  * Bleacher Report (`bleacherreport.com`)
  * Panenka (`panenka.org`)

---

## 🚀 Hoja de Ruta para la Evolución / Entrenamiento de la App

1. **Auto-merge Dinámico:** Al iniciar la app, el motor `storageService` sincroniza automáticamente nuevas categorías agregadas en el código sin perder las preferencias que el usuario ya haya ajustado en localStorage.
2. **Sistema de Puntuación (Scoring):** La ingesta de noticias evalúa el peso semántico de los titulares y resúmenes frente a las palabras clave del usuario (+20 pts coincidencia tag, +10 pts en título, +5 pts fuente oficial).
3. **Fase Futura (Ingesta Real via RSS / APIs):** Integración directa con los feeds RSS de cada dominio acreditado para filtrado en tiempo real.
