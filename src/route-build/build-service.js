const BuildService = {

  getUser(db, id){
    return db
      .select()
      .from('users')
      .where('id', id);
  },

  getUserFolders(db) {
    return db
      .select()
      .from('users')
      .join('folders', 'users.id', '=', 'folders.user_id');
  },

  getUserTeams(db) {
    return db
      .select()
      .from('users')
      .join('folders', 'users.id', '=', 'folders.user_id')
      .join('teams', 'folder.id', '=', 'teams.folder_id');
  },

  getUserSets(db) {
    return db
      .select()
      .from('users')
      .join('folders', 'users.id', '=', 'folders.user_id')
      .join('teams', 'folder.id', '=', 'teams.folder_id')
      .join('sets', 'team.id', '=', 'sets.team_id');
  },

  postUser(db) {
    
  },

  postUserFolder(db, newFolder) {
    return db.insert(newFolder).into('folders').returning('*').then(rows => rows[0]);
  },

  postUserTeam(db, newTeam) {
    return db.insert(newTeam).into('teams').returning('*').then(rows => rows[0]);
  },

  postUserSet(db, newSet) {
    return db.insert(newSet).into('sets').returning('*').then(rows => rows[0]);
  },

  patchUser(db) {

  },

  patchUserFolder(db, id, newFolder) {
    return db('folders').where({ id }).update(newFolder).returning('*').then(rows => rows[0]);
  },

  patchUserTeam(db, id, newTeam) {
    return db('teams').where({ id }).update(newTeam).returning('*').then(rows => rows[0]);
  },

  patchUserSet(db, id, newSet) {
    return db('sets').where({ id }).update(newSet).returning('*').then(rows => rows[0]);
  },

  deleteUser(db) {

  },

  deleteUserFolder(db, id) {
    return db('folders').where({ id }).del();
  },

  deleteUserTeam(db, id) {
    return db('teams').where({ id }).del();
  },

  deleteUserSet(db, id) {
    return db('sets').where({ id }).del();
  }

};

module.exports = BuildService;