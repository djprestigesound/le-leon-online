/**
 * Script de migration de base de données
 * Exécute les migrations SQL sur Vercel Postgres
 */

const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  console.log('🚀 Démarrage des migrations...\n');

  const migrationsDir = path.join(__dirname, '../lib/db/migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;

    console.log(`📄 Exécution de ${file}...`);

    const filePath = path.join(migrationsDir, file);
    const migration = fs.readFileSync(filePath, 'utf8');

    try {
      const client = await sql.connect();
      await client.query(migration);
      client.release();
      console.log(`✅ ${file} exécuté avec succès\n`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'exécution de ${file}:`);
      console.error(error.message);
      process.exit(1);
    }
  }

  console.log('✨ Toutes les migrations ont été exécutées avec succès !');
  process.exit(0);
}

runMigrations();
