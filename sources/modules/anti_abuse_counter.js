Module.register(function() {

	var MODULE_NAME = 'anti_abuse_counter';

	/******************
	 * Module context *
	 ******************/

	var ANTI_ABUSE_NOTIFIER_ID = 'd2ne_abuse_counter';

	var _time_interval = null;
	var _oldBackPack = 0;

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Prevent bank abuse';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Display a an anti-abuse counter on the bank page';
		i18n[I18N.LANG.EN][MODULE_NAME + '_label'] = 'Anti-abuse counter:';
		i18n[I18N.LANG.EN][MODULE_NAME + '_reset_in'] = 'reset in';
		i18n[I18N.LANG.EN][MODULE_NAME + '_prevent'] = 'Please wait until the end of the countdown before to try again.';

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer le compteur anti-abus';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Sur la page de la banque, affiche un compteur pour prévenir les abus et empêche de prendre plus de 5 objets toutes les 15 minutes.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_label'] = 'Compteur anti-abus :';
		i18n[I18N.LANG.FR][MODULE_NAME + '_reset_in'] = 'reset dans';
		i18n[I18N.LANG.FR][MODULE_NAME + '_prevent'] = 'Il serait préférable d\'attendre la fin du décompte avant d\'essayer à nouveau.';


		I18N.set(i18n);
	}

	function get_notifier_div()
	{
		var current_time = Math.floor(+new Date() / 1000);
		var time_left = this.properties.end_of_abuse - current_time + 1;
		var hour_left = Math.floor(time_left / 60);
		var min_left = Math.floor(time_left % 60);

		return JS.jsonToDOM(["div", { "id": ANTI_ABUSE_NOTIFIER_ID, "class": "extractCpt" },
			["img", { "src": "/gfx/icons/tag_1.gif" }],
			' ' + I18N.get(MODULE_NAME + '_label') + ' ',
			["strong", {},
				this.properties.attempt_left
			],
			" (" + I18N.get(MODULE_NAME + '_reset_in') + ' ',
			["strong", {},
				((this.properties.end_of_abuse > 0) ? ('' + hour_left + ':' + ((min_left < 10) ? '0' : '') + min_left) : '∞')
			],
			")"
		], document);
	}

	function refresh_notifier()
	{
		var div = document.getElementById(ANTI_ABUSE_NOTIFIER_ID);
		if (JS.is_defined(div)) {
			div.parentNode.replaceChild(get_notifier_div.call(this), div);
		}
	}

	function updateAttemptLeft()
	{
		if (!D2N.is_on_page_in_city('bank') && !D2N.is_on_page_in_city('well')) {
			// If we are not in the bank
			// NOR in the well
			// our backpack can still be modified (in our home for instance)
			_oldBackPack = $("#myBag li img:not([src*='small_empty_inv.gif'])").length;
			return;
		}

		var newBackPack = $("#myBag li img:not([src*='small_empty_inv.gif'])").length;
		if(newBackPack > _oldBackPack) {
			this.properties.attempt_left -= 1;
			if (this.properties.attempt_left < 0) {
				this.properties.attempt_left = 0;
			}
			this.properties.end_of_abuse = (+new Date() / 1000) + (15 * 60);
			this.save_properties();
			refresh_notifier.call(this);
		}

		_oldBackPack = newBackPack;

		document.removeEventListener('d2n_gamebody_reload', updateAttemptLeft.bind(this));
	}

	function on_object_click(event)
	{
		if (!D2N.is_on_page_in_city('bank') && !D2N.is_on_page_in_city('well')) {
			return;
		}
		
		// The click must occur on the object icon, the object number or the
		// link
		if (['IMG', 'SPAN', 'A'].indexOf(event.target.nodeName) < 0) {
			return;
		}

		if (this.properties.attempt_left < 1) {
			event.cancelBubble = true;
			event.stopPropagation();
			event.preventDefault();
			alert(I18N.get(MODULE_NAME + '_prevent'));
			return;
		}

		// We check after the reload if the backpack has changed
		_oldBackPack = $("#myBag li img:not([src*='small_empty_inv.gif'])").length;

		document.addEventListener('d2n_gamebody_reload', updateAttemptLeft.bind(this));
	}

	function inject_click_listener()
	{
		// Add listener
		if (D2N.is_on_page_in_city('bank')) {
			document.querySelector('.tools.stocks.cityInv').addEventListener('click', on_object_click.bind(this), true);
		} else if (D2N.is_on_page_in_city('well')) {
			var session = null;
			D2N.get_session_key(function(sk) {
				session = sk;
            });

			var el = $(".button[href*='well_water']");
			if(el.attr("onclick").indexOf("confirm") > 0){
				el.attr("onclick", "");
				el.click(function(ev){
					if (this.properties.attempt_left < 1) {
						event.cancelBubble = true;
						event.stopPropagation();
						event.preventDefault();
						alert(I18N.get(MODULE_NAME + '_prevent'));
						return;
					}
					if(confirm('Confirmer ?')){
						on_object_click.bind(this)(ev);
						js.XmlHttp.get('city/well_water?sk=' + session, null);
					}
					return false;
				}.bind(this));
			}
		}
	}

	function on_each_second(event)
	{
		var current_time = Math.floor(+new Date() / 1000);
		if (current_time > this.properties.end_of_abuse) {
			this.properties.attempt_left = this.properties.max_attempts;
			this.properties.end_of_abuse = 0;
			this.save_properties();
		}
		refresh_notifier.call(this);
	}

	function inject_notifier()
	{
		// Add notifier
		var selector = "div.right";
		if (D2N.is_on_page_in_city('well')) {
			selector = "div.wellPane";
		}

		JS.wait_for_selector(selector, function(el) {
			el.insertBefore(get_notifier_div.call(this), el.firstChild);

			if (_time_interval === null) {
				_time_interval = setInterval(on_each_second.bind(this), 1000);
			}
		}.bind(this));
	}


	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.INTERFACE_ENHANCEMENT,

		properties: {
			enabled: false,
			max_attempts: 5,
            isProtected: false
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.BANK,
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
					'#' + ANTI_ABUSE_NOTIFIER_ID + ' {' +
						'cursor: auto;' +
					'}');

				if(document.getElementsByClassName("chaos").length !== 0){
					this.properties.max_attempts = 10;
				} else {
					this.properties.max_attempts = 5;
				}

				if (JS.is_defined(this.properties.attempt_left) !== true) {
					this.properties.attempt_left = this.properties.max_attempts;
				}
				if (JS.is_defined(this.properties.end_of_abuse) !== true) {
					this.properties.end_of_abuse = 0;
				}

				this.save_properties();

				document.addEventListener('d2n_gamebody_reload', function() {
					// We must check the end of abuse, even if we are outside (we likely are going to spend more than 15 minutes outside)
					var current_time = Math.floor(+new Date() / 1000);
					if (current_time > this.properties.end_of_abuse) {
						this.properties.attempt_left = this.properties.max_attempts;
						this.properties.end_of_abuse = 0;
						this.save_properties();
					}

					if (!D2N.is_on_page_in_city('bank') && !D2N.is_on_page_in_city('well')) {
						return;
					}

					if(document.getElementsByClassName("chaos").length !== 0){
						this.properties.max_attempts = 10;
					} else {
						this.properties.max_attempts = 5;
					}

					this.save_properties();

					if (JS.is_defined(document.getElementById(ANTI_ABUSE_NOTIFIER_ID))) {
						return;
					}

					inject_notifier.call(this);
					inject_click_listener.call(this);
				}.bind(this), false);
			}
		}

	};
});
