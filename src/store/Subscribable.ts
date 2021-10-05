type Subscription<T> = {
  channel: string;
  listener: (data: T) => void;
};

class Subscribable<T> {
  protected _subscriptions: Subscription<T>[] = [];

  protected invoke(channel: string, data: T): void {
    this._subscriptions.forEach((subscription) => {
      if (subscription.channel === channel) {
        subscription.listener(data);
      }
    });
  }

  public subscribe(channel: string, listener: (data: T) => void): () => void {
    this._subscriptions.push({
      channel,
      listener,
    });
    return () => this.unsubscribe(listener);
  }

  public unsubscribe(listener: (data: T) => void): void {
    const subscription = this._subscriptions.find(
      (s) => s.listener === listener
    );
    if (subscription) {
      this._subscriptions.splice(this._subscriptions.indexOf(subscription), 1);
    }
  }
}

export default Subscribable;
