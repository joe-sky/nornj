import './src/typings/global';
import { NornJ } from './src/typings/nj';

/**
 * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
 * 
 * `nj'<html>Hello World!</html>'()`
 */
declare const NornJExport: NornJ;
export = NornJExport;