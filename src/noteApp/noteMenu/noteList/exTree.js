module.exports = {
  module: 'react-ui-tree',
  children: [
    {
      module: 'dist',
      collapsed: false,
      children: [
        {
          module: 'node.js',
          leaf: true,
        },
        {
          module: 'react-ui-tree.css',
          leaf: true,
        },
        {
          module: 'react-ui-tree.js',
          leaf: true,
        },
        {
          module: 'tree.js',
          collapsed: false,
          children: [
            {
              module: 'node.js',
              leaf: true
            },
            {
              module: 'react-ui-tree.css',
              leaf: true
            },
            {
              module: 'react-ui-tree.js',
              leaf: true
            },
            {
              module: 'tree.js',
              leaf: true
            }
          ]
        }
      ]
    },
    {
      module: 'example',
      children: [
        {
          module: 'app.js',
          leaf: true
        },
        {
          module: 'app.less',
          leaf: true
        },
        {
          module: 'index.html',
          leaf: true
        }
      ]
    },
    {
      module: 'lib',
      children: [
        {
          module: 'node.js',
          leaf: true
        },
      ]
    },
    {
      module: '.gitiignore',
      leaf: true
    },
    {
      module: 'index.js',
      leaf: true
    },
    {
      module: 'LICENSE',
      leaf: true
    }
  ]
};
