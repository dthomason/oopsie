module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-proposal-private-methods',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
      },
    ],
    'jest-hoist',
  ],
};
