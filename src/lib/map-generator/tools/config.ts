export const size = <const>{
    x: 11,
    y: 11
};

export const areas = <const>{
    void: 'V',
    wall: 'W',
    other_spawn: 'O',
    enemy_spawn: 'E',
    box_spawn: 'B'
};

export const settings = <const>{
    wall_distance: 3,
    player_distance: 2,
    box_area: 15,
    box_count: 3,
    enemy_count: 2,
    inset_walls: 3,
    max_void_count: 50,
    target_max_wall_count: 4,
    target_wall_distance: 3,
    targets_min_distance: 2
};

export const routes = <const>{
    n: [[-1, -1], [-1, 0], [-1, 1],],
    s: [[1, -1], [1, 0], [1, 1],],
    w: [[-1, -1], [0, -1], [1, -1],],
    e: [[-1, 1], [0, 1], [1, 1],],
};

export const chances = <const>{
    blank: { c: 100, r: 0, e: 0, l: 0 },
    character: { c: 30, r: 30, e: 30, l: 30 },
    dead: { c: 0, r: 0, e: 0, l: 0 },
    wall: { c: 30, r: 30, e: 30, l: 30 },
    box: { c: 30, r: 30, e: 30, l: 30 },
    target: { c: 30, r: 30, e: 30, l: 30 },
    enemy: { c: 30, r: 30, e: 30, l: 30 }
};

export const tiles = <const>{
    blank: {
        common: [
            ':black_large_square:'
        ]
    },
    character: {
        common: [
            ':grinning:',
            ':smiley:',
            ':smile:',
            ':grin:',
            ':laughing:',
            ':sweat_smile:',
            ':slight_smile:',
            ':upside_down:',
            ':kissing_heart:',
            ':kissing_smiling_eyes:',
            ':face_with_hand_over_mouth:',
            ':wink:',
            ':relieved:'
        ],
        rare: [
            ':smirk:',
            ':relaxed:',
            ':innocent:',
            ':blush:',
            ':thinking:',
            ':hugging:',
            ':face_with_monocle:',
            ':zany_face:',
            ':face_with_raised_eyebrow:',
            ':kissing_closed_eyes:',
            ':yum:'
        ],
        epic: [
            ':flushed:',
            ':heart_eyes:',
            ':disguised_face:',
            ':star_struck:',
            ':stuck_out_tongue:',
            ':stuck_out_tongue_closed_eyes:',
            ':stuck_out_tongue_winking_eye:',
            ':smiling_face_with_3_hearts:',
            ':shushing_face:',
            ':sunglasses:'
        ],
        legendary: [
            ':partying_face:',
            ':nerd:',
            ':cowboy:',
            ':smiley_cat:',
            ':smile_cat:',
            ':joy_cat:',
            ':heart_eyes_cat:',
            ':smirk_cat:',
            ':kissing_cat:'
        ]
    },
    dead: {
        common: [
            ':unamused:',
            ':disappointed:',
            ':pensive:',
            ':worried:',
            ':confused:',
            ':slight_frown:',
            ':frowning2:',
            ':persevere:',
            ':confounded:',
            ':tired_face:',
            ':weary:',
            ':sweat:',
            ':neutral_face:',
            ':expressionless:',
            ':grimacing:',
            ':fearful:',
            ':cold_sweat:',
            ':disappointed_relieved:'
        ],
        rare: [
            ':pleading_face:',
            ':cry:',
            ':sob:',
            ':face_exhaling:',
            ':triumph:',
            ':angry:',
            ':rage:',
            ':face_with_symbols_over_mouth:',
            ':exploding_head:',
            ':dizzy_face:',
            ':face_with_spiral_eyes:',
            ':zipper_mouth:',
            ':woozy_face:',
            ':head_bandage:',
            ':scream:'
        ],
        epic: [
            ':skull:',
            ':skull_crossbones:',
            ':clown:',
            ':scream_cat:',
            ':crying_cat_face:',
            ':pouting_cat:',
            ':poop:'
        ],
        legendary: [
            ':imp:',
            ':japanese_ogre:',
            ':japanese_goblin:',
            ':ghost:',
            ':alien:',
            ':space_invader:'
        ]
    },
    wall: {
        common: [
            ':brown_square:',
            ':blue_square:',
            ':orange_square:'
        ],
        rare: [
            ':green_square:',
            ':yellow_square:'
        ],
        epic: [
            ':red_square:'
        ],
        legendary: [
            ':purple_square:'
        ]
    },
    box: {
        common: [
            ':package:'
        ],
        rare: [
            ':game_die:'
        ],
        epic: [
            ':books:',
            ':shopping_cart:'
        ],
        legendary: [
            ':gift:'
        ]
    },
    target: {
        common: [
            ':negative_squared_cross_mark:',
            ':x:'
        ],
        rare: [
            ':flag_white:'
        ],
        epic: [
            ':checkered_flag:'
        ],
        legendary: [
            ':triangular_flag_on_post:'
        ]
    },
    enemy: {
        common: [
            ':bear:',
            ':snake:',
            ':shark:',
            ':crocodile:',
            ':boar:'
        ],
        rare: [
            ':wolf:',
            ':leopard:',
            ':scorpion:',
            ':tiger2:',
            ':rhino:'
        ],
        epic: [
            ':tiger:',
            ':polar_bear:',
            ':sauropod:',
            ':mammoth:'
        ],
        legendary: [
            ':lizard:',
            ':t_rex:',
            ':lion_face:'
        ]
    }
};