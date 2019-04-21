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
          //console.log(props);
          options.tagProps.subProps = props && props.subProps ? props.subProps : 'test';
        },
        options: {
          isSubTag: true
        }
      },
      wrap3: {
        extension: options => {
          options.tagProps.subProps = 'test3';
        },
        options: {
          isSubTag: true
        }
      },
      wrap4: {
        extension: options => {
          options.tagProps.props = 'test4';
        },
        options: {
          isSubTag: true
        }
      },
      wrap5: {
        extension: options => {
          const { props } = options;
          options.tagProps.props = props.props;
        },
        options: {
          isSubTag: true
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
          <@title>1</@title>
          <#wrap3 />
        </#wrap2>
      </#wrap1>
    `)).toBe('subProps:test3');
  });

  it('3 layers', () => {
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