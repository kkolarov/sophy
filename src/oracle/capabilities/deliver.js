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

            messenger.deliver(prophecy, (err, flag) => {
              if (!err) {
                resolve();
              } else {
                reject(err);
              }
            });
        }).
        catch(err => {
          console.log(err);
        });
    });
  }
}

module.exports = deliver;
