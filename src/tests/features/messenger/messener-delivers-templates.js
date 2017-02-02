'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const config = require('config');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const {
  Card,
  Picker,
  ReasonsGallery,
  DentistsGallery
} = require('../../../messenger/templates');

const {
  TypingReply,
  QuickReply,
  TextReply,
  ButtonReply
} = require('@fanatic/messenger/templates');

const ConversationManager = require('@fanatic/conversations/NativeConversationManager');
const Messenger = require('@fanatic/messenger/Messenger');
const ProphecyInterpreter = require('@fanatic/oracle/ProphecyInterpreter');

const USER_ID = 1405183346161408;
const PAGE_ID = 1235981259820368;

const samples = require('./prophecy-samples')(USER_ID);

const logger = sinon.stub();
logger.returns({
  debug: function(text, options) {},
  error: function(text, options) {}
});

describe("The messenger delivers templates", () => {

  before('A database has been configured.', () => {
    return mongoose.connect(config.database.mongoUri);
  });

  before('A page model has been loaded.', () => {
    const Page = require('../../../models/Page');

    return Page.findPageById(PAGE_ID).then(page => {
      this.page = page;
    });
  });

  before('A conversation has been configured.', () => {
    const metadata = {
      page: this.page
    };

    this.manager = new ConversationManager(logger());
    this.manager.createConversation(USER_ID, {}, metadata);
  });

  before('A messenger has been configured.', () => {
    const formulas = require('../../../oracle/formulas')(this.manager, logger());
    const pi = new ProphecyInterpreter(formulas);

    const settings = {
      endpoint: config.services.facebook.messenger.API.messages
    };
    this.messenger = new Messenger(pi, logger());
    this.messenger.settings(settings);
  });

  it("when the prophecy predicts a missing dentist.", () => {
    const prophecy = samples.getSampleWithMissingDentist();
    prophecy.metadata.accessToken = this.page.accessToken;

    return this.messenger.deliver(prophecy)
      .then(templates => {
        expect(templates).to.have.lengthOf(2);
        expect(templates[0]).instanceof(TextReply);
        expect(templates[1]).instanceof(DentistsGallery);
      });
  });

  it("when the prophecy predicts a missing reasons.", () => {
    const prophecy = samples.getSampleWithMissingReason();
    prophecy.metadata.accessToken = this.page.accessToken;

    return this.messenger.deliver(prophecy)
      .then(templates => {
        expect(templates).to.have.lengthOf(2);
        expect(templates[0]).instanceof(TextReply);
        expect(templates[1]).instanceof(ReasonsGallery);
      });
  });

  it("when the prophecy predicts a missing hour.", () => {
    const prophecy = samples.getSampleWithMissingHour();
    prophecy.metadata.accessToken = this.page.accessToken;

    return this.messenger.deliver(prophecy)
      .then(templates => {
        expect(templates).to.have.lengthOf(1);
        expect(templates[0]).instanceof(ButtonReply);
      });
  });

  it("when the prophecy predicts a missing day.", () => {
    const prophecy = samples.getSampleWithMissingDay();
    prophecy.metadata.accessToken = this.page.accessToken;

    return this.messenger.deliver(prophecy)
      .then(templates => {
        expect(templates).to.have.lengthOf(2);
        expect(templates[0]).instanceof(Picker);
        expect(templates[1]).instanceof(ButtonReply);
      });
  });

  it("when the prophecy predicts a reservation.", () => {
    const prophecy = samples.getSampleWithReservation();
    prophecy.metadata.accessToken = this.page.accessToken;

    return this.messenger.deliver(prophecy, false)
      .then(templates => {
        expect(templates).to.have.lengthOf(1);
        expect(templates[0]).instanceof(Card);
      });
  });

  after('A database connection will be closed.', () => {
    mongoose.connection.close();
  });
});
