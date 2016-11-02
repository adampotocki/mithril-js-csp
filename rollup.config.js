import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import includePaths from 'rollup-plugin-includepaths';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';

export default {
  entry: 'src/app.js',
  dest: 'build/js/build.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    includePaths({ paths: ['src'] }),
    nodeResolve({ jsnext: true, browser: true }),
    commonjs({ include: 'node_modules/**' })
  ].concat(
    process.env.NODE_ENV === 'production' ? [
      filesize(), // Show filesize of prod bundle
      uglify({}, minify) // Minify bundle
    ] : [
      filesize(), // Show filesize of dev bundle
    ]
  )
};
