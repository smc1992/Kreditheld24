/**
 * Evolution API Client Library
 * Handles all communication with the self-hosted Evolution API for WhatsApp integration
 */

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://evolution.kreditheld24.de';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'kreditheld24';

interface EvolutionResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

async function evolutionFetch(path: string, options: RequestInit = {}): Promise<EvolutionResponse> {
  const url = `${EVOLUTION_API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Evolution API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ============================================
// Instance Management
// ============================================

export async function getInstanceStatus() {
  return evolutionFetch(`/instance/connectionState/${INSTANCE_NAME}`);
}

export async function getInstanceInfo() {
  return evolutionFetch(`/instance/fetchInstances?instanceName=${INSTANCE_NAME}`);
}

export async function getQRCode() {
  return evolutionFetch(`/instance/connect/${INSTANCE_NAME}`);
}

export async function logoutInstance() {
  return evolutionFetch(`/instance/logout/${INSTANCE_NAME}`, { method: 'DELETE' });
}

export async function restartInstance() {
  return evolutionFetch(`/instance/restart/${INSTANCE_NAME}`, { method: 'PUT' });
}

// ============================================
// Messaging
// ============================================

export async function sendTextMessage(remoteJid: string, text: string, quoted?: any) {
  const body: any = {
    number: remoteJid.replace('@s.whatsapp.net', ''),
    text,
  };
  if (quoted) {
    body.options = { quoted };
  }
  return evolutionFetch(`/message/sendText/${INSTANCE_NAME}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function sendMediaMessage(remoteJid: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'video' | 'audio' | 'document' = 'image', quoted?: any) {
  const body: any = {
    number: remoteJid.replace('@s.whatsapp.net', ''),
    mediatype: mediaType,
    media: mediaUrl,
    caption: caption || '',
  };
  if (quoted) {
    body.options = { quoted };
  }
  return evolutionFetch(`/message/sendMedia/${INSTANCE_NAME}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function sendWhatsAppAudio(remoteJid: string, base64Audio: string, quoted?: any) {
  const body: any = {
    number: remoteJid.replace('@s.whatsapp.net', ''),
    audio: base64Audio,
  };
  if (quoted) {
    body.options = { quoted };
  }
  return evolutionFetch(`/message/sendWhatsAppAudio/${INSTANCE_NAME}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteMessageForEveryone(remoteJid: string, messageId: string, isFromMe: boolean = true) {
  return evolutionFetch(`/chat/deleteMessageForEveryone/${INSTANCE_NAME}`, {
    method: 'DELETE',
    body: JSON.stringify({
      number: remoteJid.replace('@s.whatsapp.net', ''),
      messageId: messageId,
    }),
  });
}

// ============================================
// Contacts
// ============================================

export async function getProfilePicture(remoteJid: string) {
  try {
    const result = await evolutionFetch(`/chat/fetchProfilePictureUrl/${INSTANCE_NAME}`, {
      method: 'POST',
      body: JSON.stringify({ number: remoteJid.replace('@s.whatsapp.net', '') }),
    });
    return result?.profilePictureUrl || null;
  } catch {
    return null;
  }
}

export async function checkWhatsAppNumber(phoneNumber: string) {
  return evolutionFetch(`/chat/whatsappNumbers/${INSTANCE_NAME}`, {
    method: 'POST',
    body: JSON.stringify({ numbers: [phoneNumber] }),
  });
}

// ============================================
// Chat Management  
// ============================================

export async function markMessageAsRead(remoteJid: string, messageId: string) {
  return evolutionFetch(`/chat/markMessageAsRead/${INSTANCE_NAME}`, {
    method: 'PUT',
    body: JSON.stringify({
      readMessages: [{ remoteJid, id: messageId }],
    }),
  });
}

export async function fetchMessages(remoteJid: string, count: number = 50) {
  return evolutionFetch(`/chat/findMessages/${INSTANCE_NAME}`, {
    method: 'POST',
    body: JSON.stringify({
      where: { key: { remoteJid } },
      limit: count,
    }),
  });
}

export async function fetchAllContacts() {
  return evolutionFetch(`/chat/findContacts/${INSTANCE_NAME}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function fetchAllChats() {
  return evolutionFetch(`/chat/findChats/${INSTANCE_NAME}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

// ============================================
// Helpers
// ============================================

export function cleanPhoneNumber(jid: string): string {
  return jid.replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@lid', '');
}

export function formatPhoneForDisplay(phone: string): string {
  if (phone.startsWith('49') && phone.length >= 12) {
    return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5)}`;
  }
  return `+${phone}`;
}

export function isGroupJid(jid: string): boolean {
  return jid.endsWith('@g.us');
}

export { EVOLUTION_API_URL, EVOLUTION_API_KEY, INSTANCE_NAME };
