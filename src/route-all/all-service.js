const AllService = {

  getTeamById(db, team_id) { // GET /:team_id
    return db
      .select('*')
      .from('teams')
      .join('sets', 'team.id', '=', 'sets.team_id')
      .where('id', team_id);
  },

  getSetById(db, set_id) { // GET /:team_id/:set_id
    return db
      .select('*')
      .from('sets')
      .where('id', set_id);
  },

  getFavorites(db, team_id) {
    return db
      .select()
      .from('users')
      .join('favorites', 'users.id', '=', 'favorites.user_id')
      .join('folders', 'users.id', '=', 'folders.user_id')
      .join('teams', 'folder.id', '=', 'teams.folder_id')
      .count('favorites.user_id AS likes')
      .where('favorites.team_id', team_id);
  },

  getTenTeams(db, page, sort, species) { // GET ?page=1&sort=none&species=all
    const teamsAmt = 10;
    const offset = teamsAmt * (page - 1);
    let sortVar;
    let speciesVar;

    switch(sort) {
    case 'newest':
      sortVar = 'teams.date_created';
      break;
    case 'oldest':
      sortVar = ('teams.date_created', 'asc');
      break;
    case 'alphabetical':
      sortVar = ('teams.team_name', 'asc');
      break;
    case 'rev alphabetical':
      sortVar = ('teams.team_name', 'desc');
      break;
    case 'most likes':
      sortVar = ('do not know yet'); // do not know yet
      break;
    default:
      sortVar = ('teams.date_created', 'desc');
    }

    if(species !== 'all'){
      speciesVar = ('set.species', species);
    }

    return db
      .from('users')
      .join('folders', 'users.id', '=', 'folders.user_id')
      .join('teams', 'folder.id', '=', 'teams.folder_id')
      .join('sets', 'team.id', '=', 'sets.team_id')
      .select('*')
      .where(speciesVar)
      .orderBy(sortVar)
      .limit(teamsAmt)
      .offset(offset);
  },
};

module.exports = AllService;