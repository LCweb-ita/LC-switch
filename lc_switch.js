/* ------------------------------------------------------------------------
	* LC Switch
	* superlight pure javascript plugin improving forms look and functionality
	*
	* @version: 	2.0.3
	* @author:		Luca Montanari (LCweb)
	* @website:		https://lcweb.it
	
	* Licensed under the MIT license
------------------------------------------------------------------------- */

(function($){
	"use strict";
	if(typeof(Element.prototype.lc_switch) != 'undefined') {return false;} // prevent multiple script inits
	
    // flag used to bypass checks
    let forced_action = false;
    
    
    // default options
    const def_options = {
        on_txt      : 'ON',
        off_txt     : 'OFF',
        on_color    : false,
        compact_mode: false,
    };
    
    
    let style_appended = false;
    const append_style = () => {
        if(style_appended) {
            return true;    
        }
        style_appended = true;
        
        document.head.insertAdjacentHTML('beforeend', 
`<style>
.lcs_wrap,
.lcs_wrap * {
    user-select: none;
}
.lcs_wrap {
	display: inline-block;	
	direction: ltr;
	height: 28px;
    width: 73px;
    vertical-align: middle;
}
.lcs_wrap input {
	display: none;	
}
.lcs_switch {
	display: inline-block;	
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 30px;
	background: #ddd;
	overflow: hidden;
	cursor: pointer;
	transition: all .2s ease-in-out; 
}
.lcs_cursor {
	display: inline-block;
	position: absolute;
	top: 50%;	
    margin-top: -11px;
	width: 22px;
	height: 22px;
	border-radius: 100%;
	background: #fff;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .2), 0 3px 4px 0 rgba(0, 0, 0, .1);
	z-index: 10;
	transition: all .2s linear; 
}
.lcs_label {
	font-family: "Trebuchet MS", Helvetica, sans-serif;
    font-size: 12px;
	letter-spacing: 1px;
	line-height: 18px;
	color: #fff;
	font-weight: bold;
	position: absolute;
	width: 33px;
	top: 5px;
	overflow: hidden;
	text-align: center;
	opacity: 0;
    text-shadow: 0 0 2px rgba(0,0,0, .1);
	transition: all .2s ease-in-out .1s;   
}
.lcs_label.lcs_label_on {
	left: -70px;
	z-index: 6;	
}
.lcs_label.lcs_label_off {
	right: -70px;
	z-index: 5;	
}
.lcs_switch.lcs_on {
	background: #75b936;
}
.lcs_switch.lcs_on .lcs_cursor {
	left: 48px;
}
.lcs_switch.lcs_on .lcs_label_on {
	left: 10px;	
	opacity: 1;
}
.lcs_switch.lcs_off {
	background: #b2b2b2;
	box-shadow: 0px 0px 2px #a4a4a4 inset; 	
}
.lcs_switch.lcs_off .lcs_cursor {
	left: 3px;
}
.lcs_switch.lcs_off .lcs_label_off {
	right: 10px;
	opacity: 1;	
}
.lcs_switch.lcs_disabled {
	opacity: 0.65;
	cursor: default;
}
.lcs_compact {
    height: 22px;
    width: 47px;
}
.lcs_compact .lcs_label {
    display: none;
}
.lcs_compact .lcs_cursor {
	margin-top: -8px;
	width: 16px;
	height: 16px;
}
.lcs_compact .lcs_switch.lcs_on .lcs_cursor {
	left: 28px;
}
</style>`);
    };
    
    
    
    // construct
	window.lc_switch = function(selector, options) {

        // options merge
        options = (typeof(options) != 'object') ? def_options : Object.assign({}, def_options, options);
        
        // init
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(
                el.tagName != 'INPUT' ||
                (el.tagName == 'INPUT' && (el.getAttribute('type') != 'checkbox' && el.getAttribute('type') != 'radio'))
            ) {
                return;    
            }

            // do not initialize twice
            if(el.parentNode.classList.length && el.parentNode.classList.contains('lcs_wrap')) {
                return;    
            }

            // labels structure
            const on_label 	= (options.on_txt) ? '<div class="lcs_label lcs_label_on">'+ options.on_txt +'</div>' : '',
                  off_label = (options.off_txt) ? '<div class="lcs_label lcs_label_off">'+ options.off_txt +'</div>' : '';

 
            // default states
            let classes = 'lcs_'+ el.getAttribute('type');
                
            classes += (el.checked) ? ' lcs_on' : ' lcs_off'; 
            
            if(el.disabled) {
                classes += ' lcs_disabled';
            } 
            
            
            // enabled and apply custom color?
            const custom_style = (options.on_color && el.checked) ? 'style="background: '+ options.on_color +';"' : '',
                  custom_on_col_attr = (options.on_color) ? 'data-on-color="'+ options.on_color +'"' : '';
            

            // wrap and append
            const wrapper = document.createElement('div');
            
            wrapper.classList.add('lcs_wrap');
            wrapper.innerHTML = 
            '<div class="lcs_switch '+ classes +'" '+ custom_on_col_attr +' '+ custom_style +'>' +
                '<div class="lcs_cursor"></div>' +
                on_label + off_label +
            '</div>';
            
            
            // compact mode?
            if(options.compact_mode) {
                wrapper.classList.add('lcs_compact');    
            }
            
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            
            
            // handlers
            wrapper.querySelector('.lcs_switch').addEventListener('click', (e) => {
                const target = (e.target.classList.contains('lcs_switch')) ? e.target : recursive_parent(e.target, '.lcs_switch');
                
                if(!target.classList.contains('lcs_disabled')) {
                    lcs_toggle(el);
                }
            });
            el.addEventListener('change', (e) => {
                lcs_update(el)
            });
        });
        
        append_style();
    };
    
    
    
    // destruct
	window.lcs_destroy = function(selector) {
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(!is_valid_el(el)) {
                return;    
            }
            
            el.parentNode.replaceWith(el);
        });                
    };
    
    
    
    // set to ON
	window.lcs_on = function(selector) {
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(!is_valid_el(el) || (el.checked && !forced_action)) {
                return;    
            }
               
            // if radio - disable other ones 
            if(el.getAttribute('type') == 'radio') {
                lcs_off(recursive_parent(el, 'form').querySelectorAll('input[name="'+ el.getAttribute('name') +'"]'), true);
            }
            
            // enable
            el.checked = true;
            
            const wrap = el.previousElementSibling;
            wrap.classList.add('lcs_on');
            wrap.classList.remove('lcs_off');
            
            if(wrap.getAttribute('data-on-color')) {
                wrap.style.background = wrap.getAttribute('data-on-color');        
            }
            
            // trigger events
            if(!forced_action) {
                const lcsOnEvent = new Event("lcs-on", {bubbles:true}),
                      lcsStatusChangeEvent = new Event('lcs-statuschange', {bubbles:true});

                el.dispatchEvent(lcsOnEvent);
                el.dispatchEvent(lcsStatusChangeEvent);
            }
        });                
    };
    
    
    
    // set to OFF
	window.lcs_off = function(selector, forced_by_lcsOn) {
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(!is_valid_el(el) || (!el.checked && !forced_action)) {
                return;    
            }
               
            // if radio - allows only if forced by lcs_on
            if(el.getAttribute('type') == 'radio' && !forced_by_lcsOn && !forced_action) {
                return;    
            }
            
            // disable
            el.checked = false;
            
            const wrap = el.previousElementSibling;
            wrap.classList.add('lcs_off');
            wrap.classList.remove('lcs_on');
            
            if(wrap.getAttribute('data-on-color')) {
                wrap.style.background = null;    
            }
            
            // trigger events
            if(!forced_action) {
                const lcsOffEvent = new Event("lcs-off", {bubbles:true}),
                      lcsStatusChangeEvent = new Event('lcs-statuschange', {bubbles:true});

                el.dispatchEvent(lcsOffEvent);
                el.dispatchEvent(lcsStatusChangeEvent);
            }
        });                
    };
    
    
    
    // toggle check status
    window.lcs_toggle = function(selector) {
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(!is_valid_el(el)) {
                return;    
            }
               
            // if radio - allows only if not checked
            if(el.getAttribute('type') == 'radio' && el.checked) {
                return;    
            }
            
            (el.checked) ? lcs_off(el) : lcs_on(el);
        });                
    };
    
    
    
    // DISABLE field
	window.lcs_disable = function(selector) {
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(!is_valid_el(el) || (el.disabled && !forced_action)) {
                return;    
            }
            
            // disable
            el.disabled = true;
            el.previousElementSibling.classList.add('lcs_disabled');

            // trigger events
            const lcsDisabledEvent = new Event("lcs-disabled", {bubbles:true}),
                  lcsStatusChangeEvent = new Event('lcs-statuschange', {bubbles:true});
            
            el.dispatchEvent(lcsDisabledEvent);
            el.dispatchEvent(lcsStatusChangeEvent);
        });                
    };
    
    
    
    // ENABLE field
	window.lcs_enable = function(selector) {
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(!is_valid_el(el) || (!el.disabled && !forced_action)) {
                return;    
            }
            
            // disable
            el.disabled = false;
            el.previousElementSibling.classList.remove('lcs_disabled');

            // trigger events
            const lcsEnabledEvent = new Event("lcs-enabled", {bubbles:true}),
                  lcsStatusChangeEvent = new Event('lcs-statuschange', {bubbles:true});
            
            el.dispatchEvent(lcsEnabledEvent);
            el.dispatchEvent(lcsStatusChangeEvent);
        });                
    };
    
    
    
    // UPDATE LCS statuses retrieving data from field
	window.lcs_update = function(selector) {
        maybe_querySelectorAll(selector).forEach(function(el) {
            if(!is_valid_el(el)) {
                return;    
            }
            
            forced_action = true;
            
            (el.checked) ? lcs_on(el) : lcs_off(el);
            (el.disabled) ? lcs_disable(el) : lcs_enable(el);
            
            forced_action = false;
        });                
    };
    

    
    
    ////////////////////////////////////////////////////////////
    
    
    
    // UTILITIES
    
    // sanitize "selector" parameter allowing both strings and DOM objects
    const maybe_querySelectorAll = (selector) => {
             
        if(typeof(selector) != 'string') {
            return (selector instanceof Element) ? [selector] : Object.values(selector);   
        }
        
        // clean problematic selectors
        (selector.match(/(#[0-9][^\s:,]*)/g) || []).forEach(function(n) {
            selector = selector.replace(n, '[id="' + n.replace("#", "") + '"]');
        });
        
        return document.querySelectorAll(selector);
    };
    
    
    // know whether an element is a valid input and initialized with LC switch (returns bool)
    const is_valid_el = (el) => {
        if(
            el.tagName != 'INPUT' ||
            (el.tagName == 'INPUT' && (el.getAttribute('type') != 'checkbox' && el.getAttribute('type') != 'radio'))
        ) {
            return false;    
        }

        if(!el.parentNode.classList.length || (el.parentNode.classList.length && !el.parentNode.classList.contains('lcs_wrap')) ) {
            return false;    
        }
        
        return true;
    };
    
    
    // pure-JS equivalent to parents()
    const recursive_parent = (element, target) => {
        let node = element;
        
        while(node.parentNode != null && !node.matches(target) ) {
            node = node.parentNode;
        }
        return node;
    };
    
})();
