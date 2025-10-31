// frontend/components/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white mt-auto">
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-sm">
          &copy; {year} SOOFT Digital Treasury. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
