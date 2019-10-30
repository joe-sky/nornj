declare function MobxObserver(): any;

declare function NjMobxObserver(): any;

declare namespace JSX {
  type TChildren = Element | string | number | boolean | null | typeof undefined;

  declare namespace NornJReact {
    interface Childrenable {
      children?: TChildren | TChildren[];
    }

    interface MobxObserver extends Childrenable {}
  }

  interface IntrinsicElements {
    mobxObserver: NornJReact.MobxObserver;

    'n-mobxObserver': NornJReact.MobxObserver;
  }
}
