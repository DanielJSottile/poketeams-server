import xss from 'xss';
import { PokemonFolder, PokemonSet, PokemonTeam } from '../@types';

// Sanitization

export const sanitizeFolder = (folder: PokemonFolder) => ({
  ...folder,
  folder_name: xss(folder.folder_name),
  date_created: xss(folder.date_created),
  date_modified: xss(folder.date_modified || ''),
});

export const sanitizeTeam = (team: PokemonTeam) => ({
  ...team,
  team_name: xss(team.team_name),
  description: xss(team.description),
  date_created: xss(team.date_created),
  date_modified: xss(team.date_modified || ''),
});

export const sanitizeSet = (set: PokemonSet) => ({
  ...set,
  date_created: xss(set.date_created),
  nickname: xss(set.nickname),
  species: xss(set.species),
  gender: xss(set.gender),
  item: xss(set.item),
  ability: xss(set.ability),
  nature: xss(set.nature),
  move_one: xss(set.move_one),
  move_two: xss(set.move_two),
  move_three: xss(set.move_three),
  move_four: xss(set.move_four),
});
