/*
comando para marca geral do gp
by voidh7
*/


const { BOT_NUMBER, PREFIX } = require(`${BASE_DIR}/config`);
const { toUserJid } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "aviso",
  description: "Envia um aviso marcando todos os membros individualmente",
  commands: ["aviso", "alerta", "tagall"],
  usage: `${PREFIX}aviso Texto do aviso aqui`,
  handle: async ({ args, socket, remoteJid, userJid, sendReply, sendSuccessReact }) => {
    if (!args.length) {
      return sendReply("Você precisa escrever o texto do aviso!");
    }

    const textoAviso = args.join(" ");

   
    const group = await socket.groupMetadata(remoteJid);
    const participants = group.participants.map(p => p.id);

   
    const botJid = toUserJid(BOT_NUMBER);
    const membersToMention = participants.filter(jid => jid !== botJid && jid !== userJid);

    if (!membersToMention.length) {
      return sendReply("Não há membros para mencionar!");
    }

    
    let mensagem = textoAviso + "\n\n";
    for (const jid of membersToMention) {
      mensagem += `@${jid.split("@")[0]} `;
    }

   
    await socket.sendMessage(remoteJid, {
      text: mensagem,
      mentions: membersToMention,
    });

    await sendSuccessReact();
    await sendReply("Aviso enviado marcando cada membro individualmente!");
  },
};