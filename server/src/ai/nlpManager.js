const { NlpManager } = require('node-nlp');
const path = require('path');
const Movie = require('../models/Movie');
const FandomContent = require('../models/FandomContent');

const manager = new NlpManager({ languages: ['en'], forceNER: true, nlu: { log: false } });

const DEFAULT_GENRES = [
  'action',
  'anime',
  'gaming',
  'scifi',
  'sci-fi',
  'cyberpunk',
  'fantasy',
  'horror',
  'thriller',
  'adventure',
  'comedy',
  'drama',
  'shonen',
  'superhero',
  'mystery',
  'romance',
  'animation',
  'k-pop',
  'comics',
  'manga',
  'cosplay'
];

const DEFAULT_TITLES = [
  'Arcane',
  'Cyberpunk: Edgerunners',
  'Dune',
  'Elden Ring',
  'Jujutsu Kaisen',
  'Attack on Titan',
  'Spider-Man',
  'The Batman',
  'Demon Slayer',
  'Solo Leveling',
  'Interstellar',
  'Breaking Bad',
  'Stranger Things'
];

const trainAI = async () => {
  try {
    // 1. Load massive static corpus
    const corpusPath = path.join(__dirname, 'corpus.json');
    await manager.addCorpus(corpusPath);

    // 2. Dynamic Database Entity Extraction (The Secret Weapon)
    const genres = new Set(DEFAULT_GENRES);
    const titles = new Set(DEFAULT_TITLES);

    try {
      const [movies, fandomItems] = await Promise.all([
        Movie.find().select('title genre genres category').lean(),
        FandomContent.find().select('title category genres fandom').lean()
      ]);

      if (movies && movies.length > 0) {
        movies.forEach(m => {
          if (m.title) titles.add(m.title);
          if (m.genre) genres.add(m.genre.toLowerCase());
          if (Array.isArray(m.genres)) m.genres.forEach(g => genres.add(g.toLowerCase()));
          if (m.category) genres.add(m.category.toLowerCase());
        });
      }

      if (fandomItems && fandomItems.length > 0) {
        fandomItems.forEach(f => {
          if (f.title) titles.add(f.title);
          if (f.category) genres.add(f.category.toLowerCase());
          if (f.fandom) genres.add(f.fandom.toLowerCase());
          if (Array.isArray(f.genres)) f.genres.forEach(g => genres.add(g.toLowerCase()));
        });
      }
    } catch (dbErr) {
      console.warn('DB Entity Fetch Warning (using defaults):', dbErr.message);
    }

    // Train AI to recognize exact movie titles (NER: %movie%)
    titles.forEach(title => {
      manager.addNamedEntityText('movie', title, ['en'], [title.toLowerCase(), title]);
    });

    // Train AI to recognize dynamic genres (NER: %genre%)
    genres.forEach(g => {
      manager.addNamedEntityText('genre', g, ['en'], [g.toLowerCase(), g]);
    });

    // 3. Train and Save
    await manager.train();
    manager.save();
    console.log('✅ Enterprise NLP Brain Trained with DB Entities!');
  } catch (err) {
    console.error('AI Training Error:', err);
  }
};

module.exports = { manager, trainAI };
