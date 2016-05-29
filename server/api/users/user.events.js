/**
 * User model events
 */

const EventEmitter = require('events').EventEmitter;
const User = require('./user.model');

const UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
const events = ['save', 'remove'];

// Register the event emitter to the model events
for (const event of events) {
  User.schema.post(event, ev =>
    (doc) => {
      UserEvents.emit(`${ev} : ${doc._id}`, doc);
      UserEvents.emit(event, doc);
    }
  );
}


module.exports = UserEvents;
