import { render } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';
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
          options.subExProps.subProps = props && props.subProps ? props.subProps : 'test';
        },
        options: {
          isSub: true,
          subExProps: true
        }
      },
      wrap3: {
        extension: options => {
          options.subExProps.subProps = 'test3';
        },
        options: {
          isSub: true,
          subExProps: true
        }
      },
      wrap4: {
        extension: options => {
          options.exProps.props = 'test4';
        },
        options: {
          isProp: true,
          exProps: true
        }
      },
      wrap5: options => {
        return options.children();
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
    expect(render(`
      <#wrap1>
        <#props>
          <#wrap5>
            <#wrap4 />
          </#wrap5>
        </#props>
      </#wrap1>
    `)).toBe('subProps:test4');
  });
});