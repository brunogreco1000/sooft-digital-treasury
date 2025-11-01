'use client';

import { PaymentsProvider } from '../../../context/PaymentsContext';
import PaymentsPageContent from './PaymentsPageContent';

export default function PaymentsPage() {
  return (
    <PaymentsProvider>
      <PaymentsPageContent />
    </PaymentsProvider>
  );
}
