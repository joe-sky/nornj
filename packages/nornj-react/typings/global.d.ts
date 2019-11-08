declare function MobxObserver(): any;

declare function NjMobxObserver(): any;

declare namespace JSX {
  namespace NornJReact {
    interface Childrenable {
      children?: NornJ.Children | NornJ.Children[];
    }

    interface MobxObserver extends Childrenable {}
  }

  interface IntrinsicElements {
    mobxObserver: NornJReact.MobxObserver;

    'n-mobxObserver': NornJReact.MobxObserver;
  }
}
