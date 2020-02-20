/**
 * NornJ tag `MobxObserver` is the same as the Observer component of Mobx(https://mobx-react.js.org/observer-component), but its children does not need a nested function. example:
 *
 * `<MobxObserver><div>{store.foo}</div></MobxObserver>`
 */
declare function MobxObserver(): any;

/**
 * NornJ tag `MobxObserver` is the same as Observer component of Mobx(https://mobx-react.js.org/observer-component), but its children does not need a nested function. example:
 *
 * `<NjMobxObserver><div>{store.foo}</div></NjMobxObserver>`
 */
declare function NjMobxObserver(): any;

declare function MobxFormData(props: { [id: string]: any }): any;

declare function MobxFieldData(props: { [id: string]: any }): any;

declare namespace JSX {
  namespace NornJReact {
    interface Childrenable {
      children?: NornJ.Children | NornJ.Children[];
    }

    interface MobxObserver extends Childrenable {}
  }

  interface IntrinsicElements {
    /**
     * NornJ tag `mobxObserver` is the same as the Observer component of Mobx(https://mobx-react.js.org/observer-component), but its children does not need a nested function. example:
     *
     * `<mobxObserver><div>{store.foo}</div></mobxObserver>`
     */
    mobxObserver: NornJReact.MobxObserver;

    /**
     * NornJ tag `mobxObserver` is the same as the Observer component of Mobx(https://mobx-react.js.org/observer-component), but its children does not need a nested function. example:
     *
     * `<n-mobxObserver><div>{store.foo}</div></n-mobxObserver>`
     */
    'n-mobxObserver': NornJReact.MobxObserver;
  }
}

declare module 'nornj-react/mobx';

declare module 'nornj-react/mobx/native';

declare module 'nornj-react/mobx/formData';

declare module 'nornj-react/redux';

declare module 'nornj-react/router';

declare module 'nornj-react/lib/*';
