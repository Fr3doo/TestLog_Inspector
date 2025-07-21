import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy vers l’API NestJS
 * ----------------------
 * Évite les problèmes CORS en production : le front appelle simplement
 * /api/analyze et Next.js relaie la requête vers NEXT_PUBLIC_API_URL/analyze.
 *
 * • Fonctionne uniquement pour la méthode POST (upload multipart).
 * • Ne fait AUCUNE transformation : passe le FormData tel quel.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

export async function POST(req: NextRequest) {
  // Clone le body FormData (Node runtime requis, pas edge)
  const formData = await req.formData();

  const upstream = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  // On renvoie la réponse brute (json ou text)
  const headers = new Headers(upstream.headers);
  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

/** Utilise le runtime Node.js (FormData non supportée en Edge) */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Force le rechargement à chaque requête
export const preferredRegion = 'europe'; // Priorise l'Europe pour la latence