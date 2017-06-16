const openDir = (path) => new Promise((resolve, reject) => {
  window.resolveLocalFileSystemURL(path, dir => {
    resolve(dir);
  }, err => {
    reject(err);
  });
});

const readDirContent = path => new Promise(async (resolve, reject) => {
  const dir = await openDir(path);
  const dirReader = dir.createReader();
  let entries = [];
  const readEntries = () => {
    dirReader.readEntries(results => {
      if (!results.length) {
        const parsed = entries.map(f => {
          return {
            name: f.name,
            path: f.nativeURL,
            isDir: f.isDirectory,
            open: false,
            children: []
          };
        });
        resolve(parsed);
      } else {
        entries = entries.concat(results ? results.slice() : []);
        readEntries();
      }
    }, err => {
      reject(err);
    });
  };
  readEntries();
});

const readDirAndFirstLevelChildren = async path => {
  const first = await readDirContent(path);
  await scanDirChildren(first);
  return first;
};

const scanDirChildren = async dir => {
  // this loop will read te child in sequence and not in parallel TBD if is good or bad
  for (let d of dir) {
    if (d.isDir) {
      d.children = await readDirContent(d.path);
    }
  }
  return dir;
};

const getRootDir = () => {
  return readDirAndFirstLevelChildren(window.cordova.file.externalRootDirectory);
};
const state = {
  files: []
};

// getters
const getters = {};

// actions
const actions = {
  async initializeFiles ({commit}) {
    const files = await getRootDir();
    commit('SET_FILES', files);
  },
  async openDirectory ({commit}, dir) {
    const children = await readDirContent(dir.path);
    commit('ADD_CHILDREN', {dir, children});
    commit('OPEN_DIRECTORY', dir);
  },
  closeDirectory ({commit}, dir) {
    commit('CLOSE_DIRECTORY', dir);
  }
};

// mutations
const mutations = {
  SET_FILES (state, files) {
    state.files = files.slice();
  },
  ADD_CHILDREN (state, {dir, children}) {
    dir.children = children;
  },
  OPEN_DIRECTORY (state, dir) {
    dir.open = true;
  },
  CLOSE_DIRECTORY (state, dir) {
    dir.open = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
