/* ------------------------------------------------------------------------
	* LC Switch
	* superlight jQuery plugin improving forms look and functionality
	*
	* @version: 	1.1
	* @requires:	jQuery v1.7 or later
	* @author:		Luca Montanari (LCweb)
	* @website:		https://lcweb.it
	
	* Licensed under the MIT license
------------------------------------------------------------------------- */

(function($){
	"use strict";
	if(typeof($.fn.lc_switch) != 'undefined') {return false;} // prevent multiple script inits
	
	
	
	$.fn.lc_switch = function(on_text, off_text) {

		// destruct
		$.fn.lcs_destroy = function() {
			
			$(this).each(function() {
                var $wrap = $(this).parents('.lcs_wrap');
				
				$wrap.children().not('input').remove();
				$(this).unwrap();
            });
			
			return true;
		};	


		
		// set to ON
		$.fn.lcs_on = function() {
			$(this).each(function(i, v) {
                var $wrap 	= $(this).parents('.lcs_wrap'),
					$input 	= $wrap.find('input');
				
				// if is already on - skip
				if($wrap.find('.lcs_on').length) {
					return true;	
				}
				
				(typeof($.fn.prop) == 'function') ? $input.prop('checked', true) : $input.attr('checked', true);
				
				$input.trigger('lcs-on');
				$input.trigger('lcs-statuschange');
				$wrap.find('.lcs_switch').removeClass('lcs_off').addClass('lcs_on');
				
				// if radio - disable other ones 
				if( $wrap.find('.lcs_switch').hasClass('lcs_radio_switch') ) {
					
					var f_name = $input.attr('name');
					$wrap.parents('form').find('input[name='+f_name+']').not($input).lcs_off();	
				}
            });
			
			return true;
		};	
		
		
		
		// set to OFF
		$.fn.lcs_off = function() {
			
			$(this).each(function() {
                var $wrap 	= $(this).parents('.lcs_wrap'),
					$input 	= $wrap.find('input');
				
				// if is already off - skip
				if(!$wrap.find('.lcs_on').length) {
					return true;	
				}
				
				// uncheck
				(typeof($.fn.prop) == 'function') ? $input.prop('checked', false) : $input.attr('checked', false);
				
				$input.trigger('lcs-off');
				$input.trigger('lcs-statuschange');
				$wrap.find('.lcs_switch').removeClass('lcs_on').addClass('lcs_off');
            });
			
			return true;
		};	
		
		
		
		// toggle status
		$.fn.lcs_toggle = function() {
			$(this).each(function() {
               
				// not for radios
				if( $(this).hasClass('lcs_radio_switch')) {
					return true;	   
				}
				
				($(this).is(':checked')) ? $(this).lcs_off() : $(this).lcs_on();
            });
			
			return true;
		};	
		
		
		
		// construct
		return this.each(function(){
			
			// check against double init
			if( !$(this).parent().hasClass('lcs_wrap') ) {
			
				// default texts
				var ckd_on_txt 	= (typeof(on_text) == 'undefined') ? 'ON' : on_text,
					ckd_off_txt = (typeof(off_text) == 'undefined') ? 'OFF' : off_text;
			   
			   // labels structure
				var on_label 	= (ckd_on_txt) ? '<div class="lcs_label lcs_label_on">'+ ckd_on_txt +'</div>' : '',
					off_label 	= (ckd_off_txt) ? '<div class="lcs_label lcs_label_off">'+ ckd_off_txt +'</div>' : '';
				
				
				// default states
				var disabled 	= ($(this).is(':disabled')) ? true : false,
					active 		= ($(this).is(':checked'))  ? true : false;
				
				var status_classes = '';
				status_classes += (active) ? ' lcs_on' : ' lcs_off'; 
				if(disabled) {
					status_classes += ' lcs_disabled';
				} 
			   
			   
				// wrap and append
				var structure = 
				'<div class="lcs_switch '+status_classes+'">' +
					'<div class="lcs_cursor"></div>' +
					on_label + off_label +
				'</div>';
			   
				if( $(this).is(':input') && ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') ) {
					
					$(this).wrap('<div class="lcs_wrap"></div>');
					$(this).parent().append(structure);
					
					$(this).parent().find('.lcs_switch').addClass('lcs_'+ $(this).attr('type') +'_switch');
				}
			}
        });
	};	
	
	
	
	// handlers
	$(document).ready(function() {
		
		// on click
		$(document).on('click tap', '.lcs_switch:not(.lcs_disabled)', function(e) {

			if( $(this).hasClass('lcs_on') ) {
				if( !$(this).hasClass('lcs_radio_switch') ) { // not for radio
					$(this).lcs_off();
				}
			} else {
				$(this).lcs_on();	
			}
		});
		
		
		// on checkbox status change
		$(document).on('change', '.lcs_wrap input', function() {
			( $(this).is(':checked') ) ? $(this).lcs_on() : $(this).lcs_off();	
		});
		
	});
	
})(jQuery);
