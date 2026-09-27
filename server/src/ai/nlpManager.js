const { NlpManager } = require('node-nlp');

// Initialize manager. We use 'en' as base but will feed it Roman Urdu too.
const manager = new NlpManager({ languages: ['en'], forceNER: true });

// Intent: Greetings
manager.addDocument('en', 'hello', 'greeting');
manager.addDocument('en', 'hi', 'greeting');
manager.addDocument('en', 'hey', 'greeting');
manager.addDocument('en', 'salam', 'greeting');
manager.addDocument('en', 'assalam o alaikum', 'greeting');
manager.addDocument('en', 'kya haal hai', 'greeting');
manager.addDocument('en', 'kaise ho', 'greeting');
manager.addDocument('en', 'kese ho', 'greeting');
manager.addAnswer('en', 'greeting', 'Hi there! 👋 I am FanHub AI. Kaise madad kar sakta hu aapki?');
manager.addAnswer('en', 'greeting', 'Hello! Welcome to FanHub Plus. What would you like to watch today?');
manager.addAnswer('en', 'greeting', 'Walaikum Assalam! Welcome to the Fandom Universe. Kaise hain aap?');

// Intent: Trending Movies
manager.addDocument('en', 'whats trending', 'movie.trending');
manager.addDocument('en', 'show me trending movies', 'movie.trending');
manager.addDocument('en', 'trending', 'movie.trending');
manager.addDocument('en', 'aaj kya dekhu', 'movie.trending');
manager.addDocument('en', 'top movies dikhao', 'movie.trending');
manager.addDocument('en', 'naya kya hai', 'movie.trending');
manager.addDocument('en', 'trending shows', 'movie.trending');
// Note: We append a special action tag to trigger the UI cards later
manager.addAnswer('en', 'movie.trending', 'Here are the latest trending movies on FanHub! 🍿||ACTION:FETCH_TRENDING');

// Intent: Recommendations
manager.addDocument('en', 'recommend something', 'movie.recommend');
manager.addDocument('en', 'movie recommendation', 'movie.recommend');
manager.addDocument('en', 'kuch acha batao', 'movie.recommend');
manager.addDocument('en', 'koi achi movie batao', 'movie.recommend');
manager.addDocument('en', 'anime recommend karo', 'movie.recommend');
manager.addDocument('en', 'content recommendations', 'movie.recommend');
manager.addAnswer('en', 'movie.recommend', 'Looking for recommendations? Tell me your favorite genre or check out trending anime and movies in our Fandom Explorer!||ACTION:FETCH_TRENDING');

// Intent: Help/Features
manager.addDocument('en', 'help', 'agent.help');
manager.addDocument('en', 'help with features', 'agent.help');
manager.addDocument('en', 'what can you do', 'agent.help');
manager.addDocument('en', 'features', 'agent.help');
manager.addDocument('en', 'tum kya kar sakte ho', 'agent.help');
manager.addDocument('en', 'yeh website kya hai', 'agent.help');
manager.addAnswer('en', 'agent.help', 'I can recommend movies, show you what is trending, and help you navigate FanHub. Bas apni pasand batayein!');

// Function to train and save the model
const trainAI = async () => {
  try {
    await manager.train();
    manager.save();
    console.log('✅ FanHub AI Brain trained successfully!');
  } catch (err) {
    console.error('AI Training Error:', err.message);
  }
};

module.exports = { manager, trainAI };
