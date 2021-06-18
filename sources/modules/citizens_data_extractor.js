Module.register(function() {

    var MODULE_NAME = 'citizen_data_extractor';

    /******************
     * Module context *
     ******************/

    var EXTRACT_BUTTON_ID = 'd2ne_extract_citizen_data';

    var SOUL_TIMEOUT = 5000; //ms

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_extract_alive_citizens_data_button_text'] = 'Extract alive citizens data';
        i18n[I18N.LANG.EN][MODULE_NAME + '_extract_soul_data_button_text'] = 'Extract the soul data';
        i18n[I18N.LANG.EN][MODULE_NAME + '_extract_game_history_button_text'] = 'Extract citizens data';
        i18n[I18N.LANG.EN][MODULE_NAME + '_warning'] = 'This could take some time, please do not stop the process. Do you want to continue?';
        i18n[I18N.LANG.EN][MODULE_NAME + '_work_in_progress'] = 'Work in progress...';
        i18n[I18N.LANG.EN][MODULE_NAME + '_citizen'] = 'Citizen';
        i18n[I18N.LANG.EN][MODULE_NAME + '_result_notif'] = 'Results:';
        i18n[I18N.LANG.EN][MODULE_NAME + '_use_die2nite_picto_diff'] = 'You can use this results here.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_extract_alive_citizens_data_button_text'] = 'Extraire les données des vivants';
        i18n[I18N.LANG.FR][MODULE_NAME + '_extract_soul_data_button_text'] = 'Extraire les données de l\'âme';
        i18n[I18N.LANG.FR][MODULE_NAME + '_extract_game_history_button_text'] = 'Extraire les données des citoyens';
        i18n[I18N.LANG.FR][MODULE_NAME + '_warning'] = 'Cette opération peut prendre quelques temps, merci de ne pas interrompre le processus. Voulez-vous continuer ?';
        i18n[I18N.LANG.FR][MODULE_NAME + '_work_in_progress'] = 'Récupération en cours...';
        i18n[I18N.LANG.FR][MODULE_NAME + '_citizen'] = 'Citoyen';
        i18n[I18N.LANG.FR][MODULE_NAME + '_result_notif'] = 'Résultats :';
        i18n[I18N.LANG.FR][MODULE_NAME + '_use_die2nite_picto_diff'] = 'Vous pouvez utiliser ces résultats ici.';

        I18N.set(i18n);
    }

    function extract_username(ret, next) {
        JS.wait_for_selector('div.tid_userName > span:last-child', function(node) {
            ret.username = node.textContent;
            next();
        });
    }

    function extract_icon(ret, next) {
        JS.wait_for_selector('div.tid_userSheet img.tid_avatarImg', function(node) {
            ret.iconURL = node.src;
            next();
        }, 1, next);
    }

    function extract_title(ret, next) {
        JS.wait_for_selector('span.tid_userTitle', function(node) {
            ret.title = node.textContent.trim();
            if (ret.title.length === 0) {
                delete ret.title;
            }
            next();
        });
    }

    function extract_profile_likes(ret, next) {
        JS.wait_for_selector('span.tid_likeButtonCompact', function(node) {
            ret.profileLikes = parseInt(node.textContent);
            if (typeof ret.profileLikes !== 'number' || isNaN(ret.profileLikes)) {
                ret.profileLikes = 0;
            }
            next();
        });
    }

    function extract_avatar(ret, next) {
        JS.wait_for_selector('div.tid_userSheet img.tid_avatarImg', function(node) {
            ret.avatarURL = node.src;
            next();
        }, 1, next);
    }

    function extract_sex(ret, next) {
        JS.wait_for_selector('div.tid_age > img:first-child', function(node) {
            var m = node.src.match(/\/([a-z]+)\.png$/);
            switch (m) {
                case 'male':
                    ret.sex = 'male'; break;
                case 'female':
                    ret.sex = 'female'; break;
            }
            next();
        });
    }

    function extract_age(ret, next) {
        JS.wait_for_selector('div.tid_age', function(node) {
            ret.age = parseInt(node.textContent);
            if (typeof ret.age !== 'number' || isNaN(ret.age)) {
                delete ret.age;
            }
            next();
        });
    }

    function extract_city(ret, next) {
        JS.wait_for_selector('div.tid_city', function(node) {
            ret.city = node.textContent.trim();
            if (ret.city === '--') {
                delete ret.city;
            }
            next();
        });
    }

    function extract_country(ret, next) {
        JS.wait_for_selector('div.tid_country', function(node) {
            ret.country = node.textContent.trim();
            if (ret.country === '--') {
                delete ret.country;
            }
            next();
        });
    }

    function extract_description(ret, next) {
        JS.wait_for_selector('div.tid_userStatus div.tid_content p', function(node) {
            ret.descriptionHTML = node.innerHTML;
            next();
        }, 1, next);
    }

    function extract_pictos_score(ret, next) {
        JS.wait_for_selector('div.tid_overall', function(node) {
            ret.pictosScore = parseInt(node.textContent);
            next();
        });
    }

    function extract_pictos_top(ret, next) {
        var picto;
        var count;

        JS.wait_for_selector_all('div.tid_top > div.tid_goal.tid_bg3.tid_rare:not([style])', function(nodes) {
            for (var i = 0, max = nodes.length; i < max; i++) {
                ret.pictosTop = ret.pictosTop || {};
                picto = nodes[i].querySelector('div.tid_icon > img').src.match(/\/img\/icons\/(.+)\.gif$/)[1];
                count = parseInt(nodes[i].textContent);
                ret.pictosTop[picto] = count;
            }
            next();
        }, 1, next);
    }

    function extract_pictos_rare(ret, next) {
        var picto;
        var count;

        JS.wait_for_selector_all('div.tid_block.tid_stats div.tid_goal.tid_bg3.tid_tip.tid_rare.tid_parsed', function(nodes) {
            for (var i = 0, max = nodes.length; i < max; i++) {
                ret.pictosRare = ret.pictosRare || {};
                picto = nodes[i].querySelector('img.tid_icon').src.match(/\/img\/icons\/(.+)\.gif$/)[1];
                count = parseInt(nodes[i].querySelector('div.tid_count > span:first-child').textContent);
                ret.pictosRare[picto] = count;
            }
            next();
        }, 1, next);
    }

    function extract_pictos(ret, next) {
        var picto;
        var count;

        JS.wait_for_selector_all('div.tid_block.tid_stats div.tid_goal.tid_bg3.tid_tip.tid_parsed:not(.tid_rare)', function(nodes) {
            for (var i = 0, max = nodes.length; i < max; i++) {
                ret.pictos = ret.pictos || {};
                picto = nodes[i].querySelector('img.tid_icon').src.match(/\/img\/icons\/(.+)\.gif$/)[1];
                count = parseInt(nodes[i].querySelector('div.tid_count > span:first-child').textContent);
                ret.pictos[picto] = count;
            }
            next();
        }, 1, next);
    }

    function extract_soul_score(ret, next) {
        JS.wait_for_selector('div.score > strong', function(node) {
            ret.soulScore = parseInt(node.textContent);
            next();
        });
    }

    function extract_citizen_info(citizen_id, on_finish)
    {
        var timeout = null;

        var listener = function() {
            document.removeEventListener('d2n_gamebody_reload', listener);

            var ret = {};
            ret.D2NEVersion = '<%= version %>';
            ret.rootURL = window.location.host;
            if (citizen_id) {
                ret.id = parseInt(citizen_id);
            }
            ret.time = Math.floor(new Date() / 1000);

            extract_username(ret, function next() {
                extract_icon(ret, function next() {
                    extract_title(ret, function next() {
                        extract_profile_likes(ret, function next() {
                            extract_avatar(ret, function next() {
                                extract_sex(ret, function next() {
                                    extract_age(ret, function next() {
                                        extract_city(ret, function next() {
                                            extract_country(ret, function next() {
                                                extract_description(ret, function next() {
                                                    extract_pictos_score(ret, function next() {
                                                        extract_pictos_top(ret, function next() {
                                                            extract_pictos_rare(ret, function next() {
                                                                extract_pictos(ret, function next() {
                                                                    extract_soul_score(ret, function next() {
                                                                        // Everything has been parsed, clear the timeout
                                                                        clearTimeout(timeout);
                                                                        on_finish(ret);
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        };

        if (citizen_id) {
            // If timeout is reached, try to extract the data again. Except if
            // the account is deleted
            timeout = setTimeout(function() {
                document.removeEventListener('d2n_gamebody_reload', listener);

                // If the account is deleted, abort
                if (document.querySelector('.tid_noTid') !== null) {
                    return on_finish(null);
                }

                return extract_citizen_info(citizen_id, on_finish);
            }, SOUL_TIMEOUT);

            document.addEventListener('d2n_gamebody_reload', listener, false);
            D2N.redirect_to_citizen_soul(citizen_id, '' + (Math.floor(new Date() / 1000)));
        } else {
            listener();
        }
    }

    /****/

    function extract_citizens_info(citizens_id, onFinish)
    {
        var ret = [];
        var max = citizens_id.length;

        var handler = function(i) {
            if (i >= max) {
                return onFinish(ret);
            }

            // Notify of the progress
            D2N.notification(I18N.get(MODULE_NAME + '_work_in_progress') + ' ' +
                I18N.get(MODULE_NAME + '_citizen') + ' ' + (i + 1) + '/' + max);

            return extract_citizen_info(citizens_id[i], function(citizen_info) {
                if (citizen_info !== null) {
                    ret.push(citizen_info);
                }
                handler(i + 1);
            });
        };
        handler(0);
    }

    /****/

    function extract_citizens_id(selector)
    {
        var citizens_link = document.querySelectorAll(selector);
        var ret = [];
        var regex = /uid=(\d+)/;
        var regex_results;

        for (var i = 0, max = citizens_link.length; i < max; i++) {
            regex_results = regex.exec(citizens_link[i].href);
            if (regex_results.length > 1) {
                ret.push(regex_results[1]);
            }
        }

        return ret;
    }

    /****/

    function on_soul_button_click()
    {
        D2N.notification(I18N.get(MODULE_NAME + '_work_in_progress'));

        extract_citizen_info(null, function(citizen_info) {
            D2N.notification(JS.jsonToDOM(['div', {},
                I18N.get(MODULE_NAME + '_result_notif'),
                ['textarea', { readonly: '', onclick: 'this.select()',
                               style: 'width: 100%; max-width: 100%; height: initial; margin: 0 auto; margin-top: 5px; margin-bottom: 3px; padding: 0;' },
                    JSON.stringify(citizen_info)
                ],
                ['a', { href: 'http://beaumet.me/die2nite_picto_diff/', target: '_blank' },
                    I18N.get(MODULE_NAME + '_use_die2nite_picto_diff')
                ]
            ], document));
        });
    }

    function on_citizens_list_button_click(selector, final_redirection)
    {
        if (confirm(I18N.get(MODULE_NAME + '_warning')) === false) {
            return;
        }

        D2N.notification(I18N.get(MODULE_NAME + '_work_in_progress'));

        var citizens_id = extract_citizens_id(selector);
        extract_citizens_info(citizens_id, function(citizens_info) {

            var after_getting_back_to_citizens_list = function() {
                document.removeEventListener('d2n_gamebody_reload', after_getting_back_to_citizens_list, false);
                D2N.notification(JS.jsonToDOM(['div', {},
                    I18N.get(MODULE_NAME + '_result_notif'),
                    ['textarea', { readonly: '', onclick: 'this.select()',
                                   style: 'width: 100%; max-width: 100%; height: initial; margin: 0 auto; margin-top: 5px; margin-bottom: 3px; padding: 0;' },
                        JSON.stringify(citizens_info)
                    ],
                    ['a', { href: 'http://beaumet.me/die2nite_picto_diff/', target: '_blank' },
                        I18N.get(MODULE_NAME + '_use_die2nite_picto_diff')
                    ]
                ], document));
            };
            document.addEventListener('d2n_gamebody_reload', after_getting_back_to_citizens_list, false);

            JS.redirect(final_redirection);
        });
    }

    /****/

    function get_button(i18n_key, on_click, style)
    {
        return JS.jsonToDOM(["a", { id: EXTRACT_BUTTON_ID, "class": "button", style: '' + style,
                                    onclick: on_click },
            ["img", { "src": "/gfx/icons/item_book_gen_letter.gif" }],
            ' ' + I18N.get(MODULE_NAME + i18n_key)
        ], document);
    }

    function inject_game_history_button()
    {
        JS.wait_for_selector('div.ghost div.footer', function(el) {
            el.appendChild(get_button('_extract_game_history_button_text', function() {
                on_citizens_list_button_click('td.name > a[href^="#ghost/user?uid="]', window.location.hash);
            }, 'margin-left: 30px;'));
        });
    }

    function inject_soul_button()
    {
        JS.wait_for_selector('div.footSearch', function(el) {
            el.parentNode.insertBefore(get_button('_extract_soul_data_button_text', on_soul_button_click), el);
        });
    }

    function inject_town_citizens_button()
    {
        JS.wait_for_selector('div.citizens', function(el) {
            el.appendChild(get_button('_extract_alive_citizens_data_button_text', function() {
                on_citizens_list_button_click('a.tid_user[href^="/#ghost/city?go=ghost/user?uid="]', window.location.hash);
            }));
        });
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: true,
            isProtected: false
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                document.addEventListener('d2n_gamebody_reload', function() {
                    if (JS.is_defined(document.getElementById(EXTRACT_BUTTON_ID))) {
                        return;
                    }

                    if (D2N.is_on_page_in_city('citizens')) {
                        inject_town_citizens_button();
                    } else if (/^#ghost\/city\?go=ghost\/user(?:\?uid=\d+)?;sk=/.test(window.location.hash)) {
                        inject_soul_button();
                    } else if (/^#ghost\/city\?go=ghost\/ingame\?id=\d+;sk=/.test(window.location.hash)) {
                        inject_game_history_button();
                    }
                }, false);
            }
        }

    };
});
