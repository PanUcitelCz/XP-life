// +server.ts (pro SvelteKit 5)
import { usersTable } from '$lib/db/schema';
import { db } from '$lib/db'; // Připojení k databázi
import { writeFileSync, mkdirSync } from 'fs';
import { eq } from 'drizzle-orm/expressions'; // Import eq funkce pro porovnání sloupců
import { resolve } from 'path'; // Pro dynamické generování cest

export const POST = async ({ request }) => {
  const data = await request.formData();
  const profileImage = data.get('profileImage');

  if (!profileImage || typeof profileImage === 'string') {
    return new Response('Invalid file', { status: 400 });
  }

  // Vygenerování náhodného názvu souboru pomocí timestampu a náhodného čísla
  const randomString = Date.now().toString() + Math.floor(Math.random() * 10000).toString();
  const filename = `${randomString}.jpg`;

  // Dynamická cesta k ukládání souboru mimo složku static
  const uploadDir = resolve('uploads');
  const filepath = resolve(uploadDir, filename);

  // Vytvoření složky uploads, pokud neexistuje
  mkdirSync(uploadDir, { recursive: true });

  // Uložení souboru
  const arrayBuffer = await profileImage.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  writeFileSync(filepath, buffer);

  // Aktualizace databáze (změnit userId na aktuální uživatelské ID)
  const userId = 1; // Toto by mělo být získáno z aktuální relace
  await db.update(usersTable).set({
    profileImage: `/uploads/${filename}`
  }).where(eq(usersTable.id, userId)); // Použití eq pro porovnání sloupce

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
