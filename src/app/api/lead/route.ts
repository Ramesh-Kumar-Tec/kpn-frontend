import { NextResponse } from 'next/server';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name = '', phone = '', project = '', date = '', notes = '' } = body || {};

    if (typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const normalizedPhone = phone.trim().slice(0, 50);
    const normalizedName = typeof name === 'string' ? name.trim().slice(0, 150) : '';
    const normalizedProject = typeof project === 'string' ? project.trim().slice(0, 150) : '';
    const normalizedDate = typeof date === 'string' ? date.trim().slice(0, 40) : '';
    const normalizedNotes = typeof notes === 'string' ? notes.trim().slice(0, 1000) : '';

    // Persist the chatbot lead in the same CRM used by the public forms.
    // This keeps chatbot enquiries visible to the sales team in /admin/enquiries.
    const crmResponse = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: normalizedName || 'Prospective Buyer',
        phone: normalizedPhone,
        projectName: normalizedProject || 'General Inquiry',
        message: [
          'Requested through KPN chatbot.',
          normalizedDate ? `Preferred date: ${normalizedDate}.` : '',
          normalizedNotes,
        ].filter(Boolean).join(' '),
        source: 'Chatbot',
        status: 'New',
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!crmResponse.ok) {
      const detail = await crmResponse.text().catch(() => '');
      console.error('[Chatbot Lead] CRM rejected lead:', crmResponse.status, detail.slice(0, 500));
      return NextResponse.json(
        { error: 'We could not save your enquiry. Please call or WhatsApp our advisor directly.' },
        { status: 502 }
      );
    }

    // Prepare WhatsApp direct link for the lead
    const message = encodeURIComponent(
      `*New Site Visit / Lead Inquiry from Website Chatbot*\n\n` +
      `👤 *Name*: ${normalizedName || 'Prospective Buyer'}\n` +
      `📞 *Phone*: ${normalizedPhone}\n` +
      `🏢 *Project*: ${normalizedProject || 'General Inquiry'}\n` +
      `📅 *Preferred Date*: ${normalizedDate || 'Flexible'}\n` +
      `💬 *Notes*: ${normalizedNotes || 'Requested assistance via AI Chatbot'}`
    );

    const whatsappUrl = `https://api.whatsapp.com/send?phone=918925924128&text=${message}`;

    console.log('[New Chatbot Lead Captured]:', {
      name: normalizedName,
      phoneLast4: normalizedPhone.slice(-4),
      project: normalizedProject,
      date: normalizedDate,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Our property advisory team will call you shortly.',
      whatsappUrl,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
  }
}
