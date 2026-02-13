export function calculateLove(name1: string, name2: string): number {
  const combined = (name1.trim().toLowerCase() + name2.trim().toLowerCase()).split('').sort().join('');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 101);
}

export function getLoveMessage(score: number): string {
  if (score >= 90) return "A love written in the stars! ✨ Your souls are destined to be together forever.";
  if (score >= 75) return "Deep and passionate love! 🌹 Your hearts beat as one.";
  if (score >= 60) return "A beautiful connection! 💕 Nurture it and watch it bloom.";
  if (score >= 45) return "There's a spark between you two! 🔥 Fan the flames of love.";
  if (score >= 30) return "A gentle beginning... 🌸 Every great love starts somewhere.";
  if (score >= 15) return "The universe works in mysterious ways... 🌙 Give it time.";
  return "Opposites can attract! 💫 Sometimes the unexpected creates magic.";
}

export const loveQuotes = [
  "\"The best thing to hold onto in life is each other.\" — Audrey Hepburn",
  "\"I have waited for this opportunity for more than half a century, to repeat to you once again my vow of eternal fidelity and everlasting love.\" — Gabriel García Márquez",
  "\"Whatever our souls are made of, his and mine are the same.\" — Emily Brontë",
  "\"I am who I am because of you. You are every reason, every hope, and every dream I've ever had.\" — Nicholas Sparks",
  "\"In all the world, there is no heart for me like yours.\" — Maya Angelou",
  "\"I loved her against reason, against promise, against peace, against hope, against happiness.\" — Charles Dickens",
  "\"You know you're in love when you can't fall asleep because reality is finally better than your dreams.\" — Dr. Seuss",
  "\"Love is composed of a single soul inhabiting two bodies.\" — Aristotle",
  "\"To love and be loved is to feel the sun from both sides.\" — David Viscott",
  "\"I would rather spend one lifetime with you, than face all the ages of this world alone.\" — J.R.R. Tolkien",
];
