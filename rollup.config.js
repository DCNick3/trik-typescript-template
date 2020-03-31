import babel from 'rollup-plugin-babel';
import node_resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import root_import from 'rollup-plugin-root-import';
import polyfill from 'rollup-plugin-polyfill';
import real_transform from './rollup-plugin-real-transform';
import fs from 'fs';

const extensions = ['.js', '.ts'];

const ENTRY_POINTS_IN_DIR = './src/entry_points';
const ENTRY_POINTS_REAL_OUT_DIR = 'bin/real';
const ENTRY_POINTS_SIM_OUT_DIR = 'bin/sim';

function* findEntryPoints(dir) {
    const subfiles = fs.readdirSync(dir, { withFileTypes: true });
    const child_dirs = subfiles
        .filter((x) => x.isDirectory())
        .map((x) => dir + '/' + x.name);
    for (const child_dir of child_dirs) {
        yield* findEntryPoints(child_dir);
    }

    const child_files = subfiles
        .filter((x) => x.name.endsWith('.ts'))
        .map((x) => dir + '/' + x.name)
        .map((x) => x.replace(ENTRY_POINTS_IN_DIR, ''));
    yield* child_files;
}
const entry_points = [...findEntryPoints(ENTRY_POINTS_IN_DIR)]
    .map(x => [x, x.includes("real")]);
    /* uncomment this if you want to compile only some entry points */
    //  .filter(x => x.includes('sim'));

const external = ['trik_brick', 'trik_script', 'trik_mailbox', 'trik_threading'];
const globals = {
    'trik_brick': 'brick',
    'trik_script': 'script',
    'trik_mailbox': 'mailbox',
    'trik_threading': 'Threading' /* capital T? trik, are you serious? */
}

const config = [];

config.push(...entry_points.map(entry => {
    const [name, is_real_bundle] = entry;
    return {
        input: ENTRY_POINTS_IN_DIR + name,
        external,
        output: [
            {
                file: (is_real_bundle ? ENTRY_POINTS_REAL_OUT_DIR : ENTRY_POINTS_SIM_OUT_DIR) + name.replace('.ts', '.js'),
                format: 'iife',
                globals
            },
        ],
        plugins: [
            root_import({ root: 'src' }), /* used only for importing polyfills.
                Typescript has it's own complicated module resolution mechanism and can't be tweaked much */
            /* Polyfills are to be imported in each entry point. This convienment plugin does it */
            polyfill(['/polyfills/index.js']),

            commonjs(), /* needed for some libraries (for example cojejs) that are written in commonjs style */
            node_resolve(),
            typescript(),
            babel({
                exclude: 'node_modules/core-js/**',
                extensions: extensions,
                runtimeHelpers: true
            }),

            /* this will end code that prints stop marker so that remote-run.py would be able to detect script sucsessful termination */
            real_transform({is_real_bundle})
        ],
        onwarn: (warning, handeWarning) => {
            // overwite the default warning function
            const str = warning.toString();

            /* This is used to trick babel and rollup, so eval usage is _kind_of_ justified. */
            if (/Use of eval is strongly discouraged/.test(str)) return;
            handeWarning(warning);
        },  
    }
}));

export default config;
