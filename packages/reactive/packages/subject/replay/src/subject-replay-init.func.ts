// external
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash-es';

// internal
import { completeFunction } from '../../src/complete.function';
import { PropertiesInterface } from '../../src/properties.interface';
import { subscribeFunction } from '../../src/subscribe.function';

/**
 * ApSubjectReplayInit
 * @export
 * @template T
 * @param {Function} target
 * @param {string[]} properties
 */
export const ApSubjectReplayInit = function <T>(target: Function, properties: string[], buffer: number, windowTime: number): void {
  const ngOnInit = target.prototype.ngOnInit;
  const lookup = { getter: {}, setter: {} };

  // Set lookup getters / setters.
  _.each(properties, (property: string) => {
    lookup.getter[property] = target.prototype.__proto__.__lookupGetter__(property);
    lookup.setter[property] = target.prototype.__proto__.__lookupSetter__(property);
  });

  if (properties instanceof Array) {
    _.each(properties, (property: string) => {
      // Define property to hold value.
      Object.defineProperty(target.prototype, `_${property}`, { writable: true });

      // Define `Subject` in `${property}$` on demand by using `_${property}$`.
      Object.defineProperty(target.prototype, `_${property}$`, { writable: true });
      Object.defineProperty(target.prototype, `${property}$`, {
        set: function (value: T) {
          this[`_${property}$`] = value;
        },
        get: function (): T {
          if (this[`_${property}$`] === undefined) {
            this[`_${property}$`] = new ReplaySubject<T>(buffer, windowTime);
          }
          return this[`_${property}$`];
        }
      });

      // Define property with function to subscribe to observables.
      subscribeFunction<T>(target);

      // Create function to complete observables.
      completeFunction(target);

      // Update property attributes.
      Object.defineProperty(target.prototype, `${property}`, {
        set: function (value: T) {
          // Send `value` to Subject.
          if (this[`${property}$`]) {
            this[`${property}$`].next(value);
          }

          // if setter is undefined then assign to property with suffix _.
          if (lookup.setter[property] === undefined) {
            this[`_${property}`] = value;
          // else use defined setter.
          } else {
            lookup.setter[property].apply(this, arguments);
          }
        },
        get: function (): T {
          // if setter is undefined then return property with suffix _.
          if (lookup.getter[property] === undefined) {
            return this[`_${property}`];
          // else use defined getter.
          } else {
            return lookup.getter[property].apply(this, arguments);
          }
        }
      });
    });
  }
};
