const fs = require('fs');
const path = require('path');
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} = require('docx');

const COLOR_GREEN = 'a7c957';
const COLOR_DARK = '0b0f0a';
const COLOR_TEXT = '30352d';
const COLOR_MUTED = '64705d';

const title = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  keepNext: true,
  spacing: { before: 360, after: 160 },
  border: {
    bottom: { color: COLOR_GREEN, space: 5, style: BorderStyle.SINGLE, size: 8 },
  },
  children: [new TextRun({ text, bold: true, color: COLOR_DARK, size: 30 })],
});

const subheading = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  keepNext: true,
  spacing: { before: 220, after: 80 },
  children: [new TextRun({ text, bold: true, color: COLOR_GREEN, size: 24 })],
});

const body = (text, options = {}) => new Paragraph({
  spacing: { after: 150, line: 300 },
  ...options,
  children: [new TextRun({ text, color: COLOR_TEXT, size: 22 })],
});

const bullet = (text) => body(text, {
  bullet: { level: 0 },
  indent: { left: 720, hanging: 360 },
  spacing: { after: 90, line: 280 },
});

const doc = new Document({
  creator: 'Fan Hub Plus',
  title: 'Fan Hub Plus - User Guide',
  subject: 'Official user guide and platform overview',
  description: 'A practical guide to using the Fan Hub Plus entertainment and fandom platform.',
  styles: {
    default: {
      document: {
        run: { font: 'Arial', size: 22, color: COLOR_TEXT },
        paragraph: { spacing: { after: 150, line: 300 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1500, after: 180 },
        children: [new TextRun({ text: 'FAN HUB PLUS', bold: true, color: COLOR_DARK, font: 'Arial', size: 52 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 180 },
        children: [new TextRun({ text: 'OFFICIAL USER GUIDE', bold: true, color: COLOR_GREEN, font: 'Arial', size: 30 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 900 },
        children: [new TextRun({ text: 'Discover stories. Explore fandoms. Build your watchlist.', color: COLOR_MUTED, size: 24, italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: 'A guide to the Fan Hub Plus platform', color: COLOR_DARK, bold: true, size: 24 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 1500 },
        children: [new TextRun({ text: `Prepared ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`, color: COLOR_MUTED, size: 20 })],
      }),

      new Paragraph({ pageBreakBefore: true }),
      title('Welcome to Fan Hub Plus'),
      body('Fan Hub Plus brings movies, series, fandom stories, character profiles, events, merchandise, and soundtracks together in one place. Use this guide to find your way around, save titles, and understand the tools available to community members and administrators.'),

      title('Explore the platform'),
      subheading('Home and Fandom Explorer'),
      body('The home page highlights featured and trending titles. Open Fandom Explorer to browse the content library and narrow results with categories, search, release year, and sorting options. Select a title to see more information or continue to its stream page.'),
      subheading('Community and discovery'),
      body('Use Character Dossiers and Articles to explore fandom knowledge, Events to find conventions and meetups, Audio for soundtracks and related listening, and Merchandise to browse collectibles. The Live Watch Arena provides the platform’s live viewing area.'),
      subheading('Search'),
      body('Open search from the navigation controls to look for movies and TV titles. Search is a modal interaction rather than a separate /search page.'),

      title('Accounts and personal features'),
      subheading('Sign in and registration'),
      body('Create an account or sign in with the available account options, which include Google sign-in. Your account unlocks profile and watchlist features. Some pages may direct you to sign in when a session is required.'),
      subheading('My List and Profile'),
      body('Save titles to My List so they are easier to return to later. Your Profile contains account information and personal settings. Keep your sign-in details private and sign out on shared devices.'),

      title('Streaming and playback'),
      body('Open a title’s stream page from a content card or a watch button. Playback can include third-party video embeds and TV episode selection. Fullscreen controls depend on the selected player and provider; playback availability may vary by title and provider.'),
      body('Fan Hub Plus does not guarantee that every external stream is available at all times. If playback fails, try another listed source when available or return to the title later.', { indent: { left: 360, right: 360 } }),

      title('FanHub AI assistant'),
      body('The floating FanHub AI assistant answers feature questions and can recommend titles. Its backend uses node-nlp for English-language intent processing and searches the MongoDB movie and fandom-content collections for matching recommendations. Recommendations depend on the content currently available in the database.'),

      title('Admin Command Center'),
      body('Administrator pages are restricted to authorized accounts. The Command Center provides overview metrics and an activity chart. Admin tools include content management, submissions, feedback, user management, brand settings, security, and site settings.'),
      bullet('Use Content Engine to manage published titles and fandom content.'),
      bullet('Review community submissions and feedback from their respective sections.'),
      bullet('Use Settings to manage site announcements, maintenance mode, and the custom home hero.'),
      body('Admin access is intended for trusted operators. Review changes before publishing them because settings can affect the experience for all visitors.'),

      title('Technology overview'),
      bullet('Frontend: Next.js App Router, React, Tailwind CSS, and Framer Motion.'),
      bullet('Backend: Node.js and Express REST API.'),
      bullet('Database: MongoDB, accessed through Mongoose models.'),
      bullet('AI assistant: node-nlp with database-assisted movie and fandom recommendations.'),
      bullet('Authentication: Google sign-in and token-based application sessions.'),
      bullet('Admin charts: Recharts.'),

      title('Getting help'),
      body('For account or site issues, use the Feedback page to submit a bug report, suggestion, or question. Include the page name and a short description of what happened so the team can investigate.'),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 420, after: 100 },
        children: [new TextRun({ text: 'FAN HUB PLUS', bold: true, color: COLOR_GREEN, size: 20 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Your Ultimate Fandom Universe', color: COLOR_MUTED, size: 18 })],
      }),
    ],
  }],
});

async function generateDocumentation() {
  const outputPath = path.join(__dirname, 'Fan_Hub_Plus_Documentation.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Documentation generated: ${outputPath}`);
}

generateDocumentation().catch((error) => {
  console.error('Failed to generate Fan Hub Plus documentation:', error);
  process.exitCode = 1;
});
