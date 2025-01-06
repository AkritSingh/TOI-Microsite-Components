const PubSub = () => {
  const mod_event = {};
  const pubsub = {};
  const onsubscribe_prefix = '__on_';
  const generateUid = (function generateUid() {
    let id = 0;
    return function incID() {
      id += 1;
      return id - 1;
    };
  })();
  /**
   * Publish subscribed events
   *
   * @param name Method name for the event to be published
   * @param data data to be passed to the subscribed event
   * @returns null
   */
  mod_event.publish = function publish(name, data) {
    if (!name) {
      return null;
    }
    if (pubsub[name]) {
      Object.keys(pubsub[name]).forEach((e) => {
        const eventCallback = pubsub[name][e];
        try {
          //try catch done to keep publisher running in case of error in event callback
          eventCallback(data);
        } catch (err) {
          mod_event.publish('logger.error', err.stack);
        }
      });
    }
    return null;
  };
  mod_event.subscribeAll = function subscribeAll(name, eventCallback, options) {
    if (name instanceof Array) {
      const eventIds = [];
      let responses = [];
      const bindREsponse = (response) => {
        responses.push(response);
        if (eventIds.length === responses.length) {
          // todo fix, call even when first event is called twice
          if (eventCallback) {
            eventCallback(responses);
          }
          responses = [];
        }
      };
      for (let i = 0; i < name.length; i += 1) {
        eventIds.push(mod_event.subscribe(name[i], bindREsponse, options));
      }
      return eventIds;
    }
    return mod_event.subscribe(name, eventCallback, options);
  };
  //   /**
  //    * Subscribe custom events
  //    *
  //    * @param name Method name for the event to be subscribed
  //    * @param eventCallback(data) Function to be called when the event is published with the data
  //    * @options options
  //    * @returns eventId unique id generated for every subscription
  //    */
  mod_event.subscribe = function subscribe(name, eventCallback, options) {
    if (name instanceof Array) {
      const eventIds = [];
      for (let i = 0; i < name.length; i += 1) {
        eventIds.push(mod_event.subscribe(name[i], eventCallback, options));
      }
      return eventIds;
    }
    if (!name || !eventCallback) {
      return null;
    }
    if (!pubsub[name]) {
      pubsub[name] = {};
    }
    const eventId = `${name}:${generateUid()}`;
    pubsub[name][eventId] = eventCallback;
    //TODO find better way
    //Setting callback in options so that it can be used in onsubscribe event.
    const newOptions = options;
    if (options) {
      newOptions.__callback = eventCallback;
    }
    //Calling onsubscribe events
    mod_event.publish(onsubscribe_prefix + name, newOptions);
    return eventId;
  };
  //   /**
  //    * Unsubscribe an event
  //    *
  //    * @param eventId id of the event to be unsubscribed
  //    * @returns boolean true if event is successfully unsubscribed,else false
  //    */
  mod_event.unsubscribe = function unsubscribe(eventId) {
    if (!eventId) {
      return null;
    }
    const eventArr = eventId.split(':');
    if (eventArr.length === 2) {
      const eventName = eventArr[0];
      //            var eventNum = eventArr[1];
      if (pubsub[eventName][eventId]) {
        delete pubsub[eventName][eventId];
        return true;
      }
    }
    return false;
  };
  //   /**
  //    * Get all the subscribed events in an object
  //    *
  //    *
  //    * @param name Event name for which all events are required
  //    * @returns Event object for the provided event name
  //    */
  mod_event.getSubscriptions = function getSubscriptions(name) {
    if (!name) {
      return pubsub; //todo return cloned object istead of original
    }
    return pubsub[name];
  };
  //   /**
  //    * Used to subscribe to subscribe events, onsubscribe('method1') is called when subscribe('method1') is called
  //    * This can be used to setup data / setup publish events
  //    *
  //    * @param name
  //    * @param eventCallback
  //    * @returns {string}
  //    */
  mod_event.onsubscribe = function onsubscribe(name, eventCallback) {
    let newName = name;
    if (!newName || !eventCallback) {
      return null;
    }
    newName = onsubscribe_prefix + newName;
    if (!pubsub[newName]) {
      pubsub[newName] = {};
    }
    const eventId = `${newName}:${generateUid()}`;
    pubsub[newName][eventId] = eventCallback;
    return eventId;
  };
  return mod_event;
};

export default PubSub;
