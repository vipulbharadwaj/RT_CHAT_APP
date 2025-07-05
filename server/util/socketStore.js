// socketStore.js
const userMap = {};
let io = null;

module.exports = {
  userMap,
  setIO: (ioInstance) => {
    io = ioInstance;
  },
  getIO: () => io,
};
