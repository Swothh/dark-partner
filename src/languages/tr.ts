import Config from '../configs';

export const config = {
    iso: 'tr',
    name: 'Türkçe',
    emoji: '🇹🇷',
    availableFor: ['tr', 'tr-TR']
};

export const __ = {
    format: 'D [gün] H [saat] m [dakika] s [saniye]',
    date_format: 'tr-TR',
    _global: {
        error: 'Hata',
        success: 'Başarılı',
        error_occured: 'Bir hata oluştu, tekrar deneyin.',
        error_title: 'Bir hata oluştu...',
        success_occured: 'İşlem başarıyla tamamlandı.',
        success_title: 'İşlem tamamlandı!',
        page_not_found: 'Hmm, burada gösterilecek bir şey yok...',
        connected: 'Bağlı',
        not_connected: 'Bağlı değil',
        are_you_sure: 'Emin misin?',
        pls_fast_response: 'Lütfen hızlı bir şekilde cevap verin.',
        error_fields: 'Çözemedin mi? Sorun değil.',
        error_fields_desc: 'Ekibimiz her zaman seninle! [destek sunucusuna](' + Config.main.support + ') gelerek destek alabilirsin.',
        task: 'Görev Tamamlandı',
        task_occured: 'Görev başarıyla tamamlandı.',
    },
    captcha: {
        title: 'Anti-Otomasyon',
        description: 'Resimde yazan hayvanın emojini içeren ve yazının renginde olan butona basman gerekiyor.',
        step: 'Aşama {now}/{total}',
        banned: {
            title: 'Zaman Aşımındasın',
            desc: 'Doğrulamayı geçemediğin için {date}\'e kadar beklemen gerekiyor.'
        },
        failed: {
            title: 'Doğrulama Başarısız',
            desc: 'Yanlış butona bastığın için doğrulamayı geçemedin.'
        },
        emoji_names: [
            'köpek',
            'kedi',
            'fare',
            'hamster',
            'tavşan',
            'tilki',
            'ayı',
            'panda',
            'koala',
            'kaplan',
            'aslan',
            'inek',
            'domuz',
            'kurbağa',
            'maymun',
            'tavuk',
            'penguen',
            'kuş',
            'ördek',
            'kartal',
            'baykuş',
            'yarasa',
            'kurt',
            'at',
            'arı',
            'tırtıl',
            'kelebek',
            'salyangoz',
            'solucan',
            'balık',
            'yunus',
            'timsah',
            'fil',
            'koyun',
            'güvercin',
            'papağan'
        ]
    },
    cases: {
        angels_screams: 'Meleklerin Çığlığı',
        tears: 'Gözyaşları',
        glory: 'Şan',
        badge: 'Rozet Kasası',
        items: {
            ordinary: 'Sıradan',
            rare: 'Nadir',
            epic: 'Destansı',
            partner_random: 'Rastgele Partnerlik Aboneliği',
            partner_random_desc: 'Kasadan başarıyla **{name}** çıktı. Çıkan eşyayı istediğin bir sunucuda kullanabilirsin. Senin için çıkardığın eşyayı envanterine koyduk.',
            badge_desc: 'Kasadan başarıyla **{name}** çıktı. Bu rozeti envanterinden kullanabilirsin veya satışa çıkarabilirsin.',
            badge_flowers: 'Çiçekler Güzel Mi? Rozeti',
            badge_flowers_description: 'Güzel kokulu çiçekler!',
            badge_snacks: 'Atıştırmalıklar Rozeti',
            badge_snacks_description: 'Lezzetli değil mi?',
            badge_hunter: 'Avcı Rozeti',
            badge_hunter_description: 'Ooh! Gerçek bir avcı.',
            badge_hrktbrkt: 'H.R.K.T B.R.K.T Rozeti',
            badge_hrktbrkt_description: 'Hareket, bereket.',
            badge_blood: 'Kan Rozeti',
            badge_blood_description: 'Kan, kan, kan!',
            badge_doctor: 'Doktor Rozeti',
            badge_doctor_description: 'Herkesi iyileştir.',
            badge_tears: 'Gözyaşlarını Sil Rozeti',
            badge_tears_description: 'Sana hiç yakışmıyor.',
            badge_hand_of_god: 'Tanrının Eli Rozeti',
            badge_hand_of_god_description: 'Tanrı seni korusun.',
            badge_road_of_kings: 'Kralların Yolu Rozeti',
            badge_road_of_kings_description: 'Kralın yolunda ilerle.',
            badge_dreams: 'Rüyalar Rozeti',
            badge_dreams_description: 'Dimetiltriptamin.',
            badge_riddles: 'Bilmeceler Rozeti',
            badge_just_nyde: 'Niğde Gazozu',
            badge_just_nyde_description: 'Loiren\'in en sevdiği gazoz.',
            badge_riddles_description: 'Hepsinde bir sır saklı...',
            badge_developer: 'Geliştirici Rozeti',
            badge_v5: 'Eskilerden Kim Kaldı?',
            badge_v5_description: 'Güzel günler mâzide kaldı...',
            developer_description: 'Dark şaheserinin yaratıcısı.',
            badge_financial_partner: 'Finansal Partner Rozeti',
            badge_financial_partner_description: 'Büyük teşekkürler!',
            partner_url: 'Özel URL',
            shop_partner_random_desc: 'Bu aboneliği satın alarak, partner rastgele komutunum kullanım sayısını arttırırsınız.',
            shop_partner_url_desc: 'Sunucunuza Özel bir URL tanımlayabilirsiniz ve kullanıcıların sizi daha kolay bulmasını sağlayabilirsiniz.',
            shop_partner_random_content: '1 alıma 10 abonelik',
            shop_partner_url_content: '1 URL',
            guild_prefix: 'Sunucu Prefixi',
            shop_guild_prefix_desc: 'Sunucunuzun prefixini değiştirebilirsiniz. Seçtiğiniz prefixi kullanarak komutları kullanırsınız.',
            shop_guild_prefix_content: '1 prefix eklenebilir',
        }
    },
    errors: {
        mode_development: 'Bot şu anda **geliştirme** modunda ve komut kullanılamaz.',
        user_banned: 'Bu kapıdan geçmeniz **{reason}** sebebiyle yasaklandı, lütfen bir yetkiliye başvurun.',
        missing_permissions: 'Bu komutu kullanmak için {permissions} yetkilerine sahip olmalısınız.',
        owner_only: 'Bu komutu kullanmak için **geliştirici** olmalısınız.',
        staff_only: 'Bu komutu kullanmak için **personel** olmalısınız.',
        error_occured: '🐛 Komutu kullanırken bir hata oluştu, lütfen daha sonra tekrar deneyin ve [bize](https://discord.gg/partnerbot) ulaşın. `(0x{code})`',
        error_occured_author: '{user} — Hata Oluştu',
        error_occured_footer: 'Hataları bildirerek bize yardımcı olabilirsin.',
        cooldown_wait: 'Komutu tekrar kullanmak için {time} tekrar deneyin.',
        not_allowed: 'İzin verilen test komutları arasında bu komut bulunmuyor.',
        vote: 'Bu komutu kullanmak için bota [oy vermeniz](https://top.gg/bot/1157779657467379823/vote) gerekiyor.',
        not_whitelisted: 'Sadece test sunucunuzda komut kullanabilirsiniz, test sunucunuzu belirtmek için sunucu ID\'nizin başına `test:` ekleyerek {channel} kanalına gönderin. \n1. Uygun ise bot mesaja tepki ekleyecektir.\n2. En son atılan ID geçerli olacaktır.\n3. Bot yeniden başladığında tekrar belirtmeniz gerekir.'
    },
    images: { // diğer dillerde değiştirilmesi gerek
        partner_channel_no_channel: 'https://media.discordapp.net/attachments/864489171075072010/1114269089997803651/image.png',
        partner_log_no_channel: 'https://media.discordapp.net/attachments/864489171075072010/1114271582400041041/image.png',
        partner_staff_no_role: 'girilecek'
    },
    events: {
        save_permissions: {
            author: 'İzinleri ayarla',
            footer: 'Bu verileri size daha iyi bir deneyim sağlamak için tutuyoruz.',
            title: 'Veri kaydetme izinleri',
            fields_name: '👀 Bilgilendirme',
            fields_value: 'Dilerseniz verilerinizi destek sunucumuza gelerek sildirtebilirsiniz. Bu verilerin **3. taraf kişiler** ile paylaşılmayacağını ve sadece geliştiricilerin görüntüleyebileceğini unutmayın.',
            page_1: '> **İzin 1:** Yaptığınız tüm partnerlik işlemlerini kaydetmeli miyiz? Kısaca bir partnerlik yaptığınızda onu kaydetmeli miyiz yoksa bu sadece size mi kalmalı? Lütfen aşağıdaki butonlara tıklayarak cevap verin.',
            page_2: '> **İzin 2:** Sunucu kasanızın tüm işlemlerini kaydetmeli miyiz? Kısaca bir yetkiliniz kasadan para çektiğinde vs. bunu kaydedeceğiz ve görüntülemek istediğinizde size göstereceğiz.',
            page_loading: '> Verdiğiniz izinleri algılamaya çalışırken biraz bekleyin...',
            buttons_yes: 'Evet, kaydet',
            buttons_no: 'Hayır, kaydetme',
            buttons_back: 'Geri dön',
            saved: '> İzinleriniz başarılı bir şekilde kaydedildi! **3 saniye sonra** kullanmak istediğiniz komut çalıştırılacak.',
        },
        partner: {
            approve_title: '{guild} sunucusu ile partnerlik yapıldı.',
            join_button: 'Sunucuya katıl',
            settings_error: 'Partnerlik yapmak için gerekli ayarları yapmamışsınız gibi görünüyor. Bunun bir hata olduğunu düşünüyorsanız lütfen yetkililere bildirin.',
            settings_error_target: 'Karşı sunucu partnerlik yapmak için gerekli ayarları yapmamış gibi görünüyor.',
            role_error: 'Rolleriniz alınırken bir hata oluştu. Daha sonra tekrar deneyin.',
            permission_denied: 'Bu işlemi gerçekleştirmek için <@&{role}> rolüne veya **Yönetici** yetkisine sahip olmalısınız.',
            request_not_found: 'Gerçekleştirmeye çalıştığınız partnerlik teklifi geçerli görünmüyor.',
            blacklist_error: 'Bu sunucu sizi veya partnerlik kategorinizi karalisteye almış. Sunucu yetkilileri ile iletişime geçmeyi deneyebilirsiniz.',
            blacklist_error_this: 'Bu sunucuyu karalisteye aldınız. Karalisteye aldığınız bir sunucuyla partnerlik gerçekleştiremezsiniz.',
            target_settings_error: 'Karşı sunucunun ayarlarında bir sorun var gibi görünüyor. Partnerlik gerçekleştiremezsiniz.',
            channel_settings_error: 'Partnerlik kanalınız bulunamadı veya **Yazı (GUILD_TEXT)** türünde değil.',
            loading_author: 'Seni çılgın şey! Bekle biraz...',
            loading_description: 'Çılgınsın adamım! Partnerlik işlemi gerçekleştiriyor... Sadece biraz bekle!',
            loading_footer: 'Bu partnerlik ile toplam {count} partnerlik yapmış olacaksın.',
            mention_error: 'Bu sunucuda `@everyone` ve `@here` etiketlerini kullanamıyorum. Lütfen izinlerimi kontrol edin.',
            target_mention_error_author: 'Oh! Gerekli izinlerim yok...',
            target_mention_error: 'Bu kötü oldu, sunucunuzda `@everyone` ve `@here` etiketlerini kullanamıyorum. Sunucularla partnerlik yapamıyorsunuz. Lütfen izinlerimi kontrol edin.',
            target_mention_error_2: 'Karşı sunucuda yeterli izinlerim yok. Partnerlik gerçekleştirilemez.',
            no_channel_permission_error: 'Partnerlik kanalına mesaj gönderme iznim yok. Bu izni açmadan hiç bir partnerliği onaylayamazsınız.',
            target_no_channel_permission_error_author: 'Kanala mesaj gönderemiyorum...',
            target_no_channel_permission_error_desc: 'Partnerlik kanalınıza mesaj gönderme iznim yok. Bu izni açmadan hiç bir partnerliği onaylayamazsınız veya istek attığınız sunucular partnerliğinizi onaylayamaz.',
            target_no_channel_permission_error: 'Karşı sunucunun partnerlik kanalına mesaj gönderme iznim yok. Partnerlik gerçekleştirilemez.',
            logs: {
                accept_author: `Olumlu — İstek kabul edildi`,
                deny_author: `Olumsuz — İstek reddedildi`,
                accept_description: `• **{guild}** sunucusu ile partnerlik yapıldı.`,
                deny_description: `• **{guild}** sunucusu ile partnerlik yapılmadı.`,
                embed_fields_1_name: '‧ Teklif Veren',
                accept_fields_2_name: '‧ Kabul Eden',
                deny_fields_2_name: '‧ Reddeden',
                embed_fields_3_name: '‧ Toplam Partnerlik',
                deny_fields_4_name: '‧ Reddedilme Sebebi',
                buttons_rating: 'Bu Partnerliği değerlendir'
            },
            deny_modal_title: 'Partnerlik İsteğini Reddet',
            deny_modal_placeholder: 'Geçerli bir sebep yaz...',
            already_blacklist: 'Bu sunucu zaten karalistede.',
            deny_modal_label: 'Reddetme sebebi',
            permission_error: 'Bu işlemi gerçekleştirmek için <@&{role}> rolüne veya **Yönetici** yetkisine sahip olmalısınız.',
            success: 'Partnerlik başarıyla gerçekleştirildi.',
            blacklist_success: '**{guild}** isimli sunucu başarılı bir şekilde karalisteye alındı.',
            view_text_footer: 'Bu yazı sadece önizlemedir ve farklılıklar gösterebilir.',
            rating: {
                author: '{user} — Değerlendirme',
                title: '<a:rating_wow:1206294746197393438> Sunucu değerlendirmesi',
                description: [
                    'Aşağıdaki butondan vermekte olduğun değerlendirme sayısını arttırabilirsin. Değerlendirmeyi ne kadar arttırırsan, sunucuya yaptığın değerlendirme o kadar **pozitif** olur.',
                    '**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**'
                ].join('\n'),
                fields: [
                    {
                        name: '‧ Yapacağın Değerlendirme',
                        value: '**╰** {stars}',
                        inline: true
                    },
                    {
                        name: '‧ Önizleme',
                        value: '**╰** {preview}',
                        inline: true
                    }
                ],
                trigger: 'Değerlendirmeyi Arttır',
                send: 'Gönder',
                types: {
                    1: 'Çok Kötü',
                    2: 'Kötü',
                    3: 'Orta',
                    4: 'İyi',
                    5: 'İnanılmaz'
                },
                sended: '{rating} puan verdiniz. ({user})'
            }
        },
        botlist: {
            addBot: {
                modals: {
                    title: 'Bot ekle',
                    input_1_label: 'Botun Kimliği (ID\'si)',
                    input_2_label: 'Botun Prefixi (Ön eki)',
                    input_pin_label: 'Güvenlik Şifresi',
                },
                errors: {
                    invalid_bot_id: 'Girilen bot kimliği geçersiz gibi duruyor. Bunun bir hata olduğunu düşünüyorsanız lütfen geliştiriciye bildirin.',
                    bot_not_public: 'Girilen bot kimliği herkese açık değil. Lütfen botu ayarlarından herkese açık yapın ve tekrar deneyin.',
                    bot_not_enough_server: 'Girilen bot kimliği sunucunun ayarladığı yeterli sunucu sayısına sahip değil.',
                    invalid_channel: 'Sunucu kayıt kanalı geçerli değil veya **Yazı (GUILD_TEXT)** türünde değil.',
                    invalid_pin: 'Girilen **güvenlik şifresi** geçerli değil. Eğer bunun bir hata olduğunu düşünüyorsanız lütfen bir yetkiliye ulaşın.',
                    bot_blacklisted: 'Girilen bot karalisteye alınmış. Bu botu ekleyemezsiniz.',
                    bot_in_queue: 'Girilen bot zaten sıraya eklenmiş. Lütfen yetkililerin onaylamasını bekleyin.',
                    bot_not_in_topgg: 'Girilen bot Top.gg\'de bulunamadı. Lütfen botunuzu Top.gg\'ye ekleyin ve tekrar deneyin.',
                    bot_already_in_list: 'Girilen bot zaten listede bulunuyor. Lütfen yetkililerin onaylamasını bekleyin.',
                    bot_in_server: 'Girilen bot zaten sunucuda bulunuyor. Bunun bir hata olduğunu düşünüyorsanız yetkililer ile iletişime geçin.',
                },
                request: {
                    author: 'Bot Eklendi',
                    fields: [
                        {
                            name: '‧ Bot İsmi',
                            value: '**╰** {bot_name}',
                            inline: true
                        },
                        {
                            name: '‧ Bot Prefixi',
                            value: '**╰** {bot_prefix}',
                            inline: true
                        },
                        {
                            name: '‧ Bot Kimliği',
                            value: '**╰** {bot_id}',
                            inline: true
                        },
                        {
                            name: '‧ Sunucu Sayısı',
                            value: '**╰** {bot_guilds}',
                            inline: true
                        },
                        {
                            name: '‧ DBL (Top.gg) Onayı',
                            value: '**╰** {bot_dbl}',
                            inline: true
                        },
                        {
                            name: '‧ Başvuru Yapan',
                            value: '**╰** {bot_owner}',
                            inline: true
                        },
                        {
                            name: '‧ Kullanım Şartları',
                            value: '**╰** {bot_terms}',
                            inline: true
                        },
                        {
                            name: '‧ Gizlilik Politikası',
                            value: '**╰** {bot_privacy}',
                            inline: true
                        },
                        {
                            name: '‧ Bot Web Sitesi',
                            value: '**╰** {bot_website}',
                            inline: true
                        },
                        {
                            name: '‧ Destek Sunucusu',
                            value: '**╰** {bot_support}',
                            inline: true
                        },
                        {
                            name: '‧ Discord Onayı',
                            value: '**╰** {bot_discord_verified}',
                            inline: true
                        },
                        {
                            name: '‧ Github Bağlantısı',
                            value: '**╰** {bot_github}',
                            inline: true
                        },
                        {
                            name: '‧ Bot Açıklaması',
                            value: '**╰** {bot_description}',
                        },
                        {
                            name: '‧ Bot Etiketleri',
                            value: '**╰** {bot_tags}',
                        }
                    ],
                    approved: 'Onaylı.',
                    unapproved: 'Onaylı değil.',
                    click: 'Tıkla',
                    no: 'Bulunamadı.',
                    approve: 'Botu Onayla',
                    deny: 'Botu Reddet',
                    view: 'Botu Ekle',
                    success: '**{bot_name}** isimli bot başarıyla eklendi. Lütfen yetkilier **onaylayana/reddedene** kadar sabırla bekleyin.',
                    footer: 'Botu sunucuya eklediğin an otomatik olarak onaylanmış sayılır.'
                }
            },
            autoApprove: {
                footer: 'Bu bot sunucuya eklenmeden onaylandı.',
                staff: 'Sunucuya eklenerek otomatik onaylandı.',
                author: '— Onaylandı',
                fields: [
                    {
                        name: '‧ Bot İsmi',
                        value: '**╰** {bot_name}',
                        inline: true
                    },
                    {
                        name: '‧ Bot Kimliği',
                        value: '**╰** {bot_id}',
                        inline: true
                    },
                    {
                        name: '‧ Onaylayan Yetkili',
                        value: '**╰** {staff}',
                        inline: true
                    }
                ]
            },
            reject: {
                author: '— Reddedildi',
                fields: [
                    {
                        name: '‧ Bot İsmi',
                        value: '**╰** {bot_name}',
                        inline: true
                    },
                    {
                        name: '‧ Bot Kimliği',
                        value: '**╰** {bot_id}',
                        inline: true
                    },
                    {
                        name: '‧ Reddeden Yetkili',
                        value: '**╰** {staff}',
                        inline: true
                    },
                    {
                        name: '‧ Reddedilme Sebebi',
                        value: '**╰** {reason}'
                    }
                ],
                footer: 'Bir hata olduğunu düşünüyorsan, lütfen yetkililer ile görüş.',
                modals: {
                    title: 'Botu Reddet',
                    input_label: 'Reddetme sebebi',
                    input_placeholder: 'Şu komutlar çalışmıyor; bla, bla, bla...'
                },
                no_reason: 'Sebep belirtilmedi.',
            },
            leaveGuard: {
                reason: 'Bot sahibi sunucudan çıktı.',
                author: 'Sunucudan Çıktı',
                description: '**{member}** isimli kullanıcı sunucudan çıktığı için tüm botları atıldı.',
                footer: 'Bu kullanıcının toplam {count} botu sunucudan atıldı.',
            }
        },
        locale: {
            title: 'Dil TR Olarak Seçildi.',
            author: 'Başarılı',
            description: 'Diliniz başarıyla **Türkçe** olarak ayarlandı, **5 saniye** sonra kullandığın komut çalıştırılacak.',
        },
        mention: {
            author: '👋 Merhaba — {user}',
            title: '🌺 Yine, yine, yeniden ben!',
            description: '> Selam, beni mi çağırdın? 😎\n> **Dark** ben, bilinen adıyla **Dark Partner.** En iyi partner botuyum. Partneri el ile manuel yapmak yerine, beni sunucuna ekleyerek otomatik hale getirebilirsin. **Dark\'ı** kullanan yüzlerce sunucularla partnerlik yapabilir, sunucunun gelişmesine katkıda bulunabilirsin. **{prefix}yardım** yazarak komutlara erişebilirsin. Bir sorunun var ise lütfen **destek sunucusuna** katıl.',
            fields: [
                {
                    name: '‧ Sunucu Sayısı',
                    value: '**╰** {guilds}',
                },
                {
                    name: '‧ Soket Gecikmesi',
                    value: '**╰** {ping}ms',
                },
                {
                    name: '‧ Sunucu Prefixi',
                    value: '**╰** {prefix}',
                }
            ],
            buttons: {
                invite: 'Sunucuna Davet Et',
                support: 'Destek Sunucusu',
                vote: 'Oy Ver',
            },
            footer: `Dark, 2021-${new Date().getFullYear()}'den beri en iyisi.`
        },
        maintenance: {
            defaultReason: 'Sebep yok.',
            title: '🚧 Şu an çalışıyoruz!',
            author: '{user} — Bakım Modu',
            description: [
                'Sizlere daha iyi ve daha stabil hizmet vermek adına, bakım modunda çalışıyoruz.',
                'Bakım modu kapanana kadar **Dark\'ı** kullanamazsınız.',
                'Daha fazla bilgi için [destek sunucusuna](' + Config.main.support + ') gelerek yetkililer ile iletişime geçebilirsiniz.',
                '',
                'Bakım sebebi: **{reason}**'
            ].join('\n'),
            footer: 'Dark, ©️ ' + new Date().getFullYear() + ''
        },
        badge_v5: '**v5.0.0** sürümünü kullandığın için **Eskilerden Kim Kaldı?** rozetini kazandın ve **50** coin ödül aldın, Tebrikler! 👏 *(kullandığın komut 5 saniye sonra çalıştırılacak)*',
    },
    minigame: {
        hangman: {
            author: '— Adam Asmaca',
            finished_author: '— Başarıyla Tamamlandı',
            lose_author: '— Kaybettin',
            time_is_up_author: '— Süre Doldu',
            word: 'Kelime',
            letters: 'Harfler',
            exit: 'Çıkış',
            next: 'Sonraki',
            prev: 'Önceki',
            finished_desc: '‧ Kahramansın, asılmakta olan bir adamı kurtardın! Oyun başarıyla tamamlandı. Tebrikler. 👏',
            guess_correct_desc: '‧ **{word}** kelimesi doğru tahmin edildi. Tebrikler, adamı kurtardın ve ödülünü aldın. 👏',
            finished_desc_first_guess: '‧ Üstün zekasın! **{word}** kelimesini harf almadan tahmin ettin. Tebrikler, adamı kurtardın ve ödülünü aldın. 👏',
            lost: 'Kaybettin.',
            time_is_up: 'Süre Doldu',
            guess: 'Tahmin',
            guess_modal: {
                label: 'Tahminini yaz',
                title: 'Tahmin Et'
            },
            guess_incorrect: 'Yanlış tahmin.',
            coin: 'Ödül',
            no: 'Yok',
            words: [
                'merhaba', 'elma', 'masa', 'kitap', 'ev', 'kedi', 'köpek', 'gözlük', 'bilgisayar', 'okul',
                'güneş', 'yağmur', 'şemsiye', 'çanta', 'telefon', 'müzik', 'film', 'kalem', 'sevgi', 'hava',
                'renk', 'mavi', 'turuncu', 'kahve', 'çay', 'sandalye', 'kapı', 'pencere', 'ağaç', 'çiçek',
                'kelebek', 'araba', 'bisiklet', 'uçak', 'gemı', 'bulut', 'gökyüzü', 'deniz', 'orman', 'dağ',
                'gece', 'gündüz', 'yıldız', 'ay', 'yıl', 'hafta', 'gün', 'saat', 'dakika', 'saniye',
                'kahvaltı', 'öğle', 'akşam', 'gece', 'kahve', 'çay', 'süt', 'su', 'ekmek', 'peynir',
                'pizza', 'hamburger', 'spor', 'futbol', 'basketbol', 'voleybol', 'koşu', 'yüzme', 'kamp',
                'piknik', 'kış', 'ilkbahar', 'yaz', 'sonbahar', 'hayvan', 'kuş', 'balık', 'maymun', 'fil',
                'kurt', 'tavşan', 'aslan', 'kaplumbağa', 'timsah', 'kobra', 'gitar', 'piano', 'keman', 'flüt',
                'resim', 'heykel', 'müze', 'tarih', 'coğrafya', 'matematik', 'fizik', 'kimya', 'biyoloji',
                'robot', 'uzay', 'gezegen', 'gazete', 'dergi', 'radyo', 'televizyon', 'internet', 'bilim',
                'şifre', 'gizli', 'avukat', 'doktor', 'mühendis', 'öğrenci', 'sanat', 'edebiyat', 'şiir',
                'roman', 'şarkı', 'müzik', 'dans', 'gülümse', 'mutlu', 'hüzünlü', 'korku', 'sevinç', 'öfke',
                'sabır', 'umut', 'güven', 'özgürlük', 'gözlük', 'bilgisayar', 'hamburger', 'gökyüzü', 'renkli', 'kitaplık', 'akvaryum', 'şapka', 'şeker', 'muz',
                'radyo', 'cephe', 'kumbara', 'yolcu', 'gizemli', 'kazak', 'martı', 'balina', 'gözlük', 'korku',
                'güleç', 'meyve', 'korsan', 'pilot', 'gözcü', 'kırlangıç', 'masal', 'rüzgar', 'beyaz', 'gürültü',
                'zil', 'ışık', 'gitarist', 'günebakan', 'kahve', 'oyuncak', 'dondurma', 'düşler', 'kuzey', 'balıkçı',
                'şövalye', 'havlu', 'kürek', 'duvar', 'harita', 'sokak', 'kaplumbağa', 'yapboz', 'bisküvi', 'sevinç',
                'kızarmış', 'plaj', 'kumsal', 'ahtapot', 'çiçekli', 'sepet', 'merdiven', 'korsan', 'muzip', 'bahçe',
                'kütüphane', 'kahraman', 'araba', 'şapka', 'balık', 'gözlük', 'gökkuşağı', 'kandil', 'dondurma', 'kelebek',
                'cetvel', 'zil', 'masa', 'kurabiye', 'bulut', 'çorap', 'denizkızı', 'yelkenli', 'kraliçe', 'dağcı',
                'rüzgar', 'bisiklet', 'gürültü', 'radyo', 'kuş', 'süngerbob', 'robot', 'sevimli', 'çimen', 'ayakkabı',
                'geyik', 'siyah', 'mangal', 'karpuz', 'defter', 'kelebek', 'parmak', 'kuzey', 'karavan', 'doğa',
                'şifre', 'kum', 'sarı', 'kırmızı', 'kurt', 'lale', 'günışığı', 'ormanda', 'kaptan', 'kurtarıcı',
                'minik', 'film', 'gökyüzü', 'balon', 'şişe', 'ayna', 'buz', 'kuğu', 'uçurtma', 'kırık',
                'gizem', 'kazak', 'martı', 'balina', 'gözlük', 'korku', 'güleç', 'meyve', 'korsan', 'pilot',
                'gözcü', 'kırlangıç', 'masal', 'rüzgar', 'beyaz', 'gürültü', 'zil', 'ışık', 'gitarist', 'günebakan',
                'kahve', 'oyuncak', 'dondurma', 'düşler', 'kuzey', 'balıkçı', 'şövalye', 'havlu', 'kürek', 'duvar',
                'harita', 'sokak', 'kaplumbağa', 'yapboz', 'bisküvi', 'sevinç', 'kızarmış', 'plaj', 'kumsal', 'ahtapot',
                'çiçekli', 'sepet', 'merdiven', 'korsan', 'muzip', 'bahçe', 'kütüphane', 'kahraman', 'araba', 'şapka',
                'balık', 'gözlük', 'gökkuşağı', 'kandil', 'dondurma', 'kelebek', 'cetvel', 'zil', 'masa', 'kurabiye',
                'bulut', 'çorap', 'denizkızı', 'yelkenli', 'kraliçe', 'dağcı', 'rüzgar', 'bisiklet', 'gürültü', 'radyo',
                'kuş', 'süngerbob', 'robot', 'sevimli', 'çimen', 'ayakkabı', 'geyik', 'beyaz', 'mangal', 'karpuz',
                'defter', 'kelebek', 'parmak', 'kuzey', 'karavan', 'doğa', 'şifre', 'kum', 'sarı', 'kırmızı', 'kurt',
                'lale', 'günışığı', 'ormanda', 'kaptan', 'kurtarıcı', 'minik', 'film', 'gökyüzü', 'balon', 'şişe',
                'ayna', 'buz', 'kuğu', 'uçurtma', 'kırık', 'yağış', 'kıtır', 'renk', 'akıl', 'dev', 'bozkır',
                'günbatımı', 'gezegen', 'galaksi', 'gözlüklü', 'eğlence', 'kışkırtıcı', 'konuşkan', 'sevimlilik', 'huzur',
                'kaş', 'küçük', 'güzellik', 'hediye', 'sevinçli', 'yemek', 'tatlı', 'karikatür', 'gecelik', 'kum',
                'kumbara', 'ahtapot', 'şeker', 'kıyafet', 'güvenlik', 'bilim', 'ilginç', 'robotik', 'hava', 'yelken',
                'plaj', 'sahil', 'otobüs', 'harf', 'oje', 'giysi', 'şampanya', 'parlak', 'kesir', 'laboratuvar',
                'macera', 'metal', 'mıknatıs', 'aile', 'kuzey', 'çekici', 'köpek', 'merak', 'hurriyet', 'fikir',
                'patates', 'kumbaraya', 'yaratıcı', 'fotoğraf', 'güzel', 'kanarya', 'perde', 'gösteri', 'cephe', 'enstrüman',
                'defter', 'fişek', 'aydınlık', 'teleskop', 'termal', 'patates', 'uçak', 'zaman', 'buzlu', 'pano',
                'yüzük', 'şekerleme', 'fırtına', 'parlak', 'gölge', 'güç', 'tarz', 'içecek', 'katman', 'dudak',
                'yağmur', 'ışık', 'günışığı', 'meydan', 'tezgah', 'güzel', 'evren', 'çiçek', 'gizem', 'gizli'
            ]
        },
        puzzle: {
            you: 'Sen',
            box: 'Kutu',
            enemy: 'Düşman',
            dead: ':skull: Öldün!',
            dead_desc: 'Bir düşmanla etkileşime geçtiğin için öldün. **Tekrar dene.**',
            exit: ':door: Çıkış Yaptın',
            exit_desc: 'Pes ettiğin için oyun sonlandırıldı ve hiç ödül alamadın.',
            win: '👀 Harika, Kazandın!',
            win_desc: 'Tebrikler, oyunu başarıyla tamamladın ve ödülünü aldın.\n:skull: Öldürme(ler): **{killCount}**',
            loading: 'Haritan hazırlanıyor, lütfen biraz bekle. Olabilecek en kısa süre içinde **haritanı** inşa ediyoruz.',
            waiting: 'Zaten senin için bir harita oluşturuluyor, lütfen bekle.',
            error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.',
        }
    },
    commands: {
        guide: {
            not_loaded: 'Makaleler yüklenirken bir sorun oluştu.',
            min_search: 'Arama terimi en az 3 karakter olmalıdır.',
            search_result: {
                title: 'Arama Sonuçları',
                description: 'Okumak istediğin maddeyi seç.',
                select: 'Madde seç',
                category: 'Kategori'
            },
            not_found: 'Aradığın makale bulunamadı.',
            main: {
                title: 'Rehber',
                description: {
                    _1: 'Okumak istediğin maddenin kimliğini komutu kullanırken belirt.',
                    _2: 'Yazarlar: {list}'
                },
                not_found: {
                    name: 'Madde bulunamadı',
                    value: 'Listelenecek bir madde yok.'
                },
                footer: 'Katkıda bulun — {link}'
            }
        },
        staff: {
            actions: {
                blacklist: {
                    name: 'Karaliste',
                    sub: {
                        add: 'Ekle',
                        remove: 'Çıkar',
                        check: 'Sorgula'
                    }
                },
                warn: {
                    name: 'Uyarı',
                    sub: {
                        send: 'Uyar',
                        remove: 'Kaldır',
                        check: 'Sorgula'
                    }
                }
            }
        },
        writewin: {
            words: [
                'elma',
                'armut',
                'karpuz',
                'kavun',
                'muz',
                'çilek',
                'kiraz',
                'kayısı',
                'üzüm',
                'nar',
                'insan',
                'hayvan',
                'bitki',
                'ağaç',
                'çiçek',
                'tenis',
                'futbol',
                'darkpartner',
                'discord',
                'bot',
                'yazılım',
                'kodlama',
                'programlama',
                'javascript',
                'typescript'
            ],
            gameStarted: 'Oyun başladı',
            description: 'Yaz kazan oyunu başladı, aşağıdaki kelimeyi **5 saniye** içinde yazın.\n**{word}**'
        },
        ping: {
            msg: '⏱️ Pong! **{ping}ms** *soket gecikmesi*'
        },
        partner: {
            channel: {
                no_channel: 'Bu komutu kullanabilmek için geçerli bir kanal etiketlemelisiniz.',
                success: 'Partner kanalı başarıyla <#{channel}> olarak ayarlandı. Kabul ettiğiniz partnerlik istekleri ayarladığınız kanala gönderilecek.',
            },
            log: {
                no_channel: 'Bu komutu kullanabilmek için geçerli bir kanal etiketlemelisiniz.',
                success: 'Partner kayıt kanalı başarıyla <#{channel}> olarak ayarlandı. Partnerlik ile ilgili yaptığınız işlemler bu kanala gönderilecek.',
            },
            staff: {
                no_role: 'Bu komutu kullanabilmek için geçerli bir rol etiketlemelisiniz.',
                success: 'Partner yetkilisi rolü başarıyla <@&{role}> olarak ayarlandı. Partnerlik ile ilgili işlem yapmak isteyen kullanıcılar bu role sahip olmalı veya **Administrator (yönetici)** yetkisine sahip olmalı.',
            },
            text: {
                author: 'Ayarlama',
                author_customize: 'Özelleştirme',
                footer: 'Dilersen partner yazısını özelleştirebilirsin.',
                footer_customize: 'Harika! Partner yazını daha modern bir hale götürüyorsun.',
                description: '> Partner yapmak için bir partner yazısına ihtiyacın var, aşağıdaki butonlara basarak bir işlem seç, dilersen **"Özelleştir"** butonuna basarak daha modernize bir yazıya sahip olabilirsin. Aşağıdaki değişkenleri kullanmayı unutma.',
                description_customize: '> Partner yazını daha modern bir hale getirmek için bu menüyü kullanabilirsin. Ayarladığın partner yazısı otomatik olarak **"Tanım (Description)"** kısmına koyulacak.',
                set: 'Ayarla',
                customize: 'Özelleştir',
                buttons_back: 'Geri Dön',
                buttons_author: 'Üst Yazı',
                buttons_image: 'Resim',
                buttons_thumbnail: 'Küçük Resim',
                buttons_join_button: 'Sunucuya katıl butonu',
                buttons_status_button: 'Kişisellleştirmeleri aktif et',
                buttons_status_button_disabled: 'Kişisellleştirmeleri devre dışı bırak',
                fields: [
                    {
                        name: 'Kullanılabilir değişkenler',
                        value: [
                            '• `{guild_name}` - Sunucu adı',
                            '• `{guild_owner}` - Sunucu sahibi',
                            '• `{total_partners}` - Toplam partner sayısı',
                            '• `{member_count}` - Sunucudaki üye sayısı',
                            '• `{member_count.filter}` - Filtrelenmiş üye sayısı (botları göstermez)',
                            '• `{member_count.online}` - Çevrimiçi üye sayısı',
                            '• `{member_count.offline}` - Çevrimdışı üye sayısı',
                        ].join('\n')
                    }
                ],
                customize_fields: [
                    {
                        name: 'Kullanılabilir değişkenler',
                        value: [
                            '• `{guild_name}` - Sunucu adı',
                            '• `{guild_icon}` - Sunucu ikonu',
                        ].join('\n')
                    }
                ],
                modals: {
                    title: 'Partner yazısını ayarla',
                    title_2: 'Partner yazısını özelleştir',
                    placeholder: 'Sihirli partner yazını buraya yaz!',
                    label: 'Partner yazısı',
                    success: 'Partner yazınız başarılı bir şekilde ayarlandı.\n• Toplam karakter: `{length}`, Toplam satır: `{lines}`, Toplam kelime: `{words}`',
                    link_error: 'Partner yazınızda geçerli bir **Discord Davet Linki** bulunmuyor. Ekleyip tekrar deneyin.',
                    author_label: 'Üst yazı',
                    author_placeholder: 'Sihirli üst yazını buraya yaz!',
                    author_icon_label: 'Üst yazı ikonu',
                    author_icon_placeholder: 'Buraya bir URL gir.',
                    author_icon_error: 'Geçerli bir URL girmelisiniz.',
                    author_success: 'Üst yazınız başarılı bir şekilde ayarlandı.',
                    image_label: 'Resim',
                    image_placeholder: 'Buraya bir URL gir.',
                    image_error: 'Geçerli bir URL girmelisiniz.',
                    image_success: 'Resminiz başarılı bir şekilde ayarlandı.',
                    thumbnail_label: 'Küçük resim',
                    thumbnail_placeholder: 'Buraya bir URL gir.',
                    thumbnail_error: 'Geçerli bir URL girmelisiniz.',
                    thumbnail_success: 'Küçük resminiz başarılı bir şekilde ayarlandı.',
                }
            },
            status: {
                success_disable: 'Partner durumunuz başarıyla kapatıldı. Artık sunucular size istek gönderemez veya siz herhangi bir sunucuya istek gönderemezsiniz.',
                text: 'Partner Yazısı',
                channel: 'Partner Kanalı',
                log: 'Partner Kayıt Kanalı',
                staff: 'Partner Yetkilisi',
                not_set: 'Partner durumunu açmak için gerekli ayarları yapmamışsınız.\n`{not_set}` ayarlarını yapmanız gerekiyor.',
                author: 'Kategori seç',
                footer: 'Partner kategorini lütfen özenle doğru bir şekilde seç.',
                description: '> Partner durumunu açmak için bir kategoriye ihtiyacın var, lütfen aşağıdaki açılır menüden sana uygun bir kategori seç.',
                fields_1_name: '⚠️ Dikkatli ol',
                fields_1_value: 'Lütfen kategorini özenle, doğru olacak şekilde seç. Aksi takdirde gerekli cezalar uygulayabiliriz. Ayrıca kategorini tüm sunucular görüntüleyebilir.',
                fields_2_name: '✨ Partnerlik kodun oluşturuldu',
                fields_2_value: '**{id}** kodu, senin partnerlik kodun. Sunucularla partnerlik yapmak istersen sana bu kod ile partnerlik gönderebilirler, fazla partnerlik yaptığın zaman kodun sıfırlanacak ve yeni bir kod oluşturulacak.',
                menu_placeholder: 'Sunucuna uygun bir kategori seç...',
                footer_2: 'Bu harika! Kategorini seçtin.',
                success: '> Başarılı bir şekilde kategorini **{category}** olarak seçtin. Artık partner durumun aktif ve bu diğer sunucuların sana partnerlik gönderebileceği veya senin onlara partnerlik gönderebileceğin anlamına geliyor.'
            },
            must: {
                reset: 'sıfırla',
                no_number: 'Bu komutu kullanabilmek için geçerli bir sayı girmelisiniz.',
                member_count_error: 'Partner şartınız sunucu üye sayınızdan fazla olamaz.',
                max_error: 'Partner şartınız maksimum **{max}** olabilir.',
                reset_success: 'Partner şartınız başarıyla sıfırlandı.',
                success: 'Partner şartınız başarıyla **{must}** olarak ayarlandı. Artık **{must}** üye altı sunucular size istek atamaz.',
            },
            blacklist: {
                errors_partner_status: 'Partner durumunuz kapalı, bu komutu kullanabilmek için partner durumunu aktif etmelisiniz.',
                errors_no_value: 'Bu komutu kullanabilmek için **Kategori, Sunucu Partnerlik Kodu veya Sunucu Kimliği (ID\'si)** girmelisiniz.',
                errors_invalid_value: 'Sunucu kodları veya kimlikleri (ID\'leri) boşluk içeremez.',
                errors_invalid_guild: 'Girdiğiniz sunucu kodu veya kimliği (ID\'si) geçerli bir sunucuya ait gibi görünmüyor.',
                errors_guild_already_blacklisted: 'Bu sunucu zaten karalistede bulunuyor.',
                errors_category_already_blacklisted: 'Bu kategori zaten karalistede bulunuyor.',
                errors_category_not_blacklisted: 'Bu kategori zaten karalistede değil.',
                errors_guild_not_blacklisted: 'Bu sunucu zaten karalistede değil.',
                added_category: 'Başarıyla **{category}** kategorisini karalisteye aldınız.',
                added_guild: 'Başarıyla **{id}** kimlikli sunucuyu karalisteye aldınız.',
                removed_category: 'Başarıyla **{category}** kategorisini karalisteden kaldırdınız.',
                removed_guild: 'Başarıyla **{id}** kimlikli sunucu karalisteden silindi.',
                add: 'ekle',
                remove: 'kaldır',
                list: 'liste',
                list_author: 'Sunucu Karalisteleri',
                list_footer: 'Çok fazla karaliste olduğu halde limitlendirme uygulanabilir.',
                errors_invalid_subcommand: 'Geçerli bir alt komut girmelisiniz. Alt komutlar: `ekle, kaldır, liste`',
            },
            send: {
                must_error: 'Bu sunucuyla partner olmak için **{member_count}** üyeye sahip olmalısınız.',
                fetch_owner_error: 'Discord API ile ilgili bir sorun oluştu, sunucu sahibi alınamadı. Lütfen daha sonra tekrar deneyin veya bir yetkiliye ulaşın.',
                already_request_error: 'Bu sunucuya zaten partnerlik isteği göndermişsiniz, isteğiniz kabul edilmediği takdirde silinecek ve tekrar istek gönderebilirsiniz.',
                timeout_error: 'Bu sunucuyla kısa süre önce partnerlik yapmışsınız. Tekrar partnerlik yapmak için <t:{time}:R> beklemelisiniz.',
                guild_channel_error: 'Bu sunucuda partnerlik kanalı bulunamadı veya kanal türü metin kanalı değil.',
                target_guild_channel_error: 'Karşı sunucunun partnerlik kanalı bulunamadı veya kanal türü metin kanalı değil.',
                unknown_error: 'Karşı sunucuya partnerlik isteği gönderilirken bilinmeyen bir sorun oluştu.',
                embed: {
                    author: 'Partnerlik İsteği — {guild_name} sunucusundan',
                    description: '◽ **—** Sunucu ile tekrar partner olmak için **12 saat** beklemelisiniz.\n◽ **—** Ret sebebi kurallarımıza uymazsa sunucu ağır ceza alır.\n' + Config.emojis.blank + '',
                    fields_1_name: '‧ Sunucu Sahibi‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_2_name: '‧ Toplam Üye‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_3_name: '‧ Partner Kategorisi',
                    fields_4_name: '‧ Partnerlik Sayısı',
                    fields_5_name: '‧ Bağlantı Sayısı',
                    fields_6_name: '‧ Potansiyel Üye',
                    fields_7_name: '‧ Detaylı Üye Bilgileri',
                },
                buttons_approve: 'İsteği Onayla',
                buttons_deny: 'İsteği Reddet',
                buttons_blacklist: 'Sunucuyu Karalisteye Al',
                buttons_info: 'Partner Texti Önizle',
                success: 'Başarılı bir şekilde **{guild}** sunucusuna partnerlik isteği gönderildi. Karşı sunucu isteği kabul ettiği halde partnerlik gerçekleşecek.',
                code_not_found: 'Bu komutu kullanabilmek için bir **partnerlik kodu** girmelisiniz.',
                guild_not_found: '**{code}** kodu, geçerli bir sunucuya ait gibi görünmüyor. Bunun bir hata olduğunu düşünüyorsanız lütfen bir yetkiliye ulaşın.',
                status_disabled: 'Sunucunuzun partnerlik durumu aktif değil. Bir sunucuyla partner olmak için partnerlik durumunu aktif etmelisiniz.',
                blacklist_error: 'Partnerlik isteği göndermek istediğiniz sunucu sunucunuzu veya hitap ettiğiniz kategoriyi karalisteye almış.',
                blacklist_error_message_guild: 'Bu sunucuyu veya sunucunun hitap ettiği kategoriyi karalisteye almışsınız.',
                self_error: 'Zeki olabilirsiniz, fakat kendi sunucunuza partnerlik isteği gönderemezsiniz. o_O'
            },
            random: {
                not_found: 'Başka Partner olabileceğiniz sunucu yok gibi görünüyor, komutu tekrar kullanmayı deneyebilirsiniz.',
                all_guilds_finished: 'Partner olabileceğiniz başka sunucu yok gibi görünüyor.',
                embed: {
                    author: 'Partner Rastgele — {guild}',
                    footer: 'Kalan kotanız: {sub}',
                    description: '◽ **—** Sunucuya partnerlik isteği göndermek için **İstek Gönder** butonuna tıklatın.\n◽ **—** Şartlarına uyan, partnerlik yapabileceğin **{total}** sunucu bulunuyor.',
                    fields_1: '‧ Sunucu Adı‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_2: '‧ Sunucu Sahibi‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎ ‏‏‎‏‏‎‏‏‎‏‏‎    ',
                    fields_3: '‧ Partnerlik Kategorisi',
                    fields_4: '‧ Toplam Partnerlik',
                    fields_5: '‧ Potansiyel Üye',
                    fields_6: '‧ Bağlantı Sayısı',
                    fields_7: '‧ Partnerlik Kodu',
                    fields_8: '‧ Detaylı Üye Bilgileri',
                    unknown_error: 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
                },
                buttons_send: 'İstek Gönder',
                buttons_refresh: 'Yenile',
                status_disabled: 'Sunucunuzun partnerlik durumu aktif değil. Bir sunucuyla partner olmak için partnerlik durumunu aktif etmelisiniz.',
                long_time: `${Config.emojis.loading} Bazı sunucularda sorun var gibi duruyor, Bu sorunu ayıklamaya çalışıyoruz. İşlem beklenenden uzun sürebilir...`,
                no_subscribe: 'Partnerlik aboneliğiniz bitti. Lütfen marketten satın alın.'
            },
            data: {
                author: '— Partnerlik Verileri',
                footer: 'Veriler artık manuel olarak silinmiyor, sildirmek için bize ulaşın.',
                description: '• Verilerin **ilk oluşturulma** tarihi: **{created_date}**\n• Verilerin **son güncellenme** tarihi: **{date}**',
                open: 'Açık',
                closed: 'Kapalı',
                no_url: 'Özel URL yok',
                no_data: 'Veri Yok',
                fields: [
                    {
                        name: '‧ Partnerlik Kodu',
                        value: '**╰** {url}',
                        inline: true
                    },
                    {
                        name: '‧ Partnerlik Kanalı',
                        value: '**╰** <#{channel}>',
                        inline: true
                    },
                    {
                        name: '‧ Partner Kayıt Kanalı',
                        value: '**╰** <#{log}>',
                        inline: true
                    },
                    {
                        name: '‧ Partner Yetkilisi',
                        value: '**╰** <@&{staff}>',
                        inline: true
                    },
                    {
                        name: '‧ Partner Durumu',
                        value: '**╰** {status}',
                        inline: true
                    },
                    {
                        name: '‧ Partner Kategorisi',
                        value: '**╰** {category}',
                        inline: true
                    },
                    {
                        name: '‧ Toplam Partnerlik',
                        value: '**╰** {total}',
                        inline: true
                    },
                    {
                        name: '‧ Özel URL Süresi',
                        value: '**╰** {url_time}',
                        inline: true
                    },
                    {
                        name: '‧ Üye Gerekçesi',
                        value: '**╰** {must}',
                        inline: true
                    },
                    {
                        name: '‧ Partner Yazısı',
                        value: '**╰** {text}'
                    }
                ],
            },
            find: {
                author: '— Partnerlik Bul',
                footer: '{max_page} sayfa arasından, {page}. sayfadasın.',
                fields_name: '*({point} puan)*',
                fields_value: '• Partnerlik puanı: **{point}**\n• Partnerlik kodu: **{url}**\n• Toplam Partnerlik: **{total}**\n• Kategori: **{category}**',
            },
            analysis: {
                no_data: 'Üf ya! Burada gösterilecek bir şey yok, yetkililerine partnerlik yaptırmayı deneyebilirsin.',
                author: '{guild} — Yetkili Analizleri',
                footer: 'Verileri silmek için Yönetici yetkisi gerekir.',
                title: 'Yetkili Analizleri',
                select_placeholder: 'Görüntülemek için bir kullanıcı seç...',
                author_selected: '{user} — Analizler',
                fields: [
                    {
                        name: '‧ Toplam Partnerlik',
                        value: '**╰** {total}',
                        inline: true
                    },
                    {
                        name: '‧ Bugün Yapılan',
                        value: '**╰** {today} *({status})*',
                        inline: true
                    },
                    {
                        name: '‧ Son 7 Günde',
                        value: '**╰** {week}',
                        inline: true
                    },
                    {
                        name: '‧ Sıralama',
                        value: '**╰** Bu kullanıcı *(bu sunucuda)* **{total_user}** yetkili arasında **{rank}.** sırada.',
                    }
                ],
                selected_footer: 'Bu kullanıcı, sadece partnerliklerden {coin} coin kazandı.',
                select_description: '{user} kullanıcısının verilerini görüntüle.',
                up: 'düne göre yükseliş',
                down: 'düne göre düşüş',
                same: 'düne göre değişmedi',
                reset: 'Verileri Sıfırla',
                reset_data_desc: 'Verileri sıfırlamak istediğinize emin misiniz? Eğer sıfırlarsanız, **{amount}** veri tamamen silinecek ve asla geri getirilemeyecek. Lütfen aşağıdaki butonlara basarak yanıt veriniz.',
                reset_success: 'Tüm veriler başarıyla sıfırlandı.'
            },
            access: {
                user_error: 'Bu komutu kullanabilmek için bir **kullanıcı** etiketlemelisiniz.',
                self_error: 'Kendini yetkili olarak ayarlayamazsın.',
                staff_error: 'Bu kullanıcı zaten Partner komutlarına erişebilir durumda.',
                already_error: 'Bu kullanıcı zaten **yetkili kadrosuna** eklenmiş.',
                title: 'Emin Misin?',
                description: '{user} kullanıcısını yetkili kadrosuna dahil edeceksin, kısaca artık **tüm Partnerlik komutlarına erişebilecek.** Dilersen, **!partner erişim {user}** yazarak bu işlemi geri alabilirsin.\n\n*Lütfen aşağıdaki butonlara basarak yanıt ver.*',
                accept: 'Kabul Et',
                deny: 'Reddet',
                success: '{user} isimli kullanıcı yetkili kadrosuna dahil edildi. Artık tüm **Partnerlik komutlarına erişebilir.**\n\n!partner erişim {user} yazarak bu işlemi geri alabilirsin.',
                already_success: '{user} isimli kullanıcı başarılı bir şekilde yetkili kadrosundan çıkarıldı.',
            },
            all_commands: [
                '‧ `partner kanal` — Partnerlik kanalını ayarlar.',
                '‧ `partner log` — Partnerlik kayıt kanalını ayarlar.',
                '‧ `partner yetkili` — Partnerlik yetkilisi rolünü ayarlar.',
                '‧ `partner yazı` — Partnerlik yazısını ayarlar.',
                '‧ `partner durum` — Partnerlik durumunu açar/kapatır.',
                '‧ `partner şart` — Partnerlik şartını ayarlar.',
                '‧ `partner ol` — Partnerlik isteği gönderir.',
                '‧ `partner rastgele` — Partnerlik isteği göndermek için rastgele bir sunucu bulur.',
                '‧ `partner veri` — Partnerlik verilerini gösterir.',
                '‧ `partner bul` — Ücretsiz şekilde partner bulur.',
                '‧ `partner karaliste` — Sunucu veya kategori karalisteye alır.',
                '‧ `partner analiz` — Sunucunuzdaki yetkililerin durumunu görüntülersiniz.',
                '‧ `partner erişim` — Yetkili olmamasına rağmen partnerlik yapabilecek kişileri ayarlarsınız.'
            ].join('\n'),
            badwords_detected: 'Partner yazısında kötü kelime algılandı, lütfen saygılı bir dil kullanın. Böyle devam ederseniz size ceza verebiliriz.\nBu sistem **BETA\'dır.** [bir hata olduğunu düşünüyorsanız bildirin.](https://discord.gg/partnerbot)'
        },
        botlist: {
            channel: {
                no_channel: 'Bu komutu kullanabilmek için geçerli bir kanal etiketlemelisiniz.',
                success: 'Botlist kanalı başarıyla <#{channel}> olarak ayarlandı. Kullanıcılar botlarını bu kanala gönderebilecek.',
            },
            log: {
                no_channel: 'Bu komutu kullanabilmek için geçerli bir kanal etiketlemelisiniz.',
                success: 'Botlist kayıt kanalı başarıyla <#{channel}> olarak ayarlandı. Botlarla ilgili yaptığınız işlemler bu kanala gönderilecek.',
            },
            staff: {
                no_role: 'Bu komutu kullanabilmek için geçerli bir rol etiketlemelisiniz.',
                success: 'Botlist yetkilisi rolü başarıyla <@&{role}> olarak ayarlandı. Botlist ile ilgili işlem yapmak isteyen kullanıcılar bu role sahip olmalı veya **Administrator (yönetici)** yetkisine sahip olmalı.',
            },
            must: {
                author: 'Botlist Şartları',
                footer: 'Botlist şartlarını özenle seçmelisin.',
                description: 'Aşağıdaki butonlardan, kullanıcılarının bot eklemek için uyması gereken şartları seçebilirsin. Şartlarını özenle seç.',
                fields: [
                    {
                        name: ':warning: Dikkatli ol',
                        value: 'Lütfen şartlarını kullanıcılarına uygun seç. Bazı botlar az sunucuda olabilir ve bu onların kötü olacağı anlamına gelmez.'
                    }
                ],
                server: 'Sunucu Şartı',
                topgg: 'Topgg Onayı',
                modals: {
                    title: 'Sunucu Şartı',
                    label: 'Sunucu şartı',
                    placeholder: 'Örn: 10, 20 (0 = sıfırlanır)',
                    isNaN_error: 'Bu komutu kullanabilmek için geçerli bir sayı girmelisiniz.',
                    success: 'Sunucu şartı başarıyla **{count}** olarak ayarlandı. Artık kullanıcıların botu, **{count}** sunucuya sahip mi diye bakılacak.',
                }
            },
            status: {
                channel: 'Botlist Kanalı',
                log: 'Botlist Kayıt Kanalı',
                staff: 'Botlist Yetkilisi',
                not_set: 'Botlist durumunu açmak için gerekli ayarları yapmamışsınız.\n`{not_set}` ayarlarını yapmanız gerekiyor.',
                success_enable: 'Botlist durumunuz başarıyla açıldı. Ayarlanan kanala gerekli mesaj atıldı ve artık kullanıcılarınız botlarını ekleyebilir.',
                success_disable: 'Botlist durumunuz başarıyla kapatıldı. Artık kullanıcılarınız botlarını ekleyemez.',
                select_description: 'Aşağıdaki seçim menüsünden kullanıcılarının nasıl bot ekleyeceğini seç. Dilersen bu ayarı **botlist tür** komutu ile değiştirebilirsin.',
                success_enable_fields: [
                    {
                        name: '🗒️ Tercih Edilen Seçim Türü',
                        value: 'Seçim türünüz başarıyla **{type}** olarak ayarlandı. Artık kullanıcılarınız botlarını **{type}** ile ekleyecek. Daha sonra uygun görmezseniz veya bir değişikliğe giderseniz bu ayarı **botlist tür** komutu ile değiştirebilirsiniz.',
                    }
                ],
                embeds: {
                    description_type_command: 'Merhaba, bu kanaldan botunu ekleyebilirsin. Botunu eklemek için **botekle <bot_id> <prefix>** komutunu kullan. Herhangi bir sorunda yetkililere ulaşmayı unutma.',
                    description_type_button: 'Merhaba, bu kanaldan botunu ekleyebilirsin. Botunu eklemek için aşağıdaki butona tıkla ve önüne açılan formu doldur. Herhangi bir sorunda yetkililere ulaşmayı unutma.',
                    description_type_pin: 'Ohh! Bu kanaldan botunu ekleyebilirsin. Fakat, üzgünüz ki bot eklemek için **Şifreye** ihtiyacın var. Lütfen yetkililere ulaş ve **Şifreyi** nasıl alabileceğini sor.',
                    footer: '©️ {client} tarafından sağlanıyor.',
                },
                modals: {
                    title: 'Şifre Ayarla',
                    label: 'Şifreni Gir'
                },
                channel_not_found_error: 'Ayarlanan botlist kanalı bulunamadı veya kanal türü metin kanalı değil.',
                add_bot_button: 'Bot Ekle',
            },
            type: {
                author: 'Ekleme Türü',
                footer: 'Türler, kullanıcıların botlarını nasıl ekleyeceğini belirler.',
                description: 'Aşağıdaki seçim menüsünden, kullanıcıların nasıl bot ekleyeceğini seçebilirsin. Seçtiğin ayar **anında uygulanacak.**',
                fields: [
                    {
                        name: '❓ 3 tane seçim türü bulunur:',
                        value: [
                            '• "Komut İle": kullanıcılar, **botekle** komutu ile botlarını eklerler.',
                            '• "Buton İle": kullanıcılar, botlist mesajındaki **butona** tıklayarak formu doldurur.',
                            '• "Şifre İle": kullanıcıların bot eklemek için **şifre** girmesi gerekir.',
                        ].join('\n')
                    }
                ],
                placeholder: 'Bir ekleme türü seç...',
                options_1_label: 'Komut İle',
                options_1_description: 'Kullanıcılar, botekle komutu ile botlarını eklerler.',
                options_2_label: 'Buton İle',
                options_2_description: 'Kullanıcılar, botlist mesajındaki butona tıklayarak formu doldurur.',
                options_3_label: 'Şifre İle',
                options_3_description: 'Kullanıcıların bot eklemek için şifre girmesi gerekir.',
                success: 'Bot ekleme türü başarıyla **{type}** olarak ayarlandı. Artık kullanıcılarınız botlarını **{type}** ile ekleyecek.',
                status_disabled: 'Botlist durumunuz aktif değil. Türü değiştirmek için durumu açmalısınız.',
            },
            addbot: {
                err: {
                    author: 'Bot Eklenemedi — {user}',
                    types: {
                        MISSING_ID: 'Bu komutu kullanabilmek için geçerli bir bot kimliği (ID\'si) girmelisiniz.',
                        MISSING_PREFIX: 'Bu komutu kullanabilmek için geçerli bir bot ön eki girmelisiniz.',
                        BOT_NOT_PUBLIC: 'Girdiğiniz bot, herkese açık değil. Botunuzu herkese açık yapın ve tekrar deneyin.',
                        INVALID_BOT_ID: 'Girdiğiniz bot kimliği (ID\'si) geçerli bir bot kimliği (ID\'si) değil.',
                        BOT_BLACKLISTED: 'Girdiğiniz bot, sunucu tarafından karalisteye alınmış. Lütfen bir yetkiliye ulaşın.',
                        BOT_IN_QUEUE: 'Girdiğiniz bot, zaten başvurulmuş ve **onaylanmayı/reddedilmeyi** bekliyor.',
                        BOT_NOT_ENOUGH_SERVER: 'Girdiğiniz bot, sunucu şartını karşılamıyor. Botunuzun sunucu sayısı **{count}** olmalı.',
                        INVALID_CHANNEL: 'Sunucunun kayıt kanalı geçersiz gibi görünüyor. Lütfen bir yetkiliye ulaşın.',
                        BOT_NOT_IN_TOPGG: 'Girdiğiniz bot, Top.gg üzerinde bulunamadı. Botunuzu Top.gg sitesine ekleyin ve tekrar deneyin.',
                        BOT_IN_SERVER: 'Bot zaten sunucuda bulunuyor, bunun bir hata olduğunu düşünüyorsanız yetkililer ile iletişime geçin.'
                    }
                },
                success: {
                    author: 'Bot Eklendi — {user}',
                    types: {
                        SUCCESS: '**{name}** isimli bot başarıyla eklendi. Lütfen yetkililer **onaylayana/reddene** kadar bekleyin.',
                    }
                }
            },
            customize: {
                buttons_author: 'Üst Yazı',
                buttons_image: 'Resim',
                buttons_description: 'Ana yazı',
                buttons_refresh: 'Mesajı Yenile',
                author: 'Özelleştirme',
                description: 'Aşağıdaki butonlardan botlist mesajını özelleştirebilirsin. Değişkenleri kullanmayı unutma.',
                fields: [
                    {
                        name: 'Kullanılabilir değişkenler',
                        value: '• `{guild_name}` - Sunucu adı',
                    }
                ],
                refresh_success: 'Botlist mesajı başarıyla yenilendi.',
                modals_title_1: 'Üst Yazı Ayarla',
                modals_title_2: 'Ana Yazı Ayarla',
                modals_title_3: 'Resim Ayarla',
                modals_label_2: 'Ana yazı',
                description_success: 'Ana yazı başarıyla ayarlandı.',
            },
            autorole: {
                array_bot: ['bot', 'b', 'robot'],
                array_user: ['kullanıcı', 'k', 'kullanici', 'dev', 'sahip', 'user', 'u', 'users'],
                no_value: 'Bu komutu kullanabilmek için argüman girmelisiniz: `bot, kullanıcı`',
                no_role: 'Bu komutu kullanabilmek için geçerli bir rol etiketlemelisiniz.',
                success_user: 'Botlist otorolü başarıyla <@&{role}> olarak ayarlandı. Botu kabul edilen kullanıcıya verilecek. Botun rolünü seçtiğiniz rolden üste çekmeyi unutmayın.',
                success_bot: 'Botlist otorolü başarıyla <@&{role}> olarak ayarlandı. Kabul edilen botlara verilecek. Botun rolünü seçtiğiniz rolden üste çekmeyi unutmayın.',
            },
            check: {
                success: 'Başarıyla **{count}** bot kontrol edildi ve sahibi olmayan **{count_2}** bot sunucudan atıldı.',
                error: 'Tüm botlar kontrol edildi ve şüpheli bir durum bulunamadı.'
            },
            all_commands: [
                '‧ `botlist kanal` — Botlist kanalını ayarlar.',
                '‧ `botlist log` — Botlist kayıt kanalını ayarlar.',
                '‧ `botlist yetkili` — Botlist yetkilisi rolünü ayarlar.',
                '‧ `botlist şart` — Kullanıcıların sunucuya bot eklerken botlarının kaç sunucuda olması gerektiğini ayarlar.',
                '‧ `botlist durum` — Botlist durumunu açar/kapatır.',
                '‧ `botlist tür` — Kullanıcıların nasıl bot ekleyeceğini seçer.',
                '‧ `botekle <bot_id> <prefix>` — Eğer botlist türünüz "Komut ile" ise kullanıcılar bu komutla bot ekler.',
                '‧ `botlist özelleştir` — Botlist mesajını özelleştirir.',
                '‧ `botlist otorol` — Botlist otorolünü ayarlar.',
                '‧ `botlist kontrol` — Sunucudan çıkmış kullanıcıların botlarını tarayarak sunucudan atar.'
            ].join('\n')
        },
        balance: {
            author: 'Hesap Detayları',
            wallet: '• Cüzdan',
            darkium: '• Darkium',
            history: '• Geçmiş',
            coin_remove: 'Coin kesildi',
            coin_add: 'Coin eklendi',
            listed_author: 'Tüm İşlemlerin',
            listed_footer: 'Sayfalar arasında geçiş yapmak için butonları kullan.',
            history_empty: 'Hiç işlem bulunamadı, bence bir denemelisin.',
            info: '*Son 5 işlem listeleniyor.*',
            reasons: {
                bj: 'BlackJack',
                roulette: 'Rulet',
                hangman: 'Adam Asmaca',
                partner: 'Partnerlik',
                buy: 'Market',
                cf: 'Yazı Tura',
                puzzle: 'Puzzle',
                rps: 'TKM',
                unknown: 'Bilinmiyor',
                'fast-click': 'Hızlı Tıkla',
                'shop.buy': 'Market',
                pay: 'Ödeme',
                daily: 'Günlük',
                vote: 'Top.gg Oy',
                sell: 'Satış',
                promo: 'Promosyon',
                quest: 'Görev'
            },
            info_btn: [
                'Selam, bu butonu merak ettiğini biliyoruz, bu botun Darkium ile ilgili. Aslında bakarsan Darkium çok işe yarayacaktı fakat son yaşanan olaylar yüzünden **Darkiuma şimdilik** bir anlam yüklemedik. Fakat ilerleyen zamanlarda **Darkium** değerli hale gelecek. Şu an hiç bir şekilde **Darkium** kazanamazsın.'
            ].join('\n')
        },
        avatar: {
            footer: '{user} tarafından istendi.',
            button_download: 'İndir',
            button_banner: 'Banner\'i görüntüle',
            button_avatar: 'Profil Fotoğrafını görüntüle',
        },
        shard: {
            author: '{client} — Shard Bilgileri',
            description: `> • ${Config.emojis.online} **{total_online_shard}** ${Config.emojis.offline} **{total_offline_shard}** ${Config.emojis.total} **{total_shard}**\n> *(veriler anlık olarak değişim gösterebilir)*`,
            fields_1: 'Durum',
            fields_2: 'Gecikme',
            fields_3: 'Sunucular'
        },
        botinfo_old: {
            author: '{client} — Bot Bilgileri',
            footer: 'Veriler anlık olarak değişim gösterebilir.',
            description: `> • Kullanıcı verileri gerektiren veriler, **3. taraf kişiler ile** paylaşılmaz ve hiç bir şekilde kullanıcı verilerini açığa çıkarmaz.`,
            fields_1: '• Genel Veriler',
            fields_1_value: [
                '• Toplam Sunucu: **{guilds}**',
                '• Toplam Kullanıcı: **{users}**',
                '• {progress_bar} *(sunucu hedefi)*'
            ],
            fields_2: '• Sistemsel Veriler',
            fields_2_value: [
                '• Aktiflik Süresi: **{uptime}**',
                '• Veritabanı Durumu: **{database}**',
                '• Bellek Kullanımı: **{memory}** *({memory_percent})*',
                '• İşlemci Kullanımı: **{cpu_percent}**',
            ],
            fields_3: '• Versiyon Verileri',
            fields_3_value: [
                '• {client} Versiyonu: **v{client_version}**',
                '• Node.js Versiyonu: **{nodejs}**',
                '• TypeScript Versiyonu: **{typescript}**',
                '• Veritabanı Versiyonu: **{db}**',
            ],
            fields_4: '• Gecikme Verileri',
            fields_4_value: [
                '• Soket Gecikmesi: **{api_ping}**',
                '• Veritabanı Gecikmesi: **{db_ping}**',
                //'• Önbellek Gecikmesi: **{cache_ping}**',
            ],
            advanced_info: 'Meraklısı için gelişmiş',
            advanced_started: '' + Config.emojis.loading + ' Gelişmiş bilgilere geçiş yapıyorsun, lütfen buradaki kullanıcı gerektiren verilerin **3. taraf kişiler ile** paylaşılmadığını ve asla açığa çıkmayacağını unutma. Gelişmiş modda başarılar!',
            author_advanced: '{client} — Gelişmiş Bilgiler',
            normal_info: 'Sıradan verilere dön',
            fields_1_advanced: '• Sunucu Verileri',
            fields_1_advanced_value: [
                '• Partner Durumu Açık Olan Sunucular: **{partner_status_open}**',
                '• Botlist Durumu Açık Olan Sunucular: **{botlist_status_open}**'
            ],
            fields_2_advanced: '• Kullanıcı Verileri',
            fields_2_advanced_value: [
                '• Toplam Komut Kullanımı: **{total_cmd_use}**',
                '• Toplam Yapılan Partnerlik: **{total_partner}**',
                '• Toplam Eklenen Botlar: **{total_botlist}**',
                '• Dark\'ın Aylık Oyu: **{total_vote}**',
            ],
            fields_3_advanced: '• Sistemsel Veriler',
            fields_3_advanced_value: [
                '• Toplam Yeniden Başlama: **{total_reboot}**',
                '• Toplam Hata: **{total_error}**',
                '• Toplam Çöküş: **{total_crash}**',
                '• Son Yeniden Başlatma: **{last_reboot}**',
                '• Toplam Bulundurulan Komutlar: **{total_cmd}**',
            ],
            fields_4_advanced: '• Shard Verileri',
            fields_4_advanced_value: [
                '• Toplam Shard: **{total_shard}**',
                '• Sunucunun Bulunduğu Shard: **{guild_shard}**',
                '• Shard Gecikmesi: **{shard_ping}ms**',
                '• Shard Sunucu Sayısı: **{shard_guilds}**',
            ],
            fields_3_advanced_value_last_reboot_not_found: 'Son yeniden başlatma bulunamadı.',
        },
        botinfo: {
            description: '> Tüm veriler anlık olarak değişim gösterebilir, kullanıcı gerektiren veriler saklıdır ve 3. taraf kişiler ile paylaşılmaz.',
            author: '{client} — Bot Bilgileri',
            title: '🧪 Tüm veriler anlık olarak alınır.',
            fields: [
                {
                    name: '• Dark Verileri',
                    value: [
                        '**\\-** Toplam Sunucular: **{guilds}**',
                        '**\\-** {progress_bar}',
                        '**\\-** Toplam Kullanıcılar: **{users}**',
                        '**\\-** Toplam Kanallar: **{channels}**',
                        '**\\-** Toplam Emojiler: **{emojis}**'
                    ].join('\n')
                },
                {
                    name: '• Sistemsel Veriler',
                    value: [
                        '**\\-** Veritabanı Durumu: **{db_status}**',
                        '**\\-** Bellek Kullanımı: **{memory} ({memory_percent})**',
                        '**\\-** İşlemci Kullanımı: **{cpu_percent}**',
                        '**\\-** Aktiflik Süresi: **{uptime}**'
                    ].join('\n')
                },
                {
                    name: '• Gecikme Verileri',
                    value: [
                        '**\\-** Soket: **{api_ping}ms**',
                        '**\\-** Veritabanı: **{db_ping}ms**',
                    ].join('\n')
                },
                {
                    name: '• Versiyon Verileri',
                    value: [
                        '**\\-** TypeScript **@ {typescript}**',
                        '**\\-** Node.js **@ {nodejs}**',
                        '**\\-** Discord.js **@ {discordjs}**',
                    ].join('\n')
                }
            ],
            advanced_fields: [
                {
                    name: '• Sunucu Verileri',
                    value: [
                        '**\\-** Partnerlik Durumu Açık Olan Sunucular: **{partner_status_open}**',
                        '**\\-** Botlist Durumu Açık Olan Sunucular: **{botlist_status_open}**'
                    ].join('\n')
                },
                {
                    name: '• Kullanım Verileri',
                    value: [
                        '**\\-** Toplam Komut Kullanımı: **{total_cmd_use}**',
                        '**\\-** Toplam Yapılan Partnerlik: **{total_partner}**',
                        '**\\-** Toplam Eklenen Botlar: **{total_botlist}**',
                        //'**\\-** Dark\'ın Aylık Oyu: **{total_vote}**',
                    ].join('\n')
                },
                {
                    name: '• Sistemsel Veriler',
                    value: [
                        '**\\-** Toplam Yeniden Başlama: **{total_reboot}**',
                        '**\\-** Toplam Hata: **{total_error}**',
                        '**\\-** Toplam Çöküş: **{total_crash}**',
                        '**\\-** Son Yeniden Başlatma: **{last_reboot}**',
                        '**\\-** Bulundurulan Komutlar: **{total_cmd}**',
                    ].join('\n')
                },
                {
                    name: '• Shard Verileri',
                    value: [
                        '**\\-** Toplam Shard: **{total_shard}**',
                        '**\\-** Sunucunun Bulunduğu Shard: **{guild_shard}**',
                        '**\\-** Shard Gecikmesi: **{shard_ping}ms**',
                        '**\\-** Shard Sunucu Sayısı: **{shard_guilds}**',
                    ].join('\n')
                }
            ],
            select_menu: {
                placeholder: 'Gösterim türünü seç...',
                options: {
                    general: 'Genel Veriler',
                    general_description: 'Gelişmiş olmayan; Genel, sıradan bilgiler.',
                    advanced: 'Meraklıları İçin Gelişmiş',
                    advanced_description: 'Meraklıları için; Sıradan bilgiler olmayan, daha çok sistemsel veriler.'
                }
            },
            fields_3_advanced_value_last_reboot_not_found: 'Son yeniden başlatma bulunamadı.',
            advanced_started: '' + Config.emojis.loading + ' Meraklı olduğunun farkındayız, gelişmiş bilgilere geçiş yaparken lütfen biraz bekle. Deneyimini geliştirmek için verileri alıyoruz. Lütfen buradaki bilgilerin **3. taraf kişiler ile** paylaşılmadığını ve asla açığa çıkmayacağını unutma. Gelişmiş modda başarılar!',
        },
        help: {
            description: [
                '• Bu sunucunun prefixi: **{prefix}**',
                '• Tercih ettiğin dil: **{language}**',
                '• Sunucunun shard kimliği: **{shard}** *({ms}ms)*',
                //'• Bir komut hakkında yardım almak için: **{prefix}yardım <komut>**',
                '• <> = Zorunlu, [] = İsteğe bağlı'
            ].join('\n'),
            fields_1: 'Güncellemeler',
            fields_1_err: `${Config.emojis.blob_die} Yeni güncelleme bulunamadı.`,
            fields_2: 'Sürüm Bilgisi',
            fields_2_value: `${Config.emojis.blob_heart} **{version}** sürümünü kullanıyorsun, bu sürüm önemli hata düzeltmeleri ve yeni sistemler içeriyor.`,
            fields_3: 'Komutlar',
            fields_3_value: [
                'Tüm komutları görmek için :notepad_spiral: butonuna tıkla.',
                //'Partner komutlarını görmek için <:handshakedp:1139723676904849458> butonuna tıkla.',
                //'Botlist komutlarını görmek için <:robot:1139722874983284889> butonuna tıkla.',
                //'Sihirli ödülünü almak için <:questiondp:1139723282002759860> butonuna tıkla.'
            ].join('\n'),
        },
        shop: {
            author: '— Market',
            subscriptions_author: '— Abonelikler',
            desc_1: '‧ Bu sunucuda yetkilisin ve tüm markete erişimin var. Lütfen bir sorun oluştuğunda yetkililere ulaşmayı unutma.',
            desc_2: '‧ Bu sunucuda yetkili değilsin ve sadece kendin için alışveriş yapabilirsin.',
            footer: 'Abonelikler direk olarak sunucuya, eşyalar envanterine düşer.',
            footer_error: 'Son yapılan işlem gerçekleştirilemedi.',
            modals_title: 'Satın Al',
            url_modals_title: 'Özel URL',
            prefix_modals_title: 'Sunucu Prefixi',
            label: 'Kaç tane almak istiyorsun?',
            label_url: 'Bir URL Gir',
            errors: {
                not_enough_money: 'Bu satın alımı gerçekleştirmek için **{amount}** coin gerekli.',
                amount_max: 'Tek seferde maksimum **{max}** satın alım yapabilirsin.',
                success: 'Başarıyla **{amount}** adet **{item}** satın aldın.',
                not_enough_item: 'Bu eşyayı satamıyorsun çünkü yeterli miktarda bulunmuyor.',
                special_url_exists: 'Bu **Özel URL** zaten bir sunucuya ait.',
                special_url_invalid: 'Bu **Özel URL** geçerli bir URL değil.',
            },
            value: [
                '{description}',
                '',
                '> • Tür: **{type}**',
                '> • Fiyat: **{price}**',
                '> • Durum: **{buyable}**',
                '> • İçerik: **{content}**',
                '> • {timeOrTotal}: **{duration}**',
            ],
            buyable: 'Satın Alınabilir',
            not_buyable: 'Satın Alınamaz',
            buyable_not_enough_money: 'Bakiye Yetersiz',
            buyable_active_sub: 'Aktif Abonelik Mevcut',
            success: 'Başarıyla **{coin}** karşılığında **{amount}** adet **{item}** satın aldın.',
            types: {
                case: 'Kasa',
                subscribe: 'Abonelik',
            },
            buy: 'Satın Al: {item}',
            sell: 'Sat: {item}',
            modals: {
                title: 'Eşyayı Sat',
                sell_desc: '**{item}** eşyasının piyasa değerine göre **{price}** coin alman gerekiyor. Fakat vergi ile bu satıştan **{tax}** coin alacaksın. Markete satmak istediğinden emin misin? *Bu işlem geri alınamaz.*',
                sell_cancel: 'Satış işlemi iptal edildi.',
                sell_url_desc: '**Özel URL** eşyasını **{amount}** fiyata aldın, fakat bu satıştan herhangi bir şekilde **coin** alamayacaksın. Sadece Özel URL **boşa** düşecek ve herkes tarafından kullanılabilecek, kabul ediyor musun?'
            },
            time_not: 'Süreli değil',
            content_case: 'İstenildiği kadar alınabilir',
            case_desc: 'Kasa açarak risk al ve eşya kazan. Eşyaları satabilir veya kullanabilirsin.',
            time: 'Süre',
            total: 'Sende',
            subscriptions_desc: '‧ Aşağıda sunucuya özel abonelikleri görebilirsiniz.',
            subscriptions_fields: [
                {
                    name: '‧ Rastgele Partnerlik',
                    value: [
                        '• Kalan Kota: **{sub}**',
                    ].join('\n')
                },
                {
                    name: '‧ Özel URL',
                    value: [
                        '• Alınan URL: **{url}**',
                        '• Alınma tarihi: **{date}**',
                        '• Kalan süre: **{duration}**',
                    ].join('\n')
                }
            ],
            subscriptions_not_url: 'URL yok',
            subscriptions_not_sub: 'Abonelik Yok',
            remaining: 'Kalan Süre',
            end_soon: 'Yakında bitiyor',
        },
        case: {
            author: '— Kasaların',
            no_item: 'Hiç kasan yok, lütfen marketten kasa alarak tekrar dene.',
            footer: 'Yeni bir kasa satın almak için "market" komutunu kullan.',
            opening: 'Kasa açılıyor...',
            opening_desc: '**{case}** isimli kasayı açıyorsun, umarız şans seninle olur! Lütfen biraz sabırlı ol ve kasanın açılmasını bekle.',
            opened: '{case} — Kasa Açıldı',
            footer_opened: 'Çıkardığın eşya envanerine düştü.',
            item_desc: [
                '▬▬▬▬▬▬▬▬▬▬',
                `${Config.emojis.items.epic} Destansı - **{epic_rate}%**`,
                `${Config.emojis.items.rare} Nadir - **{rare_rate}%**`,
                `${Config.emojis.items.common} Sıradan - **{common_rate}%**`,
                '',
                '**—** Toplam: **{total}**',
                '**—** Fiyat: **{price}** :coin:',
            ],
            type: '‧ Eşya Türü',
            name: '‧ Eşya İsmi',
            price: '‧ Eşya Fiyatı',
            waiting: 'Zaten bir kasa açıyorsun, lütfen kasanı açtığın zaman tekrar buraya gel. Bunun bir hata olduğunu düşünüyorsan [geliştiricilerle](https://discord.gg/K49zkFEMtr) iletişime geç.'
        },
        inventory: {
            author: '— Envanterin',
            footer: 'Kasalarını mı arıyorsun? onlar "kasa" komutunda.',
            item_desc: 'Sende **{amount}** adet bulunuyor.',
            select_item: 'Kullanmak istediğin eşyayı seç.',
            item_select_desc: '{item} eşyasını kullan.',
            modals: {
                title: '{item}',
                input_label: 'Miktar',
                success_with_sw: 'Başarıyla **{amount}** adet **{item}** eşyasını bu sunucuda kullandın.',
                not_enough: 'Bu eşya girilen sayı kadar bulunmuyor.',
            },
            already_have: 'Bu eşyayı zaten kullanıyorsun. Bu eşyayı sadece satabilirsin.',
            success: 'Başarıyla **{amount}** adet **{item}** eşyasını kullandın.',
            no_item: 'Hiç eşyan yok. Lütfen bir eşya satın al ve tekrar dene.'
        },
        userinfo: {
            author: 'Görüntüleniyor —',
            footer: 'Rozetler, bir kullanıcı üzerindeki en önemli şeydir.',
            errors: {
                user_has_banned: 'Bu kullanıcı mağaradan hala çıkamadığı için bilgileri görüntülenemiyor.',
                user_is_bot: 'Robot kullanıcıların bilgilerini görüntüleyemezsin.'
            },
            platform: {
                desktop: 'Bilgisayar',
                mobile: 'Mobil',
                web: 'Web',
                unknown: 'Bilinmiyor'
            },
            status: {
                online: 'Çevrimiçi',
                idle: 'Boşta',
                dnd: 'Rahatsız Etmeyin',
                offline: 'Çevrimdışı',
                unknown: 'Bilinmiyor'
            },
            activity: {
                yes: 'Var',
                unknown: 'Yok'
            },
            fields: [
                {
                    name: '‧ Genel Bilgiler',
                    value: [
                        'Kullanıcı Adı: **{displayName}** *({username})*',
                        'Kullanıcı Kimliği: **{id}**',
                        'Oluşturulma Tarihi: **{created}**',
                        'Katılma Tarihi: **{joined}**',
                    ],
                    inline: false
                },
                {
                    name: '‧ Dark Bilgileri',
                    value: [
                        'Toplam Coin: **{coin}**',
                        'Toplam Darkium: **{darkium}**',
                        'Toplam Rozet: **{total_badge}**',
                        'Kullanım Tarihi: **{dp_used}**',
                    ],
                    inline: false
                },
                {
                    name: '‧ Ek Bilgiler',
                    value: [
                        'Platform: **{platform}**',
                        'Durum: **{status}**',
                        'Aktivite: **{user_activity}**'
                    ]
                },
                {
                    name: '‧ En Değerli Rozet',
                    value: [
                        '{featured_badge}'
                    ]
                }
            ],
            select_menu_placeholder: 'Görüntülemek istediğin bilgiyi seç.',
            select_menu_1: 'Ana Bilgiler',
            select_menu_1_description: 'Kullanıcı hakkında genel bilgileri görüntüle.',
            select_menu_2: 'Detaylı Rozet Bilgileri',
            select_menu_2_description: 'Kullanıcının tüm rozetlerini detaylı bir şekilde görüntüle.',
            no_badge_found: 'Olamaz! Hiç rozet bulunamadı.'
        },
        roulette: {
            title: 'Rulet',
            bet: '• Bahis',
            now: '• Şuan',
            bullet: '• Mermiler',
            pull: 'Devam et',
            leave: 'Pes et',
            collect: 'Çekil',
            noMoney: 'Bahis yapmak için yeterli paran yok. Gerekli miktar: **{amount}**',
        },
        rps: {
            title: 'Taş, Kağıt, Makas!',
            you: '• Sen',
            bot: '• Bot',
            footer: 'Senin seçimin bekleniyor...',
            footer_draw: 'Berabere, ikiniz de aynı şeyi seçtiniz.',
            footer_win: 'Kazandın.',
            footer_lose: 'Kaybettin.',
            win: 'Kazandın!',
            lose: 'Kaybettin!',
            draw: 'Berabere!',
            footer_leave: 'Kapışmadan ayrıldın.',
            leave: 'Ayrıldı!'
        },
        fastclick: {
            content: '📍 Oyun başladı! Ne kadar **hızlı tıklarsan** o kadar çok **coin** kazanırsın.',
            lose_content: '🐢 Maalesef çok **yavaş** tıkladın, hiç ödül alamadın.',
            win_content: ':clap: Çok iyiydin! Tebrikler, **{amount}** coin kazandın.',
            time_content: ':clock10: Üf ya! Zaman doldu, hiç ödül alamadın...'
        },
        guessColor: {
            author: '— Renk Tahmini',
            footer: 'Zorluklara göre alınan ödül artar ve daha fazla kazanırsın.',
            description: '‧ Aşağıdaki seçim menüsünden bir **zorluk** seç, yapamadığın zaman **paran gitmeyecek** fakat süre **kısıtlaması** uygulanacak.',
            easy: 'Kolay',
            easy_desc: 'Kolay modu seçerek daha az ödül al fakat kazanma şansını arttır.',
            medium: 'Orta',
            medium_desc: 'Orta modu seçerek fazla ödül al fakat kazanma şansını azalt.',
            hard: 'Zor',
            hard_desc: 'Zor modu seçerek fazla ödül al fakat kazanma şansını azalt.',
            extreme: 'Çok Zor',
            extreme_desc: 'Çok zor modu seçerek fazla ödül al fakat kazanma şansını azalt.',
            placeholder: 'Zorluk Seç'
        },
        pay: {
            noUser: 'Bu komutu kullanabilmek için geçerli bir kullanıcı etiketlemelisiniz.',
            noAmount: 'Bu komutu kullanabilmek için geçerli bir miktar girmelisiniz.',
            minAmount: 'Bir kullanıcıya minimum **{amount}** coin gönderebilirsiniz.',
            self: 'Zeki olabilirsin, ama kendine coin gönderemezsin. **0_o**',
            noBot: 'Robotların hesabı yoktur, dolayısıyla coin gönderilemez.',
            noMoney: 'Bu işlemi gerçekleştirmek için yeterli paran yok.',
            maxAmount: 'Bir kullanıcıya maksimum **{amount}** coin gönderebilirsiniz.',
            success: '<@{user}> isimli kullanıcıya başarıyla **{amount}** coin gönderdin.',
        },
        cf: {
            noBet: 'Bu komutu kullanabilmek için geçerli bir bahis girmelisiniz.',
            noMoney: 'Bahis oynamak için yeteri kadar paran yok.',
            maxBet: 'Yazı tura oyununda maksimum **{amount}** coin bahis yapabilirsiniz.',
            start: `**__{amount}__** ${Config.emojis.coin} coin yatırıldı, **{choice}** seçimi yapıldı <@{user}>: Umarız şans seninle olur!\n${Config.emojis.coinflip} para dönüyor... Dark sana eşlik edecek.`,
            win: `**__{amount}__** ${Config.emojis.coin} coin yatırıldı, **{choice}** seçimi yapıldı <@{user}>: Harikasın!\n**{amount}** coin kazandın, tebrikler! Bugün şanslı günündesin.`,
            lose: `**__{amount}__** ${Config.emojis.coin} coin yatırıldı, **{choice}** seçimi yapıldı <@{user}>: Bu kötü oldu.\n**{amount}** coin kaybettin. Teselli için Dark'a sarıl.`,
            heads: 'Yazı',
            tails: 'Tura',
        },
        leaderboard: {
            array: ['coin', 'partner', 'oy', 'streak'],
            invalid_type: 'Bu komutu kullanabilmek için geçerli bir tür girmelisiniz. **{types}**',
            coin: {
                title: '— Coin Sıralaması',
                no_data: 'Hiç veri bulunamadı, ne üzücü ama!',
                modal: {
                    title: 'Sayfa Seç',
                    input: 'Sayfa numarası gir',
                    invalid_page: 'Sayfa numarası geçerli değil. Maksimum **{max_page}.** sayfaya gidebilirsiniz.',
                },
                loading: `${Config.emojis.loading} Verileri şu anda alıyoruz, lütfen **biraz bekleyin...**`,
            },
            vote: {
                title: '— Oy Sıralaması',
            },
            streak: {
                title: '— Oy Streakı Sıralaması',
            },
            partner: {
                title: '— Partnerlik Sıralaması',
            },
            page: '{max_page} sayfa arasından, {page}. sayfadasın.',
            skip: 'Atla'
        },
        language: {
            no_lang: 'Bu komutu kullanabilmek için geçerli bir dil girmelisiniz. **{languages}**',
            success: 'Tercih ettiğiniz dil **{language}** olarak ayarlandı.',
            same_lang: 'Zaten bu dili tercih ediyorsunuz.',
        },
        bj: {
            active_game: 'Zaten bir oyun oynuyorsun, lütfen oyunun bitmesini bekle.',
            no_bet: 'Bu oyunu oynamak için geçerli bir bahis girmelisiniz.',
            min_bet: 'Blackjack oyununda minimum **{amount}** coin bahis yapabilirsiniz.',
            max_bet: 'Blackjack oyununda maksimum **{amount}** coin bahis yapabilirsiniz.',
            no_money: 'Bu işlemi gerçekleştirmek için yeterli paran yok.',
            both_bust: 'Beraberlik, iki tarafta 21\'i geçti.',
            dealer_wins: 'Dağıtıcı kazandı, {bet} coin kaybettin.',
            player_wins: '{player} kazandı, {bet} coin kazandın.',
            tie: 'Beraberlik, iki tarafın da puanı aynı.',
            continues: 'Oyun devam ediyor...',
            author: '{author} — Blackjack Oynanıyor',
            dealer: 'Dağıtıcı'
        },
        daily: {
            waiting: 'Günlük ödülünü almak için **{time}** beklemelisin.',
            success: 'Günlük ödülünü başarıyla aldın, **{amount}** coin kazandın.',
        },
        vote: {
            footer: 'Aşağıdaki butondan kalan süreni görebilirsin.',
            btn_url: 'Oy ver',
            author: '— Oy Bilgileri',
            fields: [
                {
                    name: '‧ Oyların',
                    value: [
                        '**╰** {votes}',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ Streakların',
                    value: [
                        '**╰** {streak}',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ En Yüksek Streakın',
                    value: [
                        '**╰** {highest_streak}',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ Oy Ödülleri',
                    value: [
                        '**╰** Oy verirsen **{amount}** coin kazanacaksın.',
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '‧ Streak Nedir?',
                    value: [
                        '**╰** Oy verdikten sonra 24 saat içinde tekrar oy verirsen "Streak" artacaktır fakat oy vermezsen sıfırlanır ve başa dönersin. "Streak" arttıkça ödül çarpanın **{streak_amount}** artar.',
                    ].join('\n'),
                }
            ]
        },
        invite: {
            author: 'Şaheseri Davet Et — {name}',
            footer: '©️ {name} • ' + new Date().getFullYear() + ' ',
            description: 'Aşağıdaki butonlardan birini seçerek **destek sunucsuna** katılabilir, veya **Dark Şaheserini** sunucuna ekleyebilirsin. **2020** tarihinden beri aralıksız geliştiriliyoruz ve seni aramızda görmekten mutluluk duyarız. Ayrıca, destek sunucusuna katılarak güncellemelerden anında **haberdar** olabilir, çekilişlerimize katılabilirsin.',
            fields_1_name: '‧ {guild} sunucu bize güvendi.',
            fields_1_value: '**{guilds}** sunucu bize güvendi ve sunucusuna ekledi, ayrıca **{partner}** partnerlik sistemi açık sunucu, **{botlist}** botlist sistemi açık sunucu var. Bunlardan biri olmak istemez misin? :thinking:',
            invite: 'Sunucuna Davet Et',
            support: 'Destek Sunucusu'
        },
        slash: {
            clear: {
                errors: {
                    fetchMessages: 'Mesajlar alınırken bir hata oluştu.',
                    bulkDelete: 'Mesajlar silinirken bir hata oluştu.',
                    filterErr: 'Dark kendi mesajlarını silemez.',
                    noMessages: 'Ohh! Silinecek hiç mesaj bulunamadı, tekrar dene.',
                },
                success: 'Başarılı bir şekilde **{count}** mesaj silindi.'
            }
        },
        context: {
            bug: {
                errors: {
                    not_bot_message: 'Seçtiğiniz mesaj **Dark\'a** ait değil ve bu yüzden rapor edilemez.'
                },
                modal: {
                    title: 'Hata Bildir',
                    label: 'Hata Açıklaması',
                    placeholder: 'Hata açıklaması gir',
                },
                success: 'Hata başarıyla bildirildi, hatanız incelenerek en kısa zamanda düzeltilecek.'
            }
        },
        promo: {
            enter_code: 'Bu komutu kullanabilmek için kullanmak istediğiniz kodu girmelisiniz.',
            not_found: 'Kullanmaya çalıştığınız kod bulunamadı. Bunun bir hata olduğunu düşünüyorsanız [yetkililere](' + Config.main.support + ') ulaşın.',
            max_use: 'Bu kod maksimum kullanım sayısına ulaştı.',
            type_error: 'Bu kod sadece sunucularda kullanılabilir.',
            perm_error: 'Bu komut **GUILD** türünde ve sadece **Sunucuyu Yönet** yetkisine sahip olanlar kullanabilir.',
            already_used: 'Bu kodu zaten kullanmışsınız.',
            success_coin_author: '{user} — Promosyon Kodu',
            success_coin_footer: 'Kazanılan coin, direk olarak hesabına yatırıldı.',
            success_coin_title: '🎉 Vay be! Bu harika.',
            success_coin_desc: 'Başarıyla **{code}** kodunu kullandın ve hesabına **{amount}** coin yatırıldı. Tebrikler!',
            success_random_desc: 'Başarıyla **{code}** kodunu kullandın ve sunucunuza **{amount}** partner rastgele aboneliği verildi. Tebrikler!',
            success_random_footer: 'Kazanılan abonelik, sunucunuza direk olarak sunucuya verildi.'
        },
        tasks: {
            author: '{user} — Görevler',
            task: '**Görev:** {task}',
            time: 'Tarih: **{time}**',
            prize: 'Ödül: **{prize}** *Coin ' + Config.emojis.coin + '*',
            title: '‧ Görev #{number}',
            progress: '**İlerleme:** %{percent} `({collected}/{required})`',
            types: {
                partner: 'Sunucunu Büyüt',
                partner_desc: '**{amount}** partnerlik yap.',
                case: 'Kasaları Yağmala',
                case_desc: '**{amount}** kasa aç.',
                vote: 'Oy Ver',
                vote_desc: 'Bota **[{amount}](https://top.gg/bot/1157779657467379823/vote)** oy ver.',
                daily: 'Günlük Ödül',
                daily_desc: '**{amount}** kere günlük ödülünü al.',
                generosity: 'Cömert Biri Ol',
                generosity_desc: 'Dostuna **{amount}** kere coin gönder.',
                buy_item: 'Market Alışverişi',
                buy_item_desc: '**{amount}** eşya al.',
                play_puzzle: 'Puzzle Oyna',
                play_puzzle_desc: '**{amount}** kere puzzle oyna.',
                be_the_bad_guy: 'Kötü Ol',
                be_the_bad_guy_desc: '**{amount}** kere kumar oyna.',
            },
            messages: {
                play_puzzle: '**Puzzle Oyna** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
                partner: '<@{user}>, **Sunucunu Büyüt** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
                case: '**Kasaları Yağmala** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
                vote: '**Oy Ver** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
                daily: '**Günlük Ödül** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
                generosity: '**Cömert Biri Ol** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
                buy_item: '**Market Alışverişi** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
                be_the_bad_guy: '**Kötü Ol** görevi başarıyla tamamlandı ve ödülün olan **{amount}** coin hesabına yatırıldı.',
            },
            to_the_next: 'Bir sonraki göreve {time} kaldı.',
            no_to_the_next: 'Yeni bir görev almak için önceki görevleri yapmalısın.',
            refresh: 'Görevleri Yenile ({amount})',
            free: 'Ücretsiz',
            difficulty_1: '<:tasks_easy:1188267049382858832>',
            difficulty_2: '<:tasks_medium:1188267127304626176>',
            difficulty_3: '<:tasks_hard:1188267104248549507>',
            no_money: 'Görevleri yenilemek için gerekli paran yok.',
            no_tasks_found: 'Tüm görevleri bitirmişsin, **{time}** sonra tekrar gel!'
        },
        guild_case: {
            author: 'Sunucu Kasası — {guild}',
            description: '> Sunucu kasasındaki coinleri, yetkililerinize **eşit olarak** dağıtabilir veya yetkililerinizin istediği zaman para çekmesini sağlayabilirsiniz. Eğer sunucu kasasını yapılandırmak istiyorsanız, **aşağıdaki butona** tıklayabilirsiniz.',
            fields: {
                1: {
                    name: '• Toplam Coin',
                    value: '*__{total}__* ' + Config.emojis.coin + '',
                },
                2: {
                    name: '• Toplam Yetkili',
                    value: '*__{total_staff}__* 👥',
                },
                4: {
                    name: '• Geçmiş (8)',
                }
            }
        }
    },
    categories: {
        general: 'Genel Sunucu',
        general_description: 'Genel sunucular, içerisinde birden fazla özellik bulunduran ve genele hitap eden sunuculardır.',
        game: 'Oyun Sunucu',
        game_description: 'Oyun sunucuları, daha çok oyuncu kitlesine hitap eden sunuculardır.',
        public: 'Public Sunucu',
        public_description: 'Public sunucular, içerisinde tag sistemi bulunduran, ve genele hitap eden sunuculardır.',
        nsfw: 'NSFW Sunucu',
        nsfw_description: 'NSFW sunucular, içerisinde +18 içerikler bulunduran sunuculardır.',
        botlist_code: 'Botlist & Kod Sunucusu',
        botlist_code_description: 'Botlist & Kod sunucuları, geliştiricilere, bot yapımcılarına hitap eden sunuculardır.',
        roleplay: 'Rol Yapma Sunucusu',
        roleplay_description: 'Rol yapma sunucuları, daha çok rol yapma üzerinedir tiyatro topluluğuna hitap eder.',
        software: 'Yazılım Sunucusu',
        software_description: 'Yazılım sunucuları, daha çok yazılım geliştiricilerine hitap eden sunuculardır.',
        community: 'Topluluk Sunucusu',
        community_description: 'Topluluk sunucuları, her topluluğa hitap eden sunuculardır.',
        reward: 'Ödül Sunucusu',
        reward_description: 'Ödül sunucuları, belirli şeyler karşılığında veya karşılıksız ödül veren sunuculardır.',
        anime: 'Anime Temalı Sunucu',
        anime_description: 'Anime temalı sunucular, anime severlere hitap eden sunuculardır.',
    },
    cmd: {
        top: {
            description: 'Coin ve Sunucu sıralamasını görüntülersiniz.',
        },
        market: {
            description: 'Sunucu içi gelişimler, kasalar vs. satın alabilirsiniz.',
        },
        ping: {
            description: 'Botun anlık olarak gecikmesini görüntülersiniz.'
        },
        pay: {
            description: 'Bir kullanıcıya coin gönderirsiniz.'
        },
        partner: {
            description: 'Tüm partnerlik komutlarını görüntülersiniz.'
        },
        invite: {
            description: 'Bu şaheseri sunucuna davet et.'
        },
        help: {
            description: 'Tüm komutları görüntülersiniz.'
        },
        botlist: {
            description: 'Tüm botlist komutlarını görüntülersiniz.'
        },
        userinfo: {
            description: 'Kendi bilgilerinize veya bir kullanıcının bilgilerine bakarsınız.'
        },
        shard: {
            description: 'Botun anlık shard bilgilerine bakarsınız.'
        },
        envanter: {
            description: 'Envanterinize bakarsınız.'
        },
        kasa: {
            description: 'Satın aldığınız kasaları açarsınız.'
        },
        botinfo: {
            description: 'Botun bilgilerine bakarsınız.'
        },
        avatar: {
            description: 'Bir kullanıcının profil fotoğrafına bakarsınız.'
        },
        'add-bot': {
            description: 'Botlist durumu açık olan sunucularda bot eklersiniz.'
        },
        personel: {
            description: 'Personel harici girilmez. :p'
        },
        tkm: {
            description: 'Taş kağıt makas oynarsınız.'
        },
        rulet: {
            description: 'Rulet oynarsınız.'
        },
        puzzle: {
            description: 'Puzzle oynarsınız.'
        },
        hangman: {
            description: 'Adam asmaca oynarsınız.'
        },
        ht: {
            description: 'Hızlı Tıkla oyununu oynarsınız.'
        },
        cf: {
            description: 'Yazı tura oyununu oynarsınız.'
        },
        balance: {
            description: 'Paranızı ve tüm işlemlerinizi görüntülersiniz.'
        },
        language: {
            description: 'Tercih ettiğiniz dili değiştirirsiniz.'
        },
        bj: {
            description: 'Blackjack oyununu oynarsınız.'
        },
        'guild-language': {
            description: 'Sunucunun dilini değiştirirsiniz.'
        },
        daily: {
            description: 'Günlük ödülünüzü alırsınız.'
        },
        vote: {
            description: 'Verdiğiniz oylara ve vote streaklarınıza bakarsınız.'
        },
        tasks: {
            description: 'Biriken görevlerinizi yaparak coin kazanırsınız.'
        }
    }
};