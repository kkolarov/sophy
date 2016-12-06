const TextReply = require('../../messenger/templates').TextReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.getContext();

      R.when(context.dentist_step && context.unknown_dentist);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const textReply = new TextReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage()
      );

      this.replies = [textReply];

      R.stop();
    }
  };
}
