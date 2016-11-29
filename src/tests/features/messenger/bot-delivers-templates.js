'use strict';

const mongoose = require('mongoose');
const config = require('config');

const chai = require('chai');
const expect = chai.expect;

const {
  TypingReply,
  QuickReply,
  Card,
  ListReply,
  Gallery,
  TextReply,
  Picker,
  Suggestions,
  DentistSuggestion
} = require('../../../messenger/templates');

const { assertThatSuccessWith, assertThatFailWith } = require('../../assertion');
const Messenger = require('../../../messenger').Messenger;
const ProphecyInterpreter = require('../../../oracle').ProphecyInterpreter;

const samples = require('./prophecy-samples');

describe("A bot delivers templates", () => {

  before('A database configuration.', (done) => {
    mongoose.connect(config.get('mongoTestingUri'), (err, res) => {
      if (!err) {
        done();
      }
    });
  });

  before('A messenger configuration.', () => {
    this.messenger = new Messenger(new ProphecyInterpreter(), {
      uri: config.get('fbUri'),
      accessToken: config.get('pageAccessToken')
    });
  });

  it("when the prophecy predicts missing dentist.", (done) => {
    const prophecy = samples.getSampleWithMissingDentist();

    this.messenger.deliver(prophecy, assertThatSuccessWith(done, (templates) => {
      expect(templates).to.have.lengthOf(3);
      expect(templates[0]).instanceof(TextReply);
      expect(templates[1]).instanceof(TypingReply);
      expect(templates[2]).instanceof(DentistSuggestion);
    }));
  });

  it("when the prophecy predicts missing reasons.", (done) => {
    const prophecy = samples.getSampleWithMissingReason();

    this.messenger.deliver(prophecy, assertThatSuccessWith(done, (templates) => {
      expect(templates).to.have.lengthOf(3);
      expect(templates[0]).instanceof(TextReply);
      expect(templates[1]).instanceof(TypingReply);
      expect(templates[2]).instanceof(Gallery);
    }));
  });

  // it("when the prophecy predicts missing day.", (done) => {
  //   const prophecy = samples.getSampleWithMissingDay();
  //
  //   this.messenger.deliver(prophecy, assertThatSuccessWith(done, (templates) => {
  //     expect(templates).to.have.lengthOf(1);
  //     expect(templates[0]).instanceof(Picker);
  //   }));
  // });

  it("when the prophecy predicts missing hour.", (done) => {
    const prophecy = samples.getSampleWithMissingHour();

    this.messenger.deliver(prophecy, assertThatSuccessWith(done, (templates) => {
      expect(templates).to.have.lengthOf(1);
      expect(templates[0]).instanceof(Picker);
    }));
  });

  it("when the prophecy predicts suggestions for preferred client's time.", (done) => {
    const prophecy = samples.getSampleWithSuggestions(done);

    this.messenger.deliver(prophecy, assertThatSuccessWith(done, (templates) => {
      expect(templates).to.have.lengthOf(3);
      expect(templates[0]).instanceof(TextReply);
      expect(templates[1]).instanceof(TypingReply);
      expect(templates[2]).instanceof(Suggestions);
    }));
  });

  it("when the prophecy predicts reserving hour based the specified fields.", (done) => {
    const prophecy = samples.getSampleWithReservation(done);

    this.messenger.deliver(prophecy, assertThatSuccessWith(done, (templates) => {
      expect(templates).to.have.lengthOf(1);
      expect(templates[0]).instanceof(Card);
    }));
  });
});
