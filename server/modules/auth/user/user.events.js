/**
 * User model events
 */

import { EventEmitter } from 'events';
import User from './user.model';

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


export default UserEvents;
