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

declare const MobxFormData: NornJReact.MobxFormData;

declare const MobxFieldData: NornJReact.MobxFieldData;

type JSXElementWithMobxFormData = NornJReact.JSXElementWithMobxFormData;

declare namespace JSX {
  interface Element extends React.ReactElement<any, any>, JSXElementWithMobxFormData {}

  namespace NJR {
    interface MobxObserver extends NJ.Childrenable {}

    type MobxFormData = NornJReact.MobxFormDataProps & NJ.Childrenable;

    type MobxFieldData = NornJReact.MobxFieldDataProps & NJ.Childrenable;
  }

  interface IntrinsicElements {
    /**
     * NornJ tag `mobxObserver` is the same as the Observer component of Mobx(https://mobx-react.js.org/observer-component), but its children does not need a nested function. example:
     *
     * `<mobxObserver><div>{store.foo}</div></mobxObserver>`
     */
    mobxObserver: NJR.MobxObserver;

    /**
     * NornJ tag `mobxObserver` is the same as the Observer component of Mobx(https://mobx-react.js.org/observer-component), but its children does not need a nested function. example:
     *
     * `<n-mobxObserver><div>{store.foo}</div></n-mobxObserver>`
     */
    'n-mobxObserver': NJR.MobxObserver;

    mobxFormData: NJR.MobxFormData;

    mobxFieldData: NJR.MobxFieldData;
  }

  interface IntrinsicAttributes {
    /**
     * NornJ directive `mobxBind`, example:
     *
     * `<input mobxBind={this.inputValue} />`
     */
    mobxBind?: any;

    /**
     * NornJ directive `n-mobxBind`, example:
     *
     * `<input n-mobxBind={this.inputValue} />`
     */
    ['n-mobxBind']?: any;

    /**
     * NornJ directive `mobxField`, example:
     *
     * `<input mobxField={this.inputValue} />`
     */
    mobxField?: any;

    /**
     * NornJ directive `n-mobxField`, example:
     *
     * `<input n-mobxField={this.inputValue} />`
     */
    ['n-mobxField']?: any;
  }
}

declare module 'nornj-react/mobx';

declare module 'nornj-react/mobx/native';

declare module 'nornj-react/mobx/formData';

declare module 'nornj-react/lib/*';
