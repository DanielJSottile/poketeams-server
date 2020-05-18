const BuildService = {

  getUser(db, user_id){
    return db
      .select()
      .from('users')
      .where('id', `${user_id}`);
  },

  getUserFolders(db, user_id) {
    return db
      .select()
      .from('folders')
      //.join('folders', 'users.id', '=', 'folders.user_id')
      .where('user_id', '=', `${user_id}`);
  },

  getUserTeams(db, user_id) {
    return db
      .select()
      .from('folders')
      .join('teams', 'folders.id', '=', 'teams.folder_id')
      .where('folders.user_id', '=', `${user_id}`);
  },

  getUserSets(db, user_id) {
    return db
      .select()
      .from('folders')
      .join('teams', 'folders.id', '=', 'teams.folder_id')
      .join('sets', 'teams.id', '=', 'sets.team_id')
      .where('folders.user_id', '=', `${user_id}`);
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