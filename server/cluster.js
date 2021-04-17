const cluster = require('cluster');
const cpus = require('os').cpus();

if (cluster.isMaster) {
  cluster.on('listening', worker => console.log(`Cluster ${worker.process.pid} connected`));
  cluster.on('disconnect', worker => console.log(`Cluster ${worker.process.pid} disconnected`));
  cluster.on('exit', worker => {
    console.log(`Cluster ${worker.process.pid} exited`);
    cluster.fork();
  });
  cpus.forEach(cluster.fork);
} else {
  require('./index.js');
}
