const AllService = {

  getTeamById(db, team_id) { // GET /:team_id
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
      .where('teams.id', '=', `${team_id}`);
  },

  getSetsForIndividualTeam(db, team_id) {
    return db
      .from('teams')
      .rightJoin('folders', 'folders.id', '=', 'teams.folder_id')
      .rightJoin('users', 'users.id', '=', 'folders.user_id')
      .join('sets', 'sets.team_id', '=', 'teams.id')
      .select(
        'sets.id', 
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
      .where('sets.team_id', '=', `${team_id}`);
  },

  getSetById(db, set_id, team_id) { // GET /:team_id/:set_id
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
      .where('sets.id', '=', `${set_id}`)
      .where('sets.team_id', '=', `${team_id}`);
  },

  getFavorites(db, team_id) { // GET /:team_id
    return db
      .select()
      .from('users')
      .join('favorites', 'users.id', '=', 'favorites.user_id')
      .join('folders', 'users.id', '=', 'folders.user_id')
      .join('teams', 'folder.id', '=', 'teams.folder_id')
      .count('favorites.user_id AS likes')
      .where('favorites.team_id', '=', team_id);
  },


  // only called upon opening of the Home public view WORKS, combine with below to get full PUBLIC TEAMS!
  getTenTeamsDefault(db, page) {
    const teamsAmt = 10;
    const offset = teamsAmt * (page - 1);
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
      .orderBy('teams.id', 'desc')
      .limit(`${teamsAmt}`)
      .offset(`${offset}`);
  },

  getLikesforATeam(db, team_id){
    return db
      .from('favorites')
      .select()
      .count('team_id as likes')
      .where('team_id', '=', `${team_id}`);
  },

  // We took out the get sets for 10 teams, because the other one is chained.

  // Currently has a bug with any team that has multiple of the same Pokemon made at different times.
  getTenTeamsWithSearch(db, page, sort, species) { // GET search?page=1&sort=none&species=all 
    const teamsAmt = 10;
    const offset = teamsAmt * (page - 1);
    let sortVar = [];
    let speciesVar = [];

    switch(sort) {
    case 'newest':
      sortVar = ['sets.team_id', '=', 'asc'];
      break;
    case 'oldest':
      sortVar = ['sets.team_id', '=', 'desc'];
      break;
    case 'alphabetical':
      sortVar = ['teams.team_name', '=', 'asc'];
      break;
    case 'rev alphabetical':
      sortVar = ['teams.team_name', '=', 'desc'];
      break;
    case 'most likes':
      sortVar = ('do not know yet'); // do not know yet
      break;
    default:
      sortVar = ['sets.team_id', '=', 'asc'];
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
      .select('sets.team_id',
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
      .where(speciesVar[0], speciesVar[1], speciesVar[2]) // find something better than this later
      .orderBy(sortVar[0], sortVar[1], sortVar[2])
      .limit(`${teamsAmt}`)
      .offset(`${offset}`);
  },
};

module.exports = AllService;