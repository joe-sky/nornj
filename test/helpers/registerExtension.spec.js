import { render, precompile } from '../../src/compiler/compile';
import createTmplRule from '../../src/utils/createTmplRule';
import { registerExtension } from '../../src/helpers/extension';

describe('Register extension tag', () => {
  beforeAll(() => {
    registerExtension({
      wrap1: ({ props }) => {
        return 'subProps:' + (props.props ? props.props : props.subProps);
      },
      wrap2: {
        extension: options => {
          const { props } = options;
          options.attrs.subProps = props && props.subProps ? props.subProps : 'test';
        },
        options: {
          isSub: true,
          subExProps: true
        }
      },
      wrap3: {
        extension: options => {
          options.attrs.subProps = 'test3';
        },
        options: {
          isSub: true,
          subExProps: true
        }
      },
      wrap4: {
        extension: options => {
          options.attrs.props = 'test4';
        },
        options: {
          isSub: true,
          subExProps: true
        }
      },
      wrap5: {
        extension: options => {
          const { props } = options;
          options.attrs.props = props.props;
        },
        options: {
          isSub: true,
          subExProps: true
        }
      },
    });
  });

  it('2 layers', () => {
    expect(render(`
      <#wrap1>
        <#wrap2 />
      </#wrap1>
    `)).toBe('subProps:test');
  });

  it('3 layers', () => {
    expect(render(`
      <#wrap1>
        <#wrap2>
          <#wrap3 />
        </#wrap2>
      </#wrap1>
    `)).toBe('subProps:test3');
  });

  it('3 layers and has isProp', () => {
    // console.log(precompile(`
    //   <#wrap1>
    //     <#props>
    //       <#wrap5>
    //         <#wrap4 />
    //       </#wrap5>
    //     </#props>
    //   </#wrap1>
    // `, false, createTmplRule()).main.toString());
    expect(render(`
      <#wrap1>
        <#wrap5>
          <#wrap4 />
        </#wrap5>
      </#wrap1>
    `)).toBe('subProps:test4');
  });
});