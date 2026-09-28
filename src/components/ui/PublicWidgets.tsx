'use client';

import { usePathname } from 'next/navigation';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';
import KpnChatbot from './KpnChatbot';
import ScrollQuoteModal from './ScrollQuoteModal';
import BrochureDownloadModal from './BrochureDownloadModal';
import FloatingActionBar from './FloatingActionBar';

export default function PublicWidgets() {
  const pathname = usePathname();

  // Do not render public chatbot, WhatsApp button, or modal popups inside Admin panel
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <WhatsAppFloatingButton />
      <KpnChatbot />
      <ScrollQuoteModal />
      <BrochureDownloadModal />
      <FloatingActionBar />
    </>
  );
}


