BEGIN;

TRUNCATE
  folders,
  teams,
  sets,
  favorites,
  users RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password)
VALUES

('test', '$2a$04$GUu7zKKswojs0zuZ3ac5BuqhGw0hmca6Q06k/qCPWwmKPfT4k03rG'),
('WalterCDolenz', '$2a$04$Y3h/zQ58ZLBEkSdNOp33zu/AUaX5HDiMkKPJ6p/62WX1UGg.rniNO'),
('SerasVictoria', '$2a$04$hvGWuaS.LxMRqo6cNXkrhe48eQyFmmgSXTtsQMI.19PvtKbRB52iC'),
('Trollmiester', '$2a$04$KzkoCWuFPOYrg9nWarMOOeg9hU.Jo/ZV.67DvZsydDu0/B.rOLfea');

INSERT INTO folders (folder_name, user_id)
VALUES

('My Best Team - OU', 1),
('Infinite Showcase - OU', 1),
('Super Strong Teams', 1),
('Sophistocated Teams', 2),
('Fun Teams', 4),
('Cute Pokemon Teams', 3),
('Monotype Team', 1);

INSERT INTO teams (team_name, description, folder_id)
VALUES

('Darkrai''s revenge', 'A team using Mega Darkrai', 2),
('Troll Team', 'I''m just going to use Clefable You know....', 5),
('OU Balance 1', 'The best team made', 4),
('Cute Mons Team', 'I just wanted Pokemon I thought were the cutest', 6),
('Test Team', 'An experimental god skwad', 1);

INSERT INTO sets (nickname, species, gender, item, ability, level, shiny, happiness, nature, hp_ev, atk_ev, def_ev, spa_ev, spd_ev, spe_ev, hp_iv, atk_iv, def_iv, spa_iv, spd_iv, spe_iv, move_one, move_two, move_three, move_four, team_id)
VALUES

('Aegi Boi', 'Aegislash', 'F', 'Choice Band', 'Stance Change', 99, true, 252, 'Brave', 165, 252, 8, 20, 8, 56, 30, 31, 29, 0, 28, 0, 'Close Combat', 'Shadow Claw', 'Iron Head','Head Smash', 4),
(null, 'Darkrai', null, 'Darkraite', 'Bad Dreams', 100, true, 255, 'Timid', 0, 0, 0, 252, 4, 252, 31, 31, 31, 31, 31, 31, 'Perdition''s Pyre', 'Dark Void', 'Nasty Plot', 'Dark Pulse', 1),
(null, 'Zygarde-Complete', null, 'Leftovers', 'Power Construct', 100, false, 255, 'Adamant', 0, 232, 0, 0, 44, 232, 31, 31, 31, 31, 31, 31, 'Thousand Arrows', 'Dragon Dance', 'Substitute', 'Dragon Tail', 1),
(null, 'Groudon-Primal', null, 'Red Orb', 'Desolate Land', 100, false, 255, 'Conscientious', 248, 0, 8, 0, 252, 0, 31, 31, 31, 31, 31, 0, 'Precipice Blades', 'Stealth Rock', 'Toxic', 'Dragon Tail', 1),
(null, 'Yveltal', null, 'Safety Goggles', 'Dark Aura', 100, false, 255, 'Fastidious', 248, 0, 180, 0, 0, 80, 31, 0, 31, 31, 31, 31, 'Foul Play', 'Taunt', 'Roost', 'Toxic', 1),
('Water God', 'Arceus-Water', null, 'Splash Plate', 'Multitype', 100, true, 255, 'Meticulous', 248, 0, 244, 0, 0, 16, 31, 0, 31, 31, 31, 31, 'Ice Beam', 'Defog', 'Recover', 'Toxic', 1),
(null, 'Arceus-Infinite', null, 'Infinitium Z', 'Multitype', 100, false, 255, 'Timid', 248, 0, 8, 0, 148, 196, 31, 0, 31, 31, 31, 31, 'Gravity Beam', 'Will-O-Wisp', null, null, 2);

INSERT INTO favorites (team_id, user_id)
VALUES

(3, 1),
(3, 2),
(3, 3),
(3, 4),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(1, 1),
(1, 4),
(5, 2),
(5, 3),
(5, 4);

COMMIT;