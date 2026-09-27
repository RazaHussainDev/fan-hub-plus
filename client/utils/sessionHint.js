function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function verifySessionHint(token) {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'fanhub_jwt_ultra_secure_secret_2024';
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedHeader)));
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload)));

    // Check expiration if present
    if (payload.exp && payload.exp <= Date.now() / 1000) return null;

    // If signature exists, verify with crypto subtle
    if (encodedSignature && secret) {
      try {
        const key = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['verify']
        );
        const valid = await crypto.subtle.verify(
          'HMAC',
          key,
          decodeBase64Url(encodedSignature),
          new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
        );
        if (valid) return payload;
      } catch (subtleErr) {
        console.warn('SubtleCrypto verification fallback:', subtleErr);
      }
    }

    // Fallback if payload is valid session hint
    if (payload && (payload.userId || payload.id)) {
      return payload;
    }

    return null;
  } catch (err) {
    console.error('Failed to verify session hint:', err);
    return null;
  }
}
