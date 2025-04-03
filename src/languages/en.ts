import Config from '../configs';

export const config = {
    iso: 'en',
    name: 'English',
    emoji: '🇬🇧',
    availableFor: ['en', 'en-EN']
};

export const __ = {
    format: 'D [day] H [hour] m [minute] s [second]',
    date_format: 'en-EN',
    _global: {
        error: 'Error',
        success: 'Successful',
        error_occured: 'An error occurred, please try again.',
        error_title: 'An error occurred...',
        success_occured: 'Operation completed successfully.',
        success_title: 'Completed!',
        page_not_found: 'Hmm, there\'s nothing to show here...',
        connected: 'Connected',
        not_connected: 'Not connected',
        are_you_sure: 'Are you sure?',
        pls_fast_response: 'Please respond quickly.',
        error_fields: 'Can\'t solve it? No problem',
        error_fields_desc: 'Our team is always with you! You can get support by coming to [support server](' + Config.main.support + ')',
        task: 'Mission Completed',
        task_occured: 'Task completed successfully',
    },
    captcha: {
        title: 'Anti-Automation',
        description: 'You need to press the button that contains the emoji of the animal written in the picture and is the color of the text.',
        step: 'Step {now}/{total}',
        banned: {
            title: 'Time Out',
            desc: 'You need to wait until {date} because you failed to pass the verification.'
        },
        failed: {
            title: 'Verification Failed',
            desc: 'You failed to pass the verification because you pressed the wrong button.'
        },
        emoji_names: [
            'dog',
            'cat',
            'mouse',
            'hamster',
            'rabbit',
            'fox',
            'bear',
            'panda',
            'koala',
            'tiger',
            'lion',
            'cow',
            'pig',
            'frog',
            'monkey',
            'chicken',
            'penguin',
            'bird',
            'duck',
            'eagle',
            'owl',
            'bat',
            'wolf',
            'horse',
            'bee',
            'caterpillar',
            'butterfly',
            'snail',
            'worm',
            'fish',
            'dolphin',
            'crocodile',
            'elephant',
            'sheep',
            'pigeon',
            'parrot'
        ]
    },
    cases: {
        angels_screams: "Angels' Scream",
        tears: "Tears",
        glory: "Glory",
        badge: "Badge Case",
        items: {
            ordinary: "Ordinary",
            rare: "Rare",
            epic: "Epic",
            partner_random: "Random Partnership Subscription",
            partner_random_desc: "**{name}** successfully came out of the case. You can use the obtained item in any server you want. We have placed the item you obtained in your inventory for you.",
            badge_desc: "**{name}** successfully came out of the case. You can use this badge from your inventory or list it for sale.",
            badge_flowers: 'Are Flowers Beautiful? Badge',
            badge_flowers_description: 'Fragrant flowers!',
            badge_snacks: 'Snacks Badge',
            badge_snacks_description: 'Delicious, isn\'t it?',
            badge_hunter: 'Hunter Badge',
            badge_hunter_description: 'Ooh! A real hunter',
            badge_hrktbrkt: 'H.R.K.T B.R.K.T Badge',
            badge_hrktbrkt_description: 'Movement, abundance.',
            badge_blood: 'Blood Badge',
            badge_blood_description: 'Blood, blood, blood!',
            badge_doctor: 'Doctor Badge',
            badge_doctor_description: 'Heal everyone',
            badge_tears: 'Wipe Your Tears Badge',
            badge_tears_description: 'It doesn\'t suit you',
            badge_hand_of_god: 'Hand of God Badge',
            badge_hand_of_god_description: 'God bless you',
            badge_road_of_kings: 'Badge of the Way of Kings',
            badge_road_of_kings_description: 'Walk in the way of the King',
            badge_dreams: 'Badge of Dreams',
            badge_dreams_description: 'DMT.',
            badge_riddles: 'Riddles Badge',
            badge_just_nyde: 'Nigde Gazozu',
            badge_just_nyde_description: 'Loiren\'s favorite soda.',
            badge_riddles_description: 'They all have a secret...',
            badge_developer: 'Developer Badge',
            badge_v5: 'Who\'s Left from the Old Days?',
            badge_v5_description: 'The good times are long gone...',
            developer_description: 'Creator of the Dark masterpiece.',
            badge_financial_partner: 'Financial Partner Badge',
            badge_financial_partner_description: 'Big thanks!',
            partner_url: "Custom URL",
            shop_partner_random_desc: "By purchasing this subscription, you increase the usage count of the random partner command.",
            shop_partner_url_desc: "You can define a custom URL for your server, making it easier for users to find you.",
            shop_partner_random_content: "10 subscriptions for 1 purchase",
            shop_partner_url_content: "1 URL",
            guild_prefix: 'Server Prefix',
            shop_guild_prefix_desc: 'You can change the prefix of your server. You will use commands using the prefix of your choice.',
            shop_guild_prefix_content: '1 prefix can be added',
        }
    },
    errors: {
        mode_development: 'The bot is currently in **development** mode, and commands cannot be used.',
        user_banned: 'You are banned from passing through this gate for **{reason}**. Please contact an authority for assistance.',
        missing_permissions: 'You must have the {permissions} permissions to use this command.',
        owner_only: 'You must be a **developer** to use this command.',
        staff_only: 'You must be **staff** to use this command.',
        error_occured: '🐛 An error occurred while using the command, please try again later and [contact us](https://discord.gg/partnerbot). `(0x{code})`',
        error_occured_author: '{user} - Error Occurred',
        error_occured_footer: 'You can help us by reporting errors',
        cooldown_wait: 'Please wait {time} before trying to use the command again.',
        not_allowed: 'This command is not among the allowed test commands.',
        vote: 'You need to [vote](https://top.gg/bot/1157779657467379823/vote) for the bot to use this command.',
        not_whitelisted: 'You can only use commands in your test server. To specify your test server, send the server ID to the {channel} channel by adding `test:` to the beginning of your server ID. \n1. If it is suitable, the bot will react to the message.\n2. The last ID sent will be valid.\n3. You need to specify it again when the bot restarts.'
    },
    images: {
        partner_channel_no_channel: 'https://media.discordapp.net/attachments/864489171075072010/1114269089997803651/image.png',
        partner_log_no_channel: 'https://media.discordapp.net/attachments/864489171075072010/1114271582400041041/image.png',
        partner_staff_no_role: 'to be entered'
    },
    events: {
        save_permissions: {
            author: 'Set Permissions',
            footer: 'We store this data to provide you with a better experience.',
            title: 'Save Permissions',
            fields_name: '👀 Information',
            fields_value: 'You can delete your data by coming to our support server. Please note that these data will not be shared with **third parties** and can only be viewed by developers.',
            page_1: '> **Permission 1:** Should we record all partnership transactions you make? Should we record it when you make a partnership, or should it be your choice? Please click the buttons below to answer.',
            page_2: '> **Permission 2:** Should we record all transactions of your server case? Briefly, when one of your authorities withdraws money from the case, etc., we will record it and show it to you when you want to view it.',
            page_loading: '> Please wait a bit while we try to detect the permissions you gave...',
            buttons_yes: 'Yes, record',
            buttons_no: 'No, do not record',
            buttons_back: 'Go back',
            saved: '> Your permissions have been successfully saved! The command you want to use will be executed in **3 seconds**.'
        },
        partner: {
            approve_title: 'Partnership made with the {guild} server.',
            join_button: 'Join the Server',
            settings_error: 'It seems like you haven\'t made the necessary settings to make a partnership. If you think this is an error, please report it to the authorities.',
            settings_error_target: 'The target server does not seem to have made the necessary settings for partnership.',
            role_error: 'An error occurred while removing your roles. Please try again later.',
            permission_denied: 'You must have the <@&{role}> role or **Administrator** permission to perform this operation.',
            request_not_found: 'The partnership request you are trying to perform does not seem valid.',
            blacklist_error: 'This server has blacklisted you or your partnership category. You can try contacting the server authorities.',
            blacklist_error_this: 'You have blacklisted this server. You cannot make a partnership with a server you have blacklisted.',
            target_settings_error: 'There seems to be an issue with the settings of the target server. You cannot make a partnership.',
            channel_settings_error: 'Your partnership channel could not be found or is not of type **Text (GUILD_TEXT)**.',
            loading_author: 'You crazy thing! Wait a bit...',
            loading_description: 'You\'re crazy, man! Performing the partnership process... Just wait a bit!',
            loading_footer: 'With this partnership, you will have a total of {count} partnerships.',
            mention_error: 'I cannot use `@everyone` and `@here` tags in this server. Please check my permissions.',
            target_mention_error_author: 'Oh! I don\'t have the required permissions...',
            target_mention_error: 'This is bad; I cannot use `@everyone` and `@here` tags in your server. You cannot make partnerships with servers. Please check my permissions.',
            target_mention_error_2: 'I do not have sufficient permissions in the target server. The partnership cannot be realized.',
            no_channel_permission_error: 'I do not have permission to send messages to the partnership channel. You cannot approve any partnerships without opening this permission.',
            target_no_channel_permission_error_author: 'I cannot send messages to the channel...',
            target_no_channel_permission_error_desc: 'I do not have permission to send messages to your partnership channel. You cannot approve any partnerships without opening this permission, or the servers you requested partnerships with cannot approve your partnership.',
            target_no_channel_permission_error: 'I do not have permission to send messages to the partnership channel of the target server. The partnership cannot be realized.',
            logs: {
                accept_author: `Positive — Request accepted`,
                deny_author: `Negative — Request denied`,
                accept_description: `• Partnership made with **{guild}** server.`,
                deny_description: `• Partnership not made with **{guild}** server.`,
                embed_fields_1_name: '‧ Offeror',
                accept_fields_2_name: '‧ Approved by',
                deny_fields_2_name: '‧ Denied by',
                embed_fields_3_name: '‧ Total Partnerships',
                deny_fields_4_name: '‧ Denial Reason',
            },
            deny_modal_title: 'Deny Partnership Request',
            deny_modal_placeholder: 'Write a valid reason...',
            already_blacklist: 'This server is already blacklisted.',
            deny_modal_label: 'Denial reason',
            permission_error: 'You must have the <@&{role}> role or **Administrator** permission to perform this operation.',
            success: 'Partnership successfully realized.',
            blacklist_success: '**{guild}** has been successfully blacklisted.',
            view_text_footer: 'This is a preview only and may vary.'
        },
        botlist: {
            addBot: {
                modals: {
                    title: 'Add Bot',
                    input_1_label: 'Bot ID',
                    input_2_label: 'Bot Prefix',
                    input_pin_label: 'Security Code',
                },
                errors: {
                    invalid_bot_id: 'The entered bot ID seems invalid. If you think this is an error, please report it to the developer.',
                    bot_not_public: 'The entered bot ID is not public. Please make the bot public in its settings and try again.',
                    bot_not_enough_server: 'The entered bot ID does not have the required number of servers set by the server.',
                    invalid_channel: 'The server registration channel is not valid or not of type **Text (GUILD_TEXT)**.',
                    invalid_pin: 'The entered **security code** is not valid. If you think this is an error, please contact an authority.',
                    bot_blacklisted: 'The entered bot has been blacklisted. You cannot add this bot.',
                    bot_in_queue: 'The entered bot is already in the queue. Please wait for the approval of the authorities.',
                    bot_not_in_topgg: 'The entered bot could not be found on Top.gg. Please add your bot to Top.gg and try again.',
                    bot_already_in_list: 'The bot entered is already on the list. Please wait for the authorities to approve it.',
                    bot_in_server: 'The bot is already on the server, if you think this is a bug, contact the staffs',
                },
                request: {
                    author: 'Bot Added',
                    fields: [
                        {
                            name: '‧ Bot Name',
                            value: '**╰** {bot_name}',
                            inline: true
                        },
                        {
                            name: '‧ Bot Prefix',
                            value: '**╰** {bot_prefix}',
                            inline: true
                        },
                        {
                            name: '‧ Bot ID',
                            value: '**╰** {bot_id}',
                            inline: true
                        },
                        {
                            name: '‧ Server Count',
                            value: '**╰** {bot_guilds}',
                            inline: true
                        },
                        {
                            name: '‧ DBL (Top.gg) Approval',
                            value: '**╰** {bot_dbl}',
                            inline: true
                        },
                        {
                            name: '‧ Applicant',
                            value: '**╰** {bot_owner}',
                            inline: true
                        },
                        {
                            name: '‧ Terms of Use',
                            value: '**╰** {bot_terms}',
                            inline: true
                        },
                        {
                            name: '‧ Privacy Policy',
                            value: '**╰** {bot_privacy}',
                            inline: true
                        },
                        {
                            name: '‧ Bot Website',
                            value: '**╰** {bot_website}',
                            inline: true
                        },
                        {
                            name: '‧ Support Server',
                            value: '**╰** {bot_support}',
                            inline: true
                        },
                        {
                            name: '‧ Discord Approval',
                            value: '**╰** {bot_discord_verified}',
                            inline: true
                        },
                        {
                            name: '‧ Github Link',
                            value: '**╰** {bot_github}',
                            inline: true
                        },
                        {
                            name: '‧ Bot Description',
                            value: '**╰** {bot_description}',
                        },
                        {
                            name: '‧ Bot Tags',
                            value: '**╰** {bot_tags}',
                        }
                    ],
                    approved: 'Approved.',
                    unapproved: 'Not approved.',
                    click: 'Click',
                    no: 'Not found.',
                    approve: 'Approve Bot',
                    deny: 'Deny Bot',
                    view: 'Add Bot',
                    success: '**{bot_name}** has been successfully added. Please be patient until the authorities **approve/deny** it.',
                    footer: 'The bot is automatically considered approved as soon as you add it to the server.'
                }
            },
            autoApprove: {
                footer: 'This bot was approved before being added to the server.',
                staff: 'Automatically approved by being added to the server.',
                author: '— Approved',
                fields: [
                    {
                        name: '‧ Bot Name',
                        value: '**╰** {bot_name}',
                        inline: true
                    },
                    {
                        name: '‧ Bot ID',
                        value: '**╰** {bot_id}',
                        inline: true
                    },
                    {
                        name: '‧ Approving Staff',
                        value: '**╰** {staff}',
                        inline: true
                    }
                ],
                reject: {
                    author: '— Denied',
                    fields: [
                        {
                            name: '‧ Bot Name',
                            value: '**╰** {bot_name}',
                            inline: true
                        },
                        {
                            name: '‧ Bot ID',
                            value: '**╰** {bot_id}',
                            inline: true
                        },
                        {
                            name: '‧ Denying Staff',
                            value: '**╰** {staff}',
                            inline: true
                        },
                        {
                            name: '‧ Denial Reason',
                            value: '**╰** {reason}'
                        }
                    ],
                    footer: 'If you think there is an error, please contact the authorities.',
                    modals: {
                        title: 'Deny Bot',
                        input_label: 'Denial reason',
                        input_placeholder: 'These commands are not working: bla, bla, bla...'
                    },
                    no_reason: 'No reason provided.',
                }
            }
        },
        locale: {
            title: 'Language Selected as EN',
            author: 'Successful',
            description: 'Your language was successfully set to English, after 5 seconds the command you used will be executed.',
        },
        leaveGuard: {
            reason: 'The bot owner has quit the server.',
            author: 'Quit Server',
            description: '**{member}** has been kicked off the server and all bots have been kicked.',
            footer: 'This user\'s total {count} bots have been kicked from the server.',
        },
        mention: {
            author: '👋 Hello - {user}',
            title: '🌺 Me again, again, again!',
            description: '> Hi, did you call me? 😎\n> **Dark** me, also known as **Dark Partner.** I\'m the best partner bot. Instead of doing partnering manually, you can automate it by adding me to your server. You can partner with hundreds of servers using **Dark** and contribute to the development of your server. You can access commands by typing **{prefix}help**. If you have a problem, please join the **support server**',
            fields: [
                {
                    name: '‧ Guild Count',
                    value: '**╰** {guilds}',
                },
                {
                    name: '‧ Socket Delay',
                    value: '**╰** {ping}ms',
                },
                {
                    name: '‧ Server Prefix',
                    value: '**╰** {prefix}',
                }
            ],
            buttons: {
                invite: 'Invite to your server',
                support: 'Support Server',
                vote: 'Vote',
            },
            footer: `Dark, best since 2021-${new Date().getFullYear()}`,
        },
        maintenance: {
            defaultReason: 'No reason',
            title: '🚧 We\'re working right now!',
            author: '{user} - Maintenance Mode',
            Description: [
                'In order to provide you with better and more stable service, we are working in maintenance mode',
                'You will not be able to use **Dark** until maintenance mode is turned off',
                'For more information, you can contact the [support server](' + Config.main.support + ')',
                '',
                'Reason for maintenance: **{reason}**'
            ].join('\n'),
            footer: 'Dark, ©️ ' + new Date().getFullYear() + ''
        },
        badge_v5: 'For using version **v5.0.0** you have earned the badge **Who\'s Left from the Old Days** and received a reward of **50** coins, Congratulations! :clap: *(the command you used will be executed after 5 seconds)*',

    },
    minigame: {
        hangman: {
            author: '- Hangman',
            finished_author: '- Successfully Completed',
            lose_author: '- You lost',
            time_is_up_author: '- Time Expired',
            word: 'Word',
            letters: 'Letters',
            exit: 'Exit',
            next: 'Next',
            prev: 'Previous',
            finished_desc: '‧ You are a hero, you saved a hanging man! The game was successfully completed. Congratulations. 👏',
            guess_correct_desc: '‧ **{word}** was guessed correctly. Congratulations, you saved the man and got your reward. 👏',
            finished_desc_first_guess: '‧ You are brilliant! You guessed the word **{word}** without taking any letters. Congratulations, you saved the man and got your reward. 👏',
            lost: 'You lost',
            time_is_up: 'Time is up',
            guess: 'Guess',
            guess_modal: {
                label: 'Write your guess',
                title: 'Guess'
            },
            guess_incorrect: 'Incorrect guess',
            coin: 'Prize',
            no: 'None',
            words: [
                'hello', 'apple', 'table', 'book', 'house', 'cat', 'dog', 'glasses', 'computer', 'school',
                'sun', 'rain', 'umbrella', 'bag', 'phone', 'music', 'movie', 'pen', 'love', 'air',
                'color', 'blue', 'orange', 'coffee', 'tea', 'chair', 'door', 'window', 'tree', 'flower',
                'butterfly', 'car', 'bicycle', 'airplane', 'ship', 'cloud', 'sky', 'sea', 'forest', 'mountain',
                'night', 'day', 'star', 'moon', 'year', 'week', 'day', 'hour', 'minute', 'second',
                'breakfast', 'lunch', 'dinner', 'night', 'coffee', 'tea', 'milk', 'water', 'bread', 'cheese',
                'pizza', 'hamburger', 'sports', 'soccer', 'basketball', 'volleyball', 'running', 'swimming', 'camping',
                'picnic', 'winter', 'spring', 'summer', 'fall', 'animal', 'bird', 'fish', 'monkey', 'elephant',
                'wolf', 'rabbit', 'lion', 'turtle', 'crocodile', 'cobra', 'guitar', 'piano', 'violin', 'flute',
                'painting', 'sculpture', 'museum', 'history', 'geography', 'mathematics', 'physics', 'chemistry', 'biology',
                'robot', 'space', 'planet', 'newspaper', 'magazine', 'radio', 'television', 'internet', 'science',
                'password', 'secret', 'lawyer', 'doctor', 'engineer', 'student', 'art', 'literature', 'poetry',
                'novel', 'song', 'music', 'dance', 'smile', 'happy', 'sad', 'fear', 'joy', 'anger',
                'patience', 'hope', 'trust', 'freedom', 'glasses', 'computer', 'hamburger', 'sky', 'colorful', 'bookshelf', 'aquarium', 'hat', 'candy', 'banana',
                'radio', 'facade', 'piggy bank', 'passenger', 'mysterious', 'sweater', 'seagull', 'whale', 'glasses', 'fear',
                'smiling', 'fruit', 'pirate', 'pilot', 'lookout', 'swallow', 'fairy tale', 'wind', 'white', 'noise',
                'bell', 'light', 'guitarist', 'sunflower', 'coffee', 'toy', 'ice cream', 'dreams', 'north', 'fisherman',
                'knight', 'towel', 'shovel', 'wall', 'map', 'street', 'turtle', 'puzzle', 'biscuit', 'joy',
                'fried', 'beach', 'beach', 'octopus', 'flowery', 'basket', 'ladder', 'pirate', 'mischievous', 'garden',
                'library', 'hero', 'car', 'hat', 'fish', 'glasses', 'rainbow', 'oil lamp', 'ice cream', 'butterfly',
                'ruler', 'bell', 'table', 'cookie', 'cloud', 'sock', 'mermaid', 'sailboat', 'queen', 'climber',
                'wind', 'bicycle', 'noise', 'radio', 'bird', 'spongebob', 'robot', 'cute', 'grass', 'shoe',
                'deer', 'blueberry', 'barbecue', 'watermelon', 'notebook', 'butterfly', 'finger', 'north', 'caravan', 'nature',
                'password', 'sand', 'yellow', 'red', 'wolf', 'tulip', 'sunshine', 'in the forest', 'captain', 'savior',
                'tiny', 'movie', 'sky', 'balloon', 'bottle', 'mirror', 'ice', 'swan', 'kite', 'broken',
                'mystery', 'sweater', 'seagull', 'whale', 'glasses', 'fear', 'smile', 'fruit', 'pirate', 'pilot',
                'lookout', 'swallow', 'tale', 'wind', 'white', 'noise', 'bell', 'light', 'guitarist', 'sunflower',
                'coffee', 'toy', 'ice cream', 'dreams', 'north', 'fisherman', 'knight', 'towel', 'shovel', 'wall',
                'map', 'street', 'turtle', 'puzzle', 'biscuit', 'joy', 'fried', 'beach', 'sandy beach', 'octopus',
                'flowery', 'basket', 'ladder', 'pirate', 'mischievous', 'garden', 'library', 'hero', 'car', 'hat',
                'fish', 'glasses', 'rainbow', 'oil lamp', 'ice cream', 'butterfly', 'ruler', 'bell', 'table', 'cookie',
                'cloud', 'sock', 'mermaid', 'sailboat', 'queen', 'mountaineer', 'wind', 'bicycle', 'noise', 'radio',
                'bird', 'spongebob', 'robot', 'cute', 'grass', 'shoe', 'deer', 'white', 'barbecue', 'watermelon',
                'notebook', 'butterfly', 'finger', 'north', 'caravan', 'nature', 'password', 'sand', 'yellow', 'red', 'wolf',
                'tulip', 'sunshine', 'in the forest', 'captain', 'savior', 'tiny', 'movie', 'sky', 'balloon', 'bottle',
                'mirror', 'ice', 'swan', 'kite', 'broken', 'rainfall', 'crunch', 'color', 'mind', 'giant', 'steppe',
                'sunset', 'planet', 'galaxy', 'glasses', 'fun', 'provocative', 'talkative', 'cuteness', 'peace',
                'eyebrow', 'small', 'beauty', 'gift', 'joyful', 'food', 'sweet', 'cartoon', 'nightgown', 'sand',
                'piggy bank', 'octopus', 'candy', 'clothes', 'safety', 'science', 'interesting', 'robotics', 'weather', 'sailing',
                'beach', 'seashore', 'bus', 'letter', 'nail polish', 'clothes', 'champagne', 'bright', 'fraction', 'laboratory',
                'adventure', 'metal', 'magnet', 'family', 'north', 'attractive', 'dog', 'curiosity', 'hurriyet', 'idea',
                'potato', 'piggy bank', 'creative', 'photo', 'beautiful', 'canary', 'screen', 'show', 'facade', 'instrument',
                'notebook', 'flare', 'light', 'telescope', 'thermal', 'potato', 'airplane', 'time', 'icy', 'board',
                'ring', 'fudge', 'storm', 'shiny', 'shadow', 'power', 'style', 'drink', 'layer', 'lip',
                'rain', 'light', 'sunshine', 'square', 'bench', 'beautiful', 'universe', 'flower', 'mystery', 'hidden'
            ]
        },
        puzzle: {
            you: 'You',
            box: 'Box',
            enemy: 'Enemy',
            dead: ':skull: You are dead!',
            dead_desc: 'You died because you interacted with an enemy. **Try again.**',
            exit: ':door: You Exited',
            exit_desc: 'The game was terminated because you gave up and you didnt get any prizes',
            win: '👀 Great, you won!',
            win_desc: 'Congratulations, you have successfully completed the game and received your reward.\n:skull: Kill(s): **{killCount}**',
            loading: 'Your map is being prepared, please wait a moment. We are building your **map** as soon as possible.',
            waiting: 'A map is already being created for you, please wait.',
            error: 'An error has occurred, please try again later',
        }
    },
    commands: {
        guide: {
            not_loaded: 'There was a problem loading articles.',
            min_search: 'Search term must be at least 3 characters',
            search_result: {
                title: 'Search Results',
                description: 'Choose the article you want to read',
                select: 'Select an article',
                category: 'Category'
            },
            not_found: 'The article you are looking for was not found.',
            main: {
                title: 'Guide',
                description: {
                    _1: 'Specify the ID of the article you want to read when using the command.',
                    _2: 'Authors: {list}'
                },
                not_found: {
                    name: 'Item not found',
                    value: 'There is no item to list.'
                },
                footer: 'Contribute - {link}'
            }
        },
        staff: {
            actions: {
                blacklist: {
                    name: 'Karaliste',
                    sub: {
                        add: 'Add',
                        remove: 'Take it off',
                        check: 'Question'
                    }
                },
                warn: {
                    name: 'Warning',
                    sub: {
                        send: 'Warn',
                        remove: 'Remove',
                        check: 'Question'
                    }
                }
            }
        },
        writewin: {
            words: [
                'apple',
                'pear',
                'watermelon',
                'melon',
                'banana',
                'strawberry',
                'cherry',
                'apricot',
                'grape',
                'pomegranate',
                'human',
                'animal',
                'plant',
                'tree',
                'flower',
                'tennis',
                'soccer',
                'darkpartner',
                'discord',
                'bot',
                'software',
                'coding',
                'programming',
                'javascript',
                'typescript'
            ],
            gameStarted: 'Game started',
            description: 'Summer win game has started, type the following word in **5 seconds**.\n****{word}****'
        },
        ping: {
            msg: '⏱️ Pong! **{ping}ms** *socket delay*'
        },
        partner: {
            channel: {
                no_channel: 'You must tag a valid channel to use this command.',
                success: 'The partner channel was successfully set to <#{channel}>. The partnership requests you accepted will be sent to the channel you set.',
            },
            log: {
                no_channel: 'You must tag a valid channel to use this command.',
                success: 'The partner registration channel was successfully set to <#{channel}>. Your partnership related actions will be sent to this channel.',
            },
            staff: {
                no_role: 'You must tag a valid role to use this command.',
                success: 'The partner authority role was successfully set to <@&{role}>. Users who want to take actions related to the partnership must have this role or have **Administrator authority**.',
            },
            text: {
                author: 'Tuning',
                author_customize: 'Customize',
                footer: 'You can customize the partner text if you wish.',
                footer_customize: 'Great! You are making your partner text more modern.',
                description: '> To make a partner you need a partner text, select an action by pressing the buttons below, or you can press the **"Customize "** button to get a more modernized text. Dont forget to use the following variables.',
                description_customize: '> You can use this menu to make your partner text more modern. The partner text you set will be automatically placed in **"Description "**.',
                set: 'Set',
                customize: 'Customize',
                buttons_back: 'Back',
                buttons_author: 'Header Text',
                buttons_image: 'Image',
                buttons_thumbnail: 'Thumbnail',
                buttons_join_button: 'Join server button',
                buttons_status_button: 'Activate personalizations',
                buttons_status_button_disabled: 'Disable personalizations',
                fields: [
                    {
                        name: 'Available variables',
                        value: [
                            '- `{ guild_name }` - Server name',
                            '- `{ guild_owner } ` - Server owner',
                            '- `{ total_partners } ` - Total number of partners',
                            '- `{ member_count } ` - Number of members on the server',
                            '- `{ member_count.filter } ` - Filtered member count (does not show bots)',
                            '- `{ member_count.online } ` - Number of members online',
                            '- `{ member_count.offline } ` - Number of offline members',
                        ].join('\n')
                    }
                ],
                customize_fields: [
                    {
                        name: 'Available variables',
                        value: [
                            '- `{ guild_name } ` - Server name',
                            '- `{ guild_icon } ` - Server icon',
                        ].join('\n')
                    }
                ],
                modals: {
                    title: 'Set partner text',
                    title_2: 'Customize partner text',
                    placeholder: 'Write your magic partner text here!',
                    label: 'Partner text',
                    success: 'Your partner script was set successfully.\n- Total characters: `{ length } `, Total lines: `{ lines } `, Total words: `{ words } `',
                    link_error: 'Your partner post does not contain a valid **Discord Invite Link**. Add it and try again.',
                    author_label: 'Headline',
                    author_placeholder: 'Write your magic caption here!',
                    author_icon_label: 'Header icon',
                    author_icon_placeholder: 'Enter a URL here.',
                    author_icon_error: 'You must enter a valid URL.',
                    author_success: 'Your header was set successfully.',
                    image_label: 'Image',
                    image_placeholder: 'Enter a URL here.',
                    image_error: 'You must enter a valid URL.',
                    image_success: 'Your image was set successfully.',
                    thumbnail_label: 'Thumbnail',
                    thumbnail_placeholder: 'Enter a URL here.',
                    thumbnail_error: 'You must enter a valid URL.',
                    thumbnail_success: 'Your thumbnail was set successfully.',
                }
            },
            status: {
                success_disable: 'Your partner status has been successfully disabled. Servers can no longer send requests to you or you can no longer send requests to any server.',
                text: 'Partner Text',
                channel: 'Partner Channel',
                log: 'Partner Registration Channel',
                staff: 'Partner Officer',
                not_set: 'You have not set the necessary settings to turn on partner status.\n`{ not_set } `.',
                author: 'Select category',
                footer: 'Please choose your partner category carefully and correctly.',
                description: '> You need a category to open your partner status, please choose a suitable category from the drop-down menu below.',
                fields_1_name: '⚠️ Be careful',
                fields_1_value: 'Please choose your category carefully and correctly. Otherwise we may impose penalties. Also, all servers can view your category.',
                fields_2_name: '✨ Your affiliate code has been generated',
                fields_2_value: '**{id}** is your affiliate code. If you want to partner with servers, they can send you partnerships with this code, if you partner too much, your code will be reset and a new code will be created.',
                menu_placeholder: 'Choose a category suitable for your server...',
                footer_2: 'This is great! You selected your category.',
                success: '> You have successfully selected your category as **{category}**. Your partner status is now active and this means that other servers can send you partners or you can send them partners.'
            },
            must: {
                reset: 'reset',
                no_number: 'You must enter a valid number to use this command.',
                member_count_error: 'Your partner requirement cannot be more than your server member count.',
                max_error: 'Your partner requirement can be maximum **{max}**.',
                reset_success: 'Your partner requirement was reset successfully.',
                success: 'Your partner requirement was successfully set to **{must}**. Sub **{must}** member servers will no longer be able to send you requests.',
            },
            blacklist: {
                errors_partner_status: 'Your partner status is off, you must enable partner status to use this command.',
                errors_no_value: 'You must enter **Category, Server Partnership Code or Server ID(s)** to use this command.',
                errors_invalid_value: 'Server codes or IDs cannot contain spaces.',
                errors_invalid_guild: 'The server code or ID you entered does not appear to belong to a valid server.',
                errors_guild_already_blacklisted: 'This server is already blacklisted',
                errors_category_already_blacklisted: 'This category is already blacklisted',
                errors_category_not_blacklisted: 'This category is not already blacklisted.',
                errors_guild_not_blacklisted: 'This server is not already blacklisted.',
                added_category: 'You have successfully blacklisted the **{category}** category.',
                added_guild: 'You have successfully blacklisted the server with ID **{id}**.',
                removed_category: 'You have successfully removed the **{category}** category from the blacklist.',
                removed_guild: 'You have successfully removed the server with ID **{id}** from the blacklist.',
                add: 'add',
                remove: 'remove',
                list: 'list',
                list_author: 'Server Blacklists',
                list_footer: 'Limiting can be applied even if there are too many blacklists.',
                errors_invalid_subcommand: 'You must enter a valid subcommand. Subcommands: `add, remove, list`',
            },
            send: {
                must_error: 'You must have **{member_count}** members to partner with this server.',
                fetch_owner_error: 'There was a problem with the Discord API, the server owner could not be retrieved. Please try again later or contact an administrator.',
                already_request_error: 'You have already sent a partnership request to this server, if your request is not accepted it will be deleted and you can send a request again.',
                timeout_error: 'You have recently partnered with this server. You must wait <t:{time}:R> to partner again.',
                guild_channel_error: 'No partner channel found on this server or the channel type is not a text channel.',
                target_guild_channel_error: 'The partner channel of the opposite server was not found or the channel type is not text channel.',
                unknown_error: 'An unknown problem occurred while sending a partnership request to the other server.',
                embed: {
                    author: 'Partnership Request - from {guild_name} server',
                    description: '◽ **-** You must wait **12 hours** to partner with the server again.\n◽ **-** The server will be heavily penalized if the reason for rejection does not follow our rules.\n<:blank:1077661993705689129>',
                    fields_1_name: '‧ Server Owner‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_2_name: '‧ Total Members‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_3_name: '‧ Partner Category',
                    fields_4_name: '‧ Number of Partnerships',
                    fields_5_name: '‧ Number of Connections',
                    fields_6_name: '‧ Potential Member',
                    fields_7_name: '‧ Detailed Member Information',
                },
                buttons_approve: 'Approve Request',
                buttons_deny: 'Deny Request',
                buttons_blacklist: 'Blacklist Server',
                buttons_info: 'View Partner Text',
                success: 'A partnership request was successfully sent to the **{guild}** server. Although the other server accepted the request, the partnership will still take place.',
                code_not_found: 'You must enter a **partnership code** to use this command.',
                guild_not_found: 'The **{code}** does not appear to belong to a valid server. If you think this is an error, please contact an administrator.',
                status_disabled: 'Your servers partnership status is not active. To partner with a server, you must enable its partner status.',
                blacklist_error: 'The server you want to send a partnership request to has blacklisted your server or the category you are addressing.',
                blacklist_error_message_guild: 'You have blacklisted this server or the category this server caters to.',
                self_error: 'You may be smart, but you cannot send a partnership request to your own server. o_O'
            },
            random: {
                not_found: 'There dont seem to be any other servers you can partner with, you can try using the command again.',
                all_guilds_finished: 'It looks like there are no other servers you can partner with.',
                embed: {
                    author: 'Partner Random - {guild}',
                    footer: 'Your remaining quota: {sub}',
                    description: '◽ **-** Click the **Send Request** button to send a partnership request to the server.\n◽ **-** There are **{total}** servers that meet your requirements that you can partner with.',
                    fields_1: '‧ Server Name‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_2: '‧ Server Owner ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_3: '‧ Partnership Category',
                    fields_4: '‧ Total Partnerships',
                    fields_5: '‧ Potential Member',
                    fields_6: '‧ Number of Connections',
                    fields_7: '‧ Partnership Code',
                    fields_8: '‧ Detailed Member Information',
                    unknown_error: 'An unknown error occurred. Please try again later',
                },
                buttons_send: 'Send Request',
                buttons_refresh: 'Refresh',
                status_disabled: 'Your servers partnership status is not active. You must enable partnership status to partner with a server.',
                long_time: `${Config.emojis.loading} There seems to be a problem with some servers, we are trying to debug this issue.The process may take longer than expected...`,
                no_subscribe: 'Your affiliate subscription has expired. Please buy in the marketplace.'
            },
            data: {
                author: '- Affiliate Data',
                footer: 'Data is no longer deleted manually, contact us to have it deleted.',
                description: '- Date data was **first created**: **{created_date}**\n- **Last updated** date of data: **{date}**',
                open: 'Open',
                closed: 'Closed',
                no_url: 'No custom URL',
                no_data: 'No Data',
                fields: [
                    {
                        name: '‧ Partnership Code',
                        value: '**╰** {url}',
                        inline: true
                    },
                    {
                        name: '‧ Partnership Channel',
                        value: '**╰** <#{channel}>',
                        inline: true
                    },
                    {
                        name: '‧ Partnership Log Channel',
                        value: '**╰** <#{log}>',
                        inline: true
                    },
                    {
                        name: '‧ Partner Officer',
                        value: '**╰** <@&{staff}>',
                        inline: true
                    },
                    {
                        name: '‧ Partner Status',
                        value: '**╰** {status}',
                        inline: true
                    },
                    {
                        name: '‧ Partner Categories',
                        value: '**╰** {category}',
                        inline: true
                    },
                    {
                        name: '‧ Total Partnerships',
                        value: '**╰** {total}',
                        inline: true
                    },
                    {
                        name: '‧ Custom URL Duration',
                        value: '**╰** {url_time}',
                        inline: true
                    },
                    {
                        name: '‧ Member Justification',
                        value: '**╰** {must}',
                        inline: true
                    },
                    {
                        name: '‧ Partner Text',
                        value: '**╰** {text}'
                    }
                ],
            },
            find: {
                author: '- Find a Partnership',
                footer: 'Page: {page}/{max_page}',
                fields_name: '*({point} points)*',
                fields_value: '- Partnership score: **{point}**\n- Partnership code: **{url}**\n- Total Partnerships: **{total}**\n- Category: **{category}**',
            },
            analysis: {
                no_data: 'Oh dear! There\'s nothing to show here, you could try partnering with your authorities.',
                author: '{guild} - Staff Analysis',
                footer: 'Administrator authorization is required to delete data.',
                title: 'Staff Analytics',
                select_placeholder: 'Select a user to view...',
                author_selected: '{user} - Analytics',
                fields: [
                    {
                        name: '‧ Total Partnerships',
                        value: '**╰** {total}',
                        inline: true
                    },
                    {
                        name: '‧ Made Today',
                        value: '**╰** {today} *({status})*',
                        inline: true
                    },
                    {
                        name: '‧ In the Last 7 Days',
                        value: '**╰** {week}',
                        inline: true
                    },
                    {
                        name: '‧ Sort',
                        value: '**╰** This user ranks **{rank}.** among the **{total_user}** authorized *(on this server)*.',
                    }
                ],
                selected_footer: 'This user only earned {coin} coins from partnerships.',
                select_description: 'View data for user {user}.',
                up: 'up from yesterday',
                down: 'down from yesterday',
                same: 'unchanged from yesterday',
                reset: 'Reset Data',
                reset_data_desc: 'Are you sure you want to reset the data? If you do, **{amount}** data will be completely deleted and can never be recovered. Please respond by pressing the buttons below.',
                reset_success: 'All data has been reset successfully.'
            },
            access: {
                user_error: 'You must tag a **user** to use this command.',
                self_error: 'You cannot set yourself as staff.',
                staff_error: 'This user already has access to Partner commands.',
                already_error: 'This user has already been added to the **staff roster**.',
                title: 'Are you sure?',
                description: 'You will add user {user} to your staff roster, in short, he will now have access to **all Partner commands.** If you wish, you can undo this action by typing **!partner access {user}**.\n\n*Please respond by pressing the buttons below.*',
                accept: 'Accept',
                deny: 'Deny',
                success: 'User {user} has been added to the staff roster. He can now access all **Partnership commands.**\n\n**You can undo this action by typing partner access {user}.**',
                already_success: 'User {user} has been successfully removed from the staff roster.',
            },
            all_commands: [
                '‧ `partner channel` - Sets the partner channel.',
                '‧ `partner log` - Sets the partnership logging channel.',
                '‧ `partner staff` - Sets the partnership staff role.',
                '‧ `partner text` - Sets the partnership text.',
                '‧ `partner status` - Turns the partnership status on/off.',
                '‧ `partner must` - Sets the partnership must.',
                '‧ `partner request` - sends a partnership request.',
                '‧ `partner random` - Finds a random server to send a partnership request to',
                '‧ `partner data` - Shows partnership data.',
                '‧ `partner find` - Finds a partner for free.',
                '‧ `partner blacklist` - Blacklists server or category.',
                '‧ `partner analysis` - You view the status of the staffs on your server.',
                '‧ `partner access` - Gives a user access to the partnership commands.',
            ].join('\n'),
            badwords_detected: 'Bad words detected in partner post, please use respectful language. If you continue like this we may penalize you.\n\n*(This system is **BETA** [report if you think there is a bug](https://discord.gg/partnerbot)'
        },
        botlist: {
            channel: {
                no_channel: 'You must tag a valid channel to use this command.',
                success: 'The botlist channel was successfully set to <#{channel}>. Users will be able to send their bots to this channel.',
            },
            log: {
                no_channel: 'You must tag a valid channel to use this command.',
                success: 'The botlist registration channel was successfully set to <#{channel}>. Your actions on bots will be sent to this channel.',
            },
            staff: {
                no_role: 'You must tag a valid role to use this command.',
                success: 'The botlist administrator role was successfully set to <@&{role}>. Users who want to take action on the botlist must have this role or be authorized as **Administrator**.',
            },
            must: {
                author: 'Botlist Terms',
                footer: 'You should choose your botlist requirements carefully',
                description: 'From the buttons below, you can choose the conditions that your users need to follow to add bots. Choose your terms carefully.',
                fields: [
                    {
                        name: ':warning: Be careful',
                        value: 'Please choose your terms according to your users. Some bots may be on few servers and that doesnt mean they are bad.'
                    }
                ],
                server: 'Server Requirement',
                topgg: 'Topgg Approval',
                modals: {
                    title: 'Server Requirement',
                    label: 'Server requirement',
                    placeholder: 'Ex: 10, 20 (0 = reset)',
                    isNaN_error: 'You must enter a valid number to use this command.',
                    success: 'The server condition was successfully set to **{count}**. Now the users bot will be checked to see if it has **{count}** servers.',
                }
            },
            status: {
                channel: 'Botlist Channel',
                log: 'Botlist Registration Channel',
                staff: 'Botlist Authority',
                not_set: 'You have not set the necessary settings to turn on botlist status.\n`{ not_set } ` settings.',
                success_enable: 'Your botlist status has been successfully turned on. The required message has been sent to the set channel and your users can now add their bots.',
                success_disable: 'Your botlist status has been successfully closed. Your users can no longer add their bots.',
                select_description: 'Choose how your users can add bots from the selection menu below. You can change this setting with the **botlist type** command.',
                success_enable_fields: [
                    {
                        name: '🗒️ Preferred Election Type',
                        value: 'Your selection type was successfully set to **{type}**. Now your users will add their bots with **{type}**. You can change this setting with the **botlist type** command if you dont like it or if you want to change it later.',
                    }
                ],
                embeds: {
                    description_type_command: 'Hello, you can add your bot from this channel. Use the **botekle <bot_id> <prefix>** command to add your bot. Dont forget to contact the authorities in case of any problems.',
                    description_type_button: 'Hello, you can add your bot from this channel. To add your bot, click the button below and fill out the form in front of you. Dont forget to contact the authorities in case of any problems.',
                    description_type_pin: 'Ohh! You can add your bot on this channel. But, unfortunately, you need a **Password** to add a bot. Please contact the authorities and ask how you can get the **Password**.',
                    footer: 'Provided by ©️ {client}',
                },
                modals: {
                    title: 'Set Password',
                    label: 'Enter Your Password'
                },
                channel_not_found_error: 'The botlist channel set was not found or the channel type is not a text channel.',
                add_bot_button: 'Add Bot',
            },
            type: {
                author: 'Insert Type',
                footer: 'Types determine how users add their bots.',
                description: 'From the selection menu below, you can choose how users add bots. The setting you choose will be applied **instantly.**',
                fields: [
                    {
                        name: '❓ There are 3 selection types:',
                        value: [
                            '- "By Command": users add their bots with the **botekle** command.',
                            '- "By Button": users fill in the form by clicking the **button** in the botlist message.',
                            '- "With Password": users need to enter a **password** to add a bot.',
                        ].join('\n')
                    }
                ],
                placeholder: 'Select an insertion type...',
                options_1_label: 'By Command',
                options_1_description: 'Users add their bots with the botekle command.',
                options_2_label: 'With Button',
                options_2_description: 'Users fill out the form by clicking the button in the botlist message.',
                options_3_label: 'With Password',
                options_3_description: 'Users need to enter a password to add bots.',
                success: 'The bot addition type was successfully set to **{type}**. Now your users will add their bots with **{type}**.',
                status_disabled: 'Your botlist status is not active. You must turn it on to change the type.',
            },
            addbot: {
                err: {
                    author: 'Failed to Add Bot - {user}',
                    types: {
                        MISSING_ID: 'You must enter a valid bot ID to use this command.',
                        MISSING_PREFIX: 'You must enter a valid bot prefix to use this command.',
                        BOT_NOT_PUBLIC: 'The bot you entered is not public. Make your bot public and try again.',
                        INVALID_BOT_ID: 'The bot ID you entered is not a valid bot ID.',
                        BOT_BLACKLISTED: 'The bot you entered has been blacklisted by the server. Please contact an administrator.',
                        BOT_IN_QUEUE: 'The bot you entered has already been applied for and is waiting to be **approved/rejected**.',
                        BOT_NOT_ENOUGH_SERVER: 'The bot you entered does not meet the server requirement. Your bot must have **{count}** servers.',
                        INVALID_CHANNEL: 'The servers registration channel appears to be invalid. Please contact an administrator.',
                        BOT_NOT_IN_TOPGG: 'The bot you entered was not found on Top.gg. Add your bot to Top.gg and try again.',
                        BOT_IN_SERVER: 'The bot is already on the server, if you think this is a bug, contact the staffs.'
                    }
                },
                success: {
                    author: 'Bot Added - {user}',
                    types: {
                        SUCCESS: 'The bot named **{name}** has been successfully added. Please wait until the authorities **approve/reject**.',
                    }
                }
            },
            customize: {
                buttons_author: 'Header Text',
                buttons_image: 'Image',
                buttons_description: 'Main post',
                buttons_refresh: 'Refresh Message',
                author: 'Privatization',
                description: 'You can customize the botlist message with the buttons below. Dont forget to use variables.',
                fields: [
                    {
                        name: 'Available variables',
                        value: '- `{ guild_name } ` - Server name',
                    }
                ],
                refresh_success: 'Botlist message refreshed successfully.',
                modals_title_1: 'Set Header',
                modals_title_2: 'Set Main Post',
                modals_title_3: 'Set Image',
                modals_label_2: 'Main text',
                description_success: 'The main text was set successfully.',
            },
            autorole: {
                array_bot: ['bot', 'b', 'robot'],
                array_user: ['kullanıcı', 'k', 'kullanici', 'dev', 'sahip', 'user', 'u', 'users'],
                no_value: 'You must enter an argument to use this command: `bot, user`',
                no_role: 'You must tag a valid role to use this command.',
                success_user: 'The botlist authority was successfully set to <@&{role}>. The bot will be given to the accepted user. Remember to override the bot\'s role from the one you selected.',
                success_bot: 'The botlist autorole was successfully set to <@&{role}>. It will be given to accepted bots. Remember to override the bot\'s role from the one you chose.',
            },
            check: {
                success: 'Successfully checked **{count}** bots and kicked **{count_2}** bots with no owner from the server.',
                error: 'All bots have been checked and nothing suspicious was found.'
            },
            all_commands: [
                '‧ `botlist channel` - Sets the botlist channel.',
                '‧ `botlist log` - Sets the botlist logging channel.',
                '‧ `botlist staff` - Sets the botlist staff role.',
                '‧ `botlist must` - Sets the botlist server must.',
                '‧ `botlist status` - Turns botlist status on/off.',
                '‧ `botlist type` - Selects how users add bots.',
                '‧ `addbot <bot_id> <prefix>` - If your botlist type is "By command", users add bots with this command.',
                '‧ `botlist customize` - Customizes the botlist message.',
                '‧ `botlist autorole` - Sets the botlist autorole.',
                '‧ `botlist check` - Scans the bots of users who have left the server and kicks them off the server.'
            ].join('\n')
        },
        balance: {
            author: 'Account Details',
            wallet: '- Wallet',
            darkium: '- Darkium',
            history: '- History',
            coin_remove: 'Coin has been removed',
            coin_add: 'Coin added',
            listed_author: 'All Transactions',
            listed_footer: 'Use the buttons to switch between pages.',
            history_empty: 'No transactions found, I think you should give it a try.',
            info: '*Listing the last 5 transactions.*',
            reasons: {
                bj: 'BlackJack',
                roulette: 'Roulette',
                hangman: 'Hangman',
                partner: 'Partnership',
                buy: 'Shop',
                cf: 'CoinFlip',
                puzzle: 'Puzzle',
                rps: 'TKM',
                unknown: 'Unknown',
                'fast-click': 'Fast Click',
                'shop.buy': 'Shop',
                pay: 'Payment',
                daily: 'Daily',
                vote: 'Top.gg Vote',
                sell: 'Sell',
                promo: 'Promotion',
                quest: 'Quest'
            },
            info_btn: [
                'Hi, we know you are curious about this button, this bot is about Darkium. Actually, Darkium would be very useful, but due to recent events, we have not given **Darkium** any meaning for now. But in the future, **Darkium** will become valuable. You can\'t earn **Darkium** in any way right now.'
            ].join('\n')
        },
        avatar: {
            footer: 'Requested by {user}',
            button_download: 'Download',
            button_banner: 'Display banner',
            button_avatar: 'View Profile Photo',
        },
        shard: {
            author: '{client} - Shard Information',
            description: `> - ${Config.emojis.online} ** { total_online_shard } ** ${Config.emojis.offline} ** { total_offline_shard } ** ${Config.emojis.total} ** { total_shard } **\n > * (data may change momentarily)* `,
            fields_1: 'Status',
            fields_2: 'Delay',
            fields_3: 'Servers'
        },
        botinfo_old: {
            author: '{client} - Bot Information',
            footer: 'Data may change instantaneously',
            description: `> • Data requiring user data, ** It is not shared with 3rd parties ** and does not reveal user data in any way.`,
            fields_1: '- General Data',
            fields_1_value: [
                '• Total Servers: **{guilds}**',
                '• Total Users: **{users}**',
                '• {progress_bar} *(server target)*'
            ],
            fields_2: '- System Data',
            fields_2_value: [
                '• Active Time: **{uptime}**',
                '• Database Status: **{database}**',
                '• Memory Usage: **{memory}** *({memory_percent})*',
                '• Processor Utilization: **{cpu_percent}**',
            ],
            fields_3: '- Version Data',
            fields_3_value: [
                '• {client} Version: **v{client_version}**',
                '• Node.js Version: **{nodejs}**',
                '• TypeScript Version: **{typescript}**',
                '• Database Version: **{db}**',
            ],
            fields_4: '- Delay Data',
            fields_4_value: [
                '• Socket Delay: **{api_ping}**',
                '• Database Latency: **{db_ping}**',
                //'- Cache Delay: **{cache_ping}**',
            ],
            advanced_info: 'Advanced for the curious',
            advanced_started: '' + Config.emojis.loading + ' You are switching to advanced information, please note that the user-required data here is not shared with **3rd parties** and will never be revealed. Good luck in advanced mode!',
            author_advanced: '{client} - Advanced Information',
            normal_info: 'Return to ordinary data',
            fields_1_advanced: '- Server Data',
            fields_1_advanced_value: [
                '• Servers with Partner Status Open: **{partner_status_open}**',
                '• Servers with Botlist Status Open: **{botlist_status_open}**'
            ],
            fields_2_advanced: '- User Data',
            fields_2_advanced_value: [
                '• Total Command Usage: **{total_cmd_use}**',
                '• Total Partnerships Made: **{total_partner}**',
                '• Total Bots Added: **{total_botlist}**',
                '• Monthly Total Votes: **{total_vote}**',
            ],
            fields_3_advanced: '- System Data',
            fields_3_advanced_value: [
                '• Total Reboot: **{total_reboot}**',
                '• Total Error: **{total_error}**',
                '• Total Collapse: **{total_crash}**',
                '• Last Reboot: **{last_reboot}**',
                '• Total Commands Found: **{total_cmd}**',
            ],
            fields_4_advanced: '• Shard Data',
            fields_4_advanced_value: [
                '• Total Shard: **{total_shard}**',
                '• Shard where the server is located: **{guild_shard}**',
                '• Shard Delay: **{shard_ping}ms**',
                '• Shard Server Count: **{shard_guilds}**',
            ],
            fields_3_advanced_value_last_reboot_not_found: 'Last reboot not found.',
        },
        botinfo: {
            description: '> All data is subject to change on a moment-to-moment basis, any user-required data is reserved and not shared with 3rd parties.',
            author: '{client} - Bot Information',
            title: '🧪 All data is received instantaneously.',
            fields: [
                {
                    name: '- Dark Data',
                    value: [
                        '**\\-** Total Servers: **{guilds}**',
                        '**\\-** {progress_bar}',
                        '**\\-** Total Users: **{users}**',
                        '**\\-** Total Channels: **{channels}**',
                        '**\\-** Total Emojis: **{emojis}**'
                    ].join('\n')
                },
                {
                    name: '- System Data',
                    value: [
                        '**\\-** Database Status: **{db_status}**',
                        '**\\-** Memory Usage: **{memory}({memory_percent})**',
                        '**\\-** Processor Utilization: **{cpu_percent}**',
                        '**\\-**Activity Time: **{uptime}**'
                    ].join('\n')
                },
                {
                    name: '- Delay Data',
                    value: [
                        '**\\-** Socket: **{api_ping}ms**',
                        '**\\-** Database: **{db_ping}ms**',
                    ].join('\n')
                },
                {
                    name: '- Version Data',
                    value: [
                        '**\\-** TypeScript **@ {typescript}**',
                        '**\\-** Node.js **@ {nodejs}**',
                        '**\\-** Discord.js **@ {discordjs}**',
                    ].join('\n')
                }
            ],
            advanced_fields: [
                {
                    name: '- Server Data',
                    value: [
                        '**\\-** Servers with Partner Status Open: **{partner_status_open}**',
                        '**\\-** Servers with Botlist Status Open: **{botlist_status_open}**'
                    ].join('\n')
                },
                {
                    name: '- Usage Data',
                    value: [
                        '**\\-** Total Command Usage: **{total_cmd_use}**',
                        '**\\-** Total Partnerships Made: **{total_partner}**',
                        '**\\-** Total Bots Added: **{total_botlist}**',
                        //'**\\\-** Dark\'s Monthly Vote: **{total_vote}**',
                    ].join('\n')
                },
                {
                    name: '- System Data',
                    value: [
                        '**\\-** Total Reboot: **{{total_reboot}**',
                        '**\\-** Total Error: **{total_error}**',
                        '**\\-** Total Collapse: **{{total_crash}**',
                        '**\\-** Last Reboot: **{{last_reboot}**',
                        '**\\-** Commands Found: **{{total_cmd}**',
                    ].join('\n')
                },
                {
                    name: '- Shard Data',
                    value: [
                        '**\\-** Total Shard: **{{total_shard}**',
                        '**\\-** Shard where the server is located: **{{guild_shard}**',
                        '**\\-** Shard Delay: **{shard_ping}ms**',
                        '**\\-** Number of Shard Servers: **{shard_guilds}**',
                    ].join('\n')
                }
            ],
            select_menu: {
                placeholder: 'Select display type...',
                options: {
                    general: 'General Data',
                    general_description: 'Non-advanced; General, mundane information.',
                    advanced: 'Advanced for Enthusiasts',
                    advanced_description: 'For the curious; not ordinary information, more systemic data.'
                }
            },
            fields_3_advanced_value_last_reboot_not_found: 'Last reboot not found.',
            advanced_started: '' + Config.emojis.loading + ' We know you\'re curious, please wait a moment while we transition to advanced information. We\'re taking data to improve your experience. Please note that the information here is not shared with **3rd parties** and will never be revealed. Good luck in advanced mode!',
        },
        help: {
            description: [
                '• The prefix of this server: **{prefix}**',
                '• Your preferred language: **{language}**',
                '• The shard ID of the server: **{shard}** *({ms}ms)*',
                //'- To get help about a command: **{prefix}help <command>**',
                '• <> = Mandatory, [] = Optional'
            ].join('\n'),
            fields_1: 'Updates',
            fields_1_err: `${Config.emojis.blob_die} No new updates found.`,
            fields_2: 'Version Info',
            fields_2_value: `${Config.emojis.blob_heart} You are using version ** { version } **, which includes important bug fixes and new systems.`,
            fields_3: 'Commands',
            fields_3_value: [
                'Click :notepad_spiral:  to see all commands.',
                //'Click <:handshakedp:1139723676904849458> to see partner commands',
                //'Click <:robot:1139722874983284889> to see the botlist commands.',
                //'Click <:questiondp:1139723282002759860> to claim your magic prize.'
            ].join('\n'),
        },
        shop: {
            author: '- Market',
            subscriptions_author: '- Subscriptions',
            desc_1: '‧ You are authorized on this server and have access to the entire marketplace. Please remember to contact the authorities in case of a problem.',
            desc_2: '‧ You are not authorized on this server and can only shop for yourself.',
            footer: 'Subscriptions go directly to the server, items go to your inventory.',
            footer_error: 'The last operation could not be performed.',
            modals_title: 'Buy',
            url_modals_title: 'Custom URL',
            prefix_modals_title: 'Server Prefix',
            label: 'How many do you want to buy?',
            label_url: 'Enter a URL',
            errors: {
                not_enough_money: '**{amount}** coins are required to make this purchase.',
                amount_max: 'You can make a maximum of **{max}** purchases at one time.',
                success: 'You have successfully purchased **{amount}** of **{item}**.',
                not_enough_item: 'You cannot sell this item because there is not enough of it.',
                special_url_exists: 'This **Special URL** already exists on a server.',
                special_url_invalid: 'This **Special URL** is not a valid URL',
            },
            value: [
                '{description}',
                '',
                '> • Type: **{type}**',
                '> • Price: **{price}**',
                '> • Status: **{buyable}**',
                '> • Content: **{content}**',
                '> • {timeOrTotal}: **{duration}**',
            ],
            buyable: 'Available for Purchase',
            not_buyable: 'Not Available for Purchase',
            buyable_not_enough_money: 'Insufficient Balance',
            buyable_active_sub: 'Active Subscription Available',
            success: 'You have successfully purchased **{amount}** of **{item}** for **{coin}**.',
            types: {
                case: 'Vault',
                subscribe: 'Subscription',
            },
            buy: 'Buy: {item}',
            sell: 'Sat: {item}',
            modals: {
                title: 'Sell the Stuff',
                sell_desc: 'You should get **{price}** coins based on the market value of **{item}**. But with tax, you will get **{tax}** coins from this sale. Are you sure you want to sell it to the market? *This transaction is irreversible.*',
                sell_cancel: 'The sale has been canceled.',
                sell_url_desc: 'You bought the **Special URL** item for **{amount}**, but you will not get any **coin** from this sale. Only the **Special URL** will be **discharged** and will be available to everyone, do you agree?',
            },
            time_not: 'Not timed',
            content_case: 'Can be taken as many times as desired',
            case_desc: 'Take risks and earn items by opening a safe. You can sell or use the items.',
            time: 'Duration',
            total: 'You have it',
            subscriptions_desc: '‧ Below you can see the server specific subscriptions.',
            subscriptions_fields: [
                {
                    name: '‧ Random Dating',
                    value: [
                        '• Remaining Quota: **{sub}**',
                    ].join('\n')
                },
                {
                    name: '‧ Custom URL',
                    value: [
                        '• Received URL: **{url}**',
                        '• Date received: **{date}**',
                        '• Remaining time: **{duration}**',
                    ].join('\n')
                }
            ],
            subscriptions_not_url: 'No URL',
            subscriptions_not_sub: 'No Subscriptions',
            remaining: 'Time Remaining',
            end_soon: 'Ending soon',
        },
        case: {
            author: '- Safes',
            no_item: 'You dont have any crates, please try again by buying crates from the market.',
            footer: 'Use the "market" command to buy a new safe.',
            opening: 'Opening a safe...',
            opening_desc: 'You are opening the safe named **{case}**, we hope that luck is with you! Please be patient and wait for the safe to open.',
            opened: '{case} - Vault Opened',
            footer_opened: 'The item you removed has been added to your inventory.',
            item_desc: [
                '▬▬▬▬▬▬▬▬▬▬',
                `${Config.emojis.items.epic} Epic - ** { epic_rate } %** `,
                `${Config.emojis.items.rare} Rare - ** { rare_rate } %** `,
                `${Config.emojis.items.common} Ordinary - ** { common_rate } %** `,
                '',
                '**•** Total: **{total}**',
                '**•** Price: **{price}** :coin:',
            ],
            type: '‧ Item Type',
            name: '‧ Item Name',
            price: '‧ Item Price',
            waiting: 'You are already opening a vault, please come back here when you open your vault. If you think this is a bug, contact [developers](https://discord.gg/K49zkFEMtr).'
        },
        inventory: {
            author: '- Inventory',
            footer: 'Looking for your safes? They are in the "safe" command.',
            item_desc: 'You have **{amount}** items.',
            select_item: 'Select the item you want to use.',
            item_select_desc: 'Use item {item}.',
            modals: {
                title: '{item}',
                input_label: 'Quantity',
                success_with_sw: 'You have successfully used **{amount}** of **{item}** on this server.',
                not_enough: 'This item is not available for the number entered',
            },
            already_have: 'You already use this item. You can only sell this item.',
            success: 'You have successfully used **{amount}** of **{item}** items.',
            no_item: 'You dont have any items. Please buy an item and try again.'
        },
        userinfo: {
            author: 'Displaying -',
            footer: 'Badges are the most important thing on a user',
            errors: {
                user_has_banned: 'This user still hasnt left the cave, so their information cannot be viewed.',
                user_is_bot: 'You cannot view information for robot users.'
            },
            platform: {
                desktop: 'Computer',
                mobile: 'Mobile',
                web: 'Web',
                unknown: 'Unknown'
            },
            status: {
                online: 'Online',
                idle: 'Idle',
                dnd: 'Do Not Disturb',
                offline: 'Offline',
                unknown: 'Unknown'
            },
            activity: {
                yes: 'Var',
                unknown: 'None'
            },
            fields: [
                {
                    name: '‧ General Information',
                    value: [
                        'Username: **{displayName}** *({username})*',
                        'User ID: **{id}**',
                        'Date Created: **{created}**',
                        'Join Date: **{joined}**',
                    ],
                    inline: false
                },
                {
                    name: '‧ Dark Information',
                    value: [
                        'Total Coin: **{coin}**',
                        'Total Darkium: **{darkium}**',
                        'Total Badge: **{total_badge}****',
                        'Date of Use: **{dp_used}**',
                    ],
                    inline: false
                },
                {
                    name: '‧ Additional Information',
                    value: [
                        'Platform: **{platform}**',
                        'Status: **{status}**',
                        'Activity: **{user_activity}**'
                    ]
                },
                {
                    name: '‧ Most Valuable Badge',
                    value: [
                        '{featured_badge}'
                    ]
                }
            ],
            select_menu_placeholder: 'Select the information you want to view',
            select_menu_1: 'Main Information',
            select_menu_1_description: 'View general information about the user.',
            select_menu_2: 'Detailed Badge Information',
            select_menu_2_description: 'View all badges of the user in detail.',
            no_badge_found: 'Oh no! No badges found.'
        },
        roulette: {
            title: 'Roulette',
            bet: '- Bet',
            now: '- Now',
            bullet: '- Bullets',
            pull: 'Keep going',
            leave: 'Pes et',
            collect: 'Move',
            noMoney: 'You dont have enough money to bet. Required amount: **{amount}**',
        },
        rps: {
            title: 'Rock, Paper, Scissors!',
            you: '- You',
            bot: '- Bot',
            footer: 'Your choice is expected...',
            footer_draw: 'Its a draw, you both chose the same thing',
            footer_win: 'You win',
            footer_lose: 'You lost.',
            win: 'You won!',
            lose: 'You lost!',
            draw: 'Draw!',
            footer_leave: 'You left the challenge.',
            leave: 'Left!'
        },
        fastclick: {
            content: '📍 The game has started! The **faster** you click, the more **coins** you win.',
            lose_content: '🐢 Unfortunately you clicked too **slow**, you didnt get any prizes.',
            win_content: ':clap: You did very well! Congratulations, you won **{amount}** coins.',
            time_content: ':clock10: Oops! Times up, you didnt get any prizes...'
        },
        guessColor: {
            author: '- Color Estimation',
            footer: 'The reward increases according to the difficulty and you will earn more.',
            description: '‧ Choose a **challenge** from the selection menu below, you will not lose **money** if you fail, but a time **limit** will be applied.',
            easy: 'Easy',
            easy_desc: 'Choose easy mode to get fewer rewards but increase your chances of winning',
            medium: 'Medium',
            medium_desc: 'Choose medium mode to get more rewards but less chance of winning',
            hard: 'Hard',
            hard_desc: 'Choose hard mode to get more rewards but less chance of winning',
            extreme: 'Very Hard',
            extreme_desc: 'Choose very hard mode to get more rewards but less chance to win',
            placeholder: 'Select Difficulty'
        },
        pay: {
            noUser: 'You must tag a valid user to use this command.',
            noAmount: 'You must enter a valid amount to use this command.',
            minAmount: 'You can send a minimum **{amount}** of coins to a user.',
            self: 'You can be smart, but you cant send yourself coins. **0_o**',
            noBot: 'Robots dont have accounts, so coins cannot be sent.',
            noMoney: 'You dont have enough money to perform this operation.',
            maxAmount: 'You can send a maximum **{amount}** of coins to a user.',
            success: 'You have successfully sent **{amount}** coins to the user named <@{user}>',
        },
        cf: {
            noBet: 'You must place a valid bet to use this command.',
            noMoney: 'You dont have enough money to place a bet',
            maxBet: 'You can bet a maximum of **{amount}** coins on the coin toss game',
            start: `** __{ amount } __ ** ${Config.emojis.coin} coins deposited, ** { choice } ** choice made < @{ user } >: We hope luck will be with you!\n${Config.emojis.coinflip} coins are spinning.Dark will keep you company`,
            win: `** __{ amount } __ ** ${Config.emojis.coin} coins deposited, ** { choice } ** choice made < @{ user } >: You are awesome!\n ** { amount } ** coins won, congratulations! Today is your lucky day.`,
            lose: `** __{ amount } __ ** ${Config.emojis.coin} coins deposited, ** { choice } ** choice made < @{ user } >: That's too bad, you lost **{amount}** coins. Hug Dark for solace.`,
            heads: 'Heads',
            tails: 'Tails',
        },
        leaderboard: {
            array: ['coin', 'partner', 'vote', 'streak'],
            invalid_type: 'You must enter a valid type to use this command. **{types}**',
            coin: {
                title: '- Coin Leaderboard',
                no_data: 'No data found, how sad!',
                modal: {
                    title: 'Select Page',
                    input: 'Enter page number',
                    invalid_page: 'The page number is not valid. You can go to the maximum **{max_page}.** page.',
                },
                loading: `${Config.emojis.loading} We are receiving the data now, please **wait a little bit...**`,
            },
            vote: {
                title: '- Vote Leaderboard'
            },
            streak: {
                title: '- Vote Streak Leaderboard'
            },
            partner: {
                title: '- Partnership Ranking',
            },
            page: 'Page: {page}/{max_page}',
            skip: 'Skip'
        },
        language: {
            no_lang: 'You must enter a valid language to use this command. **{languages}**',
            success: 'Your preferred language is set to **{language}**.',
            same_lang: 'You already prefer this language.',
        },
        bj: {
            active_game: 'You are already playing a game, please wait for the game to end.',
            no_bet: 'You must place a valid bet to play this game.',
            min_bet: 'You can bet a minimum of **{amount}** coins in a Blackjack game.',
            max_bet: 'You can bet a maximum of **{amount}** coins on the Blackjack game.',
            no_money: 'You do not have enough money to perform this action.',
            both_bust: 'The tie has passed 21 on both sides.',
            dealer_wins: 'The dealer won, you lost {bet} coins.',
            player_wins: '{player} won, you won {bet} coins.',
            tie: 'Tie, both sides have the same score',
            continues: 'The game continues...',
            author: '{author} - Playing Blackjack',
            dealer: 'Dealer'
        },
        daily: {
            waiting: 'You must wait **{time}** to claim your daily reward.',
            success: 'You have successfully claimed your daily reward, you have earned **{amount}** coins.',
        },
        vote: {
            footer: 'You can see your remaining time from the button below.',
            btn_url: 'Vote',
            author: '- Vote Information',
            fields: [
                {
                    name: '‧ Your votes',
                    value: [
                        '**╰** {votes}',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ Streaks',
                    value: [
                        '**╰** {streak}',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ Highest Streak',
                    value: [
                        '**╰** {highest_streak}',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ Vote Rewards',
                    value: [
                        '**╰** If you vote, you will get **{amount}** coins.',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ What is Streak?',
                    value: [
                        '**╰** If you vote again within 24 hours after voting, your "Streak" will increase, but if you don\'t vote, it will reset and you will be back to square one.As "Streak" increases, your reward multiplier **{streak_amount}** increases.',
                    ].join('\n'),
                }
            ]
        },
        invite: {
            author: 'Invite the Masterpiece - {name}',
            footer: '©️ {name} - ' + new Date().getFullYear() + ' ',
            description: 'You can join the **support server** by selecting one of the buttons below, or you can add your **Dark Masterpiece** to your server. We\'ve been in continuous development since **2020** and we\'d love to have you on board. Also, by joining the support server, you can get instant **notifications** of updates and participate in our sweepstakes.',
            fields_1_name: '‧ {guild} server trusted us.',
            fields_1_value: '**{guilds}** server trusted us and added us to their server, we also have **{partner}** partner system open server, **{botlist}** botlist system open server. Don\'t you want to be one of them :thinking:',
            invite: 'Invite to your server',
            support: 'Support Server'
        },
        slash: {
            clear: {
                errors: {
                    fetchMessages: 'An error occurred while retrieving messages.',
                    bulkDelete: 'An error occurred while deleting messages.',
                    filterErr: 'Dark cannot delete its own messages.',
                    noMessages: 'Ohh! No messages found to delete, try again.',
                },
                success: 'Successfully deleted **{count}** messages.'
            }
        },
        context: {
            bug: {
                errors: {
                    not_bot_message: 'The message you selected does not belong to **Dark** and therefore cannot be reported.'
                },
                modal: {
                    title: 'Report Bug',
                    label: 'Bug Description',
                    placeholder: 'Enter Bug description',
                },
                success: 'Bug successfully reported, your Bug will be investigated and fixed as soon as possible.'
            }
        },
        promo: {
            enter_code: 'To use this command you must enter the code you want to use.',
            not_found: 'The code you are trying to use was not found. Contact [authorities](' + Config.main.support + ') if you think this is an error.',
            max_use: 'This script has reached its maximum usage.',
            type_error: 'This script can only be used on servers.',
            perm_error: 'This command is of type **GUILD** and is only available to those authorized to **Manage Server**.',
            already_used: 'You have already used this script.',
            success_coin_author: '{user} - Promo Code',
            success_coin_footer: 'The earned coin has been deposited directly into your account.',
            success_coin_title: '🎉 Wow, this is awesome',
            success_coin_desc: 'You successfully redeemed **{code}** and your account has been credited with **{amount}** coins. Congratulations!',
            success_random_desc: 'You successfully used **{code}** and your server has been awarded **{amount}** partner random subscription. Congratulations!',
            success_random_footer: 'The earned subscription has been awarded directly to your server.'
        },
        tasks: {
            author: '{user} - Tasks',
            task: '**Task:** {task}',
            time: 'Date: **{time}**',
            prize: 'Prize: **{prize}** *Coin ' + Config.emojis.coin + '*',
            title: '‧ Task #{number}',
            progress: '**Progress:** %{percent} `({collected}/{required})`',
            types: {
                partner: 'Grow Your Server',
                partner_desc: '**{amount}** partner.',
                case: 'Loot the Vaults',
                case_desc: '**{amount}** open case',
                vote: 'Vote',
                vote_desc: 'Vote for bot **[{amount}](https://top.gg/bot/1157779657467379823/vote)**.',
                daily: 'Daily Reward',
                daily_desc: '**{amount}** times get your daily reward',
                generosity: 'Be a Generous Person',
                generosity_desc: 'Send **{amount}** coins to your friend.',
                buy_item: 'Grocery Shopping',
                buy_item_desc: '**{amount}** buy item.',
                play_puzzle: 'Play Puzzle',
                play_puzzle_desc: '**{amount}** times play puzzle.',
                be_the_bad_guy: 'Be Bad',
                be_the_bad_guy_desc: '**{amount}** times gamble.',
                no_tasks_found: 'You have finished all the tasks, come back in **{time}**!'
            },
            messages: {
                play_puzzle: 'The **Play **Puzzle** mission has been successfully completed and your reward of **{amount}** coins has been credited to your account.',
                partner: '<@{user}>, the **Grow Your Server** task has been successfully completed and your reward of **{amount}** coins has been credited to your account.',
                case: 'The **Loot the Vaults** quest has been successfully completed and your reward of **{amount}** coins has been credited to your account.',
                vote: 'The **Vote** mission has been successfully completed and your reward of **{amount}** coins has been credited to your account.',
                daily: 'The **Daily Reward** task has been successfully completed and your reward of **{amount}** coins has been credited to your account.',
                generosity: '**Be a Generous Person** mission successfully completed and your reward of **{amount}** coins has been credited to your account.',
                buy_item: 'The **Grocery Shopping** quest was successfully completed and your reward of **{amount}** coins has been credited to your account.',
                be_the_bad_guy: '**Be Bad** mission successfully completed and your reward of **{amount}** coins has been credited to your account.',
            },
            to_the_next: '{time} left until the next task.',
            no_to_the_next: 'You must do the previous tasks to get a new task.',
            refresh: 'Refresh Tasks ({amount})',
            free: 'Free',
            difficulty_1: '<:tasks_easy:1188267049382858832>',
            difficulty_2: '<:tasks_medium:1188267127304626176>',
            difficulty_3: '<:tasks_hard:1188267104248549507>',
            no_money: 'You don\'t have the money to renew tasks.'
        }
    },
    categories: {
        general: 'Public Server',
        general_description: 'General servers are servers that have more than one feature and cater to the general public.',
        game: 'Game Server',
        game_description: 'Game servers are servers that cater to a larger audience of gamers.',
        public: 'Public Server',
        public_description: 'Public servers are servers that have a tag system and are intended for the general public.',
        nsfw: 'NSFW Server',
        nsfw_description: 'NSFW servers are servers that contain +18 content.',
        botlist_code: 'Botlist & Code Server',
        botlist_code_description: 'Botlist & Code servers are servers that cater to developers, bot makers.',
        roleplay: 'Roleplay Server',
        roleplay_description: 'Roleplay servers cater more to the roleplaying theater community.',
        software: 'Software Server',
        software_description: 'Software servers are servers that cater more to software developers.',
        community: 'Community Server',
        community_description: 'Community servers are servers that cater to each community.',
        reward: 'Reward Server',
        reward_description: 'Reward servers are servers that give rewards in exchange for certain things or for nothing.',
        anime: 'Anime Themed Server',
        anime_description: 'Anime-themed servers are servers that cater to anime lovers.',
    },
    cmd: {
        top: {
            description: 'You display the Coin and Server ranking',
        },
        market: {
            description: 'You can buy in-server upgrades, crates, etc.',
        },
        ping: {
            description: 'Displays the instantaneous latency of the bot.'
        },
        pay: {
            description: 'You send coins to a user.'
        },
        partner: {
            description: 'Display all partnership commands.'
        },
        invite: {
            description: 'Invite this masterpiece to your server.'
        },
        help: {
            description: 'Display all commands.'
        },
        botlist: {
            description: 'Display all botlist commands.'
        },
        userinfo: {
            description: 'You look at your own information or a user\'s information.'
        },
        shard: {
            description: 'You look at the bot\'s current shard information.'
        },
        envanter: {
            description: 'You look at your inventory.'
        },
        kasa: {
            description: 'You open the case you bought.'
        },
        botinfo: {
            description: 'You look at the bot\'s information.'
        },
        avatar: {
            description: 'You look at a user\'s profile photo.'
        },
        'add-bot': {
            description: 'You add bots on servers with botlist status turned on.'
        },
        personel: {
            description: 'Not to be entered except for staff. :p'
        },
        tkm: {
            description: 'You play rock paper scissors.'
        },
        rulet: {
            description: 'You play roulette.'
        },
        puzzle: {
            description: 'You play puzzles.'
        },
        hangman: {
            description: 'You play hangman.'
        },
        ht: {
            description: 'You play the Quick Click game.'
        },
        cf: {
            description: 'You play the coin toss game.'
        },
        balance: {
            description: 'You view your money and all your transactions.'
        },
        language: {
            description: 'You change your preferred language.'
        },
        bj: {
            description: 'You play blackjack.'
        },
        'guild-language': {
            description: 'You change the language of the server.'
        },
        daily: {
            description: 'You get your daily reward.'
        },
        vote: {
            description: 'You look at your votes and vote streaks.'
        },
        tasks: {
            description: 'You look at your tasks.'
        }
    }
};