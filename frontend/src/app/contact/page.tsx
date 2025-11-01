// frontend/app/contact/page.tsx
'use client';

import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

export default function ContactPage() {
  return (
    <section className="max-w-4xl mx-auto mt-16 px-4 py-8 shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center text-white">Contáctanos</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Para consultas comerciales, soporte o información sobre nuestra plataforma de tesorería digital,
        comuníquese con nuestro equipo corporativo.
      </p>

      <div className="flex flex-col md:flex-row justify-around gap-8">
        {/* Email */}
        <div className="flex items-center gap-4">
          <HiOutlineMail className="text-blue-600 w-8 h-8" />
          <div>
            <p className="font-semibold text-gray-800 text-white">Soporte</p>
            <a href="mailto:soporte@sooft.com" className="text-blue-600 hover:underline">
              soporte@sooft.com
            </a>
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex items-center gap-4">
          <HiOutlinePhone className="text-green-600 w-8 h-8" />
          <div>
            <p className="font-semibold text-gray-800 text-white">Teléfono</p>
            <a href="tel:+541112345678" className="text-blue-600 hover:underline">
              +54 11 1234-5678
            </a>
            <p className="text-sm text-gray-500">Lunes a Viernes, 9:00 – 18:00</p>
          </div>
        </div>
      </div>

      <p className="mt-12 text-center text-gray-500 text-sm">
        © 2025 SOOFT Digital Treasury. Todos los derechos reservados.
      </p>
    </section>
  );
}
