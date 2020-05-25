const BuildService = {

  // GET

  getSingleUserFolderById(db, folder_id) {
    return db
      .select()
      .from('folders')
      .where('folders.id', '=', `${folder_id}`);
  },

  getUserFolders(db, user_id) {
    return db
      .select()
      .from('folders')
      .where('user_id', '=', `${user_id}`);
  },

  getUserTeams(db, user_id) {
    return db
      .from('teams')
      .rightJoin('folders', 'folders.id', '=', 'teams.folder_id')
      .rightJoin('users', 'users.id', '=', 'folders.user_id')
      .select('teams.id',
        'team_name',
        'description',
        'teams.date_created',
        'teams.date_modified',
        'folders.user_id',
        'user_name',
        'folder_id', 
        'folder_name'
      )
      .whereNotNull('teams.id')
      .where('folders.user_id', '=', `${user_id}`);
  },

  getUserSets(db, user_id) {
    return db
      .from('teams')
      .join('sets', 'sets.team_id', '=', 'teams.id')
      .rightJoin('folders', 'folders.id', '=', 'teams.folder_id')
      .rightJoin('users', 'users.id', '=', 'folders.user_id')
      .select('sets.id', 
        'team_name', 
        'description', 
        'sets.date_created', 
        'sets.date_modified', 
        'folders.user_id', 
        'user_name', 
        'folder_id', 
        'folder_name', 
        'nickname',
        'species',
        'gender',
        'item',
        'ability',
        'level',
        'shiny',
        'happiness',
        'nature',
        'hp_ev',
        'atk_ev',
        'def_ev',
        'spa_ev',
        'spd_ev',
        'spe_ev',
        'hp_iv',
        'atk_iv',
        'def_iv',
        'spa_iv',
        'spd_iv',
        'spe_iv',
        'move_one',
        'move_two',
        'move_three',
        'move_four',
        'team_id'
      )
      .whereNotNull('teams.id')
      .where('folders.user_id', '=', `${user_id}`);
  },

  getUserFoldersFilter(db, user_id, sort, species) { // this is done
    let sortVar = [];
    let speciesVar = [];

    switch(sort) {
    case 'newest':
      sortVar = ['folders.date_created', '=', 'asc'];
      break;
    case 'oldest':
      sortVar = ['folders.date_created', '=', 'desc'];
      break;
    case 'alphabetical':
      sortVar = ['folders.folder_name', '=', 'asc'];
      break;
    case 'rev alphabetical':
      sortVar = ['folders.folder_name', '=', 'desc'];
      break;
    case 'most likes':
      sortVar = ('do not know yet'); // do not know yet
      break;
    default:
      sortVar = ['folders.date_created', '=', 'desc'];
    }

    if(species !== 'all'){
      speciesVar = ['sets.species', 'ILIKE', `%${species}%`];
    }

    return db
      .distinct('folders.id')
      .select(
        'folders.id',
        'folder_name',
        'user_id',
        'folders.date_created',
        'folders.date_modified'
      )
      
      .from('teams')
      .join('sets', 'sets.team_id', '=', 'teams.id')
      .rightJoin('folders', 'folders.id', '=', 'teams.folder_id')
      .rightJoin('users', 'users.id', '=', 'folders.user_id')
      
      .whereNotNull('teams.id')
      .where('users.id', '=', `${user_id}`)
      .where(speciesVar[0], speciesVar[1], speciesVar[2]) // find something better than this later
      .orderBy(sortVar[0], sortVar[1], sortVar[2]);
  },

  getUserTeamsFilter(db, user_id, sort, species){
    let sortVar = [];
    let speciesVar = [];

    switch(sort) {
    case 'newest':
      sortVar = ['sets.team_id', 'desc'];
      break;
    case 'oldest':
      sortVar = ['sets.team_id', 'asc'];
      break;
    case 'alphabetical':
      sortVar = ['team_name', 'asc'];
      break;
    case 'rev alphabetical':
      sortVar = ['team_name', 'desc'];
      break;
    case 'most likes':
      sortVar = ('do not know yet'); // do not know yet
      break;
    default:
      sortVar = ['sets.team_id', 'desc'];
    }

    if(species !== 'all'){
      speciesVar = ['sets.species', 'ILIKE', `%${species}%`];
    }

    return db
      .from('teams')
      .join('sets', 'sets.team_id', '=', 'teams.id')
      .rightJoin('folders', 'folders.id', '=', 'teams.folder_id')
      .rightJoin('users', 'users.id', '=', 'folders.user_id')
      .distinct('team_id')
      .select('sets.team_id as id',
        'team_name',
        'description',
        'teams.date_created',
        'teams.date_modified',
        'folders.user_id',
        'user_name',
        'folder_id', 
        'folder_name'
      )
      .whereNotNull('teams.id')
      .where('folders.user_id', '=', `${user_id}`)
      .where(speciesVar[0], speciesVar[1], speciesVar[2]) // find something better than this later
      .orderBy(sortVar[0], sortVar[1]);
  },

  getUserSetsFilter(db, user_id, sort, species){
    let sortVar = [];
    let speciesVar = [];

    switch(sort) {
    case 'newest':
      sortVar = ['sets.team_id', 'desc'];
      break;
    case 'oldest':
      sortVar = ['sets.team_id', 'asc'];
      break;
    case 'alphabetical':
      sortVar = ['team_name', 'asc'];
      break;
    case 'rev alphabetical':
      sortVar = ['team_name', 'desc'];
      break;
    case 'most likes':
      sortVar = ('do not know yet'); // do not know yet
      break;
    default:
      sortVar = ['sets.team_id', 'desc'];
    }

    if(species !== 'all'){
      speciesVar = ['sets.species', 'ILIKE', `%${species}%`];
    }

    return db
      .from('teams')
      .join('sets', 'sets.team_id', '=', 'teams.id')
      .rightJoin('folders', 'folders.id', '=', 'teams.folder_id')
      .rightJoin('users', 'users.id', '=', 'folders.user_id')
      .select('sets.id', 
        'team_name', 
        'description', 
        'sets.date_created', 
        'sets.date_modified', 
        'folders.user_id', 
        'user_name', 
        'folder_id', 
        'folder_name', 
        'nickname',
        'species',
        'gender',
        'item',
        'ability',
        'level',
        'shiny',
        'happiness',
        'nature',
        'hp_ev',
        'atk_ev',
        'def_ev',
        'spa_ev',
        'spd_ev',
        'spe_ev',
        'hp_iv',
        'atk_iv',
        'def_iv',
        'spa_iv',
        'spd_iv',
        'spe_iv',
        'move_one',
        'move_two',
        'move_three',
        'move_four',
        'team_id'
      )
      .whereNotNull('teams.id')
      .where('folders.user_id', '=', `${user_id}`)
      .where(speciesVar[0], speciesVar[1], speciesVar[2]) // find something better than this later
      .orderBy(sortVar[0], sortVar[1]);
  },

  // POST

  postUserFolder(db, newFolder) {
    return db.insert(newFolder).into('folders').returning('*').then(rows => rows[0]);
  },

  postUserTeam(db, newTeam) {
    return db.insert(newTeam).into('teams').returning('*').then(rows => rows[0]);
  },

  postUserSet(db, newSet) {
    return db.insert(newSet).into('sets').returning('*').then(rows => rows[0]);
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

  deleteUserFolder(db, id) {
    return db('folders').where('folders.id', '=', `${id}`).del();
  },


  deleteUserTeam(db, id) {
    return db('teams').where('teams.id', '=', `${id}`).del();
  },

  deleteUserSet(db, id) {
    return db('sets').where('sets.id', '=', `${id}`).del();
  }

};

module.exports = BuildService;