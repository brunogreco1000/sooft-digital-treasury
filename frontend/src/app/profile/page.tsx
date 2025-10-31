'use client';
import ProfileForm from '../../../components/forms/ProfileForm';

export default function ProfilePage() {
  return (
    <section className="mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Perfil</h1>
      <ProfileForm />
    </section>
  );
}
