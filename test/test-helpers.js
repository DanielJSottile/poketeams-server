const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Make functions for EVERY kind of table you have
in your database.  They will go here and return an 
array of objects.*/

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test",
      password: "password",
      date_created: "2020-05-17T17:55:49Z",
      date_modified: null,
    },
  ];
}

function makeFoldersArray() {
  return [
    {
      id: 1,
      folder_name: "My Best Team - OU",
      user_id: 1,
      date_created: "2020-05-17T17:55:49Z",
      date_modified: null,
    },
  ];
}

function makeTeamsArray() {
  return [
    {
      id: 1,
      team_name: "Darkrai's revenge",
      folder_id: 1,
      description: "A team using Mega Darkrai",
      date_created: "2020-05-17T17:55:49Z",
      date_modified: null,
    },
  ];
}

function makeSetsArray() {
  return [
    {
      id: 1,
      nickname: "Aegi Boi",
      species: "Aegislash",
      gender: "F",
      item: "Choice Band",
      ability: "Stance Change",
      level: 99,
      shiny: true,
      happiness: 252,
      nature: "Brave",
      hp_ev: 165,
      atk_ev: 252,
      def_ev: 8,
      spa_ev: 20,
      spd_ev: 8,
      spe_ev: 56,
      hp_iv: 30,
      atk_iv: 31,
      def_iv: 29,
      spa_iv: 0,
      spd_iv: 28,
      spe_iv: 0,
      move_one: "Close Combat",
      move_two: "Shadow Claw",
      move_three: "Iron Head",
      move_four: "Head Smash",
      team_id: 1,
      date_created: "2020-05-17T17:55:49Z",
      date_modified: null,
    },
  ];
}

/* Next, make a Fixtures function that creates a fixture of the
collection of the arrays as single entities.*/

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testFolders = makeFoldersArray();
  const testTeams = makeTeamsArray();
  const testSets = makeSetsArray();

  return { testUsers, testFolders, testTeams, testSets };
}

/* Next, Make a clean table that truncates all the tables in your 
test db and RESTART IDENTIY CASCADE at the end*/

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      folders,
      teams,
      sets,
      favorites
      RESTART IDENTITY CASCADE`
  );
}

/* Finally, make tables that seed your database.  You will have
a seedUsers function already made for you below, as well as the 
AuthHeader function*/

function seedUsers(db, users) {
  const hashedUsers = users.map((user) => {
    return {
      ...user,
      password: bcrypt.hashSync(user.password, 1),
    };
  });
  return db
    .into("users")
    .insert(hashedUsers)
    .then(() => {});
}

function seedOtherTables(db, users, folders, teams, sets) {
  return seedUsers(db, users)
    .then(() => db.into("folders").insert(folders))
    .then(() => db.into("teams").insert(teams))
    .then(() => db.into("sets").insert(sets));
}

// rest of seeding

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({}, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeFoldersArray,
  makeTeamsArray,
  makeSetsArray,
  makeFixtures,
  cleanTables,
  seedUsers,
  seedOtherTables,
  makeAuthHeader,
};
