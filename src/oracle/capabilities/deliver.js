'use strict';

function deliver(conversationManager, messenger) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      const context = req.context;

      conversationManager.findConversationByUserId(context.recipient.id)
        .then(conversation => {
            const pageAccessToken = conversation.metadata.page.accessToken;

            const prophecy = {
                recipientId: context.recipient.id,
                message: res.text,
                quickReplies: res.quickreplies,
                context: context,
                metadata: {
                  accessToken: pageAccessToken
                }
            };

            return messenger.deliver(prophecy);
        })
        .then(delivered => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = deliver;
