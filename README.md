# SOOFT Digital Treasury

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js)](https://nextjs.org/)  
[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://reactjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-green?logo=tailwind-css)](https://tailwindcss.com/)

Aplicación de tesorería digital B2B desarrollada con **Next.js (Frontend)** y **NestJS + MongoDB (Backend)**.  

Permite a las empresas gestionar su flujo de dinero, conciliaciones, pagos, transferencias e inversiones de forma segura y eficiente.

---

## 📌 Stack

**Frontend:**
- Next.js 16 (App Router, TypeScript)  
- Tailwind CSS 4  
- React Hook Form + Zod (validaciones de formularios)  
- Axios (con `withCredentials: true`)  
- jsPDF / xlsx / file-saver (export PDF / Excel)  
- Shadcn-UI, Headless UI, FontAwesome, Lucide-React  
- Framer Motion (animaciones)  
- Chart.js / Recharts (gráficos y estadísticas)  
- React-Toastify (notificaciones)

**Backend:**
- NestJS  
- MongoDB Atlas  
- Axios (para llamadas internas, si aplica)  
- Cookie-Parser (HTTP-only cookies para auth)  
- JWT para autenticación

---

## 📁 Estructura del proyecto (Frontend)

frontend/
├── .env.local
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── public/
├── .next/
├── src/
│ └── app/
│ ├── about/
│ ├── auth/google/callback/
│ ├── cash-flow/
│ ├── contact/
│ ├── dashboard/
│ ├── login/
│ ├── payments/
│ ├── profile/
│ ├── register/
│ ├── reports/
│ ├── risk/
│ ├── transfers/
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── components/
├── context/
│ ├── AuthContext.tsx
│ ├── DashboardContext.tsx
│ ├── PaymentsContext.tsx
│ ├── PortfolioContext.tsx
│ ├── RiskContext.tsx
│ └── TransfersContext.tsx
├── forms/
│ ├── PaymentForm.tsx
│ ├── PortfolioForm.tsx
│ ├── ProfileForm.tsx
│ ├── ReportForm.tsx
│ ├── RiskForm.tsx
│ └── TransferForm.tsx
├── layout/
│ ├── Footer.tsx
│ ├── Header.tsx
│ ├── Navbar.tsx
│ └── Sidebar.tsx
├── services/
│ ├── authService.ts
│ ├── axios.ts
│ ├── paymentsService.ts
│ ├── portfolioService.ts
│ ├── reportsService.ts
│ ├── riskService.ts
│ └── transfersService.ts
└── ui/
├── Alert.tsx
├── Badge.tsx
├── Button.tsx
├── Card.tsx
├── Chart.tsx
├── InputField.tsx
├── Loader.tsx
├── Modal.tsx
└── Table.tsx

markdown
Copy code

---

## 📝 Notas importantes

- El commit **“Actualizacion de transferencias y tabla UI”** refactorizó el módulo de transferencias:  
  - Nueva tabla de transferencias (`Table.tsx` en `/ui`)  
  - Formularios actualizados (`TransferForm.tsx`, `PaymentForm.tsx`, etc.)  
  - Contextos globales para manejar datos (`TransfersContext.tsx`)  
  - Layout renovado (`Navbar.tsx`, `Sidebar.tsx`)  
  - Integración con servicios (`transfersService.ts` y otros)

- Arquitectura **componentizada y escalable**, separando:  
  - **UI base** (`/ui`)  
  - **Formularios** (`/forms`)  
  - **Servicios** (`/services`)  
  - **Contextos globales** (`/context`)  
  - **Rutas y páginas** (`/src/app`)  

- Compatible con **Next.js App Router**, React 19 y TypeScript 5, usando patrones modernos de desarrollo y  y buenas prácticas de frontend.