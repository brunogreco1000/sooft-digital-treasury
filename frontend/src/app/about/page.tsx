// frontend/app/about/page.tsx
export default function AboutPage() {
  return (
    <section className="max-w-6xl mx-auto mt-12 px-6 text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Acerca de SOOFT Digital Treasury
      </h1>

      <div className="space-y-6 text-lg leading-relaxed">
        <p>
          <strong className="text-white">SOOFT Digital Treasury</strong> es una plataforma B2B diseñada para 
          transformar la gestión financiera de las empresas. Ofrecemos un entorno 
          seguro, eficiente y centralizado para administrar el flujo de caja, pagos, 
          conciliaciones, transferencias e inversiones en tiempo real.
        </p>

        <p>
          Nuestra solución combina automatización, análisis financiero y trazabilidad 
          completa, eliminando la dependencia de hojas de cálculo y reduciendo los 
          riesgos operativos. Con dashboards inteligentes y flujos de trabajo dinámicos, 
          brindamos a los equipos de tesorería una visión 360° de su liquidez y riesgos.
        </p>

        <p className="text-white font-semibold">
          Funcionalidades clave:
        </p>

        <ul className="list-disc pl-8 space-y-2">
          <li>Gestión de flujo de caja y proyecciones de tesorería.</li>
          <li>Control automatizado de pagos, intereses y liquidaciones.</li>
          <li>Integración con ERP y sistemas contables (SAP, Oracle, entre otros).</li>
          <li>Valoraciones, análisis de riesgos y cumplimiento bajo normas IFRS.</li>
          <li>Exportación de reportes en PDF y Excel para auditorías y seguimiento.</li>
          <li>Seguridad avanzada con autenticación JWT y cookies HTTP-only.</li>
        </ul>

        <p>
          Nuestro equipo está conformado por especialistas en desarrollo 
          <strong className="text-white"> front-end</strong> y 
          <strong className="text-white"> back-end</strong>, con experiencia en 
          <em> tecnologías modernas</em> como Next.js, NestJS y MongoDB. Aplicamos 
          metodologías ágiles para garantizar un producto escalable, adaptable y 
          alineado con las necesidades financieras de cada cliente.
        </p>

        <p>
          <strong className="text-white">SOOFT Digital Treasury</strong> no solo es una herramienta de gestión, 
          es un aliado estratégico para la transformación digital de las áreas financieras. 
          Nuestro compromiso es ofrecer visibilidad, control y confianza en cada decisión 
          financiera.
        </p>
      </div>
    </section>
  );
}
