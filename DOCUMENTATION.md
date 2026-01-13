# Documentazione Tecnica - WebTech's MemeMuseum

<table>
  <tr>
    <td width="92">
      <img src="assets/logo-federico-II.svg" alt="Unina Logo" width="92"/>
    </td>
    <td>
      <strong>Corso:</strong> Tecnologie Web @ Università degli studi di Napoli Federico II (UNINA)<br />
      <strong>Traccia:</strong> B - WebTech's MemeMuseum<br />
      <strong>Studente:</strong> Oreste Leone N86/1980
    </td>
  </tr>
</table>

## 1. Descrizione del Progetto

**MemeMuseum** è una Single Page Application (SPA) per la condivisione di meme. Supporta navigazione pubblica e interazioni (upload, voti, commenti) per utenti autenticati.
L'architettura separa rigorosamente **Frontend** (React) e **Backend** (Express REST API), orchestrati via **Docker Compose** per garantire un ambiente riproducibile.

## 2. Tecnologie Utilizzate

### Backend (`/backend`)

* **Node.js (v24 LTS) & Express.js:** Runtime e framework per API REST veloci e scalabili.
* **SQLite:** Database relazionale su file (zero-config) persistito via Docker Volume.
* **Prisma ORM:** Accesso al database type-safe con gestione automatica delle migrazioni.
* **Multer:** Middleware per la gestione dell'upload di immagini (salvate localmente).
* **JWT (JSON Web Tokens) & bcryptjs:** Autenticazione stateless sicura e hashing delle password.

### Frontend (`/frontend`)

* **React (v18) + Vite:** Libreria UI a componenti e build tool di nuova generazione (HMR istantaneo).
* **TypeScript:** Linguaggio tipizzato utilizzato nell'intero stack per robustezza e manutenibilità.
* **Tailwind CSS + DaisyUI:** Utility-first CSS framework con componenti UI pre-stilizzati.
* **React Query (TanStack Query):** Gestione ottimizzata dello stato e recupero dati asincroni su cui basare i componenti React.
* **Context API:** Gestione dello stato globale client (es. sessione utente/Auth) per evitare "prop drilling".
* **Axios:** Client HTTP per le chiamate API REST.
* **React Router:** Gestione del routing client-side.

### Infrastruttura & Testing

* **Docker & Docker Compose:** Containerizzazione dei servizi (Frontend, Backend) e gestione volumi.
* **Nginx:** Web server leggero per servire i file statici del frontend in produzione.
* **Cypress:** Framework per test End-to-End automatizzati.
