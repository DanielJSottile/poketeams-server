export type NewUserType = {
  user_name: string;
  date_created: string;
  password: string;
};

export interface UserType extends NewUserType {
  id: number;
}

export type PatchPokemonFolder = {
  folder_name: string;
};

export interface PostPokemonFolder extends PatchPokemonFolder {
  user_id: number;
}

export interface PokemonFolder extends PostPokemonFolder {
  id: number;
  date_created: string;
  date_modified: string | null;
}

export type PatchPokemonTeam = {
  team_name: string;
  description: string;
};

export interface PokemonTeam extends PatchPokemonTeam {
  id: number;

  date_created: string;
  date_modified: string | null;
  folder_id: number;
}

export type PatchPokemonSet = {
  nickname: string;
  species: string;
  gender: string;
  item: string;
  ability: string;
  level: number;
  shiny: boolean;
  happiness: number;
  nature: string;
  hp_ev: number;
  atk_ev: number;
  def_ev: number;
  spa_ev: number;
  spd_ev: number;
  spe_ev: number;
  hp_iv: number;
  atk_iv: number;
  def_iv: number;
  spa_iv: number;
  spd_iv: number;
  spe_iv: number;
  move_one: string;
  move_two: string;
  move_three: string;
  move_four: string;
};

export interface PokemonSet extends PatchPokemonSet {
  id: number;
  date_created: string;
  date_modified: string | null;
  team_id: number;
}
