Module.register(function() {

    var MODULE_NAME = 'hide_rookie_mode';

    /******************
     * Module context *
     ******************/

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Hide rookie mode';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Hide all the links to enable the rookie mode.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Cacher le mode apprentissage';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Cache tous les liens pour activer le mode apprentissage.';

        I18N.set(i18n);
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.INTERFACE,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                JS.injectCSS(
                    'div.block.tutorialBlock, div.expertMode {' +
                        'display: none;' +
                    '}'
                );
            }
        }

    };
});
