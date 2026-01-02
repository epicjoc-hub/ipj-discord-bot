require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  ADMIN_ROLE_ID: "1179052940351246357",
  PANEL_CHANNEL_ID: "1455043025817440306",
  GUILD_ID: "1162871509275119637",
  GRADES: [
    "AGENT",
    "AGENT-PRINCIPAL",
    "AGENT-SEF-ADJUNCT",
    "AGENT-SEF-PRINCIPAL",
    "INSPECTOR",
    "INSPECTOR-PRINCIPAL",
    "SUB-COMISAR",
    "COMISAR",
    "COMISAR-SEF"
  ],
  SITE_URL: process.env.SITE_URL || "https://ipj-ls-pr-bzone.vercel.app"
};
