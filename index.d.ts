import './src/typings/global';
import { NornJ } from './src/typings/nj';

declare module 'nornj' {
	export = NornJ;
}

declare module 'nornj/dist/nornj.common' {
	export = NornJ;
}