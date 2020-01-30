(function ($) {
    let ID = 'resize';
    let autoSize = 'A';

    /**
     * Модуль для управления высотой многострочного элемента ввода
     * @param $el Элемент управления
     * @param config Параметры конфигурации
     */
    let ResizeTextarea = function ($el, config) {
        this.init($el, $.extend(
            {},
            config,
            {
                min: 95,
                steps: [95, 145, 212, 262]
            }));
    };

	function getElementHeight(el) {
		return el.scrollHeight + 5
	}

	ResizeTextarea.prototype = {
        /**
         * Инициализаци модуля
         * @param $el Элемент управления
         * @param config Параметры
         */
        init: function ($el, config) {
            this.$el = $el;
            this.el = $el[0];
            this.key = 'textarea_Resiser_' + window.location.pathname + '_' + this.el.id;
            this.config = config;

			var byTextStep = {
				value: autoSize,
				text: 'A',
				title: 'Размер: <strong>По тексту</strong>'
			};
			this.steps = [];

			var elHeight = getElementHeight(this.el);
			var minHeight = this.config.min;
			var byTextFirstStep = config.useElementMinHeight && elHeight < config.steps[0];
			if (byTextFirstStep) {
				minHeight = elHeight;
				this.steps.push(byTextStep);
			}

            $.each(config.steps, function (i, item) {
				this.steps.push({
					value: item,
					text: (i + 1) + 'x',
					title: 'Размер: <strong>' + (i + 1) + 'x</strong>'
				});
			}.bind(this));
            if (!this.steps || !this.steps.length) {
                this.isGenerated = false;
                return;
            }

			if (!byTextFirstStep) {
				this.steps.push(byTextStep);
			}

            this.current = this.current();
            this.$el
				.css('min-height', minHeight)
                .addClass(ID + '-input')
                .on('input.' + ID, this.handleInput.bind(this));

            this.$resizer = this.el.id ? $("a[href='#" + this.el.id + "']") : null;
            if (!(this.$resizer && this.$resizer.length)) {
                this.$actions = $('<div>', { class: ID + '-actions' });
                this.$actions.insertBefore(this.$el);
                this.$resizer = $('<a>', { class: 'resize-command' });
                this.$resizer.appendTo(this.$actions);
            }

            this.$resizer.on("click", function () {
                this.current++;
                this.resize();
                this.save();
                return false;
            }.bind(this));

            this.resize();
            this.isGenerated = true;
        },

        /**
         * Метод выполняет пересчет высоты элемента для текущего шага
         */
        resize: function () {
            if (this.current < 0 || this.current >= this.steps.length) {
                this.current = 0;
            }

            let stepSize = this.steps[this.current];

            this.$resizer
                .html(stepSize.title);

            if (!isNaN(stepSize.value)) {
                this.$el.css("height", stepSize.value);
            } else {
                this.$el.css("height", 'auto');
                this.$el.css("height", this.el.scrollHeight + 5);
                window.setTimeout(this.handleInput.bind(this), 0);
            }
        },

        /**
         * Метод выполняет пересчет высоты элемента управления, после ввода текста
         */
        handleInput: function () {
            let step = this.steps[this.current];
            if (!step || step.value !== autoSize) {
                return;
            }

            this.$el.css("height", 'auto');

            if (this.el.scrollHeight > this.$el.innerHeight()) {
                this.$el.css("height", this.el.scrollHeight + 5);
            }
        },

        /**
         * Метод возвращает индект текущего шага
         * @returns Индекс
         */
        current: function () {
            var stepValue = localStorage.getItem(this.key);
            if (!stepValue) {
                return 0;
            }

            for (let i = 0; i < this.steps.length; i++) {
                if (this.steps[i].value == stepValue) {
                    return i;
                }
            }

            return 0;
        },

        /**
         * Метод выполняет сохранение идентификатор текущего шага в локальное хранилище
         */
        save: function () {
            let stepSize = this.steps[this.current];
            if (!stepSize) {
                return;
            }

	        // utility.setLocalStorage(this.key, stepSize.value);
        },

        /**
         * Метод выполняет удаление плагина
         */
        destroy: function () {
            this.$resizer.off('click');
            this.$actions.remove();
            this.$el
                .unwrap()
                .removeClass(ID + '-input')
                .off('input.' + ID)
                .off(ID)
                .removeData(ID);

            $(window).off('resize.' + ID);
            $('.arrowPanel').off('click.' + ID); 
        },
    };

    /**
     * Метод выполняет инициализацию плагина для указанных элементов управления
     * @param options
     */
    $.fn.resizeTextarea = function (options) {
        return this.each(function () {
            let $this = $(this);
            let plugin = $this.data(ID);

            if (typeof options === 'string') {
                if (plugin) {
                    switch (options) {
                        case 'destroy':
                            plugin.destroy();
                            break;
                        default:
                            console.error('unrecognized method string');
                    }
                } else {
                    console.error('plugin must be instantiated first');
                }
            } else {
                if (plugin) {
                    plugin.destroy();
                }
                plugin = new ResizeTextarea($this, options);

                if (plugin.isGenerated) {
                    $this.data(ID, plugin);

                    $(window).on('resize.' + ID, function () {
                        plugin.handleInput();
                    });

                    $('.arrowPanel').on('click.' + ID, function () {
                        plugin.handleInput();
                    }); 
                }
            }

            //if (typeof orig_w == 'undefined') var orig_w = $this.width();
            //if (typeof orig_h == 'undefined') var orig_h = $this.height();
            //$this.after(
            //    $('<div id="div_' + id + '"><a href="javascript:void(0);"></a></div>')
            //        .addClass('resizer')
            //        .width(orig_w)
            //        .bind('mousedown', function (e) {
            //            e = (typeof (e) == "undefined") ? window.event : e;
            //            var h = $this.height(), w = $this.width();
            //            var y = e.clientY, x = e.clientX;
            //            var moveHandler = function (e) {
            //                $this
            //                    .height(Math.max(orig_h, e.clientY + h - y))
            //                    .width(Math.max(orig_w, e.clientX + w - x));
            //                $('#div_' + id + '')
            //                    .width(Math.max(orig_w, e.clientX + w - x));
            //            };
            //            var upHandler = function (e) {
            //                $('html')
            //                    .unbind('mousemove', moveHandler)
            //                    .unbind('mouseup', upHandler);
            //            };
            //            $('html').bind('mousemove', moveHandler).bind('mouseup', upHandler);
            //            return false;
            //        })
            //);
        });
    };
})(jQuery);
