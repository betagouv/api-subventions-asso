import bcrypt from "bcrypt";

interface EventOption {
    layer: number;
    filter?: (...args: Array<unknown>) => boolean;
}

interface CallbackFunction {
    (callbackStop: (data?: unknown) => void, ...args: Array<unknown>): void | Promise<void>;
}

interface CallbackObject {
    callback: CallbackFunction;
    id: string;
    option: EventOption;
}

interface Event {
    name: string;
    callbacks: Array<CallbackObject>;
}

interface StackEvent extends Array<Event> {
    [index: number]: Event;
}

interface CallbackStored {
    callbackObject: CallbackObject;
    event: Event;
    id: string;
}

class EventManager {
    private events: StackEvent = [];
    private callbacks: Array<CallbackStored> = [];

    /**
     * Register event
     *
     * @param eventName is the name of event
     */
    public add(eventName: string): Event {
        const foundEvent = this.events.find((event: Event) => event.name === eventName);
        if (foundEvent) return foundEvent;

        const event = {
            name: eventName,
            callbacks: [],
        };

        this.events.push(event);

        return event;
    }

    /**
     * Register events
     *
     * @param eventNames is the names of events
     */
    public addMultiple(...eventNames: Array<string>) {
        eventNames.forEach(eventName => this.add(eventName));
    }

    /**
     * Attach callback when event
     *
     * @param eventName is the name of event
     * @param option is for defined function filter or layer
     * @param callback the callback attached to event
     */
    public on(eventName: string, option: { name?: string; layer?: number }, callback: CallbackFunction) {
        const event = this.getEventByName(eventName, true);

        if (!option.layer) option.layer = Infinity; // If not layer call this callback in last

        // Found pos in callback stack
        const position = event.callbacks.findIndex(cbObject => cbObject.option.layer > (option.layer as number));
        const callbackObject = {
            callback,
            id: (option.name as string) || bcrypt.hashSync("DEFAULT_ID", Math.random() * 10 + 1),
            option: option as EventOption,
        };

        if (position != -1) {
            event.callbacks.splice(position, 0, callbackObject);
        } else {
            event.callbacks.push(callbackObject);
        }

        this.callbacks.push({
            event,
            callbackObject,
            id: callbackObject.id,
        });

        return callbackObject.id;
    }

    /**
     * Call callbacks linked to the event
     *
     * @param eventName is the name of event
     * @param args argument send to callbacks
     */
    public call(eventName: string, args: Array<unknown> = []) {
        return new Promise(resolve => {
            const event = this.getEventByName(eventName);
            let stopCallback = false;

            const callbackStop = (data?: unknown) => {
                stopCallback = true;
                resolve(data);
            };

            event.callbacks.forEach(callback => {
                if (stopCallback) return;

                if (callback.option.filter) {
                    if (callback.option.filter(...args)) {
                        callback.callback(callbackStop, ...args);
                    }
                } else {
                    callback.callback(callbackStop, ...args);
                }
            });
        });
    }

    /**
     * Find event by name.
     *
     * @param eventName the event name finded
     * @param force if is true and event is not found this function create the event
     */
    private getEventByName(eventName: string, force = false): Event {
        let event = this.events.find((event: Event) => event.name === eventName);

        if (!event) {
            if (!force) throw new Error(`The event ${eventName} is not found, please check if as been declared`);
            event = this.add(eventName);
        }

        return event;
    }

    /**
     * Remove callback on event
     *
     * @param callbackId The id or name of the removed callback
     */
    removeCallback(callbackId: string) {
        const callback = this.callbacks.find(callback => callback.id === callbackId);
        if (!callback) return;

        const indexInEvent = callback.event.callbacks.findIndex(cb => cb.id === callbackId);
        if (indexInEvent === -1) return;
        callback.event.callbacks.splice(indexInEvent, 1);
    }
}

export default new EventManager();
