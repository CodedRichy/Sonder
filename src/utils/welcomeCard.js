const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');
const path = require('path');

const WIDTH = 900;
const HEIGHT = 300;

async function generateCard(member, type = 'welcome') {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle pattern overlay
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < WIDTH; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, HEIGHT);
    ctx.stroke();
  }

  // Border accent
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);

  // Avatar circle
  const avatarSize = 128;
  const avatarX = 80;
  const avatarY = HEIGHT / 2 - avatarSize / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2);
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.clip();

  try {
    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 256 }));
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  } catch {
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
  }
  ctx.restore();

  // Text
  const textX = avatarX + avatarSize + 50;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(type === 'welcome' ? 'Welcome!' : 'Goodbye!', textX, 100);

  ctx.fillStyle = '#e0e0e0';
  ctx.font = '24px sans-serif';
  const username = member.user.username.length > 20
    ? member.user.username.slice(0, 20) + '...'
    : member.user.username;
  ctx.fillText(username, textX, 145);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '18px sans-serif';
  if (type === 'welcome') {
    ctx.fillText(`Member #${member.guild.memberCount}`, textX, 185);
  } else {
    ctx.fillText(`We'll miss you!`, textX, 185);
  }

  ctx.fillText(member.guild.name, textX, 220);

  const buffer = canvas.toBuffer('image/png');
  return new AttachmentBuilder(buffer, { name: `${type}-card.png` });
}

module.exports = { generateCard };
