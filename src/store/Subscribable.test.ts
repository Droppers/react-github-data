import Subscribable from "./Subscribable";

class TestSub extends Subscribable<string> {
  doInvoke(channel: string, data: string) {
    this.invoke(channel, data);
  }

  get subscriptions() {
    return this._subscriptions;
  }
}
describe("Subscribable tests", () => {
  let instance: TestSub;

  beforeEach(() => {
    instance = new TestSub();
  });

  test("there are no subscriptions by default", () => {
    expect(instance.subscriptions.length).toBe(0);
  });

  test("'subscribe()' adds a subscription", () => {
    instance.subscribe("test", () => true);
    expect(instance.subscriptions.length).toBe(1);
  });

  test("'subscribe()' unsubscribing using return function", () => {
    const unsubscribe = instance.subscribe("test", () => true);
    unsubscribe();
    expect(instance.subscriptions.length).toBe(0);
  });

  test("'unsubscribe()' unsubscribes", () => {
    const callback = () => true;
    instance.subscribe("test", callback);
    expect(instance.subscriptions.length).toBe(1);
    instance.unsubscribe(callback);
    expect(instance.subscriptions.length).toBe(0);
  });

  test("'unsubscribe()' not existing subscription", () => {
    instance.unsubscribe(() => true);
  });

  test("callback of subscriber is called after invoking", (done) => {
    instance.subscribe("test", (data) => {
      expect(data).toBe("test data");
      done();
    });

    instance.doInvoke("test", "test data");
  }, 500);

  test("invoke only calls subscriptions in same channel", (done) => {
    instance.subscribe("wrong-channel", () => {
      done("Subscription is not in the 'test' channel.");
    });

    instance.subscribe("test", (data) => {
      expect(data).toBe("test data");
      done();
    });

    instance.doInvoke("test", "test data");
  }, 500);
});
