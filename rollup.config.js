import typescript from 'rollup-plugin-typescript2';

// https://github.com/microsoft/TypeScript/issues/18442#issuecomment-749896695
export default [
  {
    preserveModules: true,
    input: ['src/index.ts'],
    output: [{
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      preserveModules: true
    }],
    plugins: [
      typescript({
        tsconfig: './tsconfig.esm.json'
      })
    ],
  }
];
