module.exports = {
  servers: {
    one: {
      host: '46.101.235.148',
      username: 'root',
      pem: '/Users/pekka/.ssh/do_rsa'
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'solinor-wages',
    path: './',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://turtola.fi'
    },

    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};